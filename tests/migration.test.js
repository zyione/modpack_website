import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {defaults,selectMods,readState,stateSearch,csvText,statuses,impacts} from '../src/migration-model.js';

const audit=JSON.parse(readFileSync(new URL('../public/migration/audit.json',import.meta.url),'utf8'));
const state=overrides=>({...defaults,statuses:[],...overrides});

test('public inventory includes all audit mods and the exact server subset',()=>{
  assert.equal(audit.mods.length,429);
  assert.equal(new Set(audit.mods.map(m=>m.id)).size,429);
  assert.equal(audit.mods.filter(m=>m.server).length,338);
  assert.equal(audit.mods.filter(m=>m.local).length,404);
  assert.equal(audit.mods.reduce((n,m)=>n+m.files.length,0),435);
  for(const m of audit.mods){
    assert.ok(statuses[m.status],m.id);assert.ok(impacts[m.impact],m.id);
    assert.ok(m.removal,m.id);assert.ok(m.route,m.id);
    assert.ok(m.priority>=0&&m.priority<=5,m.id);
    assert.ok(m.difficulty>=1&&m.difficulty<=5,m.id);
  }
});

test('public export excludes server credentials, local paths and raw inspection data',()=>{
  const serialized=JSON.stringify(audit);
  assert.doesNotMatch(serialized,/C:\\|C:\/|\/private\/|known_hosts|sftp-credentials|verified_host_key|"sha1"|"path"|"contact"|"match"/i);
  for(const m of audit.mods)if(m.source)assert.equal(new URL(m.source).protocol,'https:');
});

test('server, combined and client-only scopes stay distinct',()=>{
  assert.equal(selectMods(audit.mods,state()).length,338);
  assert.equal(selectMods(audit.mods,state({scope:'all'})).length,429);
  const client=selectMods(audit.mods,state({scope:'client'}));
  assert.equal(client.length,91);assert.ok(client.every(m=>m.local&&!m.server));
});

test('missing ports and custom builds filter together and respect server scope',()=>{
  const result=selectMods(audit.mods,state({statuses:['M','C']}));
  assert.equal(result.length,50);
  assert.ok(result.every(m=>m.server&&['M','C'].includes(m.status)));
  assert.equal(selectMods(audit.mods,state({scope:'all',statuses:['M']})).length,54);
});

test('search combines words with availability, importance and category',()=>{
  const result=selectMods(audit.mods,state({q:'  MYTHIC metals  ',statuses:['M'],importance:'5',category:'combat-and-rpg'}));
  assert.deepEqual(result.map(m=>m.id),['mythicmetals']);
  assert.equal(selectMods(audit.mods,state({q:'mythic metals',statuses:['N']})).length,0);
});

test('difficulty is independent from preservation importance',()=>{
  const easyCritical=selectMods(audit.mods,state({importance:'5',difficulty:'easy'}));
  assert.ok(easyCritical.some(m=>m.id==='mr_extended_woldheight512'));
  assert.ok(easyCritical.every(m=>m.priority===5&&m.difficulty<=2&&['M','C','V'].includes(m.status)));
});

test('client renderer resources are not mistaken for owned server blocks',()=>{
  for(const id of ['betterbeds','enhancedblockentities','fastchest','modefite']){
    const mod=audit.mods.find(m=>m.id===id);
    assert.equal(mod.priority,0,id);assert.equal(mod.impact,'CLIENT',id);
  }
});

test('sorting difficulty never describes an existing native port as unfinished work',()=>{
  for(const sort of ['difficulty-asc','difficulty-desc']){
    const result=selectMods(audit.mods,state({sort}));
    const scores=result.filter(m=>['M','C','V'].includes(m.status)).map(m=>m.difficulty);
    assert.deepEqual(scores,[...scores].sort((a,b)=>sort==='difficulty-asc'?a-b:b-a));
    assert.ok(['M','C','V'].includes(result[0].status));
  }
});

test('share URLs preserve combined filters, Unicode search and a selected mod',()=>{
  const chosen=state({q:'Blåhaj & "flowers"',scope:'all',statuses:['M','P'],category:'building-and-decoration',importance:'4',impact:'content',difficulty:'hard',sort:'difficulty-desc',view:'attention'});
  const url=stateSearch(chosen,'mythicmetals');
  assert.deepEqual(readState(url),chosen);
  assert.equal(new URLSearchParams(url).get('mod'),'mythicmetals');
  assert.equal(readState('?scope=invalid&sort=nonsense&status=BAD,P').scope,'server');
  assert.deepEqual(readState('?status=BAD,P').statuses,['P']);
});

test('CSV contains the full removal explanation and protects spreadsheet formulas',()=>{
  const selected=selectMods(audit.mods,state({q:'mythic metals'}));
  const csv=csvText(selected);
  assert.ok(csv.includes('Saved ores are confirmed'));
  assert.ok(csv.includes('"P5","D4"'));
  assert.equal(csv.split('\r\n').length,2);
  assert.ok(csvText([{...selected[0],name:'=HYPERLINK("x")'}]).includes('"\'=HYPERLINK(""x"")"'));
});
