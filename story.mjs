const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chapters=[...document.querySelectorAll('.chapter')];
const hero=document.querySelector('#question');
const copy={
 overview:['107','saved records','Start with what is published.','Each dot is one saved record. Grouping preserves the same population.'],
 ids:['13 / 107','records with a process ID','A possible route into procurement.','Dark dots contain an ID. The 94 pale dots do not. An ID alone is not a tested link.'],
 both:['11 / 107','records with both fields','Two fields meet in the same record.','The 11 dark dots contain both a budget with currency and a procurement identifier.'],
 split:['70 / 107','budget present, ID absent','Different gaps need different checks.','The four groups contain all 107 records. Outlined dots lack a procurement ID.'],
 featured:['1','deliberate example','An award is visible. Delivery is not established.','Bulemu is one of the two ID-only records. Its award source can be read; financial and delivery questions remain.'],
 action:['Next','a proposed joint check','Make the next question answerable.','A publisher and assurance lead could agree what to check and who will act. No owner or funding decision is established here.' ]
};
const evidence={dates:'<h3>Observed · Two dates, two meanings</h3><p>The NCC Zambia package was published on 25 June 2026 and retrieved by the datastore on 5 September 2026. This analysis was saved on 5 September 2026. Retrieval does not establish current delivery.</p>',identifiers:'<h3>Calculated · 13 of 107 records</h3><p>A record counts once if at least one contractingProcesses[].id is a non-empty string. There are 15 process entries across these 13 records. An identifier does not prove the corresponding procurement record can be accessed.</p>',intersection:'<h3>Calculated · Same-record overlap</h3><p>A budget requires a finite numeric amount, including zero, and a non-empty currency. A procurement ID requires a non-empty string. Both must occur in the same saved project record.</p><ul><li>Both: 11</li><li>ID only: 2</li><li>Budget only: 70</li><li>Neither: 24</li></ul><p>These four groups sum to all 107 records. Separate counts are 81 budgets and 13 records with IDs. No amounts or currencies are pooled.</p>',record:'<h3>Observed · A selected source relationship</h3><p>Record <code>oc4ids-xxpl20-zm-moe-bulemu-east-west</code> contains process <code>contract-16</code>. The source is in <code>contractingProcesses[0].summary.sources[0].url</code>.</p><p><a href="https://getfit-zambia.org/solar" target="_blank" rel="noopener noreferrer">GET FiT Zambia Solar ↗</a> was read on 5 September 2026. It names the Bulemu awards and the Building Energy and Pele Energy joint venture. The saved record has no project budget or contract value.</p><h3>Unverified · What this does not settle</h3><p>This does not establish a signed contract, payments, current delivery or value for money. The example was deliberately selected for readable award context with a missing budget; it is not representative.</p>',action:'<h3>Recommended · Confirm a practical next step</h3><p>A publisher and assurance lead could agree a sample, the questions to answer, and how to record usable, missing and unchecked source relationships. They must confirm the responsible people and institutional need before adopting this proposal or making a funding decision.</p><p>The intended result is a dated check with an accountable next action. No impact or institutional commitment is inferred from field presence.</p>',methods:'<h3>Calculated · A diagnostic reading of one package</h3><p>All 107 NCC Zambia records are retained, without sector or status filters. Counts describe presence of fields, not national coverage, verified spending, quality rankings or delivery. The four-group comparison retains the same record population.</p><p>Source dates and definitions are available below. This is a decision layer with the full record layer linked for inspection.</p>'};
let data=null;
for(const button of document.querySelectorAll('[data-evidence]'))button.addEventListener('click',()=>{
 $('#evidence-body').innerHTML=evidence[button.dataset.evidence]||evidence.methods;
 if(button.dataset.evidence==='record'&&data)$('#evidence-body').insertAdjacentHTML('beforeend','<h3>Other selected checks</h3>'+data.sourceCheck.checks.filter(c=>c.status==='inconclusive').map(c=>`<p><b>${esc(c.project)}</b>: ${esc(c.result)}</p>`).join(''));
 $('#evidence').showModal();
});
try{
 const response=await fetch('data/generated/storyboard.json');if(!response.ok)throw Error('Saved calculations could not be loaded. The chapter and source links remain available; reload to restore the changing visual.');data=await response.json();
 if(data.counts.recordCount!==107)throw Error('The chapter needs an editorial refresh before showing changed data.');
 const order=[...data.groups.both,...data.groups.idOnly,...data.groups.budgetOnly,...data.groups.neither];
 const records=new Map(data.records.map(r=>[r.id,r]));
 $('#dots').innerHTML=order.map((id,i)=>`<circle data-id="${esc(id)}" cx="${30+i%11*30}" cy="${13+Math.floor(i/11)*26}" r="8"><title>${esc(records.get(id).title)}</title></circle>`).join('');
 const circles=[...$('#dots').children];let active=null;
 function activate(chapter){
  if(active===chapter.id)return;active=chapter.id;const mode=chapter.dataset.mode,[n,unit,title,caption]=copy[mode];
  $('#stage-number').innerHTML=esc(n)+'<span>'+esc(unit)+'</span>';$('#stage-title').textContent=title;$('#stage-caption').textContent=caption;
  const index=chapters.indexOf(chapter);$('#step-label').textContent=String(index+1).padStart(2,'0')+' / 06';$('#next-chapter').href='#'+chapters[(index+1)%chapters.length].id;$('#next-chapter').textContent=index===5?'Start again ↑':'Continue ↓';
  $('#record-visual').toggleAttribute('hidden',mode==='featured'||mode==='action');$('#trail').hidden=mode!=='featured'&&mode!=='action';
  $('#record-visual').setAttribute('aria-label',title+' '+caption);
  $('#group-labels').innerHTML=mode==='split'?[[20,14,'11 · Both'],[202,14,'2 · ID only'],[20,135,'70 · Budget only'],[202,135,'24 · Neither']].map(([x,y,t])=>`<text x="${x}" y="${y}">${t}</text>`).join(''):'';
  const positions={withBoth:[20,32,0],processOnly:[202,32,0],budgetOnly:[20,154,0],neither:[202,154,0]};
  circles.forEach((circle,i)=>{const r=records.get(circle.dataset.id),isId=r.processIds.length>0,isBoth=r.category==='withBoth';circle.setAttribute('class',mode==='ids'?(isId?'highlight':'dim'):mode==='both'?(isBoth?'highlight':'dim'):mode==='split'?(!isId?'missing':'highlight'):'');let x=30+i%11*30,y=13+Math.floor(i/11)*26;
   if(mode==='split'){const pos=positions[r.category],j=pos[2]++;x=pos[0]+j%10*14;y=pos[1]+Math.floor(j/10)*16;}
   circle.setAttribute('cx',x);circle.setAttribute('cy',y);circle.setAttribute('r',mode==='split'?4.5:8);
  });
  if(history.replaceState)history.replaceState(null,'',location.pathname+location.search+'#'+chapter.id);
 }
 let scheduled=false;
 function readScroll(){scheduled=false;if(hero&&hero.getBoundingClientRect().bottom>innerHeight*.45){active=null;if(location.hash!=="#question")history.replaceState(null,"","#question");return;}const mobile=innerWidth<=760,target=mobile?Math.min(innerHeight-60,380):innerHeight*.5;const next=chapters.find(c=>c.getBoundingClientRect().bottom>target)||chapters.at(-1);activate(next);}
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(readScroll)}}
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);window.addEventListener('hashchange',schedule);readScroll();
}catch(error){$('#story-status').textContent=error.message;$('#story-status').hidden=false;}
