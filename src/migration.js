import './style.css';
import './migration.css';
import {statuses,categories,importance,difficulty,impacts,defaults,needsWork,location,readState,stateSearch,selectMods,csvText} from './migration-model.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',link:'<path d="m10 13 4-2m-6 5H6a4 4 0 0 1 0-8h4m4 0h4a4 4 0 0 1 0 8h-4"/>',filter:'<path d="M4 6h16M7 12h10m-7 6h4"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',external:'<path d="M14 4h6v6m0-6L10 14m0-10H4v16h16v-6"/>'};
const icon=key=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]||''}</svg>`;
const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}};
const app=document.querySelector('#app');
let audit;
try{
  const response=await fetch('/migration/audit.json');
  if(!response.ok)throw new Error('Audit unavailable');
  audit=await response.json();
  if(!Array.isArray(audit.mods)||!audit.mods.length)throw new Error('Audit empty');
}catch{
  app.innerHTML='<main class="migration-error"><a href="/">← Back to BCG</a><h1>The field guide couldn’t load.</h1><p>Please refresh to try again.</p><button class="button" id="retry-load">Try again</button></main>';
  document.querySelector('#retry-load').addEventListener('click',()=>window.location.reload());
}
if(audit)start();

function start(){
  const mods=audit.mods;
  let state=readState(window.location.search),page=1,selectedMod='',previousFocus;
  const pageSize=40;
  const views=[['all','All mods'],['attention','Needs a decision'],['preserve','Preserve first'],['ports','Unofficial ports'],['client','Client extras']];
  app.innerHTML=`
  <header class="header migration-header"><div class="nav migration-wrap"><a class="brand" href="/"><img src="/favicon.svg" width="34" height="34" alt="">BigChadGuys+</a><nav aria-label="Main navigation"><a href="/">The community</a><a href="/migration/" aria-current="page">Migration guide</a></nav><a class="back-home" href="/">Back to the pack ${icon('arrow')}</a></div></header>
  <main id="main">
    <section class="migration-hero"><div class="migration-wrap migration-hero-grid"><div><span class="eyebrow">A LITTLE PLANNING. A LOT WORTH KEEPING.</span><h1>A new version.<br><em>The same world.</em></h1><p>Find a way forward for every mod.<br>See what’s available, what needs work, and what we need to preserve.</p></div><div class="journey-card"><span class="journey-label">OUR NEXT CHAPTER</span><div class="version-route"><div><small>FROM</small><strong>1.20.1</strong><span>Fabric</span></div><span class="route-arrow">${icon('arrow')}</span><div><small>TO</small><strong>1.21.1</strong><span>NeoForge</span></div></div><div class="journey-foot"><span class="snapshot-dot"></span>Research snapshot · 30 Oct 2026</div></div></div></section>
    <div class="migration-wrap">
      <section class="audit-stats" aria-label="Audit overview"></section>
      <div class="guide-notice"><span class="notice-mark" aria-hidden="true">i</span><p><strong>A port is a starting point.</strong> A download can exist while old inventories, pets or player data still need conversion. This is a planning guide; the upgraded server hasn’t been tested.</p><button id="open-explainer">How to read this ${icon('arrow')}</button></div>
      <section class="explorer" aria-labelledby="explorer-title"><div class="explorer-heading"><div><span class="eyebrow">THE MIGRATION FIELD GUIDE</span><h2 id="explorer-title">Every mod. A clearer next step.</h2></div><div class="explorer-actions"><button class="quiet-button" id="share-view">${icon('link')} Share view</button><button class="quiet-button" id="export-view">${icon('download')} Export CSV</button></div></div>
      <div class="explorer-views" role="group" aria-label="Quick views">${views.map(([key,label])=>`<button data-view="${key}" aria-pressed="false">${label}</button>`).join('')}</div>
      <div class="explorer-grid"><aside class="filter-panel" aria-label="Filter mods"><div class="filter-title"><strong>${icon('filter')} Refine the list</strong><button id="reset-filters">Reset</button></div><button class="mobile-filter-toggle" aria-expanded="false" aria-controls="filter-fields">Filters <span>＋</span></button><div id="filter-fields">
        <label class="control-label" for="scope-filter">Installed where?</label><select id="scope-filter" data-filter="scope"><option value="server">On our server</option><option value="all">All client + server mods</option><option value="client">Client extras only</option></select>
        <fieldset class="status-filters"><legend>Availability</legend>${Object.entries(statuses).map(([code,s])=>`<label class="status-filter"><input type="checkbox" value="${code}" data-status="${code}"><span class="status-dot tone-${s.tone}"></span><span>${s.label}</span><small data-status-count="${code}"></small></label>`).join('')}<p>Choose one or more. None selected shows all.</p></fieldset>
        <label class="control-label" for="category-filter">Category</label><select id="category-filter" data-filter="category"><option value="">All categories</option>${Object.entries(categories).sort((a,b)=>a[1].localeCompare(b[1])).map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select>
        <label class="control-label" for="importance-filter">Preservation importance</label><select id="importance-filter" data-filter="importance"><option value="">Any importance</option><option value="5">P5 · Preserve first</option><option value="4">P4–P5 · High + critical</option><option value="3">P3–P5 · Medium and above</option><option value="1">P1–P5 · Exclude client-only scores</option></select>
        <label class="control-label" for="difficulty-filter">Custom porting difficulty</label><select id="difficulty-filter" data-filter="difficulty"><option value="">Any / existing options</option><option value="easy">D1–D2 · Low / modest</option><option value="medium">D3 · Medium</option><option value="hard">D4–D5 · Hard / very hard</option></select>
        <label class="control-label" for="impact-filter">If we remove it</label><select id="impact-filter" data-filter="impact"><option value="">All consequences</option><option value="content">Blocks, items, pets or containers</option><option value="world">World loading / generation</option><option value="state">Player or server data</option><option value="dependency">Other mods depend on it</option><option value="optional">Behavior / client feature</option></select>
        <div class="filter-footnote"><strong>About the numbers</strong><p>Importance is about keeping our world intact. Difficulty estimates apply when custom work is needed.</p><button class="text-link" id="open-scales">See both scales ↗</button></div>
      </div></aside>
      <div class="results-panel"><div class="results-toolbar"><label class="search-box" for="mod-search"><span class="sr-only">Search mods, IDs, files and target options</span>${icon('search')}<input id="mod-search" type="search" placeholder="Search a mod, ID, or target option…" autocomplete="off"><kbd aria-hidden="true">/</kbd></label><label class="sort-control" for="sort-filter"><span>Sort by</span><select id="sort-filter" data-filter="sort"><option value="priority">Preservation first</option><option value="name">Name · A–Z</option><option value="name-desc">Name · Z–A</option><option value="difficulty-desc">Difficulty · Hardest first</option><option value="difficulty-asc">Difficulty · Easiest first</option><option value="status">Availability</option></select></label></div>
      <div class="results-meta"><p id="result-count" role="status" aria-live="polite"></p><span id="active-summary"></span></div>
      <div class="table-container"><table class="mod-table"><caption class="sr-only">Mod migration options. Select a mod name for full findings and source links.</caption><thead><tr><th scope="col" data-sort-column="name"><button data-sort="name">Mod <span aria-hidden="true">↕</span></button></th><th scope="col" data-sort-column="status"><button data-sort="status">Availability <span aria-hidden="true">↕</span></button></th><th scope="col" data-sort-column="priority"><button data-sort="priority">Importance <span aria-hidden="true">↓</span></button></th><th scope="col" data-sort-column="difficulty"><button data-sort="difficulty-desc">Porting <span aria-hidden="true">↕</span></button></th><th scope="col">If removed</th><th scope="col"><span class="sr-only">Open details</span></th></tr></thead><tbody id="mod-rows"></tbody></table><div class="no-results" hidden><span aria-hidden="true">⌕</span><h3>No mods match this view.</h3><p>Try a shorter search or reset your filters.</p><button class="button" id="empty-reset">Reset filters</button></div></div>
      <div class="results-pagination"><span id="page-range"></span><div><button id="previous-page" aria-label="Previous page">← Previous</button><span id="page-count"></span><button id="next-page" aria-label="Next page">Next →</button></div></div>
      <p class="results-note">Availability was checked for <strong>NeoForge 1.21.1</strong>. “No native found” means no matching release was identified in the checked sources—not that a port is impossible.</p>
      </div></div></section>
      <section class="preservation-notes" aria-label="Migration essentials"><article><span class="note-number">01</span><h3>Missing blocks aren’t safe placeholders.</h3><p>Java can replace unknown blocks with air or reject the world. Missing containers can take their contents with them.</p></article><article><span class="note-number">02</span><h3>Our saved world matters.</h3><p>The audit sampled 18 chunks and found saved mod content. It wasn’t a full survey of builds, pets or inventories.</p></article><article><span class="note-number">03</span><h3>Start with a complete copy.</h3><p>Keep the original 1.20.1 world intact. Verify data conversion on a backup before moving the live server.</p></article></section>
    </div>
  </main><footer class="migration-wrap migration-footer"><a class="brand" href="/"><img src="/favicon.svg" width="28" height="28" alt="">BigChadGuys+</a><p>Our next chapter, carefully planned.</p><span>Research checked 30 Oct 2026 · 429 distinct mods</span></footer>
  <dialog id="mod-dialog" class="migration-drawer" aria-labelledby="mod-detail-title"><button class="drawer-close" aria-label="Close mod details">${icon('close')}</button><div id="mod-detail-body"></div></dialog>
  <dialog id="scales-dialog" class="scales-dialog" aria-labelledby="scales-title"><div class="dialog-top"><span class="eyebrow">A QUICK FIELD NOTE</span><button class="close-button" aria-label="Close scale guide">✕</button></div><h2 id="scales-title">Two scales. Different questions.</h2><p><strong>Importance asks: what could we lose?</strong> A tiny world-height pack can be easy to update but critical to keep. Scores reflect preservation needs, not whether every mod is needed to start a server.</p><div class="scale-legend"><h3>Preservation importance</h3>${importance.map((label,i)=>`<div><span class="priority-value priority-${i}">P${i}</span><strong>${label}</strong><span>${['Client feature; no direct save import needed.','Rules or convenience; behavior can change.','Smaller saved features or supporting dependencies.','Equipment, powers or player progression.','Builds, pets, transport or important state.','Resolve storage, world layout or incompatible data first.'][i]}</span></div>`).join('')}<h3>Custom porting difficulty</h3>${difficulty.slice(1).map((label,i)=>`<div><span class="difficulty-value">D${i+1}</span><strong>${label}</strong><span>${['Data/config/schema changes with little Java code.','A small tool, event or mixin feature.','Several systems with menus, networking or saved state.','Complex inventories, machinery or data conversion.','Large entity, animation, rendering or deep save-format work.'][i]}</span></div>`).join('')}</div><p class="method-note">Difficulty is an engineering estimate, not a time quote. Existing ports show “Port found” instead. Ratings can change after detailed source and compatibility checks.</p></dialog>
  <div id="migration-toast" class="toast" role="status" aria-live="polite"></div>`;

  const $=selector=>document.querySelector(selector);
  const drawer=$('#mod-dialog'),scales=$('#scales-dialog');
  const syncUrl=()=>window.history.replaceState(null,'',window.location.pathname+stateSearch(state,selectedMod));
  function notify(message){const toast=$('#migration-toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('visible'),3500);}
  const statusBadge=m=>`<span class="availability tone-${statuses[m.status].tone}"><span class="status-dot"></span>${statuses[m.status].short}</span>`;
  const priorityBadge=m=>`<span class="priority-value priority-${m.priority}">P${m.priority}</span>`;
  const difficultyLabel=m=>needsWork(m)?`<span class="difficulty-value">D${m.difficulty}</span><small>${difficulty[m.difficulty]}</small>`:`<span class="existing-option">${m.status==='P'?'Port found':m.status==='N'?'Available':'Alternative'}</span>`;
  function render(){
    const scoped=mods.filter(m=>state.scope==='server'?m.server:state.scope==='client'?!m.server&&m.local:true);
    const scopeLabel=state.scope==='server'?'server mods':state.scope==='client'?'client extras':'distinct mods';
    const stats=[['all',scoped.length,scopeLabel,'Our current inventory','inventory'],['N',scoped.filter(m=>m.status==='N').length,'native counterparts','Published target releases','green'],['M',scoped.filter(m=>m.status==='M').length,'no native port found','A decision still needed','red'],['C',scoped.filter(m=>m.status==='C').length,'custom builds','Our pack-specific work','amber']];
    $('.audit-stats').innerHTML=stats.map(([key,value,title,desc,tone])=>`<button class="stat-card stat-${tone}" data-stat="${key}" aria-label="Show ${title}"><span class="stat-label">${title}</span><strong>${value}<span aria-hidden="true">↗</span></strong><small>${desc}</small></button>`).join('');
    document.querySelectorAll('[data-filter]').forEach(el=>el.value=state[el.dataset.filter]);
    $('#mod-search').value=state.q;
    document.querySelectorAll('[data-status]').forEach(el=>el.checked=state.statuses.includes(el.dataset.status));
    document.querySelectorAll('[data-status-count]').forEach(el=>el.textContent=scoped.filter(m=>m.status===el.dataset.statusCount).length);
    document.querySelectorAll('[data-view]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.view===state.view)));
    const selected=selectMods(mods,state);
    const pages=Math.max(1,Math.ceil(selected.length/pageSize));page=Math.min(page,pages);
    const start=(page-1)*pageSize,visible=selected.slice(start,start+pageSize);
    $('#result-count').textContent=`${selected.length.toLocaleString()} ${selected.length===1?'mod':'mods'}${selected.length!==scoped.length?' of '+scoped.length:''}`;
    $('#active-summary').textContent=state.scope==='server'?'On our server':state.scope==='client'?'Client extras only':'Client + server inventory';
    $('#mod-rows').innerHTML=visible.map(m=>`<tr><th scope="row"><button class="mod-open" data-mod="${esc(m.id)}"><span class="mod-mark category-${esc(m.purpose)}" aria-hidden="true">${esc(m.name.replace(/[^a-zA-Z0-9]/g,'').slice(0,2).toUpperCase())}</span><span class="mod-name"><strong>${esc(m.name)}</strong><small>${esc(categories[m.purpose]||m.purpose)}</small>${Object.keys(m.evidence||{}).length?'<span class="evidence-label"><i></i> Saved content sampled</span>':''}</span></button></th><td data-label="Availability">${statusBadge(m)}</td><td data-label="Importance"><span class="priority-cell">${priorityBadge(m)}<small>${importance[m.priority]}</small></span></td><td data-label="Porting"><span class="difficulty-cell">${difficultyLabel(m)}</span></td><td data-label="If removed"><span class="impact-cell">${esc(impacts[m.impact]?.label||m.impact)}</span></td><td class="open-cell"><button class="row-open" data-mod="${esc(m.id)}" aria-label="Open ${esc(m.name)} details">${icon('arrow')}</button></td></tr>`).join('');
    $('.no-results').hidden=selected.length>0;
    $('.mod-table').hidden=selected.length===0;
    $('#page-range').textContent=selected.length?`Showing ${start+1}–${Math.min(start+pageSize,selected.length)} of ${selected.length}`:'No matching mods';
    $('#page-count').textContent=`${page} / ${pages}`;
    $('#previous-page').disabled=page<=1;
    $('#next-page').disabled=page>=pages;
    $('#export-view').disabled=!selected.length;
    document.querySelectorAll('[data-sort-column]').forEach(th=>{
      let active=state.sort.startsWith(th.dataset.sortColumn);
      th.setAttribute('aria-sort',active?(state.sort==='name'||state.sort==='difficulty-asc'||state.sort==='status'?'ascending':'descending'):'none');
    });
    syncUrl();
  }
  function change(patch){state={...state,...patch};page=1;render();}
  function reset(){state={...defaults,statuses:[]};page=1;render();}
  function openMod(id,{fromUrl=false}={}){
    const m=mods.find(m=>m.id===id);if(!m)return;
    previousFocus=document.activeElement;selectedMod=id;
    const source=safeUrl(m.source);
    const evidence=Object.entries(m.evidence||{});
    $('#mod-detail-body').innerHTML=`<div class="drawer-eyebrow">${esc(categories[m.purpose]||m.purpose)} <span>·</span> ${location(m)}</div><h2 id="mod-detail-title">${esc(m.name)}</h2><code class="detail-mod-id">${esc(m.id)}</code><div class="drawer-badges">${statusBadge(m)}</div><p class="status-definition">${esc(statuses[m.status].description)}</p>
    <div class="detail-scores"><section><span>Preservation importance</span><strong>${priorityBadge(m)} ${importance[m.priority]}</strong><small>What we need to keep or convert.</small></section><section><span>${needsWork(m)?'Estimated port difficulty':'Version option'}</span><strong>${needsWork(m)?`<span class="difficulty-value">D${m.difficulty}</span> ${difficulty[m.difficulty]}`:m.status==='P'?'Community port':m.status==='N'?'Native counterpart':'Alternative / API change'}</strong><small>${needsWork(m)?'Engineering estimate, not a time quote.':'Published option; save conversion untested.'}</small></section></div>
    <section class="removal-note"><span class="detail-section-label">IF WE REMOVE IT</span><h3>${esc(impacts[m.impact]?.label||m.impact)}</h3><p>${esc(m.removal)}</p></section>
    <section class="detail-section"><span class="detail-section-label">THE WAY FORWARD</span><h3>${esc(m.route)}</h3><p>${esc(m.route_note)}</p>${source?`<a class="source-button" href="${esc(source)}" target="_blank" rel="noopener noreferrer">Open checked source ${icon('external')}</a>`:'<p class="local-source-note">Local build · no public release verified.</p>'}</section>
    ${needsWork(m)?`<section class="detail-section"><span class="detail-section-label">WHY THIS DIFFICULTY</span><p>${esc(m.difficulty_reason)}</p>${m.fabric_target?'<p class="bridge-note">A 1.21.1 Fabric release was found. Connector may be worth testing; this is not a verified bridge or save-conversion route.</p>':''}</section>`:''}
    ${evidence.length?`<section class="detail-section evidence-section"><span class="detail-section-label">FOUND IN THE SAVE SAMPLE</span><p>These references appear in the sampled saved data. The audit checked 18 terrain chunks, not every build or player inventory.</p>${evidence.map(([type,ids])=>`<h4>${esc(({blocks:'Block palettes',block_entities:'Block entities',entities:'Entities',items:'Items'})[type]||type)}</h4><div class="evidence-ids">${ids.slice(0,10).map(id=>`<code>${esc(id)}</code>`).join('')}${ids.length>10?`<small>and ${ids.length-10} more references</small>`:''}</div>`).join('')}</section>`:''}
    <details class="installed-files"><summary>Installed files <span>${m.files.length}</span></summary>${m.files.map(f=>`<div><code>${esc(f.file)}</code><small>${esc(f.version)} · ${location(f)}</small></div>`).join('')}</details><div class="drawer-footer"><span>Checked 30 Oct 2026 · Research snapshot</span><button class="text-link" id="share-mod">${icon('link')} Share this mod</button></div>`;
    if(!drawer.open)drawer.showModal();
    document.body.classList.add('modal-open');drawer.scrollTop=0;drawer.querySelector('.drawer-close').focus();
    if(!fromUrl)syncUrl();
  }
  function showScales(){previousFocus=document.activeElement;scales.showModal();document.body.classList.add('modal-open');}
  drawer.querySelector('.drawer-close').addEventListener('click',()=>drawer.close());
  drawer.addEventListener('close',()=>{selectedMod='';document.body.classList.remove('modal-open');syncUrl();previousFocus?.focus();});
  scales.querySelector('.close-button').addEventListener('click',()=>scales.close());
  scales.addEventListener('close',()=>{document.body.classList.remove('modal-open');previousFocus?.focus();});
  for(const dialog of [drawer,scales])dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  $('#open-explainer').addEventListener('click',showScales);$('#open-scales').addEventListener('click',showScales);
  document.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('change',()=>change({[el.dataset.filter]:el.value})));
  document.querySelectorAll('[data-status]').forEach(el=>el.addEventListener('change',()=>change({statuses:[...document.querySelectorAll('[data-status]:checked')].map(input=>input.dataset.status)})));
  $('#mod-search').addEventListener('input',event=>change({q:event.target.value}));
  $('#reset-filters').addEventListener('click',reset);$('#empty-reset').addEventListener('click',reset);
  $('.mobile-filter-toggle').addEventListener('click',event=>{const button=event.currentTarget;const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.querySelector('span').textContent=open?'−':'＋';});
  document.addEventListener('click',event=>{
    const modButton=event.target.closest('[data-mod]');if(modButton)openMod(modButton.dataset.mod);
    const view=event.target.closest('[data-view]');if(view)change({view:view.dataset.view,statuses:[],...(view.dataset.view==='client'?{scope:'client'}:state.scope==='client'?{scope:'server'}:{})});
    const stat=event.target.closest('[data-stat]');if(stat)change({view:'all',statuses:stat.dataset.stat==='all'?[]:[stat.dataset.stat]});
    const sort=event.target.closest('[data-sort]');if(sort){let next=sort.dataset.sort;if(next==='name'&&state.sort==='name')next='name-desc';if(next==='difficulty-desc'&&state.sort==='difficulty-desc')next='difficulty-asc';change({sort:next});}
    if(event.target.closest('#share-mod'))share();
  });
  async function share(){try{await navigator.clipboard.writeText(window.location.href);notify('Link copied. This view is ready to share.');}catch{notify('Copy the page address to share this view.');}}
  $('#share-view').addEventListener('click',share);
  $('#export-view').addEventListener('click',()=>{const results=selectMods(mods,state);const blob=new Blob([csvText(results)],{type:'text/csv;charset=utf-8'});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download='bcg-neoforge-1.21.1-mods.csv';a.click();setTimeout(()=>URL.revokeObjectURL(href),1000);notify(`Exported ${results.length} mods from this view.`);});
  function turnPage(delta){page+=delta;render();$('#explorer-title').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
  $('#previous-page').addEventListener('click',()=>turnPage(-1));$('#next-page').addEventListener('click',()=>turnPage(1));
  document.addEventListener('keydown',event=>{if(event.key==='/'&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!drawer.open&&!scales.open){event.preventDefault();$('#mod-search').focus();}});
  window.addEventListener('popstate',()=>{state=readState(window.location.search);page=1;const id=new URLSearchParams(window.location.search).get('mod');selectedMod=id||'';render();if(id)openMod(id,{fromUrl:true});else if(drawer.open)drawer.close();});
  const initialMod=new URLSearchParams(window.location.search).get('mod');selectedMod=initialMod||'';render();if(initialMod)openMod(initialMod,{fromUrl:true});
}
