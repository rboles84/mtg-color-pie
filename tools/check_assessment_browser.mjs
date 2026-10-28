// Focused A-assessment checks using externally supplied Playwright; no new dependency.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const args=process.argv.slice(2), opt=(n,d)=>args.includes(n)?args[args.indexOf(n)+1]:d;
const root=path.resolve(opt('--root','.'));
const copyOnly=args.includes('--copy-only');
const {chromium}=createRequire(import.meta.url)(opt('--playwright','playwright'));
const payload=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-assessments.v1.json'),'utf8'));
const supplement=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement.v1.json'),'utf8'));
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try{res.setHeader('Content-Type',file.endsWith('.json')?'application/json':file.endsWith('.html')?'text/html':'text/plain');res.end(fs.readFileSync(file));}
  catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url=`http://127.0.0.1:${server.address().port}/vox-color/mechanical-explorer.html`;
const assessmentRoute='**/data/mechanics-assessments.v1.json';
const math=()=>{
  const values={};
  for(const code of ['W','WB','UBR','WUBR','WUBRG']){
    const c=new Set(code);values[code]={sections:VMX.sections(c),buckets:VMX.buckets(c),add:VMX.deltaAdd(c,[...'WUBRG'].find(x=>!c.has(x))||'W'),remove:VMX.deltaRemove(c,code[0])};
  }
  return JSON.stringify({values,summary:VMX.wubrgSummary()});
};
let browser;const results=[];
try{
  browser=await chromium.launch({channel:opt('--channel','msedge'),headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}}), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(()=>window.VMX?.assessments().status==='ready');
  await page.waitForFunction(()=>document.querySelector('#selftest').textContent.includes('84 of 84 passed'));
  const baseline=await page.evaluate(math);
  assert.equal(await page.locator('#list .ent').count(),216);
  assert.equal(await page.evaluate(()=>VMX.assessments().records.length),25);
  await page.evaluate(()=>VMX.setView('az'));
  assert.equal(await page.locator('#list .ent').count(),587);
  assert.equal(await page.locator('#list > .grp[data-scope="main"] .ent').count(),543);
  assert.equal(await page.locator('#list > .grp[data-scope="special-material"] .ent').count(),44);
  if(!copyOnly){
  for(const record of payload.records){
    const row=page.locator(`#list .ent[data-k="${record.id}"]`);
    if(record.kind!=='derived'){assert.equal(await row.locator('.strip').count(),0);continue;}
    const expected=[...'WUBRG'].map(c=>[c,record.placements[c]?'t-'+record.placements[c][0].toLowerCase():'t-n']);
    assert.equal(await row.locator('.e-tag').count(),0,record.name+' verbose row subtitle removed');
    assert.equal(await row.locator('.strip').count(),1);
    assert.deepEqual(await row.locator('.strip > .sc').evaluateAll(slots=>slots.map(e=>[e.dataset.c,[...e.classList].find(c=>c.startsWith('t-'))])),expected);
    assert.ok((await row.getAttribute('aria-label')).includes(record.label.replace(' - ',' — ')));
    for(const c of 'WUBRG')if(!record.placements[c])assert.match(await row.getAttribute('aria-label'),new RegExp(({W:'White',U:'Blue',B:'Black',R:'Red',G:'Green'})[c]+' Unassigned'));
    await page.locator('#q').fill(record.name);
    const result=page.locator(`.opt[data-k="${record.id}"]`);
    assert.deepEqual(await result.locator('.strip > .sc').evaluateAll(slots=>slots.map(e=>[e.dataset.c,[...e.classList].find(c=>c.startsWith('t-'))])),expected);
    assert.equal(await result.locator('.lensp').innerText(),record.shortLabel+' · provisional');
    assert.match(await result.getAttribute('aria-label'),/provisional/);
  }
  await page.evaluate(()=>{VMX.setQuery('');VMX.chooseCombo('W');VMX.setView('article');VMX.setView('az');});
  assert.equal(await page.locator('#list .ent[data-k^="deck:"] .strip').count(),20);
  assert.equal(await page.locator('#list .ent[data-k^="deck:"] .strip .bx').count(),0);
  assert.equal(await page.evaluate(math),baseline);
  await page.evaluate(()=>VMX.clearColors());
  await page.locator('#q').fill('Adamant');await page.locator('#q').press('Enter');
  assert.equal(await page.locator('#dx-title').innerText(),'Adamant');
  assert.match(await page.locator('#detail .supp-assessment').innerText(),/Scryfall-derived assessment - provisional/);
  await page.locator('#detail .dx-close').press('Enter');
  assert.equal(await page.evaluate(()=>VMX.state.pick),null);
  await page.setViewportSize({width:360,height:900});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await page.locator('#list .ent[data-k^="deck:"] .strip').evaluateAll(strips=>strips.every(e=>e.getBoundingClientRect().right<=e.closest('.ent').getBoundingClientRect().right)),true);
  assert.deepEqual(errors,[]);
  results.push('20 exact WUBRG strips in rows/search; no verbose subtitle; accessible provisional/Unassigned labels; no fake Colorless/rules strips; Article/lens roundtrip; keyboard; 360px containment');
  await page.setViewportSize({width:1440,height:900});
  }
  if(!args.includes('--symbols-only')){
  let assigned=0;
  for(const record of payload.records){
    await page.evaluate(id=>VMX.open(id),record.id);
    const panel=page.locator('#detail .supp-assessment');
    assert.equal(await panel.getAttribute('aria-label'),record.label,record.name);
    assert.equal(await page.locator('#dx-title').innerText(),record.name);
    assert.match(await panel.innerText(),/Outside the 2021 color calculations/);
    assert.match(await panel.innerText(),/Based on evidence available October 26, 2026/);
    assert.ok((await panel.innerText()).includes(record.scope));
    assert.equal(await page.locator('#supp-ranking-note').count(),0);
    const summary=await page.locator(`#list .ent[data-k="${record.id}"]`).getAttribute('aria-label');
    assert.ok(summary.includes(record.shortLabel));
    assert.doesNotMatch(summary,/Rankings unassigned/);
    if(record.kind==='derived'){
      assert.equal(await panel.locator('.own-row').count(),5);
      for(const c of 'WUBRG'){
        assert.equal(await panel.locator(`.own-row[data-c="${c}"] .own-t`).innerText(),record.placements[c]||'Unassigned');
        if(record.placements[c])assigned++;
      }
    }else{
      assert.equal(await panel.locator('.own-row').count(),0);
      assert.ok((await panel.innerText()).includes(record.kind==='colorless'?(record.outsidePrimary?'Primary: Colorless':'Colorless access · Tier unassigned'):'Rules action · Not ranked'));
    }
    const notes=panel.locator('.assessment-notes');
    await notes.locator(':scope > summary').focus();await page.keyboard.press('Enter');
    assert.equal(await notes.getAttribute('open'),'');
    assert.ok((await notes.innerText()).includes(record.summary));
    if(record.kind==='derived') for(const c of 'WUBRG'){
      assert.ok((await notes.innerText()).includes(record.rationale[c]));
      assert.ok((await notes.innerText()).includes('Confidence: '+record.decisionConfidence[c]));
    }
    const playerText=await panel.innerText();
    assert.doesNotMatch(playerText,/Protocol 1\.0|Judgment October|observed tier unresolved|no support in sample|inherited receipts|normalized to UTC|retained record|conformance record|independent review pending/i,record.name+' excludes research bookkeeping');
    if(record.name==='Adapt'){
      assert.doesNotMatch(await page.locator('#detail').innerText(),/Specific rules material|Specific Comprehensive Rules material is retained/);
      for(const name of ['Knighted Myr','Pteramander','Etherium Pteramander','Incubation Druid']) assert.ok(playerText.includes(name));
      assert.match(record.rationale.U,/not enough|cannot|unclear|uncertain|do not|does not/i);
      assert.match(record.rationale.R,/no|not found|none/i);
    }
    const scopeWitness={Actualize:/digital|Alchemy/i,Assimilate:/preview/i,Assemble:/Unstable/i,Augment:/Unstable|Unsanctioned/i,Affinitycycling:/playtest|designer/i}[record.name];
    if(scopeWitness) assert.match(await page.locator('#detail').innerText(),scopeWitness,record.name+' scope warning retained');
    assert.equal(await notes.locator('a').count(),record.sources.length+1+record.citationCards.length);
    assert.deepEqual(await notes.locator('a').evaluateAll(links=>links.filter(a=>a.protocol!=='https:'||!['scryfall.com','magic.wizards.com'].includes(a.hostname)||a.rel!=='noopener noreferrer').map(a=>a.href)),[]);
    if(record.name==='Attach'){
      const related=panel.locator('.assessment-related');
      assert.match(await related.innerText(),/Blue · Primary/);assert.match(await related.innerText(),/2017/);
      assert.match(await related.innerText(),/not every Attach action/);
    }
    if(record.name==='Annihilator'){
      assert.match(await panel.innerText(),/selected for this page/);
      assert.match(await panel.innerText(),/The cards support colorless access; Primary is the classification chosen for this page/);
      assert.doesNotMatch(await panel.innerText(),/Analyst assessment|assessment - provisional/);
    }
    if(record.name==='Affinitycycling'){
      assert.match(await panel.innerText(),/assessment - provisional/);
      assert.match(await panel.innerText(),/Confidence: Low/);
      assert.match(await notes.innerText(),/playtest|designer/i);
    }
  }
  assert.equal(assigned,payload.records.reduce((n,r)=>n+Object.values(r.placements).filter(Boolean).length,0));
  results.push('25 protocol assessments; all projected colored tiers; unresolved Colorless access and user-selected Colorless home; rules actions; scoped 2017 note; evidence links');
  const training=supplement.records.find(r=>r.name==='Training');
  await page.evaluate(id=>VMX.open(id),training.id);
  assert.equal(await page.locator('#detail .supp-assessment').count(),0);
  assert.match(await page.locator('#detail').innerText(),/Rankings unassigned/);
  assert.match(await page.locator('#detail').innerText(),/Specific Comprehensive Rules material is retained/);
  await page.locator('#q').fill('Flying');await page.locator('#q').press('Enter');
  assert.equal(await page.locator('#dx-title').innerText(),'Flying');
  assert.equal(await page.locator('#detail .supp-assessment').count(),0);
  results.push('Player copy for all 25; no research bookkeeping; Adapt uncertainty, special scope, non-A and 2021 controls preserved');
  if(!copyOnly){
  await page.evaluate(()=>{VMX.close();VMX.clearColors();VMX.setQuery('');});
  await page.locator('#q').fill('Absorb');await page.locator('#q').press('Enter');
  assert.equal(await page.locator('#dx-title').innerText(),'Absorb');
  await page.locator('#detail .dx-close').focus();await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>VMX.state.pick),null);
  await page.setViewportSize({width:360,height:900});
  await page.locator('#q').fill('Annihilator');await page.locator('#q').press('Enter');
  await page.locator('#detail .assessment-notes > summary').click();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.evaluate(()=>VMX.chooseCombo('WUBRG'));
  assert.equal(await page.evaluate(math),baseline);
  assert.deepEqual(errors,[]);
  results.push('2021: 84/84; Article 216, A–Z 543 + Special 44; unchanged math and non-A; keyboard and 360px containment');
  }
  }
  await page.close();
  if(!copyOnly){
  for(const scenario of (args.includes('--symbols-only')?['missing']:['missing','bad-tier','wrong-binding','unsafe-url','bad-status','false-colorless-tier'])){
    const p=await browser.newPage();const bad=structuredClone(payload);
    if(scenario==='bad-tier')bad.records.at(-1).placements.W='Invented';
    if(scenario==='wrong-binding')bad.supplementCanonicalSha256='0'.repeat(64);
    if(scenario==='unsafe-url')bad.records.at(-1).queryUrl='https://scryfall.com@evil.example/test';
    if(scenario==='bad-status')bad.records.find(r=>r.name==='Absorb').decisionStatus.W='observed_tier_unresolved';
    if(scenario==='false-colorless-tier')bad.records.find(r=>r.name==='Affinitycycling').outsidePrimary='Colorless';
    await p.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));
    await p.goto(url);await p.waitForFunction(()=>window.VMX?.assessments().status==='unavailable');
    assert.equal(await p.evaluate(()=>VMX.supplemental().status),'ready');
    assert.equal(await p.evaluate(()=>VMX.assessments().records.length),0);
    await p.evaluate(id=>{VMX.setView('az');VMX.open(id);},payload.records.find(r=>r.name==='Absorb').id);
    assert.match(await p.locator('#detail .supp-assessment').innerText(),/Assessment unavailable/);
    assert.equal(await p.locator('#list .ent').count(),587);
    assert.equal(await p.locator('#list .ent[data-k^="deck:"] .strip').count(),0);
    await p.waitForFunction(()=>document.querySelector('#selftest').textContent.includes('84 of 84 passed'));
    assert.equal(await p.evaluate(math),baseline);await p.close();
    results.push('Atomic fail-soft: '+scenario);
  }
  const late=await browser.newPage();let release;
  const gate=new Promise(resolve=>release=resolve);
  const escaped=structuredClone(payload);escaped.records.find(r=>r.name==='Absorb').summary='<img src=x onerror="window.assessmentInjected=true">';
  await late.route(assessmentRoute,async route=>{await gate;await route.fulfill({contentType:'application/json',body:JSON.stringify(escaped)});});
  await late.goto(url,{waitUntil:'domcontentloaded'});
  await late.waitForFunction(()=>window.VMX?.supplemental().status==='ready');
  const absorb=payload.records.find(r=>r.name==='Absorb');
  await late.evaluate(id=>{VMX.setView('az');VMX.setQuery('Absorb');VMX.open(id);},absorb.id);
  assert.match(await late.locator('#detail .supp-assessment').innerText(),/Assessment loading/);
  await late.locator('#q').focus();release();
  await late.waitForFunction(()=>VMX.assessments().status==='ready');
  assert.equal(await late.locator('#q').evaluate(e=>document.activeElement===e),true);
  assert.equal(await late.locator(`#list .ent[data-k="${absorb.id}"] .e-tag`).count(),0);
  assert.equal(await late.locator(`#list .ent[data-k="${absorb.id}"] .strip`).count(),1);
  assert.equal(await late.locator(`#list .ent[data-k="${absorb.id}"] .strip .t-p`).count(),1);
  assert.equal(await late.locator(`.opt[data-k="${absorb.id}"] .strip .t-n`).count(),4);
  assert.match(await late.locator('#detail .supp-assessment').innerText(),/Scryfall-derived/);
  assert.equal(await late.locator('#detail .supp-assessment img').count(),0);
  assert.equal(await late.evaluate(()=>window.assessmentInjected),undefined);
  assert.ok((await late.locator('#detail .assessment-notes').textContent()).includes('<img src=x'));
  results.push('Late load refreshes row/detail, preserves input focus; source HTML escaped');await late.close();
  }
  console.log(JSON.stringify({result:'PASS',checks:results},null,2));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
