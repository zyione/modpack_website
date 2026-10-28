import test from 'node:test';
import assert from 'node:assert/strict';
import {mods,perks,selectEntries} from '../src/content.js';
test('search combines category and case-insensitive content',()=>{
  assert.deepEqual(selectEntries(mods,'DRAGON','Adventure').map(x=>x.id),['dragons']);
  assert.equal(selectEntries(mods,'dragon','Building').length,0);
  assert.equal(selectEntries(perks,'  flight  ')[0].id,'beacon');
  assert.equal(selectEntries(perks,'nothing matches').length,0);
  assert.equal(selectEntries(mods,'','All').length,mods.length);
});
test('all guide targets have unique IDs and complete readable content',()=>{
  for(const items of [mods,perks]){
    assert.equal(new Set(items.map(i=>i.id)).size,items.length);
    for(const item of items){for(const key of ['id','name','title','category','description'])assert.ok(item[key],`${item.id}: ${key}`);}
  }
  for(const mod of mods){assert.ok(mod.steps.length>=3);assert.ok(mod.notes);assert.ok(mod.scene>=0&&mod.scene<=3);}
  for(const perk of perks){assert.ok(perk.how);assert.ok(perk.note);}
});
