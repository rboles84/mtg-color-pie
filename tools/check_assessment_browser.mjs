// Focused A/B/C assessment checks using externally supplied Playwright; no new dependency.
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
const assessmentRoute='**/data/mechanics-assessments.v1.json*';
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
  assert.equal(await page.evaluate(()=>VMX.assessments().records.length),78);
  const expectedAssessmentIds=supplement.records.filter(r=>/^[ABC]/.test(r.name)&&r.target2021===null).map(r=>r.id).sort();
  assert.deepEqual(payload.records.map(r=>r.id).sort(),expectedAssessmentIds,'every admitted A/B/C target has exactly one assessment');
  assert.deepEqual(payload.sourceBindings.map(x=>x.path),[
    'docs/mechanics-research/a-assessments-source.json',
    'docs/mechanics-research/absorb-assessment-source.json',
    'docs/mechanics-research/a-classification-addendum.json',
    'docs/mechanics-research/a-protocol-core.json',
    'docs/mechanics-research/a-protocol-extended.json',
    'docs/mechanics-research/a-protocol-special.json',
    'docs/mechanics-research/b-protocol-core.json',
    'docs/mechanics-research/b-protocol-extended.json',
    'docs/mechanics-research/c-protocol-core.json',
    'docs/mechanics-research/c-protocol-extended.json',
    'docs/mechanics-research/c-protocol-special.json'
  ],'all eleven canonical packet bindings are present');
  assert.deepEqual(['Cast','Counter','Create'].map(name=>payload.records.find(r=>r.name===name)?.kind),['rules','rules','rules'],'generic C rules actions have no invented color access');
  await page.evaluate(()=>VMX.setView('az'));
  assert.equal(await page.locator('#list .ent').count(),587);
  assert.equal(await page.locator('#list > .grp[data-scope="main"] .ent').count(),543);
  assert.equal(await page.locator('#list > .grp[data-scope="special-material"] .ent').count(),44);
  if(!copyOnly){
    /* Access-only contract: every supplemental A/B record retains five colors,
       rules actions have no invented map, and no access strip uses tier classes. */
    await page.evaluate(()=>VMX.setView('az'));
    for(const record of payload.records){
      const row=page.locator(`#list .ent[data-k="${record.id}"]`), access=record.access, compactExamples=record.name.startsWith('C');
      assert.equal(await row.locator('.access-strip').count(),record.kind==='access'?1:0,record.name);
      if(record.kind==='access'){
        assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(slots=>slots.map(s=>s.dataset.c)),[...'WUBRG',...(access.colorless.status==='documented'?['C']:[])]);
        assert.equal(await row.locator('.access-strip .t-p,.access-strip .t-s,.access-strip .t-t,.access-strip .t-n').count(),0);
        for(const color of 'WUBRG') assert.equal(await row.locator(`.access-strip .sc[data-c="${color}"].a-d`).count(),access.colors[color].status==='documented'?1:0);
        for(const item of [...Object.values(access.colors),...access.combinations,access.colorless]){
          const names=item.cards.map(card=>`!"${card.name.replaceAll('"','')}"`).join(' or ');
          if(item.findUrl) assert.equal(new URL(item.findUrl).searchParams.get('q'),`(${names}) include:extras`,record.name+' exact reviewed-card discovery link');
          assert.ok(item.cards.every(card=>card.url === null || /^https:\/\/scryfall\.com\//.test(card.url)),record.name+' retains reviewed-card URLs');
        }
      }
      await page.evaluate(id=>VMX.open(id),record.id);
      const panel=page.locator('#detail .supp-assessment');
      const notes=panel.locator('.assessment-notes');
      assert.match(await panel.innerText(),/Color Access/);
      assert.match(await panel.innerText(),/Outside the 2021 color calculations/);
      assert.doesNotMatch(await panel.innerText(),/Our assessment|Confidence:|Primary:|Secondary:|Tertiary:|assessment - provisional/i);
      if(record.kind==='access'){
        assert.equal(await panel.locator('.own-row').count(),5+(access.colorless.status==='documented'?1:0));
        assert.ok((await panel.innerText()).includes(record.scopeLabel));
        for(const color of 'WUBRG'){
          const item=access.colors[color], rowText=await panel.locator(`.own-row[data-c="${color}"]`).innerText();
          assert.match(rowText,new RegExp(item.status==='documented'?'Access':item.status==='multicolor_only'?'Combination only':item.status==='not_found'?'No example found':item.status==='not_applicable'?'Not applicable':'Insufficient evidence'));
        }
      }
      await notes.locator(':scope > summary').focus(); await page.keyboard.press('Enter'); assert.equal(await notes.getAttribute('open'),'');
      assert.ok((await notes.innerText()).includes(record.summary));
      if(record.kind==='access') for(const color of 'WUBRG') {
        if(!compactExamples || access.colors[color].status==='documented') assert.ok((await notes.innerText()).includes(access.colors[color].note),record.name+' '+color+' authored example visible');
      }
      assert.doesNotMatch((await panel.locator('.dx-h,.own-t').allTextContents()).join(' '),/Documented access/i);
      assert.doesNotMatch(await panel.innerText(),/Neutral mana marks/i);
      const hasColorless=record.kind==='access' && access.colorless.status==='documented';
      assert.equal(await row.locator('.access-strip .ms-c').count(),hasColorless?1:0,record.name+' colorless list glyph');
      assert.equal(await panel.locator('.own-row[data-c="C"] .ms-c').count(),hasColorless?1:0,record.name+' colorless detail glyph');
      const colored=await row.locator('.access-strip .sc.a-d').evaluateAll(slots=>slots.map(s=>({color:s.dataset.c,background:getComputedStyle(s).backgroundColor,token:getComputedStyle(document.documentElement).getPropertyValue(s.dataset.c==='C'?'--ink-dim':'--'+s.dataset.c.toLowerCase()).trim()})));
      for(const item of colored){
        const actual=await page.evaluate(token=>{const el=document.createElement('i');el.style.color=token;document.body.append(el);const color=getComputedStyle(el).color;el.remove();return color;},item.token);
        assert.equal(item.background,actual,record.name+' '+item.color+' palette binding');
      }
      const expectedSources=record.sources.filter(s=>{const u=new URL(s.url);return u.hostname!=='scryfall.com'||!/^\/(?:cards?(?:\/|$)|search(?:\/|$))/.test(u.pathname);});
      assert.deepEqual(await notes.locator('.assessment-sources a').evaluateAll(links=>links.map(a=>a.href)),expectedSources.map(s=>s.url),record.name+' non-card references retained');
      const cardBuckets=[...Object.values(access.colors).filter(x=>!compactExamples || x.status==='documented'),...access.combinations,...(!compactExamples || access.colorless.status==='documented'?[access.colorless]:[])];
      const visibleCards=cardBuckets.flatMap(x=>compactExamples?x.cards.slice(0,1):x.cards);
      const expectedCardLinks=(record.kind==='rules'?record.citationCards:visibleCards).filter(c=>c.url).map(c=>c.url).sort();
      if(compactExamples && record.kind==='access') {
        assert.equal(await notes.locator('.assessment-example').count(),cardBuckets.length,record.name+' one visible example per represented bucket');
        assert.equal(new Set(expectedCardLinks).size,expectedCardLinks.length,record.name+' combination-only citations are not repeated under each color');
        assert.equal(await notes.locator('details').count(),0,record.name+' no exhaustive nested card lists');
        if(record.name==='Convert') {
          assert.doesNotMatch(await notes.innerText(),/Ratchet|Starscream| \/\/ /,'Convert describes only selected examples without repeating double-faced names');
          assert.equal(await notes.getByRole('link',{name:'Blitzwing, Adaptive Assailant',exact:true}).count(),1,'Convert links the mechanic-bearing back face');
        }
        assert.doesNotMatch(await notes.innerText(),/under its stated conditions|present votes provide a separate effect|independent example|reviewed scope/,record.name+' no filler or internal qualification prose');
        for(const item of [...access.combinations,...(access.colorless.status==='documented'?[access.colorless]:[])]) assert.ok((await notes.innerText()).includes(item.note),record.name+' combination/colorless example visible');
      }
      assert.deepEqual(await notes.locator('a').evaluateAll(links=>links.filter(a=>a.hostname==='scryfall.com'&&a.pathname.startsWith('/card/')).map(a=>a.href).sort()),expectedCardLinks,record.name+' no redundant aggregate card list');
      const linkedBuckets=cardBuckets.filter(item=>item.findUrl && (!compactExamples || item.cards.length>1));
      for(const findUrl of new Set(linkedBuckets.map(item=>item.findUrl))) assert.equal(await notes.locator(`a[href="${findUrl}"]`).count(),linkedBuckets.filter(item=>item.findUrl===findUrl).length,record.name+' renders every exact reviewed-card bucket link');
      assert.deepEqual(await notes.locator('a').evaluateAll(links=>links.filter(a=>a.protocol!=='https:'||!['scryfall.com','magic.wizards.com'].includes(a.hostname)||a.rel!=='noopener noreferrer').map(a=>a.href)),[]);
    }
    const blue=payload.records.find(r=>r.access.colors.U.status==='documented'); assert.ok(blue,'a documented blue example exists');
    await page.locator('#q').fill(blue.name); await page.locator('#q').press('Enter'); assert.equal(await page.locator('#dx-title').innerText(),blue.name);
    const accessBefore=await page.locator('.access-strip .sc').evaluateAll(slots=>slots.map(s=>s.className));
    await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');}); assert.equal(await page.evaluate(math),baseline);
    assert.deepEqual(await page.locator('.access-strip .sc').evaluateAll(slots=>slots.map(s=>s.className)),accessBefore,'color lens never retiers access symbols');
    await page.setViewportSize({width:360,height:900}); assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true); await page.setViewportSize({width:1440,height:900});
    for(const scenario of ['missing','bad-status','unsafe-url','bad-binding']){
      const fail=await browser.newPage(), bad=structuredClone(payload);
      if(scenario==='bad-status') bad.records[0].access.colors.W.status='invented';
      if(scenario==='unsafe-url') bad.records.find(r=>r.kind==='access').access.colors.W.findUrl='https://scryfall.com@evil.example/';
      if(scenario==='bad-binding') bad.sourceBindings[0].path='docs/mechanics-research/tampered.json';
      await fail.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));
      await fail.goto(url); await fail.waitForFunction(()=>VMX.assessments().status==='unavailable');
      assert.equal(await fail.evaluate(()=>VMX.assessments().records.length),0); assert.equal(await fail.locator('#list .access-strip').count(),0); await fail.close();
    }
    assert.deepEqual(errors,[]);
    results.push('C representative sources, unique combination citations and concise copy; 78 A/B/C access maps; documented/no-example/joint/colorless/rules cases; exact-example and retained non-card links; atomic malformed fail-soft; search keyboard/mobile; unchanged 2021 84 checks');
  }
  await page.close();
  console.log(JSON.stringify({result:'PASS',checks:results},null,2));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
