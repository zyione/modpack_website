export const statuses = {
  N: {label:'Native counterpart', short:'Native', tone:'green', description:'A release exists for the corresponding project on NeoForge 1.21.1. Existing save data still needs checking.'},
  P: {label:'Unofficial port', short:'Unofficial port', tone:'blue', description:'A community port or fork was found. Features, dependencies and saved IDs need comparison.'},
  R: {label:'Alternative / API change', short:'Alternative', tone:'purple', description:'An alternative implementation or dependency change is needed. It may not read the original save data.'},
  C: {label:'Custom build', short:'Custom build', tone:'amber', description:'Our exact local or pack-specific build needs a deliberate port, recreation or retirement decision.'},
  M: {label:'No native port found', short:'No native found', tone:'red', description:'No matching native NeoForge 1.21.1 release was found in the checked sources. This does not mean a port is impossible.'},
  V: {label:'Needs verification', short:'Unverified', tone:'gray', description:'The exact target release remains unresolved. This is not confirmed incompatibility.'},
};
export const categories = {
  'building-and-decoration':'Building & decoration','combat-and-rpg':'Combat & RPG',
  'create-and-technology':'Create & technology','food-and-farming':'Food & farming',
  'gameplay-and-utilities':'Gameplay & utilities','libraries':'Libraries',
  'mobs-and-villagers':'Mobs & villagers','quests-economy-and-pack-tools':'Quests & economy',
  'storage-and-inventory':'Storage & inventories','travel-and-vehicles':'Travel & mounts',
  'worldgen-and-structures':'Worldgen & structures','server-rules-and-utilities':'Server rules',
  'client-tools':'Client tools','performance':'Performance','ui-and-hud':'Menus & HUD',
  'building-and-controls':'Building controls','visuals-and-animations':'Visuals & animation',
  'multiplayer-and-networking':'Multiplayer','fixes-and-diagnostics':'Fixes & diagnostics',
  'sound-and-music':'Sound & music','camera-and-perspective':'Camera & perspective',
};
export const importance = ['Client extra','Optional','Lower priority','Medium priority','High priority','Preserve first'];
export const difficulty = ['','Low','Modest','Medium','Hard','Very hard'];
export const impacts = {
  STORAGE:{label:'Container + contents',group:'content',description:'Losing a container can also lose everything inside it, including vanilla items.'},
  BLOCK:{label:'Blocks can disappear',group:'content',description:'Unmapped blocks can fall back to air; their items or block-entity data can be lost.'},
  ITEM:{label:'Items / equipment',group:'content',description:'Unknown items or components can be discarded or reset.'},
  ENTITY:{label:'Pets / entities',group:'content',description:'Unknown entity types can be skipped, including their ownership, equipment and inventory.'},
  WORLDGEN:{label:'World loading / terrain',group:'world',description:'Missing biome or generator keys can stop world loading. Custom content can be lost.'},
  HEIGHT:{label:'World height',group:'world',description:'Changed dimension bounds can strand out-of-range content or lose it when rewritten.'},
  STATE:{label:'Player / server data',group:'state',description:'Powers, progress, claims, slot contents or other saved state may stop working or reset.'},
  GENERATION:{label:'Future generation',group:'world',description:'Existing vanilla structure blocks normally remain; future generation and references can change.'},
  DEPENDENCY:{label:'Required by other mods',group:'dependency',description:'Dependent mods may refuse to start without a compatible library.'},
  RULE:{label:'Behavior changes',group:'optional',description:'Rules or fixes stop working; check custom fields and dependents.'},
  CLIENT:{label:'Client feature only',group:'optional',description:'The client feature goes away; no direct server save conversion is expected.'},
};
export const defaults = {q:'',scope:'server',statuses:[],category:'',impact:'',importance:'',difficulty:'',sort:'priority',view:'all'};
export const needsWork = mod => ['M','C','V'].includes(mod.status);
export const location = mod => mod.server ? mod.local ? 'Client + server' : 'Server only' : 'Client only';
export function readState(search) {
  const p=new URLSearchParams(search);
  const state={...defaults,statuses:(p.get('status')||'').split(',').filter(x=>statuses[x])};
  for(const key of ['q','scope','category','impact','importance','difficulty','sort','view']) if(p.has(key)) state[key]=p.get(key);
  if(!['server','all','client'].includes(state.scope)) state.scope='server';
  if(!['all','attention','preserve','ports','client'].includes(state.view)) state.view='all';
  if(!['priority','name','name-desc','difficulty-desc','difficulty-asc','status'].includes(state.sort)) state.sort='priority';
  return state;
}
export function stateSearch(state,modId='') {
  const p=new URLSearchParams();
  for(const key of ['q','scope','category','impact','importance','difficulty','sort','view']) if(state[key]!==defaults[key] && state[key]) p.set(key,state[key]);
  if(state.statuses.length)p.set('status',state.statuses.join(','));
  if(modId)p.set('mod',modId);
  return p.size?'?'+p.toString():'';
}
export function selectMods(mods,state) {
  const terms=state.q.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const subset=mods.filter(m=>{
    if(state.scope==='server'&&!m.server)return false;
    if(state.scope==='client'&&(m.server||!m.local))return false;
    if(state.statuses.length&&!state.statuses.includes(m.status))return false;
    if(state.category&&m.purpose!==state.category)return false;
    if(state.impact&&impacts[m.impact]?.group!==state.impact)return false;
    if(state.importance&&m.priority<Number(state.importance))return false;
    if(state.difficulty){
      if(!needsWork(m))return false;
      if(state.difficulty==='easy'&&m.difficulty>2)return false;
      if(state.difficulty==='medium'&&m.difficulty!==3)return false;
      if(state.difficulty==='hard'&&m.difficulty<4)return false;
    }
    if(state.view==='attention'&&m.status==='N')return false;
    if(state.view==='preserve'&&m.priority<4)return false;
    if(state.view==='ports'&&m.status!=='P')return false;
    if(state.view==='client'&&(m.server||!m.local))return false;
    const haystack=[m.name,m.id,m.route,m.route_note,categories[m.purpose],...m.files.map(f=>f.file)].join(' ').toLocaleLowerCase();
    return terms.every(t=>haystack.includes(t));
  });
  const statusOrder={M:0,C:1,V:2,P:3,R:4,N:5};
  return subset.sort((a,b)=>{
    const alphabetical=()=>a.name.localeCompare(b.name,undefined,{sensitivity:'base'});
    if(state.sort==='name')return alphabetical();
    if(state.sort==='name-desc')return -alphabetical();
    if(state.sort.startsWith('difficulty')){
      if(needsWork(a)!==needsWork(b))return needsWork(a)?-1:1;
      if(needsWork(a)){const d=(a.difficulty-b.difficulty)*(state.sort==='difficulty-desc'?-1:1);if(d)return d;}
      return b.priority-a.priority||alphabetical();
    }
    if(state.sort==='status')return statusOrder[a.status]-statusOrder[b.status]||b.priority-a.priority||alphabetical();
    return b.priority-a.priority||statusOrder[a.status]-statusOrder[b.status]||alphabetical();
  });
}
export function csvText(mods) {
  const cell=value=>{
    let s=String(value??'');
    if(/^[=+\-@\t\r]/.test(s))s="'"+s;
    return '"'+s.replaceAll('"','""')+'"';
  };
  const records=[['Mod','ID','Installed','Availability','Preservation importance','Port difficulty (estimate)','Removal consequence','Target route','Source'],...mods.map(m=>[m.name,m.id,location(m),statuses[m.status].label,'P'+m.priority,needsWork(m)?'D'+m.difficulty:'Existing route / alternative',m.removal,m.route,m.source])];
  return '\uFEFF'+records.map(r=>r.map(cell).join(',')).join('\r\n');
}
