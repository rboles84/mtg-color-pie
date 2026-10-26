// Focused integration checks. Uses an externally supplied Playwright installation;
// no package manager, runtime dependency, or remote provider query is introduced.
// node tools/check_supplement_browser.mjs --root . --playwright <absolute module>
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const args=process.argv.slice(2), option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const root=path.resolve(option('--root','.'));
const modulePath=option('--playwright',process.env.PLAYWRIGHT_PATH||'playwright');
const {chromium}=createRequire(import.meta.url)(modulePath);
const payload=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement.v1.json'),'utf8'));
assert.equal(payload.schemaVersion,1); assert.equal(payload.records.length,390);
const scope=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement-scope.v1.json'),'utf8'));
const examples=JSON.parse(fs.readFileSync(path.join(root,'vox-color/mechanical-supplement-examples.json'),'utf8'));
const sha256=text=>createHash('sha256').update(text).digest('hex');
assert.equal(scope.schemaVersion,1);assert.equal(scope.records.length,390);
assert.equal(scope.payloadCanonicalSha256,sha256(JSON.stringify(payload)));
assert.equal(scope.payloadSha256,sha256(fs.readFileSync(path.join(root,'data/mechanics-supplement.v1.json'))));
assert.equal(examples.schemaVersion,1);assert.equal(examples.records.length,358);
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try {res.setHeader('Content-Type',file.endsWith('.json')?'application/json':file.endsWith('.csv')?'text/csv':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(file));}
  catch {res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
let browser;
const checks=[];
const pass=(name,detail)=>{checks.push({name,result:'PASS',detail});};
try {
  browser=await chromium.launch({channel:option('--channel','msedge'),headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const errors=[],consoleErrors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push({text:m.text(),url:m.location().url});});
  page.on('console',m=>{if(m.text().includes('[mechanical-explorer]')) console.error(m.text());});
  await page.goto(base+'/vox-color/mechanical-explorer.html');
  await page.waitForFunction(()=>window.VMX?.supplemental().status!=='loading');
  assert.equal(await page.evaluate(()=>VMX.supplemental().status),'ready',await page.locator('#supplement-status').innerText());
  await page.waitForFunction(()=>document.querySelector('#supplement-status').textContent.includes('358 selected supplemental card examples are available.'));
  await page.waitForFunction(()=>document.querySelector('#selftest').textContent.includes('84 of 84 passed'));
  pass('baseline self-checks',84);
  const results=await page.evaluate(records=>{
    const failures=[];let checks=0;
    for(const lens of ['', 'W']) {
      VMX.clearColors();if(lens)VMX.toggleColor(lens);
      for(const record of records) for(const name of [record.name,...record.aliases]) {
        const destination=record.target2021||record.id;
        VMX.setQuery(name);
        const hits=VMX.state.hits;
        if(hits.filter(h=>h.k===destination).length!==1||hits[0]?.k!==destination)failures.push({lens,name,destination,first:hits[0]?.k});
        checks++;
      }
    }
    VMX.clearColors();VMX.setQuery('');
    return {checks,failures,article:VMX.article().length,listOnly:VMX.listOnly().length,entries:document.querySelectorAll('#list .ent').length};
  },payload.records);
  assert.deepEqual(results.failures,[]);assert.equal(results.entries,216);assert.equal(results.article+results.listOnly,216);
  pass('all accepted names and approved aliases, no lens and White lens',results);
  const training=payload.records.find(r=>r.name==='Training');assert.ok(training);
  const q=page.locator('#q'), detail=page.locator('#detail');
  const original=JSON.parse(fs.readFileSync(path.join(root,'data/mechanical-color-pie.runtime.json'),'utf8')).byMechanic;
  const expectedKeys=[...Object.keys(original),...payload.records.filter(r=>!r.target2021).map(r=>r.id)];
  assert.equal(new Set(expectedKeys).size,587);
  const mathSnapshot=()=>{
    const result={};
    for(const code of ['W','WB','UBR','WUBR','WUBRG']){
      const cols=new Set(code);
      result[code]={sections:VMX.sections(cols),buckets:VMX.buckets(cols),
        add:VMX.deltaAdd(cols,[...'WUBRG'].find(c=>!cols.has(c))||'W'),remove:VMX.deltaRemove(cols,code[0])};
    }
    return JSON.stringify({result,summary:VMX.wubrgSummary()});
  };
  const beforeViews=await page.evaluate(mathSnapshot);
  await page.locator('[data-v="az"]').click();
  const browse=await page.evaluate(()=>{
    const rows=[...document.querySelectorAll('#list .ent')];
    return {keys:rows.map(e=>e.dataset.k),tabbable:rows.filter(e=>e.tabIndex===0).length};
  });
  assert.equal(browse.keys.length,587);assert.equal(new Set(browse.keys).size,587);
  assert.deepEqual([...browse.keys].sort(),expectedKeys.sort());assert.equal(browse.tabbable,1);
  // Titles include glosses; the visible label plus qualifier is the index's sort key.
  const sortedGroups=await page.evaluate(()=>[...document.querySelectorAll('#list > .grp')].map(group=>({id:group.dataset.scope,label:group.getAttribute('aria-label'),count:group.querySelector('h3 small').textContent,keys:[...group.querySelectorAll(':scope > .grp-in > .ent')].map(e=>e.dataset.k),sorted:[...group.querySelectorAll(':scope > .grp-in > .ent')].map(e=>{
    const label=e.querySelector('.e-lab').cloneNode(true);
    label.querySelectorAll('.e-tag,.e-q').forEach(e=>e.remove());
    return label.textContent.toLowerCase().replace(/[\u2018\u2019]/g,"'")
      .replace(/[\u201c\u201d"]/g,'').replace(/[\u2013\u2014]/g,'-').replace(/\u200b/g,'').replace(/\s+/g,' ').trim()
      .replace(/[.\s]+$/,'').replace(/^["'+\-]+/,'').replace(/['"]/g,'')+' '+(e.querySelector('.e-q')?.textContent.replace(/^ · /,'')||'');
  })})));
  const newRecords=payload.records.filter(r=>!r.target2021), scopedById=new Map(scope.records.map(r=>[r.id,r]));
  const ordinaryRecords=newRecords.filter(r=>['rules','ability-words'].includes(scopedById.get(r.id).group));
  const specialRecords=newRecords.filter(r=>!['rules','ability-words'].includes(scopedById.get(r.id).group));
  assert.deepEqual(sortedGroups.map(g=>[g.id,g.label]),[['main','A–Z'],['special-material','Special material']]);
  assert.deepEqual([...sortedGroups[0].keys].sort(),[...Object.keys(original),...ordinaryRecords.map(r=>r.id)].sort());
  assert.equal(sortedGroups[0].keys.length,543);assert.equal(sortedGroups[0].count,'543 entries');assert.ok(sortedGroups[0].sorted.every((v,i)=>i===0||sortedGroups[0].sorted[i-1]<=v),'main A–Z order');
  assert.equal(sortedGroups[1].count,'44 entries');
  const specialGroups=await page.evaluate(()=>[...document.querySelectorAll('#list > .grp[data-scope="special-material"] > .grp-in > .grp')].map(group=>({id:group.dataset.scope,label:group.getAttribute('aria-label'),count:group.querySelector('h3 small').textContent,keys:[...group.querySelectorAll(':scope > .grp-in > .ent')].map(e=>e.dataset.k)})));
  const expectedSpecial=scope.groups.filter(group=>!['rules','ability-words'].includes(group.id)).map(group=>({id:group.id,label:group.label,keys:specialRecords.filter(r=>scopedById.get(r.id).group===group.id).map(r=>r.id)})).filter(group=>group.keys.length);
  assert.deepEqual(specialGroups.map(group=>[group.id,group.label]),expectedSpecial.map(group=>[group.id,group.label]));
  for(const [i,group] of specialGroups.entries()){assert.deepEqual([...group.keys].sort(),expectedSpecial[i].keys.sort());assert.equal(group.count,group.keys.length+' '+(group.keys.length===1?'entry':'entries'));}
  assert.equal(specialGroups.flatMap(group=>group.keys).length,44);
  await page.evaluate(()=>{window.__azFlying=document.querySelector('#list .ent[data-k="flying"]');window.__azFlying.focus();});
  await page.evaluate(()=>{VMX.setView('article');VMX.setView('az');});
  assert.equal(await page.evaluate(()=>document.querySelector('#list .ent[data-k="flying"]')===window.__azFlying&&document.activeElement===window.__azFlying),true);
  assert.match(await page.locator('#list-cap').innerText(),/587.*216.*2021.*371.*supplemental/);
  assert.match(await page.locator('#meta').innerText(),/216.*2021 entries.*2021 color placements/);
  const supplementalKeys=payload.records.filter(r=>!r.target2021).map(r=>r.id);
  for(const code of ['W','WB','WUBR','WUBRG']){
    await page.evaluate(code=>VMX.chooseCombo(code),code);
    const failures=await page.evaluate(keys=>keys.filter(k=>{
      const e=[...document.querySelectorAll('#list .ent')].find(e=>e.dataset.k===k);
      return !e||e.classList.contains('is-out')||e.classList.contains('is-off')||e.querySelector('.strip')||
        getComputedStyle(e).display==='none'||getComputedStyle(e).opacity!=='1'||
        !e.textContent.includes('Rankings unassigned')||!e.getAttribute('aria-label').includes('Rankings unassigned');
    }),supplementalKeys);
    assert.deepEqual(failures,[],code);
  }
  await page.evaluate(()=>{VMX.chooseCombo('W');VMX.setSpot('bucket:primary');});
  assert.equal(await page.locator('#list .ent.is-off').evaluateAll(rows=>rows.some(e=>e.dataset.k.startsWith('deck:'))),false);
  assert.match(await page.locator('#spotbar').innerText(),/Supplemental entries remain visible/);
  await page.evaluate(()=>{VMX.clearColors();VMX.setQuery('');});
  const opened=await page.evaluate(keys=>keys.filter(k=>{
    VMX.open(k);
    return VMX.state.pick!==k||document.querySelectorAll('[data-detail-owner]').length!==1||document.querySelector('#detail').hidden||
      (k.startsWith('deck:')&&document.querySelectorAll('#detail .own-row').length!==0);
  }),expectedKeys);
  assert.deepEqual(opened,[]);await page.evaluate(()=>VMX.close());
  const renderedExamples=await page.evaluate(records=>records.map(record=>{
    VMX.open(record.key);const detail=document.querySelector('#detail'), figure=detail.querySelector(`.cite[data-id="${record.card.id}"]`);
    return {key:record.key,title:detail.querySelector('#dx-title')?.textContent,example:detail.querySelector('.dx-eg')?.textContent,caption:figure?.querySelector('.cite-c')?.textContent,image:figure?.querySelector('img')?.getAttribute('src'),alt:figure?.querySelector('img')?.getAttribute('alt')};
  }),examples.records);
  for(const record of renderedExamples){
    assert.equal(record.example?.startsWith('Example'),true,record.key);assert.equal(record.caption?.endsWith('An example card.'),true,record.key);assert.ok(record.image?.startsWith('https://cards.scryfall.io/'),record.key);
  }
  await page.evaluate(()=>VMX.close());
  pass('all 358 optional supplemental examples render through the existing safe card plate with supplemental-only neutral caption',renderedExamples.length);
  assert.equal(await page.evaluate(mathSnapshot),beforeViews);
  pass('A–Z main 543 alphabetical ordinary entries, then 44 scoped Special material entries; all 587 unique and outside every tested lens/spotlight; immutable maths',true);
  const trainingRow=page.locator('#list .ent').filter({hasText:'Training'}).filter({hasText:'Rankings unassigned'});
  await trainingRow.click();assert.equal(await detail.locator('#dx-title').innerText(),'Training');
  await detail.locator('[data-act="close"]').click();assert.equal(await trainingRow.evaluate(e=>e===document.activeElement),true);
  await trainingRow.press('Enter');assert.equal(await detail.locator('#dx-title').innerText(),'Training');
  await detail.locator('[data-act="close"]').focus();await page.keyboard.press('Escape');
  assert.equal(await trainingRow.evaluate(e=>e===document.activeElement),true);
  await trainingRow.press('Space');assert.equal(await detail.locator('#dx-title').innerText(),'Training');
  for(const width of [1440,360]){
    await page.setViewportSize({width,height:900});
    const typography=await detail.locator('.dx-ex').evaluateAll(paragraphs=>paragraphs.map(e=>({
      text:e.textContent,firstFloat:getComputedStyle(e,'::first-letter').float,
      firstSize:getComputedStyle(e,'::first-letter').fontSize,size:getComputedStyle(e).fontSize,
      numberFloat:e.querySelector('b')?getComputedStyle(e.querySelector('b'),'::first-letter').float:'none',
      width:e.scrollWidth,clientWidth:e.clientWidth
    })));
    assert.deepEqual(typography.map(p=>p.text),training.clauses.map(c=>c.number+' '+c.text));
    assert.ok(typography.every(p=>p.firstFloat==='none'&&p.numberFloat==='none'&&p.firstSize===p.size&&p.width<=p.clientWidth+1),JSON.stringify(typography));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }
  await page.setViewportSize({width:1440,height:900});
  await page.locator('[data-v="article"]').click();
  assert.equal(await page.locator('#list .ent').count(),216);
  assert.equal(await detail.locator('#dx-title').innerText(),'Training');
  await detail.locator('[data-act="close"]').click();
  assert.equal(await page.locator('[data-v="article"]').evaluate(e=>document.activeElement===e),true);
  assert.equal(await page.evaluate(mathSnapshot),beforeViews);
  await page.locator('#list .ent[data-k="flying"]').click();
  const decorative=await detail.locator('[aria-label="Explanation"] .dx-ex').evaluate(e=>({
    float:getComputedStyle(e,'::first-letter').float,first:parseFloat(getComputedStyle(e,'::first-letter').fontSize),size:parseFloat(getComputedStyle(e).fontSize)
  }));
  assert.equal(decorative.float,'left');assert.ok(decorative.first>decorative.size*3);
  await page.locator('[data-v="az"]').click();assert.equal(await detail.locator('#dx-title').innerText(),'Flying');
  await detail.locator('[data-act="close"]').click();
  assert.equal(await page.locator('#list .ent[data-k="flying"]').evaluate(e=>document.activeElement===e),true);
  await page.locator('[data-v="article"]').click();
  pass('browse mouse, Enter/Space, focus/view fallback, exact Training clauses, drop caps and desktop/360px overflow',true);
  const expectedSymbols={
    '0':['0','0 generic mana'],'1':['1','1 generic mana'],'2':['2','2 generic mana'],
    '3':['3','3 generic mana'],'5':['5','5 generic mana'],'6':['6','6 generic mana'],
    W:['w','One white mana'],U:['u','One blue mana'],G:['g','One green mana'],R:['r','One red mana'],
    'W/B':['wb','One white or black mana'],T:['tap','Tap'],X:['x','X generic mana']
  };
  const evidenceCheck=await page.evaluate(({records,symbols,scopes,groups})=>{
    const classifications=new Map(scopes.map(r=>[r.id,r])),groupLabels=new Map(groups.map(g=>[g.id,g.label]));
    const failures=[],seenTokens=new Set();let symbolCount=0;
    for(const a of records){
      VMX.open(a.target2021||a.id);
      const host=document.querySelector('#detail'), scope=host.querySelector('.supp-evidence');
      const text=scope?.textContent||'', ref=a.reference, review=a.qualifications.acceptedSourceReview;
      const classification=classifications.get(a.id), upfront=host.querySelector('.supp-classification');
      const statusInNote=/\bdefinition\b/i.test(classification.scopeNote)&&/\b(?:no|not|unverified)\b/i.test(classification.scopeNote);
      const visibleQualifications=classification.qualifications.filter(text=>text!=='General definition unverified'||!statusInNote);
      if(!upfront||![classification.scopeNote,...visibleQualifications].every(text=>upfront.textContent.includes(text)))failures.push(a.name+': upfront scope');
      if(statusInNote&&(upfront.querySelectorAll('li').length!==visibleQualifications.length||text.includes('A general definition has not been verified.')))failures.push(a.name+': repeated generated definition warning');
      const type=a.target2021?upfront.querySelector('h3'):host.querySelector('.dx-where');
      if(!type?.textContent.includes(classification.evidenceLabel)||!type?.textContent.includes(groupLabels.get(classification.group)))failures.push(a.name+': scope type');
      const clauses=[...host.querySelectorAll('.supp-rules .dx-ex')].map(p=>p.textContent);
      if(JSON.stringify(clauses)!==JSON.stringify(a.clauses.map(c=>c.number+' '+c.text)))failures.push(a.name+': clauses');
      const excerpts=[...new Set([ref?.quote,ref?.summary,review?.exactExcerpt].filter(Boolean))];
      if(JSON.stringify([...host.querySelectorAll('.supp-reference blockquote')].map(p=>p.textContent))!==JSON.stringify(excerpts))failures.push(a.name+': excerpts');
      const tokens=[...a.clauses.map(c=>c.text),...excerpts].flatMap(text=>[...text.matchAll(/\{[^{}\r\n]+\}/g)].map(m=>m[0]));
      const rendered=[...host.querySelectorAll('.supp-symbol')];
      if(JSON.stringify(rendered.map(n=>n.textContent))!==JSON.stringify(tokens))failures.push(a.name+': symbol tokens');
      for(const node of rendered){
        const token=node.textContent.slice(1,-1),expected=symbols[token];seenTokens.add(token);symbolCount++;
        if(!expected||node.getAttribute('role')!=='img'||node.getAttribute('aria-label')!==expected[1]||
          !node.querySelector('.ms-'+expected[0])||node.querySelector('i').getAttribute('aria-hidden')!=='true'||
          node.querySelector('.supp-symbol-text').getAttribute('aria-hidden')!=='true')failures.push(a.name+': symbol semantics '+token);
      }
      for(const value of [review?.verifiedScope,review?.limits,ref?.source?.title,ref?.source?.section,ref?.supportingSource?.title].filter(Boolean)){
        if(!text.includes(value))failures.push(a.name+': missing '+value);
      }
      if(ref?.definitionVerified===false&&!statusInNote&&!text.includes('General definition unverified')&&!text.includes('A general definition has not been verified.'))failures.push(a.name+': missing definition limitation');
      if(ref?.playtest&&!text.includes('Not legal in Commander.'))failures.push(a.name+': playtest scope');
      if(/https?:\/\/|sha-?256|Original source ID|Accepted population|Source category|Provider categor|Record provenance|None recorded|Source record metadata|Stored rules snapshot/i.test(text))failures.push(a.name+': backend text');
      if(/[a-f0-9]{64}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i.test(scope?.innerHTML||''))failures.push(a.name+': technical value');
      if(scope?.querySelector('details'))failures.push(a.name+': hidden metadata');
      const links=[...scope.querySelectorAll('a')], canonical=raw=>{
        const u=new URL(raw);if(u.hostname==='www.youtube.com')u.searchParams.delete('t');
        if(u.pathname.endsWith('/card-image-gallery'))u.search='';return u.href;
      };
      if(new Set(links.map(a=>canonical(a.href))).size!==links.length)failures.push(a.name+': duplicate citation');
      for(const url of [a.clauses.length&&a.rulesSource.sourceUrl,ref?.source?.url,ref?.supportingSource?.url,
        ...(review?.evidence||[]).map(e=>e.finalUrl||e.url),review?.locator?.imageUrl].filter(Boolean)){
        if(!links.some(link=>canonical(link.href)===canonical(url)))failures.push(a.name+': missing citation');
      }
      if(!a.target2021){
        if(host.querySelectorAll('h2').length!==1||!host.querySelector('.dx-where').textContent.includes(classification.evidenceLabel)||host.querySelector('.dx-top').textContent.includes('mechanic record')||!host.textContent.includes('Rankings unassigned'))failures.push(a.name+': heading/status');
        if(!host.querySelector('#supp-ranking-note')?.textContent.includes('No sourced Primary/Secondary/Tertiary assignment is recorded.'))failures.push(a.name+': accessible unknown ranking');
      }
    }
    VMX.close();return {records:records.length,symbolCount,tokens:[...seenTokens].sort(),failures};
  },{records:payload.records,symbols:expectedSymbols,scopes:scope.records,groups:scope.groups});
  assert.deepEqual(evidenceCheck.failures,[]);
  assert.deepEqual(evidenceCheck.tokens,Object.keys(expectedSymbols).sort());
  pass('all 390 evidence records: exact rules/excerpts/scopes, meaningful deduplicated citations, no backend metadata in detail DOM',evidenceCheck);
  const searchScopes=await page.evaluate(({records,scopes,groups})=>{
    const byId=new Map(scopes.map(r=>[r.id,r])),labels=new Map(groups.map(g=>[g.id,g.label])),failures=[];
    document.querySelector('#q').focus();
    for(const record of records){
      VMX.setQuery(record.name);
      const option=[...document.querySelectorAll('#res-list .opt')].find(e=>e.dataset.k===(record.target2021||record.id));
      const badge=option?.querySelector('.scope-badge');
      if(!option||(record.target2021?(badge||!option.querySelector('.strip')):badge?.textContent!==labels.get(byId.get(record.id).group)))failures.push(record.name);
    }
    VMX.setQuery('');return failures;
  },{records:payload.records,scopes:scope.records,groups:scope.groups});
  assert.deepEqual(searchScopes,[]);
  for(const [name,group] of [['Affinitycycling','designer'],['Legacy','playtest'],['Underdog','playtest'],['Kinfall','playtest'],['Actualize','digital'],['Covercast','digital'],['Jump','card-specific'],['Parade!','card-specific'],["Hero's Reward",'special'],['Augment','special']]){
    const record=payload.records.find(r=>r.name===name),audit=scopedById.get(record.id);
    assert.equal(audit.group,group,name);
    for(const width of [1440,360]){
      await page.setViewportSize({width,height:900});await page.evaluate(k=>VMX.open(k),record.id);
      const upfront=detail.locator('.supp-classification');
      const visibleScope=await upfront.evaluate(e=>{
        const box=e.getBoundingClientRect(),detail=e.closest('#detail').getBoundingClientRect();
        return {text:e.textContent,visible:box.top>=detail.top&&box.bottom<=detail.bottom,fit:e.scrollWidth<=e.clientWidth+1};
      });
      assert.ok(visibleScope.visible&&visibleScope.fit,name+' '+width+': '+JSON.stringify(visibleScope));
      assert.ok(visibleScope.text.includes(audit.scopeNote));
      assert.ok((await detail.locator('.dx-where').innerText()).includes(scope.groups.find(g=>g.id===group).label));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    }
  }
  await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>VMX.close());
  pass('all 390 search scopes; critical playtest/designer/digital/card/special types and complete upfront scope visible desktop/360px',true);

  for(const name of ['Attach','Bargain']){
    const record=payload.records.find(r=>r.name===name);
    for(const width of [1440,360]){
      await page.setViewportSize({width,height:900});await page.evaluate(k=>VMX.open(k),record.id);
      const presentation=await detail.locator('.supp-rules .dx-ex').evaluateAll(rows=>rows.map((e,i)=>({
        text:e.textContent,margin:parseFloat(getComputedStyle(e).marginTop),
        gap:i?e.getBoundingClientRect().top-rows[i-1].getBoundingClientRect().bottom:null,
        float:getComputedStyle(e,'::first-letter').float,numberFloat:getComputedStyle(e.querySelector('.supp-rule-number'),'::first-letter').float,
        size:getComputedStyle(e).fontSize,first:getComputedStyle(e,'::first-letter').fontSize,
        fits:e.scrollWidth<=e.clientWidth+1
      })));
      assert.deepEqual(presentation.map(p=>p.text),record.clauses.map(c=>c.number+' '+c.text));
      assert.ok(presentation.every((p,i)=>p.float==='none'&&p.numberFloat==='none'&&p.first===p.size&&p.fits&&(!i||p.gap>=16&&p.margin>=16)),JSON.stringify(presentation));
      assert.equal(await detail.locator('.supp-rules .supp-citation a').count(),1);
      assert.equal(await detail.locator('.supp-rules .supp-citation a').innerText(),'Wizards Comprehensive Rules · September 25, 2026');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    }
  }
  await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>VMX.close());
  const scopeExpectations={
    Jump:['Card-specific evidence','Cid, Freeflier Pilot'],
    Affinitycycling:['Designer card example','Gavin Verhey','February 20, 2023','not a Wizards Comprehensive Rules definition'],
    "Hero's Reward":['Archived design discussion','Sam Stoddard','Wizards (archived)','October 25, 2013','Hydra-specific'],
    Kinfall:['Playtest card example','Scryfall','Mystery Booster Playtest Card Artists','Not legal in Commander','An official definition or original official card image was not verified.'],
    Landship:['Playtest card example','Scryfall','Not legal in Commander','An official definition or original official card image was not verified.'],
    Actualize:['Card example','Etali, Primal Garden','No formal mechanic-wide definition was verified.'],
    Covercast:['Card example','Summitfest Closing Ceremony','Those wiki claims remain unverified.'],
    Specialize:['MTG Arena Announcements, June 22, 2022','Alchemy Horizons'],
    Assimilate:['A First Look','No definition text is reproduced in this reference.']
  };
  for(const [name,expected] of Object.entries(scopeExpectations)){
    const record=payload.records.find(r=>r.name===name);await page.evaluate(k=>VMX.open(k),record.id);
    const text=await detail.innerText();for(const value of expected)assert.ok(text.includes(value),name+': '+value);
  }
  assert.match(await page.locator('.foot').innerText(),/In the 2021 catalog.*Supplemental rules and references are attributed separately/);
  await page.evaluate(()=>VMX.close());
  pass('Attach/Bargain paragraph separation at desktop/360px; narrow references retain publisher, date and limitations; footer scoped',true);
  const firebending=payload.records.find(r=>r.name==='Firebending');
  await q.fill('Firebending');await q.press('Enter');
  const redSymbol=detail.getByRole('img',{name:'One red mana',exact:true});
  assert.equal(await redSymbol.count(),1);assert.equal(await redSymbol.textContent(),'{R}');
  await page.evaluate(()=>document.fonts.ready);
  const fontState=await redSymbol.evaluate(e=>({
    ready:document.documentElement.classList.contains('supp-mana-ready'),
    glyph:getComputedStyle(e.querySelector('.ms')).display,fallback:getComputedStyle(e.querySelector('.supp-symbol-text')).display,
    content:getComputedStyle(e.querySelector('.ms'),'::before').content,
    family:getComputedStyle(e.querySelector('.ms')).fontFamily,
    color:getComputedStyle(e.querySelector('.ms')).backgroundColor
  }));
  assert.equal(fontState.ready,true,JSON.stringify(fontState));
  assert.notEqual(fontState.glyph,'none');assert.equal(fontState.fallback,'none');
  assert.match(fontState.family,/Mana/);assert.notEqual(fontState.content,'none');assert.equal(fontState.color,'rgb(217, 120, 88)');
  assert.deepEqual(await detail.locator('.supp-rules .dx-ex').allTextContents(),firebending.clauses.map(c=>c.number+' '+c.text));
  for(const [name,label,glyph] of [['Extort','One white or black mana','wb'],['Outlast','Tap','tap'],['Food','2 generic mana','2'],['Ravenous','X generic mana','x']]){
    const record=payload.records.find(r=>r.name===name);await page.evaluate(k=>VMX.open(k),record.target2021||record.id);
    const symbol=detail.getByRole('img',{name:label,exact:true});assert.equal(await symbol.count(),1);
    assert.equal(await symbol.locator('.ms-'+glyph).count(),1);
  }
  await page.evaluate(()=>VMX.open('flying'));
  assert.equal(await detail.locator('[aria-label="Explanation"] .supp-symbol').count(),0);
  await page.evaluate(()=>VMX.close());
  pass('sourced Firebending red, hybrid, tap, generic and X glyphs accessible; original 2021 explanation unchanged',fontState);
  const hostile='{UNKNOWN} {__proto__} {constructor} {R" onmouseover="window.symbolInjected=true} <img src=x onerror="window.symbolInjected=true"> & "quoted"';
  const synthetic=JSON.parse(JSON.stringify(payload));
  const syntheticFire=synthetic.records.find(r=>r.name==='Firebending');
  syntheticFire.clauses[0].text+=' '+hostile;
  const syntheticScope={...scope,payloadSha256:sha256(JSON.stringify(synthetic)),payloadCanonicalSha256:sha256(JSON.stringify(synthetic))};
  const noFont=await browser.newPage();const noFontErrors=[];noFont.on('pageerror',e=>noFontErrors.push(e.message));
  await noFont.route('**/*',route=>route.request().resourceType()==='font'?route.abort():route.continue());
  await noFont.route('**/data/mechanics-supplement.v1.json',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(synthetic)}));
  await noFont.route('**/data/mechanics-supplement-scope.v1.json',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(syntheticScope)}));
  await noFont.goto(base+'/vox-color/mechanical-explorer.html');
  await noFont.waitForFunction(()=>window.VMX?.supplemental().status==='ready');
  await noFont.evaluate(()=>document.fonts.ready);
  await noFont.evaluate(k=>VMX.open(k),syntheticFire.id);
  assert.deepEqual(await noFont.locator('#detail .supp-rules .dx-ex').allTextContents(),syntheticFire.clauses.map(c=>c.number+' '+c.text));
  assert.equal(await noFont.locator('#detail .supp-symbol').count(),1);
  const fallback=await noFont.locator('#detail .supp-symbol').evaluate(e=>({
    glyph:getComputedStyle(e.querySelector('.ms')).display,fallback:getComputedStyle(e.querySelector('.supp-symbol-text')).display,
    literal:e.querySelector('.supp-symbol-text').innerText,label:e.getAttribute('aria-label')
  }));
  assert.equal(fallback.glyph,'none');assert.notEqual(fallback.fallback,'none');assert.equal(fallback.literal,'{R}');assert.equal(fallback.label,'One red mana');
  assert.equal(await noFont.locator('#detail .supp-rules img, #detail .supp-rules script, #detail .supp-rules [onmouseover]').count(),0);
  assert.equal(await noFont.evaluate(()=>!!window.symbolInjected),false);assert.deepEqual(noFontErrors,[]);
  assert.ok((await noFont.locator('#detail .supp-rules .dx-ex').first().innerText()).includes(hostile));
  await noFont.close();
  pass('blocked Mana font keeps literal accessible fallback; unknown/prototype/hostile tokens stay escaped text',fallback);


  await q.fill('Training');await page.locator('#res-list .opt').first().click();
  await detail.waitFor({state:'visible'});
  assert.equal(await detail.locator('#dx-title').innerText(),'Training');
  assert.equal(await detail.locator('.own-row').count(),0);
  assert.match(await detail.innerText(),/No sourced Primary\/Secondary\/Tertiary assignment|rankings? unassigned/i);
  assert.ok((await detail.innerText()).includes(training.clauses[0].text));
  assert.equal(await page.locator('[data-detail-owner]').count(),1);
  await page.locator('#pips [data-c="W"]').click();
  assert.equal(await detail.locator('#dx-title').innerText(),'Training');
  await detail.locator('[data-act="close"]').click();
  assert.equal(await q.evaluate(e=>document.activeElement===e),true);
  await q.fill('Training');await q.press('ArrowDown');await q.press('Enter');
  await detail.waitFor({state:'visible'});await page.keyboard.press('Escape');
  assert.equal(await q.evaluate(e=>document.activeElement===e),true);
  pass('Training mouse/keyboard, unassigned rankings, lens change, close/focus',true);
  await page.evaluate(()=>VMX.clearColors());
  // A broad evidence term exercises bounded pagination, then selects page two.
  await q.fill('ability');
  assert.ok(await page.evaluate(()=>VMX.state.hits.length>60));
  assert.ok(await page.locator('#res-list .opt').count()<=60);
  const firstPageKey=await page.locator('#res-list .opt').first().getAttribute('data-k');
  await page.locator('#res-next').click();
  const secondPageKey=await page.locator('#res-list .opt').first().getAttribute('data-k');
  assert.notEqual(firstPageKey,secondPageKey);
  await page.locator('#res-list .opt').first().click();assert.equal(await page.evaluate(()=>VMX.state.pick),secondPageKey);
  await detail.locator('[data-act="close"]').click();
  await q.fill('ability ');await q.press('PageDown');
  assert.equal(await page.locator('#res-list .opt').first().getAttribute('data-k'),secondPageKey);
  await q.press('Enter');assert.equal(await page.evaluate(()=>VMX.state.pick),secondPageKey);
  await detail.locator('[data-act="close"] ').click();
  pass('bounded overflow reachable by mouse and keyboard in existing search',true);
  await q.fill('Flash');await q.press('ArrowDown');await q.press('Enter');
  assert.equal(await detail.locator('.own-row').count(),5);
  assert.match(await detail.innerText(),/Rosewater, 2021/);
  assert.match(await detail.innerText(),/Supplemental/i);
  const flash=payload.records.find(r=>r.name==='Flash');
  assert.ok((await detail.innerText()).includes(flash.clauses[0].text));
  await detail.locator('[data-act="close"]').click();
  assert.equal(await page.locator('#list .ent[data-k="flash"]').evaluate(e=>document.activeElement===e),true);
  pass('mapped Flash retains 2021 plus transferred text and original list focus return',true);
  await page.evaluate(()=>VMX.open('exiling cards from graveyard'));
  assert.match(await detail.innerText(),/Primary in the color lists · Secondary in the explanations/);
  await detail.locator('.dx-src summary').click();
  assert.match(await detail.innerText(),/both|two ways/);
  assert.equal(await detail.locator('.own-row').count(),5);
  pass('existing 2021 conflict retained',true);
  // No new browser-executed data-fetch path is exercised by supplemental detail.
  assert.deepEqual(errors,[]);const applicationConsoleErrors=consoleErrors.filter(e=>!e.url?.endsWith('/favicon.ico'));
  assert.deepEqual(applicationConsoleErrors,[]);pass('application page and console errors',{errors,applicationConsoleErrors,existingFavicon404:consoleErrors.filter(e=>e.url?.endsWith('/favicon.ico'))});
  const scopeBody=edit=>{const value=JSON.parse(JSON.stringify(scope));edit(value);return JSON.stringify(value);};
  for(const [kind,resource,response] of [
    ['missing','mechanics-supplement.v1.json',{status:404,body:'missing'}],
    ['malformed','mechanics-supplement.v1.json',{status:200,body:'{'}],
    ['malformed record','mechanics-supplement.v1.json',{status:200,body:JSON.stringify({...payload,records:[{...payload.records[0],reference:42},...payload.records.slice(1)]})}],
    ['unsupported schema','mechanics-supplement.v1.json',{status:200,body:JSON.stringify({...payload,schemaVersion:999})}],
    ['scope missing','mechanics-supplement-scope.v1.json',{status:404,body:'missing'}],
    ['scope malformed','mechanics-supplement-scope.v1.json',{status:200,body:'{'}],
    ['scope unsupported schema','mechanics-supplement-scope.v1.json',{status:200,body:scopeBody(s=>{s.schemaVersion=999;})}],
    ['scope payload mismatch','mechanics-supplement-scope.v1.json',{status:200,body:scopeBody(s=>{s.payloadCanonicalSha256='0'.repeat(64);})}],
    ['scope source ID mismatch','mechanics-supplement-scope.v1.json',{status:200,body:scopeBody(s=>{s.records[0].sourceId+='-wrong';})}],
    ['scope duplicate record','mechanics-supplement-scope.v1.json',{status:200,body:scopeBody(s=>{s.records[1]=s.records[0];})}],
    ['scope unknown group','mechanics-supplement-scope.v1.json',{status:200,body:scopeBody(s=>{s.records[0].group='unknown';})}],
  ]) {
    const p=await browser.newPage();const failures=[];p.on('pageerror',e=>failures.push(e.message));
    await p.route('**/data/'+resource,route=>route.fulfill({...response,contentType:'application/json'}));
    await p.goto(base+'/vox-color/mechanical-explorer.html');
    await p.waitForFunction(()=>window.VMX?.supplemental().status==='unavailable');
    assert.match(await p.locator('#supplement-status').innerText(),/scope classifications are unavailable/i);
    assert.equal(await p.evaluate(()=>VMX.supplemental().records.length),0);
    assert.equal(await p.locator('#list .ent').count(),216);
    await p.locator('[data-v="az"]').click();assert.equal(await p.locator('#list .ent').count(),216);
    assert.equal(await p.locator('#list > .grp').count(),1);
    await p.locator('#q').fill('Training');assert.equal(await p.evaluate(()=>VMX.state.hits.length),0);
    await p.locator('#q').fill('Flying');await p.locator('#q').press('Enter');
    assert.equal(await p.locator('#detail #dx-title').innerText(),'Flying');
    assert.equal(await p.locator('#detail .own-row').count(),5);
    assert.equal(await p.locator('#detail .supp-evidence').count(),0);
    assert.deepEqual(failures,[]);
    pass('supplement failure: '+kind,{status:'unavailable',legacyUsable:true,atomic2021Only:true});await p.close();
  }
  const noExamples=await browser.newPage();const noExampleErrors=[];noExamples.on('pageerror',e=>noExampleErrors.push(e.message));
  await noExamples.route('**/vox-color/mechanical-supplement-examples.json',route=>route.fulfill({status:404,body:'missing'}));
  await noExamples.goto(base+'/vox-color/mechanical-explorer.html');
  await noExamples.waitForFunction(()=>window.VMX?.supplemental().status==='ready'&&document.querySelector('#supplement-status').textContent.includes('Supplemental card examples are unavailable'));
  await noExamples.locator('[data-v="az"]').click();assert.equal(await noExamples.locator('#list .ent').count(),587);
  await noExamples.evaluate(()=>VMX.open('deck:vocabulary:training'));
  assert.equal(await noExamples.locator('#detail #dx-title').innerText(),'Training');assert.equal(await noExamples.locator('#detail .cite').count(),0);
  assert.deepEqual(noExampleErrors,[]);pass('optional example transport failure preserves all supplemental browse/search/scope evidence and withholds only plates',true);await noExamples.close();
  const collision=JSON.parse(JSON.stringify(examples)), protectedRecord=payload.records.find(record=>record.name==='Actualize'), protectedScope=scopedById.get(protectedRecord.id);
  collision.records[0]={...collision.records[0],key:protectedRecord.id,sourceRecordId:protectedRecord.id,scopeGroup:protectedScope.group};
  const protectedCollision=await browser.newPage();await protectedCollision.route('**/vox-color/mechanical-supplement-examples.json',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(collision)}));
  await protectedCollision.goto(base+'/vox-color/mechanical-explorer.html');
  await protectedCollision.waitForFunction(()=>window.VMX?.supplemental().status==='ready'&&document.querySelector('#supplement-status').textContent.includes('Supplemental card examples are unavailable'));
  await protectedCollision.locator('[data-v="az"]').click();assert.equal(await protectedCollision.locator('#list .ent').count(),587);await protectedCollision.close();
  pass('protected named-card-evidence destination collision rejects optional transport without reducing supplemental availability',true);
  // Delay only the additive fetch: A–Z can be cached and switched before it arrives.
  const delayed=await browser.newPage();let releaseSupplement;
  const released=new Promise(resolve=>{releaseSupplement=resolve;});
  await delayed.route('**/data/mechanics-supplement.v1.json',async route=>{await released;await route.continue();});
  await delayed.goto(base+'/vox-color/mechanical-explorer.html');
  await delayed.waitForFunction(()=>document.querySelector('#selftest').textContent.includes('84 of 84 passed'));
  const beforeLoad=await delayed.evaluate(mathSnapshot);
  await delayed.locator('[data-v="az"]').click();assert.equal(await delayed.locator('#list .ent').count(),216);
  await delayed.locator('[data-v="article"]').click();await delayed.locator('[data-v="az"]').click();
  const preLoadRow=delayed.locator('#list .ent[data-k="flying"]');await preLoadRow.focus();
  releaseSupplement();await delayed.waitForFunction(()=>VMX.supplemental().status==='ready');
  assert.equal(await delayed.locator('#list .ent').count(),587);
  assert.equal(await preLoadRow.evaluate(e=>document.activeElement===e),true);
  assert.equal(await delayed.evaluate(mathSnapshot),beforeLoad);
  await delayed.locator('[data-v="article"]').click();assert.equal(await delayed.locator('#list .ent').count(),216);
  await delayed.locator('[data-v="az"]').click();assert.equal(await delayed.locator('#list .ent').count(),587);
  pass('late supplemental fetch invalidates cached A–Z, preserves focus and maths, Article stays 216',true);await delayed.close();
  // The actual packaged shell must load the same packaged explorer and revision.
  await page.goto(base+'/#mechanical-color-pie');
  const frame=page.frameLocator('#frame-pie');
  await frame.locator('#q').waitFor();
  await page.waitForFunction(()=>document.querySelector('#frame-pie').contentWindow.VMX?.supplemental().status==='ready');
  await frame.locator('#q').fill('Training');await frame.locator('#q').press('Enter');
  assert.equal(await frame.locator('#detail #dx-title').innerText(),'Training');
  pass('shell route loads packaged supplemental detail',await page.locator('#frame-pie').getAttribute('src'));
  console.log(JSON.stringify({root,passed:true,checks},null,2));
} finally {
  await browser?.close();await new Promise(resolve=>server.close(resolve));
}
