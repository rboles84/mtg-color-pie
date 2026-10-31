// Focused A–P and R assessment checks using externally supplied Playwright; no new dependency.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const args=process.argv.slice(2), opt=(n,d)=>args.includes(n)?args[args.indexOf(n)+1]:d;
const root=path.resolve(opt('--root','.'));
const copyOnly=args.includes('--copy-only');
const combinationsOnly=args.includes('--combinations-only');
const kOnly=args.includes('--k-only');
const lOnly=args.includes('--l-only');
const mOnly=args.includes('--m-only');
const nOnly=args.includes('--n-only');
const oOnly=args.includes('--o-only');
const pOnly=args.includes('--p-only');
const rOnly=args.includes('--r-only');
const sOnly=args.includes('--s-only');
const tOnly=args.includes('--t-only');
const uOnly=args.includes('--u-only');
const vOnly=args.includes('--v-only');
const sCopyOnly=args.includes('--s-copy-only');
const accessLabelsOnly=args.includes('--access-labels-only');
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
// Exact subpaths/palettes from the pinned Mana 1.18 SVG/CSS, not the rejected font/gradient composition.
// SVG SHA256 da399dc513828acc373e187a457574c7e10515ee5b89caa1b91fac1bd69c2a8e.
const ciPathHashes={"3":["131d51ed29e20c9aa775ebb5094d4be8f3511907ad59b88edcfb61f5c5856f06","9d849d80b8320c3cbeb1c3080963c9c5ac6b94b4bfb2b1ea0d6794b5d0775395","a3d12eec27e1749efe27593db8cc60562a46c5cbcb67752c5cb1346d260458a7","a420efa8bb78d81ed9fb8b2004e0eaa87f88042e798ffcc03dd4f181d6e0a165"],"5":["131d51ed29e20c9aa775ebb5094d4be8f3511907ad59b88edcfb61f5c5856f06","4db0f8df52032341284cb588466593dc48353ffad3313892196810bcfb0ffeb5","9301a76f180030b5a3d1a1cb8f5e10a1ffb1b7006cb4dd335b53e2826efaf826","01a8768565729464c95fce3b30418f57e377bf673c0f82e30ef45990529d7603","17ee6820251767f8a3e4a9542e1e2b8598d9f766470940f71504afd1dc776f13","7c284a93d686ba6abb0920657cb8650f218b545237d308893cc5b5a996d8c308"]};
ciPathHashes['4']=["131d51ed29e20c9aa775ebb5094d4be8f3511907ad59b88edcfb61f5c5856f06","2560b9ed7e9aa624cd36e031f181ee614f4c7a246fd1123bc5cf1538cc157075","b1d4987aa6f47bbcaf3daf7e7e0958af7b0cff1ce8f3f4deedcbc497cb21a1ff","7d9e38864aa717d5956aaa6804c36f54e1cfd6d49a5d289324b94091fcf23295","1ce83b3f14cf8532efe2dc85e3ad6a2842ddef556cd94758cd18ea3cc83e70f1"];
const ciPalettes={"WUG":["#3b6ba0","#3d684b","#fff"],"UBR":["#c6553e","#3b6ba0","#383431"],"WUR":["#c6553e","#fff","#3b6ba0"],"BRG":["#3d684b","#383431","#c6553e"],"WBG":["#383431","#3d684b","#fff"],"WUB":["#383431","#fff","#3b6ba0"],"WUBRG":["#c6553e","#383431","#3b6ba0","#3d684b","#fff"]};
Object.assign(ciPalettes,{WUBG:['#3b6ba0','#383431','#fff','#3d684b'],UBG:['#3d684b','#3b6ba0','#383431'],URG:['#3b6ba0','#c6553e','#3d684b'],WRG:['#fff','#c6553e','#3d684b'],WBR:['#fff','#383431','#c6553e'],WUBR:['#383431','#c6553e','#3b6ba0','#fff'],WURG:['#fff','#3b6ba0','#3d684b','#c6553e']});
async function checkCIVectors(host,label,size=18){
  assert.equal(await host.locator('.combo-mark .ms-ci').count(),0,label+' has no independent CI font/gradient layer');
  const glyphs=await host.locator('.ci3-svg,.ci4-svg,.ci5-svg').evaluateAll(items=>items.map(svg=>{
    const paths=[...svg.querySelectorAll('path')],outer=paths[0],box=svg.getBoundingClientRect(),ink=outer.getBoundingClientRect(),mark=svg.closest('.combo-mark').getBoundingClientRect();
    return {key:svg.closest('.combo-mark').dataset.combo,viewBox:svg.getAttribute('viewBox'),transform:svg.querySelector('g')?.getAttribute('transform'),
      geometry:[box.width,box.height,ink.width,ink.height,(ink.left+ink.width/2)-(mark.left+mark.width/2),(ink.top+ink.height/2)-(mark.top+mark.height/2)],
      paths:paths.map(path=>({d:path.getAttribute('d'),fill:path.getAttribute('fill'),paint:getComputedStyle(path).fill,stroke:getComputedStyle(path).stroke})),
      sharedPaintFrame:[svg,...paths].every(path=>{const style=getComputedStyle(path);return style.backgroundImage==='none'&&style.boxShadow==='none'&&style.filter==='none';}),
      contained:paths.slice(1).every(path=>{const length=path.getTotalLength();for(let i=0;i<=256;i++)if(!outer.isPointInFill(path.getPointAtLength(length*i/256)))return false;return true;})};
  }));
  for(const glyph of glyphs){
    const expected=['#010101',...ciPalettes[glyph.key]];
    assert.deepEqual(glyph.paths.map(p=>createHash('sha256').update(p.d).digest('hex')),ciPathHashes[glyph.key.length],label+' '+glyph.key+' exact original native outline/cutouts');
    assert.deepEqual(glyph.paths.map(p=>p.fill),expected,label+' '+glyph.key+' native section colors');
    assert.deepEqual(glyph.paths.map(p=>p.paint),expected.map(hex=>{const h=hex.length===4?[...hex.slice(1)].map(c=>c+c).join(''):hex.slice(1);return 'rgb('+[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)).join(', ')+')';}),label+' colors actually paint without CSS overrides');
    assert.ok(glyph.paths.every(p=>p.stroke==='none')&&glyph.sharedPaintFrame&&glyph.contained,label+' '+glyph.key+' actual colored paths stay inside the shared native outline');
    assert.equal(glyph.viewBox,'0 0 1024 1024');assert.equal(glyph.transform,'translate(0 938.667) scale(1 -1)');
    assert.ok(glyph.geometry.slice(0,4).every(n=>Math.abs(n-size)<=.1)&&glyph.geometry.slice(4).every(n=>Math.abs(n)<=.1),label+' '+glyph.key+' native painted circle is centered and normalized to'+size+'px');
  }
}
// A compact access circle is 14px; detail circles remain 18px. Measure the
// native pair glyph too, so reducing only the host or its font cannot pass.
async function checkAccessSizes(host,label,size,blocked=false){
  const marks=await host.locator('.combo-mark,.access-strip > .sc:not(.a-none),.own-row > .sc:not(.a-none)').evaluateAll(items=>items.map(mark=>{
    const box=mark.getBoundingClientRect(),combo=mark.classList.contains('combo-mark');
    const glyph=mark.querySelector('.ms,.ci3-svg,.ci4-svg,.ci5-svg'),ink=glyph.getBoundingClientRect();
    const fallback=mark.querySelector('.combo-text'),text=fallback?.getBoundingClientRect(),optical=new DOMMatrix(getComputedStyle(glyph).transform);
    return {combo,key:mark.dataset.combo||mark.dataset.c,host:[box.width,box.height],glyph:[ink.width,ink.height],
      center:[ink.x+ink.width/2-box.x-box.width/2-optical.e,ink.y+ink.height/2-box.y-box.height/2-optical.f],
      font:parseFloat(getComputedStyle(glyph).fontSize),hidden:getComputedStyle(glyph).display==='none',
      fallback:fallback&&{visible:getComputedStyle(fallback).display!=='none',text:fallback.textContent,
        center:[text.x+text.width/2-box.x-box.width/2,text.y+text.height/2-box.y-box.height/2]}};
  }));
  assert.ok(marks.length,label+' has actual marks to measure');
  for(const mark of marks){
    assert.ok(mark.host.every(n=>Math.abs(n-size)<=.1),label+' '+mark.key+' '+size+'px host');
    if(mark.combo&&blocked){
      assert.ok(mark.hidden&&mark.fallback.visible&&mark.fallback.text===mark.key,label+' '+mark.key+' readable no-font letters');
      assert.ok(mark.fallback.center.every(n=>Math.abs(n)<=.5),label+' '+mark.key+' centered no-font text');
    }else if(!blocked){
      assert.ok(!mark.hidden&&mark.center.every(n=>Math.abs(n)<=.5),label+' '+mark.key+' centered native glyph');
      if(mark.combo) assert.ok(mark.glyph.every(n=>Math.abs(n-size)<=.5),label+' '+mark.key+' full proportional glyph footprint');
      else assert.ok(mark.glyph.every(n=>n>0&&n<size),label+' '+mark.key+' independent inner glyph stays within its circle');
    }
  }
}
async function checkAccessLabels(page){
  const mixed=payload.records.filter(record=>/^[A-P]/.test(record.name)&&record.access.combinations.length&&'WUBRG'.split('').some(color=>record.access.colors[color].status==='documented'));
  const mixedAO=mixed.filter(record=>/^[A-O]/.test(record.name)),mixedP=mixed.filter(record=>record.name.startsWith('P'));
  const noMono=['Commander ninjutsu','Companion','Covercast','Eminence','Friends forever','Fuse','Mark of Chaos Ascendant'].map(name=>payload.records.find(record=>record.name===name));
  assert.equal(mixedAO.length,160,'the fixed A–O mixed-access cohort is exact');
  assert.equal(mixedP.length,13,'the fixed P mixed-access cohort is exact');
  assert.equal(mixed.length,173,'the fixed A–P mixed-access cohort is exact');
  await page.evaluate(()=>VMX.setView('az'));
  for(const record of mixed){
    await page.evaluate(id=>VMX.open(id),record.id);
    const panel=page.locator('#detail .supp-assessment');
    const slots=await panel.locator('.own-row[data-c]').evaluateAll(rows=>rows.map(row=>({color:row.dataset.c,label:row.querySelector('.own-t')?.textContent})));
    for(const slot of slots){
      const status=(slot.color==='C'?record.access.colorless:record.access.colors[slot.color])?.status;
      assert.equal(slot.label,status==='documented'?'Access':status==='multicolor_only'?'No example found':status==='not_applicable'?'Not applicable':status==='insufficient_evidence'?'Insufficient evidence':'No example found',record.name+' '+slot.color+' keeps an independent-access label');
    }
    const combinations=panel.locator('.combo-mark');
    assert.ok(await combinations.evaluateAll(items=>items.every(item=>item.getAttribute('title').endsWith(' — Combination')&&item.getAttribute('aria-label').endsWith(' combination'))),record.name+' combination marker metadata uses Combination');
    assert.ok(await panel.locator('.own-row[data-combo] .own-t').evaluateAll(items=>items.every(item=>item.textContent==='Combination')),record.name+' visible combination rows use Combination');
  }
  for(const record of noMono){
    await page.evaluate(id=>VMX.open(id),record.id);
    const panel=page.locator('#detail .supp-assessment');
    const slots=await panel.locator('.own-row[data-c]').evaluateAll(rows=>rows.map(row=>({color:row.dataset.c,label:row.querySelector('.own-t')?.textContent})));
    for(const slot of slots){
      const status=(slot.color==='C'?record.access.colorless:record.access.colors[slot.color])?.status;
      assert.equal(slot.label,status==='multicolor_only'?'Combination only':status==='documented'?'Access':status==='not_applicable'?'Not applicable':status==='insufficient_evidence'?'Insufficient evidence':'No example found',record.name+' retains its baseline '+slot.color+' label');
    }
    assert.ok(await panel.locator('.combo-mark').evaluateAll(items=>items.every(item=>item.getAttribute('title').endsWith(' — Combination only')&&item.getAttribute('aria-label').endsWith(' combination only'))),record.name+' retains no-independent-access marker metadata');
  }
  await page.locator('#q').fill('Pack tactics');await page.locator('#q').focus();
  const option=page.locator('#res-list .opt[data-k="deck:vocabulary:pack tactics"]');await option.waitFor({state:'visible'});await option.click();
  const pack=page.locator('#detail .supp-assessment');
  assert.deepEqual(await pack.locator('.own-row[data-c]').evaluateAll(rows=>rows.map(row=>[row.dataset.c,row.querySelector('.own-t').textContent])),[['R','Access'],['G','Access']],'Pack tactics preserves its independent color rows');
  assert.deepEqual(await pack.locator('.own-row[data-combo] .own-t').allTextContents(),['Combination'],'Pack tactics labels Red / Green as Combination');
  await page.locator('#q').fill('');
}
async function checkL(page,browser,baseline){
  const records=payload.records.filter(r=>r.name.startsWith('L'));
  const maps={Landcycling:['W','U','B','R','G','WU','WG','UB','UG','BR','RG','C'],Landfall:['W','U','B','R','G','WUBR','WURG','WUG','WBG','WRG','WG','UBG','URG','UG','BG','RG','C'],Landship:['G'],Landwalk:['W','U','B','R','G','WU','WRG','WG','UB','UBR','UG','BR','BRG','BG','RG','C'],Learn:['W','U','B','R','G','WB','BG'],Legacy:['G','C'],'Legendary landwalk':['G','RG'],'Level Up':['W','U','B','R','G'],Lieutenant:['W','U','B','R','G'],'Living Metal':['W','U','B','R','WU','WUR','WBR','WR','WRG','UB','BR'],'Living Weapon':['W','B','G','BR','C']};
  const buckets=r=>[...Object.values(r.access.colors).filter(b=>b.status==='documented'),...r.access.combinations,...(r.access.colorless.status==='documented'?[r.access.colorless]:[])];
  assert.equal(records.length,11);assert.equal(records.flatMap(buckets).length,83);
  assert.equal(payload.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')&&!r.name.startsWith('P')).length,244);assert.equal(payload.sourceBindings.slice(0,23).length,23);
  assert.equal(payload.records.find(r=>r.name==='Lifelink'),undefined,'mapped Lifelink stays frozen');
  const packet=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/l-protocol.json'),'utf8'));
  const receipts=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/l-protocol-evidence/retrieval-receipts.json'),'utf8')).retrievals;
  for(const r of packet.records) for(const card of r.card_review){
    const binding=card.evidence_binding, raw=fs.readFileSync(path.join(root,binding.path));
    assert.equal(createHash('sha256').update(raw).digest('hex'),binding.sha256,card.name+' actual raw hash');
    const receipt=receipts.find(r=>r.path===binding.path);assert.equal(receipt.status,200);assert.equal(receipt.rawSha256,binding.sha256);
    assert.ok(receipt.url.startsWith('https://api.scryfall.com/cards/')&&receipt.requestStartedUtc&&receipt.requestEndedUtc);
    const body=JSON.parse(raw),fact=(body.data||[body]).find(c=>c.oracle_id===card.oracle_id);assert.deepEqual(card.card_facts,fact,card.name+' entire saved object matches raw capture');
    const face=fact.card_faces?.find(f=>f.name===card.mechanic_bearing_face)||fact;
    assert.deepEqual(card.attributed_colors,[...'WUBRG'].filter(c=>face.colors.includes(c)),card.name+' actual mechanic-bearing face colors');
    assert.ok(fact.games.includes('paper')&&fact.released_at<='2026-10-29');
  }
  await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
  const actualTokens=new Map();let links=0;
  for(const record of records){
    const a=record.access, independent=[...'WUBRG'].filter(c=>a.colors[c].status==='documented').concat(a.colorless.status==='documented'?['C']:[]), combos=a.combinations.map(b=>b.colors.join(''));
    assert.deepEqual([...independent.filter(c=>c!=='C'),...combos,...independent.includes('C')?['C']:[]],maps[record.name],record.name+' exact observed map');
    assert.ok(buckets(record).every(b=>b.cards.length===1));
    await page.evaluate(()=>VMX.setView('az'));const row=page.locator(`#list .ent[data-k="${record.id}"]`);
    assert.equal(await row.locator('.access-strip').count(),1);
    assert.deepEqual(await row.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' list combinations');
    assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(items=>items.filter(i=>i.classList.contains('a-d')).map(i=>i.dataset.c)),independent);
    await page.locator('#q').fill(record.name);await page.locator('#q').focus();const option=page.locator(`#res-list .opt[data-k="${record.id}"]`);await option.waitFor({state:'visible'});
    assert.deepEqual(await option.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' actual search combinations');
    await checkAccessSizes(row,record.name+' list',18);await checkCIVectors(row,record.name+' list',18);await checkAccessSizes(option,record.name+' search',18);await checkCIVectors(option,record.name+' search',18);
    await page.locator('#q').fill('');await page.evaluate(id=>VMX.open(id),record.id);
    const panel=page.locator('#detail .supp-assessment');assert.match(await panel.innerText(),/October 29, 2026/);
    assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' detail combinations');
    if(combos.length)assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(items=>items.map(i=>i.dataset.c)),independent);
    await panel.locator('.assessment-notes > summary').focus();await page.keyboard.press('Enter');
    const expected=buckets(record).map(b=>b.cards[0].url).sort();links+=expected.length;
    assert.deepEqual(await page.locator('#detail a').evaluateAll(items=>items.filter(i=>i.hostname==='scryfall.com'&&i.pathname.startsWith('/card/')).map(i=>i.href).sort()),expected,record.name+' exactly one selected link per bucket in whole detail');
    await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail',18);
    assert.equal(await panel.locator('.assessment-example').count(),expected.length);
    assert.equal(await panel.locator('.assessment-notes details').count(),0);
    assert.doesNotMatch(await panel.innerText(),/Selected .*document|presence evidence|independent example|reviewed scope|unselected discovery|individually reviewed|narrow witness|name matches/i);
    assert.deepEqual(await panel.locator('.assessment-sources a').evaluateAll(items=>items.map(i=>i.href)),record.sources.map(s=>s.url));
    assert.ok(await page.locator('#detail a').evaluateAll(items=>items.every(i=>i.protocol==='https:'&&['scryfall.com','magic.wizards.com','media.wizards.com'].includes(i.hostname)&&i.rel.includes('noopener'))));
    await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    const state=await page.locator('#detail').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));return {tokens:[...copy.textContent.matchAll(/\{[^{}\r\n]+\}/g)].map(m=>m[0]),rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({token:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms'),'::before').content,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})),visible:el.innerText};});
    assert.deepEqual(state.rendered.map(s=>s.token),state.tokens,record.name+' every actual prose/rule/reference token rendered');assert.doesNotMatch(state.visible,/\{[^{}\r\n]+\}/);
    assert.ok(state.rendered.every(s=>s.label&&s.fallback==='none'&&!['none','normal','""'].includes(s.glyph)));actualTokens.set(record.name,state.tokens);
    assert.ok(await page.locator('#detail .combo-mark').evaluateAll((items,label)=>items.every(i=>i.getAttribute('role')==='img'&&i.getAttribute('aria-label').endsWith(label)),'WUBRG'.split('').some(color=>record.access.colors[color].status==='documented')?'combination':'combination only'));
    await page.setViewportSize({width:360,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),record.name+' narrow containment');await page.setViewportSize({width:1440,height:900});
  }
  assert.equal(links,83);
  assert.match(records.find(r=>r.name==='Lieutenant').access.colors.U.note,/Loyal Drake.*beginning of combat/);
  assert.match(records.find(r=>r.name==='Lieutenant').access.colors.G.note,/Loyal Guardian.*each creature/);
  assert.match(records.find(r=>r.name==='Landship').summary,/no general Landship definition has been verified/);
  assert.match(records.find(r=>r.name==='Legacy').access.colorless.note,/permanently mark/);
  const tokenText='{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {12} {W} {U} {B} {R} {G} {C} {X} {B/G} {T}',unsafe='<img src=x onerror=alert(1)> {unknown} '+tokenText;
  for(const blocked of [false,true]){
    const fixture=await browser.newPage();if(blocked)await fixture.route('**/mana-font@1.18.0/**',route=>route.abort());
    const data=structuredClone(supplement),p=structuredClone(payload),scopes=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement-scope.v1.json'),'utf8'));
    for(const r of data.records.filter(r=>r.name.startsWith('L')&&r.target2021===null)){r.clauses=[{number:'fixture',text:unsafe}];r.reference={title:'Fixture',verification:'fixture',rules:[],summary:unsafe,source:{title:'Fixture',url:'https://magic.wizards.com/en/news/feature/mystery-booster-release-notes-2019-11-11'}};}
    const hash=createHash('sha256').update(JSON.stringify(data)).digest('hex');scopes.payloadCanonicalSha256=hash;p.supplementCanonicalSha256=hash;for(const r of p.records.filter(r=>r.name.startsWith('L')))r.summary=unsafe;
    await fixture.route('**/data/mechanics-supplement.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(data)}));await fixture.route('**/data/mechanics-supplement-scope.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(scopes)}));await fixture.route(assessmentRoute,r=>r.fulfill({contentType:'application/json',body:JSON.stringify(p)}));
    await fixture.goto(url);await fixture.waitForFunction(()=>VMX.assessments().status==='ready');if(!blocked)await fixture.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    for(const record of records){await fixture.evaluate(id=>VMX.open(id),record.id);await fixture.locator('.assessment-notes > summary').click();
      for(const selector of ['.assessment-notes > p','#detail .supp-rules .dx-ex','#detail .supp-reference .supp-quote']){
        const prose=fixture.locator(selector).first();assert.equal(await prose.locator('img').count(),0);assert.ok((await prose.textContent()).includes('<img src=x onerror=alert(1)> {unknown}'));
        const symbols=await prose.locator('.supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,role:s.getAttribute('role'),label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display,before:getComputedStyle(s.querySelector('.ms'),'::before').content,after:getComputedStyle(s.querySelector('.ms'),'::after').content})));
        assert.deepEqual(symbols.map(s=>s.raw),tokenText.split(' '),record.name+' all fixture tokens across '+selector);assert.ok(symbols.every(s=>s.label&&s.role==='img'&&(blocked?s.glyph==='none'&&s.text===s.raw&&s.fallback!=='none':s.glyph!=='none'&&s.fallback==='none'&&!['none','normal','""'].includes(s.before)&&(s.raw.includes('/')?!['none','normal','""'].includes(s.after):true))));
      }
    }await fixture.close();
  }
  const noFont=await browser.newPage();await noFont.route('**/mana-font@1.18.0/**',r=>r.abort());await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');await noFont.evaluate(()=>VMX.setView('az'));
  for(const record of records){await noFont.evaluate(id=>VMX.open(id),record.id);await noFont.locator('.assessment-notes > summary').click();
    const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));assert.deepEqual(symbols.map(s=>s.raw),actualTokens.get(record.name));assert.ok(symbols.every(s=>s.raw===s.text&&s.label&&s.glyph==='none'));
    await checkAccessSizes(noFont.locator('#detail .supp-assessment'),record.name+' fallback detail',18,true);
    const fallbackRow=noFont.locator(`#list .ent[data-k="${record.id}"]`);await checkAccessSizes(fallbackRow,record.name+' fallback list',18,true);
    await noFont.locator('#q').fill(record.name);await noFont.locator('#q').focus();const fallbackOption=noFont.locator(`#res-list .opt[data-k="${record.id}"]`);await fallbackOption.waitFor({state:'visible'});await checkAccessSizes(fallbackOption,record.name+' fallback search',18,true);await noFont.locator('#q').fill('');
    assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(items=>items.every(i=>getComputedStyle(i.querySelector('svg,.ms')).display==='none'&&i.innerText===i.dataset.combo)),record.name+' no-font combinations');
  }await noFont.close();
  for(const scenario of ['missing','date','status','unsafe','binding']){const failure=await browser.newPage(),bad=structuredClone(payload),r=bad.records.find(r=>r.name==='Landfall');if(scenario==='date')r.researchDate='2026-10-28';if(scenario==='status')r.access.colors.W.status='invented';if(scenario==='unsafe')r.access.colors.W.cards[0].url='https://scryfall.com@evil.example/';if(scenario==='binding')bad.sourceBindings.at(-1).path='tampered.json';await failure.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));await failure.goto(url);await failure.waitForFunction(()=>VMX.assessments().status==='unavailable');assert.equal(await failure.evaluate(()=>VMX.assessments().records.length),0);await failure.evaluate(()=>VMX.open('deck:vocabulary:landfall'));assert.ok(await failure.locator('#detail .supp-rules').count());await failure.close();}
  await page.locator('#q').fill('Landfall');await page.locator('#q').focus();await page.locator('#q').press('Enter');assert.equal(await page.locator('#dx-title').innerText(),'Landfall');await page.locator('#q').fill('');
  await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');});assert.equal(await page.evaluate(math),baseline);
  results.push('All eleven L records / 83 exact linked witnesses: fresh raw objects, face colors and receipts; actual list/search/detail independent and combination marks; concise prose; all actual and fixture mana tokens across assessment/rules/reference, escaping, accessible glyphs and blocked-font fallback; malformed isolation, keyboard, narrow containment and unchanged frozen 84-check baseline.');
}

async function checkM(page,browser,baseline){
  const records=payload.records.filter(r=>r.name.startsWith('M'));
  const maps={"Madness":["W","U","B","R","G","BR","C"],"Magecraft":["W","U","B","R","G","BG","UG","UR","WB","WR","C"],"Manifest":["W","U","B","R","G","UG","UR","C"],"Manifest Dread":["W","U","B","R","G","BR","UG","C"],"Mark of Chaos Ascendant":["UBR"],"Max Speed":["W","U","B","R","G","BR","WB","WBR","WU","C"],"Mayhem":["U","B","R","BR","UBR","UR","C"],"Megamorph":["W","U","B","R","G"],"Meld":["W","B","G","BR","WU","C"],"Melee":["W","R","G","RG","WR","WRG"],"Mentor":["W","U","R","G","WB","WR"],"Metalcraft":["W","U","B","R","G","WR","C"],"Miracle":["W","U","B","R","G","WB","WR","WUB","C"],"Mobilize":["W","B","R","WBR"],"Modular":["W","B","R","RG","WR","C"],"Mold Earth":["W"],"Monstrosity":["W","U","B","R","G","BG","RG","UG","WG","C"],"Morbid":["W","B","R","G","BG","C"],"More Than Meets the Eye":["W","U","B","R","BR","RG","UB","WBR","WR","WRG","WU","WUB","WUR"],"Morph":["W","U","B","R","G","UBG","UG","URG","WBG","WBR","WUR","C"],"Mountaincycling":["R","BR","RG"],"Mountainwalk":["W","U","R","G"],"Multikicker":["W","U","B","R","G","WU","C"],"Mutate":["W","U","B","R","G","BG","UBG","UG","UR","URG","WB","WBG","WBR","WR","WUR"],"Myriad":["W","U","B","R","G","BR","UR","WG","WR","WUBRG","C"]};
  const buckets=r=>[...Object.values(r.access.colors).filter(b=>b.status==='documented'),...r.access.combinations,...(r.access.colorless.status==='documented'?[r.access.colorless]:[])];
  assert.equal(records.length,25);assert.equal(records.flatMap(buckets).length,183);
  assert.equal(createHash('sha256').update(JSON.stringify(payload.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')&&!r.name.startsWith('M')&&!r.name.startsWith('N')&&!r.name.startsWith('O')))).digest('hex'),'844a874bfbd33d96acd485db46782bf4ac72b5afbddcf8a614785150fcd98768','all 210 A–L rows unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(payload.sourceBindings.slice(0,20))).digest('hex'),'945b65c696a960aa7a3bacf71e9c44b5c6817732d02e5b22dd138e4e190f3553','all 20 A–L bindings unchanged');
  assert.equal(payload.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')&&!r.name.startsWith('P')).length,244);assert.equal(payload.sourceBindings.slice(0,23).length,23);
  for(const name of ['Menace','Mill'])assert.equal(payload.records.find(r=>r.name===name),undefined,name+' mapped entry stays frozen');
  const packet=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/m-protocol.json'),'utf8'));
  const receipts=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/m-protocol-evidence/retrieval-receipts.json'),'utf8')).retrievals;
  for(const r of packet.records) for(const card of r.card_review){
    const binding=card.evidence_binding, raw=fs.readFileSync(path.join(root,binding.path));
    assert.equal(createHash('sha256').update(raw).digest('hex'),binding.sha256,card.name+' actual raw hash');
    const receipt=receipts.find(r=>r.path===binding.path);assert.equal(receipt.status,200);assert.equal(receipt.rawSha256,binding.sha256);
    assert.ok(receipt.url.startsWith('https://api.scryfall.com/cards/')&&receipt.requestStartedUtc&&receipt.requestEndedUtc);
    const body=JSON.parse(raw),fact=(body.data||[body]).find(c=>c.oracle_id===card.oracle_id);assert.deepEqual(card.card_facts,fact,card.name+' entire saved object matches raw capture');
    const face=fact.card_faces?.find(f=>f.name===card.mechanic_bearing_face)||fact;
    assert.deepEqual(card.attributed_colors,[...'WUBRG'].filter(c=>face.colors.includes(c)),card.name+' actual mechanic-bearing face colors');
    assert.ok(fact.games.includes('paper')&&fact.released_at<='2026-10-29');
    assert.ok(!fact.digital&&!['token','double_faced_token','emblem','planar','scheme','augment','host'].includes(fact.layout));
    assert.ok(!/\b(?:Stickers|Token|Scheme|Plane|Vanguard|Conspiracy)\b/.test(fact.type_line)&&!['funny','token','memorabilia'].includes(fact.set_type)&&fact.security_stamp!=='acorn'&&fact.border_color!=='silver');
    assert.ok(!/playtest/i.test(fact.oracle_text||'')&&!['cmb1','cmb2','mb2'].includes(fact.set));
    assert.ok((face.oracle_text||'').toLowerCase().includes(r.mechanic.name.toLowerCase()),card.name+' exact text qualifies');
    if(r.mechanic.name==='Manifest')assert.ok(/\bmanifest(?! dread)\b/i.test(face.oracle_text));
    assert.equal(receipt.method,'POST');
    const requestRaw=fs.readFileSync(path.join(root,receipt.requestBodyPath));
    assert.equal(createHash('sha256').update(requestRaw).digest('hex'),receipt.requestBodySha256);
    assert.ok(JSON.parse(requestRaw).identifiers.some(i=>i.id===fact.id));

  }
  await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
  const actualTokens=new Map();let links=0;
  for(const record of records){
    const a=record.access, independent=[...'WUBRG'].filter(c=>a.colors[c].status==='documented').concat(a.colorless.status==='documented'?['C']:[]), combos=a.combinations.map(b=>b.colors.join(''));
    assert.deepEqual([...independent.filter(c=>c!=='C'),...combos,...independent.includes('C')?['C']:[]],maps[record.name],record.name+' exact observed map');
    assert.ok(buckets(record).every(b=>b.cards.length===1));
    await page.evaluate(()=>VMX.setView('az'));const row=page.locator(`#list .ent[data-k="${record.id}"]`);
    assert.equal(await row.locator('.access-strip').count(),1);
    assert.deepEqual(await row.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' list combinations');
    assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(items=>items.filter(i=>i.classList.contains('a-d')).map(i=>i.dataset.c)),independent);
    await page.locator('#q').fill(record.name);await page.locator('#q').focus();const option=page.locator(`#res-list .opt[data-k="${record.id}"]`);await option.waitFor({state:'visible'});
    assert.deepEqual(await option.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' actual search combinations');
    await checkAccessSizes(row,record.name+' list',18);await checkCIVectors(row,record.name+' list',18);await checkAccessSizes(option,record.name+' search',18);await checkCIVectors(option,record.name+' search',18);
    await page.locator('#q').fill('');await page.evaluate(id=>VMX.open(id),record.id);
    const panel=page.locator('#detail .supp-assessment');assert.match(await panel.innerText(),/October 29, 2026/);
    assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' detail combinations');
    if(combos.length)assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(items=>items.map(i=>i.dataset.c)),independent);
    await panel.locator('.assessment-notes > summary').focus();await page.keyboard.press('Enter');
    const expected=buckets(record).map(b=>b.cards[0].url).sort();links+=expected.length;
    assert.deepEqual(await page.locator('#detail a').evaluateAll(items=>items.filter(i=>i.hostname==='scryfall.com'&&i.pathname.startsWith('/card/')).map(i=>i.href).sort()),expected,record.name+' exactly one selected link per bucket in whole detail');
    await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail',18);
    assert.equal(await panel.locator('.assessment-example').count(),expected.length);
    assert.equal(await panel.locator('.assessment-notes details').count(),0);
    assert.doesNotMatch(await panel.innerText(),/Selected .*document|presence evidence|independent example|reviewed scope|unselected discovery|individually reviewed|narrow witness|name matches/i);
    assert.deepEqual(await panel.locator('.assessment-sources a').evaluateAll(items=>items.map(i=>i.href)),record.sources.map(s=>s.url));
    assert.ok(await page.locator('#detail a').evaluateAll(items=>items.every(i=>i.protocol==='https:'&&['scryfall.com','magic.wizards.com','media.wizards.com'].includes(i.hostname)&&i.rel.includes('noopener'))));
    await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    const state=await page.locator('#detail').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));return {tokens:[...copy.textContent.matchAll(/\{[^{}\r\n]+\}/g)].map(m=>m[0]),rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({token:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms'),'::before').content,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})),visible:el.innerText};});
    assert.deepEqual(state.rendered.map(s=>s.token),state.tokens,record.name+' every actual prose/rule/reference token rendered');assert.doesNotMatch(state.visible,/\{[^{}\r\n]+\}/);
    assert.ok(state.rendered.every(s=>s.label&&s.fallback==='none'&&!['none','normal','""'].includes(s.glyph)));actualTokens.set(record.name,state.tokens);
    assert.ok(await page.locator('#detail .combo-mark').evaluateAll((items,label)=>items.every(i=>i.getAttribute('role')==='img'&&i.getAttribute('aria-label').endsWith(label)),'WUBRG'.split('').some(color=>record.access.colors[color].status==='documented')?'combination':'combination only'));
    await page.setViewportSize({width:360,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),record.name+' narrow containment');await page.setViewportSize({width:1440,height:900});
  }
  assert.equal(links,183);
  const named=name=>records.find(r=>r.name===name);
  assert.equal(named('Mentor').access.colorless.status,'not_found','Stickers are excluded from ordinary paper');
  assert.equal(named('Manifest').access.colors.U.cards[0].name,'Cloudform');
  assert.equal(named('Manifest').access.colorless.cards[0].name,'Scroll of Fate');
  assert.ok(!named('Manifest').access.combinations.some(b=>b.colors.join('')==='BR'),'Manifest Dread is a separate action');
  assert.equal(named('Mountainwalk').access.colors.U.cards[0].name,'River Merfolk');
  assert.equal(named('Miracle').access.colorless.cards[0].name,'Molecule Man');
  assert.match(named('Modular').access.combinations.find(b=>b.colors.join('')==='RG').note,/Blaster.*grants modular 1/);
  assert.match(named('Mayhem').access.colorless.note,/Oscorp Industries.*without a cost.*land-play limits/);
  assert.match(named('Mayhem').access.combinations.find(b=>b.colors.join('')==='UBR').note,/Green Goblin.*nonland cards in your graveyard/);
  assert.match(named('Morbid').access.colorless.note,/Séance Board/);
  assert.doesNotMatch(JSON.stringify(records),/\uFFFD|documented here through selected|selected .*example/i);
  const tokenText='{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {12} {W} {U} {B} {R} {G} {C} {X} {B/G} {G/U} {B/R} {G/W} {U/R} {W/B} {U/B} {R/G} {R/W} {W/U} {S} {T}',unsafe='<img src=x onerror=alert(1)> {unknown} '+tokenText;
  for(const blocked of [false,true]){
    const fixture=await browser.newPage();if(blocked)await fixture.route('**/mana-font@1.18.0/**',route=>route.abort());
    const data=structuredClone(supplement),p=structuredClone(payload),scopes=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement-scope.v1.json'),'utf8'));
    for(const r of data.records.filter(r=>r.name.startsWith('M')&&r.target2021===null)){r.clauses=[{number:'fixture',text:unsafe}];r.reference={title:'Fixture',verification:'fixture',rules:[],summary:unsafe,source:{title:'Fixture',url:'https://magic.wizards.com/en/news/feature/mystery-booster-release-notes-2019-11-11'}};}
    const hash=createHash('sha256').update(JSON.stringify(data)).digest('hex');scopes.payloadCanonicalSha256=hash;p.supplementCanonicalSha256=hash;for(const r of p.records.filter(r=>r.name.startsWith('M')))r.summary=unsafe;
    await fixture.route('**/data/mechanics-supplement.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(data)}));await fixture.route('**/data/mechanics-supplement-scope.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(scopes)}));await fixture.route(assessmentRoute,r=>r.fulfill({contentType:'application/json',body:JSON.stringify(p)}));
    await fixture.goto(url);await fixture.waitForFunction(()=>VMX.assessments().status==='ready');if(!blocked)await fixture.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    for(const record of records){await fixture.evaluate(id=>VMX.open(id),record.id);await fixture.locator('.assessment-notes > summary').click();
      for(const selector of ['.assessment-notes > p','#detail .supp-rules .dx-ex','#detail .supp-reference .supp-quote']){
        const prose=fixture.locator(selector).first();assert.equal(await prose.locator('img').count(),0);assert.ok((await prose.textContent()).includes('<img src=x onerror=alert(1)> {unknown}'));
        const symbols=await prose.locator('.supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,role:s.getAttribute('role'),label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display,before:getComputedStyle(s.querySelector('.ms'),'::before').content,after:getComputedStyle(s.querySelector('.ms'),'::after').content})));
        assert.deepEqual(symbols.map(s=>s.raw),tokenText.split(' '),record.name+' all fixture tokens across '+selector);assert.ok(symbols.every(s=>s.label&&s.role==='img'&&(blocked?s.glyph==='none'&&s.text===s.raw&&s.fallback!=='none':s.glyph!=='none'&&s.fallback==='none'&&!['none','normal','""'].includes(s.before)&&(s.raw.includes('/')?!['none','normal','""'].includes(s.after):true))));
      }
    }await fixture.close();
  }
  const noFont=await browser.newPage();await noFont.route('**/mana-font@1.18.0/**',r=>r.abort());await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');await noFont.evaluate(()=>VMX.setView('az'));
  for(const record of records){await noFont.evaluate(id=>VMX.open(id),record.id);await noFont.locator('.assessment-notes > summary').click();
    const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));assert.deepEqual(symbols.map(s=>s.raw),actualTokens.get(record.name));assert.ok(symbols.every(s=>s.raw===s.text&&s.label&&s.glyph==='none'));
    await checkAccessSizes(noFont.locator('#detail .supp-assessment'),record.name+' fallback detail',18,true);
    const fallbackRow=noFont.locator(`#list .ent[data-k="${record.id}"]`);await checkAccessSizes(fallbackRow,record.name+' fallback list',18,true);
    await noFont.locator('#q').fill(record.name);await noFont.locator('#q').focus();const fallbackOption=noFont.locator(`#res-list .opt[data-k="${record.id}"]`);await fallbackOption.waitFor({state:'visible'});await checkAccessSizes(fallbackOption,record.name+' fallback search',18,true);await noFont.locator('#q').fill('');
    assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(items=>items.every(i=>getComputedStyle(i.querySelector('svg,.ms')).display==='none'&&i.innerText===i.dataset.combo)),record.name+' no-font combinations');
  }await noFont.close();
  for(const scenario of ['missing','date','status','unsafe','binding']){const failure=await browser.newPage(),bad=structuredClone(payload),r=bad.records.find(r=>r.name==='Madness');if(scenario==='date')r.researchDate='2026-10-28';if(scenario==='status')r.access.colors.W.status='invented';if(scenario==='unsafe')r.access.colors.W.cards[0].url='https://scryfall.com@evil.example/';if(scenario==='binding')bad.sourceBindings.at(-1).path='tampered.json';await failure.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));await failure.goto(url);await failure.waitForFunction(()=>VMX.assessments().status==='unavailable');assert.equal(await failure.evaluate(()=>VMX.assessments().records.length),0);await failure.evaluate(()=>VMX.open('deck:vocabulary:madness'));assert.ok(await failure.locator('#detail .supp-rules').count());await failure.close();}
  await page.locator('#q').fill('Madness');await page.locator('#q').focus();await page.locator('#q').press('Enter');assert.equal(await page.locator('#dx-title').innerText(),'Madness');await page.locator('#q').fill('');
  await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');});assert.equal(await page.evaluate(math),baseline);
  results.push('All 25 M records / 183 exact linked witnesses: fresh raw objects, face colors and receipts; actual list/search/detail independent and combination marks; concise prose; all actual and fixture mana tokens across assessment/rules/reference, escaping, accessible glyphs and blocked-font fallback; malformed isolation, keyboard, narrow containment and unchanged frozen 84-check baseline.');
}

async function checkMutatePips(page,browser,baseline){
  const mutate=payload.records.find(record=>record.name==='Mutate');
  const expected={
    'Nethroi, Apex of Death':['{4}','{G/W}','{B}','{B}'],
    'Snapdax, Apex of the Hunt':['{2}','{B/R}','{W}','{W}'],
    'Vadrok, Apex of Thunder':['{1}','{W/U}','{R}','{R}'],
    'Necropanther':['{2}','{W/B}','{W/B}'],
    'Regal Leosaur':['{1}','{R/W}','{R/W}']
  };
  await page.setViewportSize({width:466,height:900});
  await page.evaluate(id=>VMX.open(id),mutate.id);await page.locator('.assessment-notes > summary').click();
  for(const [name,tokens] of Object.entries(expected)){
    const example=page.locator('#detail .assessment-example').filter({hasText:name});
    const run=example.locator('.supp-cost-run');await run.waitFor();
    assert.deepEqual(await run.locator('.supp-symbol-text').allTextContents(),tokens,name+' retains every saved cost token in one run');
    const geometry=await run.evaluate(el=>{const box=el.getBoundingClientRect(),symbols=[...el.querySelectorAll('.supp-symbol')].map(symbol=>{const box=symbol.getBoundingClientRect(),glyph=symbol.querySelector('.ms'),style=getComputedStyle(glyph);return {x:box.x,y:box.y,w:box.width,h:box.height,lineHeight:style.lineHeight,fontSize:style.fontSize,before:getComputedStyle(glyph,'::before').content,after:getComputedStyle(glyph,'::after').content};});return {box,symbols};});
    assert.ok(geometry.box.width>0&&geometry.symbols.length===tokens.length,name+' has one visible contiguous cost run');
    assert.ok(geometry.symbols.every(symbol=>Math.abs(symbol.y-geometry.symbols[0].y)<=.1&&Math.abs(symbol.h-geometry.symbols[0].h)<=.1),name+' centers hybrid and single pips in one line box');
    assert.ok(geometry.symbols.slice(1).every((symbol,index)=>symbol.x>=geometry.symbols[index].x+geometry.symbols[index].w+.5),name+' pips have visible non-overlapping spacing');
    assert.ok(geometry.symbols.every((symbol,index)=>tokens[index].includes('/')?symbol.after&&!['none','normal','""'].includes(symbol.after):!symbol.after||symbol.after==='none'),name+' only hybrid pips paint a second native half');
    assert.ok(geometry.symbols.every(symbol=>symbol.lineHeight==='normal'||symbol.lineHeight!==symbol.fontSize),name+' retains the native Mana line-height rather than forcing 1');
  }
  await page.evaluate(()=>VMX.open('deck:vocabulary:landfall'));await page.locator('.assessment-notes > summary').click();
  assert.equal(await page.locator('#detail .supp-cost-run').count(),0,'legacy L formatter preserves its established ungrouped markup');
  const redGreen=await browser.newPage({viewport:{width:466,height:900}}),injected=structuredClone(payload);
  injected.records.find(record=>record.name==='Mutate').summary='Fixture red before green {R}{G}.';
  await redGreen.route(assessmentRoute,route=>route.fulfill({contentType:'application/json',body:JSON.stringify(injected)}));await redGreen.goto(url);await redGreen.waitForFunction(()=>VMX.assessments().status==='ready');await redGreen.evaluate(id=>VMX.open(id),mutate.id);await redGreen.locator('.assessment-notes > summary').click();
  const redGreenPips=await redGreen.locator('#detail .assessment-notes > p').first().locator('.supp-cost-run .ms').evaluateAll(items=>items.map(item=>{const box=item.getBoundingClientRect();return {className:item.className,x:box.x,y:box.y,w:box.width,h:box.height,before:getComputedStyle(item,'::before').content,after:getComputedStyle(item,'::after').content};}));
  assert.deepEqual(redGreenPips.map(pip=>pip.className),['ms ms-cost ms-r','ms ms-cost ms-g'],'red-before-green fixture preserves source token order');
  assert.ok(redGreenPips[1].x>=redGreenPips[0].x+redGreenPips[0].w+.5&&Math.abs(redGreenPips[0].y-redGreenPips[1].y)<=.1&&Math.abs(redGreenPips[0].h-redGreenPips[1].h)<=.1,'red-before-green fixture has spaced, aligned painted glyph boxes');
  assert.ok(redGreenPips.every(pip=>pip.before&&!['none','normal','""'].includes(pip.before)&&pip.after==='none'),'red-before-green fixture has no stray hybrid artwork');await redGreen.close();
  const noFont=await browser.newPage({viewport:{width:466,height:900}});await noFont.route('**/mana-font@1.18.0/**',route=>route.abort());await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');await noFont.evaluate(id=>VMX.open(id),mutate.id);await noFont.locator('.assessment-notes > summary').click();
  for(const [name,tokens] of Object.entries(expected))assert.deepEqual(await noFont.locator('#detail .assessment-example').filter({hasText:name}).locator('.supp-cost-run .supp-symbol').allInnerTexts(),tokens,name+' keeps readable no-font cost text');
  await noFont.close();await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');});assert.equal(await page.evaluate(math),baseline);
  results.push('Mutate costs keep each saved cost run together, align hybrid and single pips, preserve native hybrid halves, spacing, labels and no-font fallback.');
}

async function checkN(page,browser,baseline){
  const records=payload.records.filter(r=>r.name.startsWith('N'));
  const maps={Ninjutsu:['W','U','B','R','G','UB'],Nightbound:['B','R','G','RG'],'Nonbasic landwalk':['G','C']};
  const buckets=r=>[...Object.values(r.access.colors).filter(b=>b.status==='documented'),...r.access.combinations,...(r.access.colorless.status==='documented'?[r.access.colorless]:[])];
  assert.equal(records.length,3);assert.equal(records.flatMap(buckets).length,12);assert.equal(payload.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')&&!r.name.startsWith('P')).length,244);assert.equal(payload.sourceBindings.slice(0,23).length,23);
  assert.equal(createHash('sha256').update(JSON.stringify(payload.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')&&!r.name.startsWith('N')&&!r.name.startsWith('O')))).digest('hex'),'6e502e205d171be0b573d312561eec574817d9a6e58b6ef9fce58f0afd227cf5','all 235 A–M rows unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(payload.sourceBindings.slice(0,21))).digest('hex'),'b89202d0eb2e4bb308d34a57501df7c61f02a4d9bb95a64e7d4938e781421af4','all 21 A–M bindings unchanged');
  const packet=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/n-protocol.json'),'utf8'));
  assert.doesNotMatch(JSON.stringify(packet),/\uFFFD/,'authored N text has no replacement characters');
  const receipts=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/n-protocol-evidence/retrieval-receipts.json'),'utf8')).retrievals;
  for(const receipt of receipts){
    const raw=fs.readFileSync(path.join(root,receipt.path));assert.equal(createHash('sha256').update(raw).digest('hex'),receipt.rawSha256);
    assert.equal(receipt.status,200);assert.equal(new URL(receipt.url).hostname,'api.scryfall.com');
    assert.ok(Number.isFinite(Date.parse(receipt.requestStartedUtc))&&Date.parse(receipt.requestStartedUtc)<=Date.parse(receipt.requestEndedUtc));
    const body=JSON.parse(raw);if(receipt.method==='GET')assert.equal(body.has_more,false,'discovery capture is complete');
    if(receipt.method==='POST'){const request=fs.readFileSync(path.join(root,receipt.requestBodyPath));assert.equal(createHash('sha256').update(request).digest('hex'),receipt.requestBodySha256);assert.ok([1,11].includes(JSON.parse(request).identifiers.length));assert.equal(body.data.length,JSON.parse(request).identifiers.length);assert.deepEqual(body.not_found,[]);}
  }
  for(const r of packet.records)for(const card of r.card_review){
    const raw=fs.readFileSync(path.join(root,card.evidence_binding.path)), receipt=receipts.find(x=>x.path===card.evidence_binding.path);
    assert.equal(createHash('sha256').update(raw).digest('hex'),card.evidence_binding.sha256);assert.equal(receipt.rawSha256,card.evidence_binding.sha256);
    const fact=JSON.parse(raw).data.find(c=>c.oracle_id===card.oracle_id),face=fact.card_faces?.find(f=>f.name===card.mechanic_face)||fact;
    assert.deepEqual(card.card_facts,fact);assert.deepEqual(card.attributed_colors,[...'WUBRG'].filter(c=>face.colors.includes(c)));
    assert.ok(JSON.parse(fs.readFileSync(path.join(root,receipt.requestBodyPath),'utf8')).identifiers.some(i=>i.id===fact.id));
    assert.ok(fact.games.includes('paper')&&fact.released_at<='2026-10-30'&&!fact.digital&&fact.security_stamp!=='acorn'&&fact.border_color!=='silver');
    assert.ok(!['token','double_faced_token','emblem','planar','scheme','augment','host'].includes(fact.layout)&&!['funny','token','memorabilia'].includes(fact.set_type));
    assert.match(face.oracle_text,new RegExp(r.mechanic.name,'i'));assert.equal(card.scryfall_url,fact.scryfall_uri);
    if(r.mechanic.name==='Nightbound')assert.equal(face,fact.card_faces[1],'Nightbound uses back-face colors');
    if(card.name==="Trailblazer's Boots")assert.deepEqual(card.roles,['explicit_grant']);
  }
  // Derive encountered signatures from every returned object before comparing the authored map.
  // Scope screening is not a claim that all unselected designs received individual card reviews.
  const discoveryFiles={Ninjutsu:'ninjutsu-full-oracle-discovery.json',Nightbound:'nightbound-discovery.json','Nonbasic landwalk':'nonbasic-discovery.json'};
  for(const [name,file] of Object.entries(discoveryFiles)){
    const body=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/n-protocol-evidence',file),'utf8')),signatures=new Set();
    for(const fact of body.data){
      if(!fact.games.includes('paper')||fact.digital||fact.released_at>'2026-10-30'||fact.border_color==='silver'||fact.security_stamp==='acorn'||['funny','token','memorabilia'].includes(fact.set_type))continue;
      const faces=fact.card_faces||[fact];
      for(const face of faces)if(new RegExp(name,'i').test(face.oracle_text||''))signatures.add([...'WUBRG'].filter(c=>face.colors.includes(c)).join('')||'C');
    }
    assert.deepEqual([...signatures].sort(),maps[name].slice().sort(),name+' complete discovered source/face signature screen');
  }
  const oracle=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/n-protocol-evidence/ninjutsu-full-oracle-discovery.json'),'utf8')).data;
  for(const name of ['Satoru Umezawa',"Yuriko, the Tiger's Shadow"]){const c=oracle.find(c=>c.name===name);assert.ok(c.games.includes('paper')&&!c.digital);assert.deepEqual([...c.colors].sort(),['B','U']);assert.match(c.oracle_text,/ninjutsu/i);}
  assert.match(oracle.find(c=>c.name==='Satoru Umezawa').oracle_text,/Each creature card in your hand has ninjutsu/);
  assert.match(oracle.find(c=>c.name==="Yuriko, the Tiger's Shadow").oracle_text,/Commander ninjutsu/);
  assert.equal(records.find(r=>r.name==='Nightbound').access.colors.W.status,'not_found');assert.equal(records.find(r=>r.name==='Nightbound').access.colors.U.status,'not_found');
  await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
  const actualTokens=new Map();let links=0;
  for(const record of records){
    const a=record.access, independent=[...'WUBRG'].filter(c=>a.colors[c].status==='documented').concat(a.colorless.status==='documented'?['C']:[]), combos=a.combinations.map(b=>b.colors.join(''));
    assert.deepEqual([...independent.filter(c=>c!=='C'),...combos,...independent.includes('C')?['C']:[]],maps[record.name],record.name+' exact observed map');
    assert.ok(buckets(record).every(b=>b.cards.length===1));
    await page.evaluate(()=>VMX.setView('az'));const row=page.locator(`#list .ent[data-k="${record.id}"]`);
    assert.equal(await row.locator('.access-strip').count(),1);
    assert.deepEqual(await row.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' list combinations');
    assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(items=>items.filter(i=>i.classList.contains('a-d')).map(i=>i.dataset.c)),independent);
    await page.locator('#q').fill(record.name);await page.locator('#q').focus();const option=page.locator(`#res-list .opt[data-k="${record.id}"]`);await option.waitFor({state:'visible'});
    assert.deepEqual(await option.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' actual search combinations');
    await checkAccessSizes(row,record.name+' list',18);await checkCIVectors(row,record.name+' list',18);await checkAccessSizes(option,record.name+' search',18);await checkCIVectors(option,record.name+' search',18);
    await page.locator('#q').fill('');await page.evaluate(id=>VMX.open(id),record.id);
    const panel=page.locator('#detail .supp-assessment');assert.match(await panel.innerText(),/October 30, 2026/);
    assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' detail combinations');
    if(combos.length)assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(items=>items.map(i=>i.dataset.c)),independent);
    await panel.locator('.assessment-notes > summary').focus();await page.keyboard.press('Enter');
    const expected=buckets(record).map(b=>b.cards[0].url).sort();links+=expected.length;assert.equal(new Set(expected).size,expected.length,record.name+' selected hrefs are unique');
    assert.deepEqual(await page.locator('#detail a').evaluateAll(items=>items.filter(i=>i.hostname==='scryfall.com'&&i.pathname.startsWith('/card/')).map(i=>i.href).sort()),expected,record.name+' exactly one selected link per bucket in whole detail');
    await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail',18);
    assert.equal(await panel.locator('.assessment-example').count(),expected.length);
    assert.equal(await panel.locator('.assessment-notes details').count(),0);
    assert.doesNotMatch(await panel.innerText(),/Selected .*document|presence evidence|independent example|reviewed scope|unselected discovery|individually reviewed|narrow witness|name matches/i);
    assert.deepEqual(await panel.locator('.assessment-sources a').evaluateAll(items=>items.map(i=>i.href)),record.sources.map(s=>s.url));
    assert.ok(await page.locator('#detail a').evaluateAll(items=>items.every(i=>i.protocol==='https:'&&['scryfall.com','magic.wizards.com','media.wizards.com'].includes(i.hostname)&&i.rel.includes('noopener'))));
    await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    const state=await page.locator('#detail').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));return {tokens:[...copy.textContent.matchAll(/\{[^{}\r\n]+\}/g)].map(m=>m[0]),rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({token:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms'),'::before').content,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})),visible:el.innerText};});
    assert.deepEqual(state.rendered.map(s=>s.token),state.tokens,record.name+' every actual prose/rule/reference token rendered');assert.doesNotMatch(state.visible,/\{[^{}\r\n]+\}/);
    assert.ok(state.rendered.every(s=>s.label&&s.fallback==='none'&&!['none','normal','""'].includes(s.glyph)));actualTokens.set(record.name,state.tokens);
    assert.ok(await page.locator('#detail .combo-mark').evaluateAll((items,label)=>items.every(i=>i.getAttribute('role')==='img'&&i.getAttribute('aria-label').endsWith(label)),'WUBRG'.split('').some(color=>record.access.colors[color].status==='documented')?'combination':'combination only'));
    await page.setViewportSize({width:360,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),record.name+' narrow containment');await page.setViewportSize({width:1440,height:900});
  }
  assert.equal(links,12);
  const tokenText='{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {12} {W} {U} {B} {R} {G} {C} {X} {B/G} {G/U} {B/R} {G/W} {U/R} {W/B} {U/B} {R/G} {R/W} {W/U} {S} {T}',unsafe='<img src=x onerror=alert(1)> {unknown} '+tokenText;
  for(const blocked of [false,true]){
    const fixture=await browser.newPage();if(blocked)await fixture.route('**/mana-font@1.18.0/**',route=>route.abort());
    const data=structuredClone(supplement),p=structuredClone(payload),scopes=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement-scope.v1.json'),'utf8'));
    for(const r of data.records.filter(r=>r.name.startsWith('N')&&r.target2021===null)){r.clauses=[{number:'fixture',text:unsafe}];r.reference={title:'Fixture',verification:'fixture',rules:[],summary:unsafe,source:{title:'Fixture',url:'https://magic.wizards.com/en/news/feature/mystery-booster-release-notes-2019-11-11'}};}
    const hash=createHash('sha256').update(JSON.stringify(data)).digest('hex');scopes.payloadCanonicalSha256=hash;p.supplementCanonicalSha256=hash;for(const r of p.records.filter(r=>r.name.startsWith('N')))r.summary=unsafe;
    await fixture.route('**/data/mechanics-supplement.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(data)}));await fixture.route('**/data/mechanics-supplement-scope.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(scopes)}));await fixture.route(assessmentRoute,r=>r.fulfill({contentType:'application/json',body:JSON.stringify(p)}));
    await fixture.goto(url);await fixture.waitForFunction(()=>VMX.assessments().status==='ready');if(!blocked)await fixture.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    for(const record of records){await fixture.evaluate(id=>VMX.open(id),record.id);await fixture.locator('.assessment-notes > summary').click();
      for(const selector of ['.assessment-notes > p','#detail .supp-rules .dx-ex','#detail .supp-reference .supp-quote']){
        const prose=fixture.locator(selector).first();assert.equal(await prose.locator('img').count(),0);assert.ok((await prose.textContent()).includes('<img src=x onerror=alert(1)> {unknown}'));
        const symbols=await prose.locator('.supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,role:s.getAttribute('role'),label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display,before:getComputedStyle(s.querySelector('.ms'),'::before').content,after:getComputedStyle(s.querySelector('.ms'),'::after').content})));
        assert.deepEqual(symbols.map(s=>s.raw),tokenText.split(' '),record.name+' all fixture tokens across '+selector);assert.ok(symbols.every(s=>s.label&&s.role==='img'&&(blocked?s.glyph==='none'&&s.text===s.raw&&s.fallback!=='none':s.glyph!=='none'&&s.fallback==='none'&&!['none','normal','""'].includes(s.before)&&(s.raw.includes('/')?!['none','normal','""'].includes(s.after):true))));
      }
    }await fixture.close();
  }
  const noFont=await browser.newPage();await noFont.route('**/mana-font@1.18.0/**',r=>r.abort());await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');await noFont.evaluate(()=>VMX.setView('az'));
  for(const record of records){await noFont.evaluate(id=>VMX.open(id),record.id);await noFont.locator('.assessment-notes > summary').click();
    const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));assert.deepEqual(symbols.map(s=>s.raw),actualTokens.get(record.name));assert.ok(symbols.every(s=>s.raw===s.text&&s.label&&s.glyph==='none'));
    await checkAccessSizes(noFont.locator('#detail .supp-assessment'),record.name+' fallback detail',18,true);
    const fallbackRow=noFont.locator(`#list .ent[data-k="${record.id}"]`);await checkAccessSizes(fallbackRow,record.name+' fallback list',18,true);
    await noFont.locator('#q').fill(record.name);await noFont.locator('#q').focus();const fallbackOption=noFont.locator(`#res-list .opt[data-k="${record.id}"]`);await fallbackOption.waitFor({state:'visible'});await checkAccessSizes(fallbackOption,record.name+' fallback search',18,true);await noFont.locator('#q').fill('');
    assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(items=>items.every(i=>getComputedStyle(i.querySelector('svg,.ms')).display==='none'&&i.innerText===i.dataset.combo)),record.name+' no-font combinations');
  }await noFont.close();
  for(const scenario of ['missing','date','status','unsafe','binding']){const failure=await browser.newPage(),bad=structuredClone(payload),r=bad.records.find(r=>r.name==='Ninjutsu');if(scenario==='date')r.researchDate='2026-10-28';if(scenario==='status')r.access.colors.W.status='invented';if(scenario==='unsafe')r.access.colors.W.cards[0].url='https://scryfall.com@evil.example/';if(scenario==='binding')bad.sourceBindings.at(-1).path='tampered.json';await failure.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));await failure.goto(url);await failure.waitForFunction(()=>VMX.assessments().status==='unavailable');assert.equal(await failure.evaluate(()=>VMX.assessments().records.length),0);await failure.evaluate(()=>VMX.open('deck:vocabulary:ninjutsu'));assert.ok(await failure.locator('#detail .supp-rules').count());await failure.close();}
  await page.locator('#q').fill('Ninjutsu');await page.locator('#q').focus();await page.locator('#q').press('Enter');assert.equal(await page.locator('#dx-title').innerText(),'Ninjutsu');await page.locator('#q').fill('');
  await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');});assert.equal(await page.evaluate(math),baseline);
  results.push('All 3 N records / 12 exact unique selected links: complete fresh receipts and objects, actual face/source colors, list/search/detail combinations, concise definitions, actual and fixture symbols in assessment/rules/references, escaping, accessible labels, blocked-font fallback, malformed isolation, keyboard, narrow containment and unchanged frozen math.');
}
async function checkR(page,browser,baseline){
  const maps={Radiance:['W','R','WR'],Raid:['W','U','B','R','G','BR','UR','URG'],Rally:['W','B','R','G','WG','WR'],Rampage:['W','R','G','C','WU','WG','RG','WUB'],Ravenous:['W','R','G','RG','UG','UR'],'Read Ahead':['W','U','B','R','G'],Rebound:['W','U','B','R','G','BR','WU'],Reconfigure:['W','U','B','R','G'],Recover:['W','U','B','R','G'],Recruit:['W','U','WU'],Reinforce:['W','R','G','C'],Renew:['U','B','G','UBG'],Renown:['W','R','G','WG','WRG'],Repartee:['W','B','WB'],Replicate:['W','U','B','R','G','UR','C'],Retrace:['W','U','B','R','G','UR','UG','WR','BG','RG'],Revolt:['W','B','R','G','WB','WG'],Riot:['R','G','RG'],Ripple:['W','U','B','R','G','C'],'Role token':['W','U','B','R','G','WG','BG'],'Roll to Visit Your Attractions':['U','B'],Regenerate:['W','U','B','R','G','C','WB','UB','BR','WG','BG','RG','BRG','WUBRG','WUG','UBR'],Reveal:[]};
  const records=payload.records.filter(r=>r.name.startsWith('R'));
  const buckets=r=>[...Object.values(r.access.colors).filter(b=>b.status==='documented'),...r.access.combinations,...(r.access.colorless.status==='documented'?[r.access.colorless]:[])];
  assert.equal(records.length,23);assert.equal(records.flatMap(buckets).length,129);assert.equal(payload.records.length,329);assert.equal(payload.sourceBindings.length,26);
  assert.deepEqual(records.map(r=>r.id).sort(),supplement.records.filter(r=>r.name.startsWith('R')&&r.target2021===null).map(r=>r.id).sort());
  assert.equal(createHash('sha256').update(JSON.stringify(payload.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')))).digest('hex'),'a00567a2b7270e646ffe0d312cff80ec3c83a1adcc5860908e0767619312fa9e','all 266 prior projected rows unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(payload.sourceBindings.slice(0,24))).digest('hex'),'ffaba46801251b004e72450d9eba30dc4fe7713ef6376233ebca4ec597f73b47','all 24 prior source bindings unchanged');
  assert.equal(records.find(r=>r.name==='Reach'),undefined);assert.equal(records.find(r=>r.name==='Reveal').kind,'rules');
  const packet=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/r-protocol.json'),'utf8'));
  assert.doesNotMatch(JSON.stringify(packet),/\uFFFD|TODO/);
  const receipts=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/r-protocol-evidence/retrieval-receipts.json'),'utf8'));
  const captures=new Map();
  for(const receipt of receipts){
    assert.equal(receipt.method,'GET');assert.equal(new URL(receipt.url).hostname,'api.scryfall.com');
    assert.ok(Number.isFinite(Date.parse(receipt.requestStartedUtc))&&Date.parse(receipt.requestStartedUtc)<=Date.parse(receipt.retrievedUtc));
    if(!receipt.sha256){assert.equal(receipt.status,404);assert.equal(fs.existsSync(path.join(root,receipt.path)),false);continue;}
    const raw=fs.readFileSync(path.join(root,receipt.path));assert.equal(createHash('sha256').update(raw).digest('hex'),receipt.sha256);
    const body=JSON.parse(raw);captures.set(receipt.path,{receipt,body});
    if(receipt.status!==200){assert.equal(body.object,'error');continue;}
    assert.equal(body.object,'list');
    if(body.has_more){const next=[...receipts].find(r=>r.url===body.next_page);assert.ok(next&&next.sha256,'every returned discovery page captured');}
  }
  const ordinary=c=>c.games.includes('paper')&&!c.digital&&c.released_at<='2026-10-30'&&c.security_stamp!=='acorn'&&!['silver','gold'].includes(c.border_color)&&!c.promo_types?.includes('playtest')&&(!['funny','memorabilia','token'].includes(c.set_type)||c.set==='unf')&&!['token','double_faced_token','emblem','planar','scheme','vanguard','augment','host','art_series'].includes(c.layout)&&!/\b(?:Token|Stickers|Plane|Phenomenon|Vanguard|Scheme|Conspiracy)\b/.test(c.type_line);
  const faceColors=f=>[...'WUBRG'].filter(c=>(f.colors||f.color_indicator||f.mana_cost?.match(/[WUBRG]/g)||[]).includes(c));
  const qualifies=(name,c,f)=>{
    const t=f.oracle_text||'';
    if(['Radiance','Rally','Renew','Repartee','Revolt'].includes(name))return new RegExp('^'+name+' [—-]','mi').test(t);
    if(name==='Raid')return /^Raid(?: \(the Fridge\))? [—-]/mi.test(t);
    if(name==='Recruit')return /\brecruit[.,]/i.test(t);
    if(name==='Role token')return /\bcreat\w*\b[^\n]*\bRole token\b/i.test(t);
    if(name==='Roll to Visit Your Attractions')return c.name!=='"Lifetime" Pass Holder'&&/\broll to visit your Attractions\b/i.test(t);
    if(name==='Regenerate')return /\bregenerate\b/i.test(t);
    return new RegExp('\\b'+name+'\\b','i').test(t);
  };
  for(const r of packet.records){
    const name=r.mechanic.name;if(name==='Reveal'){assert.equal(r.card_review.length,0);continue;}
    const signatures=new Set();
    for(const query of r.queries){const cap=captures.get(query.path);if(!cap||cap.receipt.status!==200)continue;
      assert.equal(query.url,cap.receipt.url);
      for(const fact of cap.body.data)if(ordinary(fact))for(const face of fact.card_faces||[fact])if(qualifies(name,fact,face))signatures.add(faceColors(face).join('')||'C');
    }
    assert.deepEqual([...signatures].sort(),maps[name].slice().sort(),name+' complete captured source/face signature screen');
    for(const card of r.card_review){
      const binding=card.evidence_binding,cap=captures.get(binding.path);assert.ok(cap,card.name+' has actual capture');assert.equal(binding.sha256,cap.receipt.sha256);
      const fact=cap.body.data.find(c=>c.id===card.card_facts.id);assert.deepEqual(card.card_facts,fact);assert.equal(card.scryfall_url,fact.scryfall_uri);assert.equal(card.oracle_id,fact.oracle_id);
      if(!card.included)continue;assert.ok(ordinary(fact),card.name+' ordinary paper through review date');assert.equal(card.scope,'released paper');
      const face=fact.card_faces?.find(f=>f.name===card.mechanic_face)||fact;assert.ok(qualifies(name,fact,face),card.name+' native/direct/granted/creator use');assert.deepEqual(card.attributed_colors,faceColors(face),card.name+' actual mechanic-bearing source colors');
    }
  }
  // Exact baseline HTML/payload run in a second page; no extra checkout or branch.
  const base='ab053fb3e3228797466fad13a3aa65a1eee248ef',oldPage=await browser.newPage({viewport:{width:1440,height:900}});
  const oldHTML=execFileSync('git',['show',base+':vox-color/mechanical-explorer.html'],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}),oldPayload=execFileSync('git',['show',base+':data/mechanics-assessments.v1.json'],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});
  await oldPage.route('**/vox-color/mechanical-explorer.html',r=>r.fulfill({contentType:'text/html',body:oldHTML}));await oldPage.route(assessmentRoute,r=>r.fulfill({contentType:'application/json',body:oldPayload}));
  await oldPage.goto(url);await oldPage.waitForFunction(()=>VMX.assessments().status==='ready');assert.equal(await oldPage.evaluate(math),baseline);
  const ids=payload.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')).map(r=>r.id);
  const rendered=ids=>{VMX.clearColors();VMX.setQuery('');VMX.setView('az');return ids.map(id=>{VMX.open(id);return {id,detail:document.querySelector('#detail').innerHTML,list:[...document.querySelectorAll('#list .ent')].find(e=>e.dataset.k===id).innerHTML};});};
  assert.deepEqual(await page.evaluate(rendered,ids),await oldPage.evaluate(rendered,ids),'all 266 prior full emitted detail/list outputs preserved');
  const unchanged=supplement.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')&&!r.target2021&&!/^[A-P]/.test(r.name)).map(r=>r.id);
  assert.deepEqual(await page.evaluate(rendered,unchanged),await oldPage.evaluate(rendered,unchanged),'unassessed Q and later supplemental rendering preserved');
  await oldPage.close();
  await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
  const actualTokens=new Map();let links=0;
  for(const record of records){
    const a=record.access, independent=[...'WUBRG'].filter(c=>a.colors[c].status==='documented').concat(a.colorless.status==='documented'?['C']:[]), combos=a.combinations.map(b=>b.colors.join(''));
    assert.deepEqual([...independent.filter(c=>c!=='C'),...combos,...independent.includes('C')?['C']:[]].sort(),maps[record.name].slice().sort(),record.name+' exact observed map');
    assert.ok(buckets(record).every(b=>b.cards.length===1));
    await page.evaluate(()=>VMX.setView('az'));const row=page.locator(`#list .ent[data-k="${record.id}"]`);
    assert.equal(await row.locator('.access-strip').count(),record.kind==='access'?1:0);
    assert.deepEqual(await row.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' list combinations');
    assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(items=>items.filter(i=>i.classList.contains('a-d')).map(i=>i.dataset.c)),independent);
    await page.locator('#q').fill(record.name);await page.locator('#q').focus();const option=page.locator(`#res-list .opt[data-k="${record.id}"]`);await option.waitFor({state:'visible'});
    assert.deepEqual(await option.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' actual search combinations');
    if(record.kind==='access')await checkAccessSizes(row,record.name+' list',18);await checkCIVectors(row,record.name+' list',18);if(record.kind==='access')await checkAccessSizes(option,record.name+' search',18);await checkCIVectors(option,record.name+' search',18);
    await page.locator('#q').fill('');await page.evaluate(id=>VMX.open(id),record.id);
    const panel=page.locator('#detail .supp-assessment');assert.match(await panel.innerText(),/October 30, 2026/);
    if(record.kind==='access')assert.equal(await panel.locator(':scope > .dx-note').first().innerText(),record.scopeLabel+'.','scope label does not repeat the definition');
    assert.equal(await panel.locator('.assessment-notes > p').first().textContent(),record.summary,'mechanic explanation appears once before card-specific notes');
    assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' detail combinations');
    if(combos.length)assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(items=>items.map(i=>i.dataset.c)),independent);
    await panel.locator('.assessment-notes > summary').focus();await page.keyboard.press('Enter');
    const expected=buckets(record).map(b=>b.cards[0].url).sort();links+=expected.length;assert.equal(new Set(expected).size,expected.length,record.name+' selected hrefs are unique');
    assert.deepEqual(await page.locator('#detail a').evaluateAll(items=>items.filter(i=>i.hostname==='scryfall.com'&&i.pathname.startsWith('/card/')).map(i=>i.href).sort()),expected,record.name+' exactly one selected link per bucket in whole detail');
    if(record.kind==='access')await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail',18);
    assert.equal(await panel.locator('.assessment-example').count(),expected.length);
    assert.equal(await panel.locator('.assessment-notes details').count(),0);
    assert.doesNotMatch(await panel.innerText(),/Selected .*document|presence evidence|independent example|reviewed scope|unselected discovery|individually reviewed|narrow witness|name matches/i);
    assert.deepEqual(await panel.locator('.assessment-sources a').evaluateAll(items=>items.map(i=>i.href)),record.sources.map(s=>s.url));
    assert.ok(await page.locator('#detail a').evaluateAll(items=>items.every(i=>i.protocol==='https:'&&['scryfall.com','magic.wizards.com','media.wizards.com'].includes(i.hostname)&&i.rel.includes('noopener'))));
    await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    const state=await page.locator('#detail').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));return {tokens:[...copy.textContent.matchAll(/\{[^{}\r\n]+\}/g)].map(m=>m[0]),rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({token:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms'),'::before').content,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})),visible:el.innerText};});
    assert.deepEqual(state.rendered.map(s=>s.token),state.tokens,record.name+' every actual prose/rule/reference token rendered');assert.doesNotMatch(state.visible,/\{[^{}\r\n]+\}/);
    assert.ok(state.rendered.every(s=>s.label&&s.fallback==='none'&&!['none','normal','""'].includes(s.glyph)));actualTokens.set(record.name,state.tokens);
    assert.ok(await page.locator('#detail .combo-mark').evaluateAll((items,label)=>items.every(i=>i.getAttribute('role')==='img'&&i.getAttribute('aria-label').endsWith(label)),'WUBRG'.split('').some(color=>record.access.colors[color].status==='documented')?'combination':'combination only'));
    await page.setViewportSize({width:360,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),record.name+' narrow containment');await page.setViewportSize({width:1440,height:900});
  }
  assert.equal(links,129);
  const tokenText='{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {12} {W} {U} {B} {R} {G} {C} {X} {B/G} {G/U} {B/R} {G/W} {U/R} {W/B} {U/B} {R/G} {R/W} {W/U} {S} {T}',unsafe='<img src=x onerror=alert(1)> {unknown} '+tokenText;
  for(const blocked of [false,true]){
    const fixture=await browser.newPage();if(blocked)await fixture.route('**/mana-font@1.18.0/**',route=>route.abort());
    const data=structuredClone(supplement),p=structuredClone(payload),scopes=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement-scope.v1.json'),'utf8'));
    for(const r of data.records.filter(r=>r.name.startsWith('R')&&r.target2021===null)){r.clauses=[{number:'fixture',text:unsafe}];r.reference={title:'Fixture',verification:'fixture',rules:[],summary:unsafe,source:{title:'Fixture',url:'https://magic.wizards.com/en/news/feature/mystery-booster-release-notes-2019-11-11'}};}
    const hash=createHash('sha256').update(JSON.stringify(data)).digest('hex');scopes.payloadCanonicalSha256=hash;p.supplementCanonicalSha256=hash;for(const r of p.records.filter(r=>r.name.startsWith('R')))r.summary=unsafe;
    await fixture.route('**/data/mechanics-supplement.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(data)}));await fixture.route('**/data/mechanics-supplement-scope.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(scopes)}));await fixture.route(assessmentRoute,r=>r.fulfill({contentType:'application/json',body:JSON.stringify(p)}));
    await fixture.goto(url);await fixture.waitForFunction(()=>VMX.assessments().status==='ready');if(!blocked)await fixture.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    for(const record of records){await fixture.evaluate(id=>VMX.open(id),record.id);await fixture.locator('.assessment-notes > summary').click();
      for(const selector of ['.assessment-notes > p','#detail .supp-rules .dx-ex','#detail .supp-reference .supp-quote']){
        const prose=fixture.locator(selector).first();assert.equal(await prose.locator('img').count(),0);assert.ok((await prose.textContent()).includes('<img src=x onerror=alert(1)> {unknown}'));
        const symbols=await prose.locator('.supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,role:s.getAttribute('role'),label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display,before:getComputedStyle(s.querySelector('.ms'),'::before').content,after:getComputedStyle(s.querySelector('.ms'),'::after').content})));
        assert.deepEqual(symbols.map(s=>s.raw),tokenText.split(' '),record.name+' all fixture tokens across '+selector);assert.ok(symbols.every(s=>s.label&&s.role==='img'&&(blocked?s.glyph==='none'&&s.text===s.raw&&s.fallback!=='none':s.glyph!=='none'&&s.fallback==='none'&&!['none','normal','""'].includes(s.before)&&(s.raw.includes('/')?!['none','normal','""'].includes(s.after):true))));
      }
    }await fixture.close();
  }
  const noFont=await browser.newPage();await noFont.route('**/mana-font@1.18.0/**',r=>r.abort());await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');await noFont.evaluate(()=>VMX.setView('az'));
  for(const record of records){await noFont.evaluate(id=>VMX.open(id),record.id);await noFont.locator('.assessment-notes > summary').click();
    const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));assert.deepEqual(symbols.map(s=>s.raw),actualTokens.get(record.name));assert.ok(symbols.every(s=>s.raw===s.text&&s.label&&s.glyph==='none'));
    if(record.kind==='access')await checkAccessSizes(noFont.locator('#detail .supp-assessment'),record.name+' fallback detail',18,true);
    const fallbackRow=noFont.locator(`#list .ent[data-k="${record.id}"]`);if(record.kind==='access')await checkAccessSizes(fallbackRow,record.name+' fallback list',18,true);
    await noFont.locator('#q').fill(record.name);await noFont.locator('#q').focus();const fallbackOption=noFont.locator(`#res-list .opt[data-k="${record.id}"]`);await fallbackOption.waitFor({state:'visible'});if(record.kind==='access')await checkAccessSizes(fallbackOption,record.name+' fallback search',18,true);await noFont.locator('#q').fill('');
    assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(items=>items.every(i=>getComputedStyle(i.querySelector('svg,.ms')).display==='none'&&i.innerText===i.dataset.combo)),record.name+' no-font combinations');
  }await noFont.close();
  for(const scenario of ['missing','date','status','unsafe','binding']){const failure=await browser.newPage(),bad=structuredClone(payload),r=bad.records.find(r=>r.name==='Radiance');if(scenario==='date')r.researchDate='2026-10-28';if(scenario==='status')r.access.colors.W.status='invented';if(scenario==='unsafe')r.access.colors.W.cards[0].url='https://scryfall.com@evil.example/';if(scenario==='binding')bad.sourceBindings.at(-1).path='tampered.json';await failure.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));await failure.goto(url);await failure.waitForFunction(()=>VMX.assessments().status==='unavailable');assert.equal(await failure.evaluate(()=>VMX.assessments().records.length),0);await failure.evaluate(()=>VMX.open('deck:vocabulary:radiance'));assert.ok(await failure.locator('#detail .supp-rules').count());await failure.close();}
  await page.locator('#q').fill('Radiance');await page.locator('#q').focus();await page.locator('#q').press('Enter');assert.equal(await page.locator('#dx-title').innerText(),'Radiance');await page.locator('#q').fill('');
  await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');});assert.equal(await page.evaluate(math),baseline);
  results.push('All 23 R records / 129 selected buckets rendered in list, actual search and expanded detail; exact card objects, receipts, source colors, compact links, symbols, escaping, blocked-font fallback, malformed isolation, keyboard, 360px containment, prior rendered parity and frozen math PASS.');
}
// Re-screen all saved discovery pages independently of authored selected-card maps.
// Text normalization here removes self-name and ability-negation references only;
// original Oracle text and braces remain unchanged in the retained source objects.
function screenSDiscovery(source,captures){
  const name=source.mechanic.name;
  if(['Sacrifice','Shuffle','Set in motion'].includes(name))return [];
  const native=word=>'^(?:[a-z -]+[,;] *)*'+word+'(?=\\s*(?:\\(|[,;.]|$))';
  const grant=word=>'\\b(?:has|have|gains?) '+word+'\\b';
  const patterns={
    Saddle:'\\bsaddle\\s+\\d+|\\bbecomes? saddled\\b',
    Scavenge:'\\bscavenge\\s+(?:\\{|\\d)|'+grant('scavenge'),
    'Secret council':'^Secret council [—-]',
    Shadow:native('shadow')+'|'+grant('shadow')+'|\\bput[^\\n]*shadow counter\\b',
    Shroud:native('shroud')+'|'+grant('shroud')+'|the same is true for[^\\n]*shroud',
    Skulk:native('skulk')+'|'+grant('skulk')+'|the same is true for[^\\n]*skulk',
    Sneak:'\\bsneak\\s+\\{',Solved:'^Solved [—-]',
    Soulbond:native('soulbond')+'|'+grant('soulbond'),
    Soulshift:'\\bsoulshift\\s+\\d+|'+grant('soulshift'),
    Spectacle:'\\bspectacle\\s+\\{|'+grant('spectacle'),
    'Spell mastery':'^Spell mastery [—-]',Splice:'\\bsplice onto\\b',
    'Split Second':native('split second')+'|'+grant('split second'),
    Spree:'^Spree\\b',Squad:'\\bsquad\\s+\\{',
    'Start Your Engines!':'\\bstart your engines!',Station:'^Station(?:\\s|$)|'+grant('station'),
    Storied:'^Storied\\b',Storm:native('storm')+'|'+grant('storm'),Strive:'^Strive\\b',
    Sunburst:native('sunburst')+'|'+grant('sunburst'),Support:'\\bsupport\\s+[\\dX]+\\b',
    Surge:'\\bsurge\\s+\\{|'+grant('surge'),Surveil:'\\bsurveil\\s+[\\dX]+\\b',
    Survival:'^Survival [—-]',Suspect:'\\bsuspect\\s+(?:it|them|that|target|up to|one|a creature|each|any|an opponent|enchanted)|\\bcreate[^\\n]*suspected',
    Suspend:'\\bsuspend\\s+\\d+|'+grant('suspend'),Sweep:'^Sweep [—-]',
    'Sell Contraband':'^[•* -]*Sell Contraband [—-]',"Scions' Secretary":"^Scions[’'] Secretary [—-]",'Sigil of Corruption':'^Sigil of Corruption [—-]',
    Swampcycling:'\\bswampcycling\\s+\\{',Slivercycling:'\\bslivercycling\\s+\\{',
    Swampwalk:native('swampwalk')+'|'+grant('swampwalk'),Specialize:'\\bspecialize\\s+\\{',
    Seek:'(?:^|[.!?:,]\\s*|— |then |may )seek\\b|\\b(?:owner|controller|player|opponent) seeks\\b'
  };
  const pattern=new RegExp(patterns[name],'mi'),digital=['Seek','Specialize'].includes(name),signatures=new Set();
  const eligible=c=>c.released_at<='2026-10-30'&&(digital?c.digital&&c.games.includes('arena'):c.games.includes('paper')&&!c.digital&&c.security_stamp!=='acorn'&&!['silver','gold'].includes(c.border_color)&&!c.promo_types?.includes('playtest')&&(!['funny','memorabilia','token'].includes(c.set_type)||c.set==='unf')&&!['token','double_faced_token','emblem','planar','scheme','vanguard','augment','host','art_series'].includes(c.layout)&&! /\b(?:Token|Stickers|Plane|Phenomenon|Vanguard|Scheme|Conspiracy)\b/.test(c.type_line));
  for(const capturePath of source.discovery_screen.captures){
    const cap=captures.get(capturePath);assert.equal(cap.receipt.status,200,name+' discovery capture succeeded');assert.equal(cap.body.object,'list');
    if(cap.body.has_more)assert.ok([...captures.values()].some(c=>c.receipt.url===cap.body.next_page&&c.receipt.status===200),name+' returned page is retained');
    for(const fact of cap.body.data){if(!eligible(fact))continue;for(const face of fact.card_faces||[fact]){
      let text=face.oracle_text||'';for(const self of new Set([fact.name,face.name]))text=text.split(self).join('CARD');
      text=text.replace(/as though[^.\n]*/gi,'').replace(/(?:can’t|can't|cannot) have [^.\n]*/gi,'');
      if(pattern.test(text))signatures.add([...'WUBRG'].filter(c=>(face.colors||face.color_indicator||[]).includes(c)).join('')||'C');
    }}
  }
  return [...signatures].sort();
}
async function checkSExampleHydration(page){
  const exampleCount=JSON.parse(fs.readFileSync(path.join(root,'vox-color/mechanical-supplement-examples.json'),'utf8')).records.length;
  await page.waitForFunction(n=>document.querySelector('#supplement-status').textContent.includes(n+' selected supplemental card examples are available.'),exampleCount);
  let links=0;
  for(const record of payload.records.filter(r=>r.name.startsWith('S'))){
    await page.evaluate(id=>VMX.open(id),record.id);
    const panel=page.locator('#detail .supp-assessment');await panel.locator('.assessment-notes > summary').click();
    assert.equal(await page.locator('#detail .dx-eg, #detail .cite').count(),0,record.name+' suppresses legacy example line/image after example data is ready');
    const auditCopy=/receipts?|timestamps?|reacquisition|request time|retriev(?:al|ed)|saved discovery|source-card access bucket|incidental Oracle|authoritative for selected|original status, bytes/i;
    assert.doesNotMatch(record.access.limitations.join(' '),auditCopy,record.name+' player limitations exclude research process');assert.doesNotMatch(await panel.locator('.assessment-notes').innerText(),auditCopy,record.name+' rendered expanded examples exclude research process');
    const buckets=[...Object.values(record.access.colors).filter(b=>b.status==='documented'),...record.access.combinations,...(record.access.colorless.status==='documented'?[record.access.colorless]:[])],expected=buckets.map(b=>b.cards[0].url).sort();
    assert.deepEqual(await page.locator('#detail a').evaluateAll(items=>items.filter(a=>a.hostname==='scryfall.com'&&a.pathname.startsWith('/card/')).map(a=>a.href).sort()),expected,record.name+' hydrated detail has only selected bucket links');links+=expected.length;
  }
  assert.equal(links,221);console.error('S hydration: all40 entries/221links have no legacy example line/image');
}
async function checkSCopy(page,browser,baseline){
  const names=['Scavenge','Sacrifice','Shuffle','Set in motion'];
  await page.evaluate(()=>{VMX.clearColors();VMX.setQuery('');});
  for(const name of names){
    const record=payload.records.find(r=>r.name===name);assert.ok(record);
    if(name==='Scavenge'){assert.match(record.scope,/\+1\/\+1 counters/);assert.match(record.summary,/\+1\/\+1 counters/);}
    else assert.doesNotMatch(record.summary,/access|inferred|reference only/i,name+' factual action explanation');
    await page.evaluate(id=>VMX.open(id),record.id);
    const panel=page.locator('#detail .supp-assessment');await panel.locator('.assessment-notes > summary').focus();await page.keyboard.press('Enter');
    const explanation=panel.locator('.assessment-notes > p:not(.assessment-example)');assert.equal(await explanation.count(),1);assert.equal(await explanation.innerText(),record.summary,name+' corrected source explanation is visible once');
    assert.equal(await panel.locator('.assessment-example').count(),name==='Scavenge'?3:0,name+' bucket/rules scope is preserved');
  }
  await checkSExampleHydration(page);assert.equal(await page.evaluate(math),baseline);results.push('All40 S hydrated example suppression/221 exact links; four S copy corrections: +1/+1 counter kind, factual rules-action explanations, exact visible authored summaries once, unchanged scopes/examples and frozen math.');
}
async function checkS(page,browser,baseline){
  console.error('S check: source and receipt audit');
  await checkSExampleHydration(page);
  const packetPath=path.join(root,'docs/mechanics-research/s-protocol.json');assert.ok(fs.existsSync(packetPath),'canonical S source packet is required');
  const packet=JSON.parse(fs.readFileSync(packetPath,'utf8'));assert.doesNotMatch(JSON.stringify(packet),/\uFFFD|TODO/,'authored S text has no replacement/TODO markers');
  const sourceRecords=packet.records.filter(r=>r.mechanic.name.startsWith('S')&&r.mechanic.name!=='Scry');
  const records=payload.records.filter(r=>r.name.startsWith('S')&&r.name!=='Scry');
  const buckets=r=>r.access?[...Object.values(r.access.colors).filter(b=>b.status==='documented'),...r.access.combinations,...(r.access.colorless.status==='documented'?[r.access.colorless]:[])]:[];
  const maps={Saddle:['W','U','B','R','G','WR','WG','BG','WRG','C'],Scavenge:['B','G','BG'],'Secret council':['U','R','UG','UR'],Shadow:['W','U','B','WUB','UB','C'],Shroud:['W','U','B','G','WU','UR','WUG','RG','WRG','UG','WG','C'],Skulk:['W','U','B','WU','WB','UB','C'],Sneak:['W','U','B','R','G','WB'],Solved:['W','U','B','R','G','C'],Soulbond:['W','U','B','R','G'],Soulshift:['W','B','G'],Spectacle:['B','R','BR'],'Spell mastery':['W','U','B','R','G','WR'],Splice:['W','U','B','R','G','UR'],'Split Second':['W','U','B','R','G','WR','BR'],Spree:['W','U','B','R','G'],Squad:['W','U','B','R','G','C'],'Start Your Engines!':['W','U','B','R','G','WB','BR','WU','WRG','WBR','C'],Station:['W','U','B','R','G','BRG','WUBRG','WUR','C'],Storied:['W','R','WR'],Storm:['W','U','B','R','G','BR','UR','URG'],Strive:['W','U','B','R','G','WR'],Sunburst:['C'],Support:['W','U','R','G','WG'],Surge:['U','R'],Surveil:['W','U','B','R','G','WU','WB','UB','UR','UG','BR','BG','WG','WUB','WUG','UBG','C'],Survival:['W','B','G','WG'],Suspect:['W','U','B','R','WR','BR'],Suspend:['W','U','B','R','G','WR','WUR','WU','UR','UB','C'],Sweep:['W','B','R'],'Sell Contraband':['B'],"Scions' Secretary":['W'],'Sigil of Corruption':['R'],Swampcycling:['B','BR','UB'],Slivercycling:['R'],Swampwalk:['W','B','G','BR','UBR','BG','UB'],Specialize:['W','U','B','R','G'],Seek:['W','U','B','R','G','WR','UR','URG','WRG','WG','RG','UB','UG','BR','WB','WUB','BG','WBG','WU','UBG','C'],Sacrifice:[],Shuffle:[],'Set in motion':[]};
  const scavenge=sourceRecords.find(r=>r.mechanic.name==='Scavenge').access_review;
  assert.match(scavenge.scope,/\+1\/\+1 counters/,'Scavenge scope preserves the counter kind');assert.match(scavenge.summary,/\+1\/\+1 counters/,'Scavenge explanation preserves the counter kind');
  for(const name of ['Sacrifice','Shuffle','Set in motion'])assert.doesNotMatch(sourceRecords.find(r=>r.mechanic.name===name).access_review.summary,/access|inferred|reference only/i,name+' explains the action without repeating access process');
  assert.match(sourceRecords.find(r=>r.mechanic.name==='Sacrifice').access_review.summary,/permanent[\s\S]*graveyard/);assert.match(sourceRecords.find(r=>r.mechanic.name==='Shuffle').access_review.summary,/random/);assert.match(sourceRecords.find(r=>r.mechanic.name==='Set in motion').access_review.summary,/scheme[\s\S]*face up/);
  const sourceMap=r=>[...'WUBRG'].filter(c=>r.access_review.colors?.[c]?.status==='documented').concat(r.access_review.combinations.map(b=>b.colors.join('')),r.access_review.colorless.status==='documented'?['C']:[]);
  assert.equal(sourceRecords.length,40,'all 40 unmapped S targets are sourced');assert.equal(Object.keys(maps).length,40,'all S static maps are frozen');assert.equal(records.length,40,'all 40 unmapped S targets project');assert.equal(payload.records.length,329);assert.equal(payload.sourceBindings.length,26);
  assert.deepEqual(records.map(r=>r.id).sort(),sourceRecords.map(r=>r.mechanic.accepted_id).sort(),'every admitted S target has one projected record');assert.equal(payload.records.find(r=>r.name==='Scry'),undefined,'mapped Scry remains frozen');
  const base='a65d2b95e4dd252c6613a21fa469b6911940ddcc',oldPayload=JSON.parse(execFileSync('git',['show',base+':data/mechanics-assessments.v1.json'],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}));
  assert.deepEqual(payload.records.filter(r=>!r.name.startsWith('S')),oldPayload.records,'all 289 pre-S projected records are structurally unchanged');assert.deepEqual(payload.sourceBindings.slice(0,25),oldPayload.sourceBindings,'all 25 pre-S bindings are structurally unchanged');
  const receiptPath=path.join(root,'docs/mechanics-research/s-protocol-evidence/retrieval-receipts.json');assert.ok(fs.existsSync(receiptPath),'S retrieval receipts are required');
  const receiptData=JSON.parse(fs.readFileSync(receiptPath,'utf8')),receipts=Array.isArray(receiptData)?receiptData:(receiptData.receipts||receiptData.retrievals),captures=new Map();assert.ok(Array.isArray(receipts),'S receipt list shape');assert.equal(receipts.length,78,'every S retrieval receipt is retained');assert.equal(receipts.filter(r=>r.status===200).length,77,'successful S captures are counted exactly');assert.equal(receipts.filter(r=>r.status===429).length,1,'retained rate-limit receipt remains explicit');
  for(const receipt of receipts){const ended=receipt.requestEndedUtc||receipt.retrievedUtc;assert.ok(receipt.url&&receipt.requestStartedUtc&&ended,'S receipt retains URL and actual timing');assert.ok(Number.isFinite(Date.parse(receipt.requestStartedUtc))&&Date.parse(receipt.requestStartedUtc)<=Date.parse(ended),'S receipt timing orders');const hash=receipt.rawSha256||receipt.sha256;if(!hash){assert.notEqual(receipt.status,200);continue;}const raw=fs.readFileSync(path.join(root,receipt.path));assert.equal(createHash('sha256').update(raw).digest('hex'),hash,receipt.path+' receipt hash');captures.set(receipt.path,{receipt,body:JSON.parse(raw)});}
  for(const source of sourceRecords){const projected=records.find(r=>r.id===source.mechanic.accepted_id), expected=maps[source.mechanic.name],screen=source.discovery_screen;assert.ok(projected,source.mechanic.name+' has projection');assert.deepEqual(sourceMap(source),expected,source.mechanic.name+' canonical source map');assert.deepEqual([...(screen.observed_selected_signatures||[])].sort(),[...expected].sort(),source.mechanic.name+' screened source/face signatures');for(const capturePath of screen.captures||[])assert.ok(captures.has(capturePath),source.mechanic.name+' screened capture has a retained receipt/body');assert.deepEqual([...(projected.kind==='rules'?[]:[...'WUBRG'].filter(c=>projected.access.colors[c].status==='documented')),...projected.access.combinations.map(b=>b.colors.join('')),...(projected.access.colorless.status==='documented'?['C']:[])],expected,source.mechanic.name+' exact projected map');
    for(const card of source.card_review){const binding=card.evidence_binding,cap=captures.get(binding.path);assert.ok(cap,card.name+' has saved receipt/body');assert.equal(binding.sha256||binding.rawSha256,cap.receipt.rawSha256||cap.receipt.sha256,card.name+' receipt binding');const facts=cap.body.data||[cap.body],fact=facts.find(c=>c.id===card.card_facts.id||c.oracle_id===card.oracle_id);assert.deepEqual(card.card_facts,fact,card.name+' entire selected object matches capture');if(!card.included)continue;const face=fact.card_faces?.find(f=>f.name===(card.mechanic_face||card.mechanic_bearing_face))||fact;assert.deepEqual(card.attributed_colors,[...'WUBRG'].filter(c=>(face.colors||face.color_indicator||[]).includes(c)),card.name+' mechanic-bearing face colors');assert.equal(card.scryfall_url,fact.scryfall_uri,card.name+' exact Scryfall link');}
  }
  for(const source of sourceRecords)assert.deepEqual(screenSDiscovery(source,captures),maps[source.mechanic.name].slice().sort(),source.mechanic.name+' independent complete-discovery source/face signature screen');
  const selected=(name,signature)=>{const access=records.find(r=>r.name===name).access,bucket=signature==='C'?access.colorless:signature.length===1?access.colors[signature]:access.combinations.find(b=>b.colors.join('')===signature);return bucket.cards[0].name;};
  assert.equal(selected('Storm','B'),'Reaping the Graves','Storm uses a real black storm card, not a gravestorm false positive');assert.ok(!maps.Storm.includes('WUR')&&!maps.Storm.includes('WG'),'Storm excludes false WUR/WG signatures');assert.ok(!maps.Storied.includes('B'),'Storied excludes name-only black hit');assert.ok(!maps.Survival.includes('WR'),'Survival excludes name-only WR hit');assert.equal(selected('Surveil','WU'),'Proctor of Potential','Surveil WU uses an actual action-bearing face');assert.ok(!maps.Surveil.includes('WUR'),'Surveil excludes split-card false positive');assert.equal(selected('Suspect','U'),'Reasonable Doubt','Suspect U excludes removal-only hit');assert.equal(selected('Suspect','BR'),'Incriminating Impetus','Suspect BR excludes removal-only hit');assert.ok(!maps.Suspect.includes('G')&&!maps.Suspect.includes('C'),'Suspect excludes removal/colorless inflation');assert.equal(selected('Swampwalk','UB'),'Wrexial, the Risen Deep','Swampwalk UB excludes Magical Hack false positive');
  console.error('S check: source audit PASS; prior rendered parity');
  const oldPage=await browser.newPage({viewport:{width:1440,height:900}}),oldHTML=execFileSync('git',['show',base+':vox-color/mechanical-explorer.html'],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});
  await oldPage.route('**/vox-color/mechanical-explorer.html',r=>r.fulfill({contentType:'text/html',body:oldHTML}));await oldPage.route(assessmentRoute,r=>r.fulfill({contentType:'application/json',body:JSON.stringify(oldPayload)}));await oldPage.goto(url);await oldPage.waitForFunction(()=>VMX.assessments().status==='ready');await oldPage.waitForFunction(()=>document.querySelector('#supplement-status').textContent.includes('358 selected supplemental card examples are available.'));assert.equal(await oldPage.evaluate(math),baseline);
  const rendered=ids=>{VMX.clearColors();VMX.setQuery('');VMX.setView('az');return ids.map(id=>{VMX.open(id);return {id,detail:document.querySelector('#detail').innerHTML,list:[...document.querySelectorAll('#list .ent')].find(e=>e.dataset.k===id)?.innerHTML||null};});};const oldIds=oldPayload.records.map(r=>r.id);assert.deepEqual(await page.evaluate(rendered,oldIds),await oldPage.evaluate(rendered,oldIds),'all pre-S list/detail output preserved');console.error('S check: prior rendered parity PASS; every S list/search/detail');const unchanged=supplement.records.filter(r=>r.name==='Scry'||(!r.target2021&&!/^[A-RS]/.test(r.name))).map(r=>r.id);assert.deepEqual(await page.evaluate(rendered,unchanged),await oldPage.evaluate(rendered,unchanged),'mapped Scry and unassessed Q/later rendering preserved');await oldPage.close();
  await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));const actualTokens=new Map();let links=0;
  for(const record of records){const a=record.access||{colors:Object.fromEntries('WUBRG'.split('').map(c=>[c,{status:'not_found'}])),colorless:{status:'not_found'},combinations:[]},independent=[...'WUBRG'].filter(c=>a.colors[c].status==='documented').concat(a.colorless.status==='documented'?['C']:[]),combos=a.combinations.map(b=>b.colors.join(''));assert.ok(buckets(record).every(b=>b.cards.length===1),record.name+' one exact witness per bucket');await page.evaluate(()=>VMX.setView('az'));const row=page.locator(`#list .ent[data-k="${record.id}"]`);assert.equal(await row.locator('.access-strip').count(),record.kind==='access'?1:0);assert.deepEqual(await row.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' list combinations');assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(items=>items.filter(i=>i.classList.contains('a-d')).map(i=>i.dataset.c)),independent,record.name+' list independent access');if(record.kind==='access'){await checkAccessSizes(row,record.name+' list',18);await checkCIVectors(row,record.name+' list',18);}await page.locator('#q').fill(record.name);await page.locator('#q').focus();const option=page.locator(`#res-list .opt[data-k="${record.id}"]`);await option.waitFor({state:'visible'});assert.deepEqual(await option.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' search combinations');assert.deepEqual(await option.locator('.access-strip > .sc').evaluateAll(items=>items.filter(i=>i.classList.contains('a-d')).map(i=>i.dataset.c)),independent,record.name+' search independent access');if(record.kind==='access'){await checkAccessSizes(option,record.name+' search',18);await checkCIVectors(option,record.name+' search',18);}await page.locator('#q').fill('');await page.evaluate(id=>VMX.open(id),record.id);const panel=page.locator('#detail .supp-assessment');assert.match(await panel.innerText(),/October 30, 2026/);assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' detail combinations');if(record.kind==='access'){if(combos.length)assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(items=>items.map(i=>i.dataset.c)),independent,record.name+' detail independent access');await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail',18);}assert.ok(await panel.locator('.combo-mark').evaluateAll((items,label)=>items.every(i=>i.getAttribute('role')==='img'&&i.getAttribute('aria-label').endsWith(label)),'WUBRG'.split('').some(color=>a.colors[color]?.status==='documented')?'combination':'combination only'));assert.equal(await panel.locator('.assessment-notes > p').first().textContent(),record.summary,record.name+' renders the authored mechanic explanation once');await panel.locator('.assessment-notes > summary').focus();await page.keyboard.press('Enter');const expected=buckets(record).map(b=>b.cards[0].url).sort();links+=expected.length;assert.equal(new Set(expected).size,expected.length,record.name+' unique links');if(record.kind==='access'){assert.deepEqual(await panel.locator('.assessment-example a').evaluateAll(items=>items.map(i=>i.href).sort()),expected,record.name+' exactly one selected link per bucket across detail');assert.equal(await panel.locator('.assessment-example').count(),expected.length,record.name+' exact selected example count');}else assert.equal(await panel.locator('.assessment-example').count(),0,record.name+' rules-only assessment adds no access witness');assert.deepEqual(await panel.locator('.assessment-sources a').evaluateAll(items=>items.map(i=>i.href)),record.sources.map(s=>s.url));assert.ok(await page.locator('#detail a').evaluateAll(items=>items.every(i=>i.protocol==='https:'&&['scryfall.com','magic.wizards.com','media.wizards.com'].includes(i.hostname)&&i.rel.includes('noopener'))));const state=await page.locator('#detail').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));return {tokens:[...copy.textContent.matchAll(/\{[^{}\r\n]+\}/g)].map(m=>m[0]),rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms'),'::before').content,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})),visible:el.innerText};});assert.deepEqual(state.rendered.map(s=>s.raw),state.tokens,record.name+' every actual assessment/rules/reference token rendered');assert.doesNotMatch(state.visible,/\{[^{}\r\n]+\}/);assert.ok(state.rendered.every(s=>s.label&&s.fallback==='none'&&!['none','normal','""'].includes(s.glyph)));actualTokens.set(record.name,state.tokens);await page.setViewportSize({width:360,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),record.name+' 360px containment');await page.setViewportSize({width:1440,height:900});}
    assert.equal(links,221,'all S selected bucket links render once');console.error('S check: all40 entries/221links PASS; font fallback and escaped fixtures');
  const noFont=await browser.newPage();await noFont.route('**/mana-font@1.18.0/**',r=>r.abort());await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');for(const record of records){await noFont.evaluate(id=>VMX.open(id),record.id);await noFont.locator('.assessment-notes > summary').click();const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));assert.deepEqual(symbols.map(s=>s.raw),actualTokens.get(record.name),record.name+' same tokens with blocked font');assert.ok(symbols.every(s=>s.text===s.raw&&s.label&&s.glyph==='none'),record.name+' accessible text fallback');}await noFont.close();
  const tokenText='{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {12} {W} {U} {B} {R} {G} {C} {X} {B/G} {G/U} {B/R} {G/W} {U/R} {W/B} {U/B} {R/G} {R/W} {W/U} {S} {T}',unsafe='<img src=x onerror=alert(1)> {unknown} '+tokenText;
  for(const blocked of [false,true]){const fixture=await browser.newPage(),data=structuredClone(supplement),p=structuredClone(payload),scopes=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement-scope.v1.json'),'utf8'));if(blocked)await fixture.route('**/mana-font@1.18.0/**',r=>r.abort());for(const source of sourceRecords){const item=data.records.find(r=>r.id===source.mechanic.accepted_id);item.clauses=[{number:'fixture',text:unsafe}];item.reference={title:'Fixture',verification:'fixture',rules:[],summary:unsafe,source:{title:'Fixture',url:'https://magic.wizards.com/en/news/feature/mystery-booster-release-notes-2019-11-11'}};}const hash=createHash('sha256').update(JSON.stringify(data)).digest('hex');scopes.payloadCanonicalSha256=hash;p.supplementCanonicalSha256=hash;for(const record of p.records.filter(r=>r.name.startsWith('S')&&r.name!=='Scry'))record.summary=unsafe;await fixture.route('**/data/mechanics-supplement.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(data)}));await fixture.route('**/data/mechanics-supplement-scope.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(scopes)}));await fixture.route(assessmentRoute,r=>r.fulfill({contentType:'application/json',body:JSON.stringify(p)}));await fixture.goto(url);await fixture.waitForFunction(()=>VMX.assessments().status==='ready');if(!blocked)await fixture.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));for(const record of records){await fixture.evaluate(id=>VMX.open(id),record.id);await fixture.locator('.assessment-notes > summary').click();for(const selector of ['.assessment-notes > p','#detail .supp-rules .dx-ex','#detail .supp-reference .supp-quote']){const prose=fixture.locator(selector).first();assert.equal(await prose.locator('img').count(),0,record.name+' fixture escapes markup');assert.ok((await prose.textContent()).includes('<img src=x onerror=alert(1)> {unknown}'));const symbols=await prose.locator('.supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,label:s.getAttribute('aria-label'),role:s.getAttribute('role'),glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})));assert.deepEqual(symbols.map(s=>s.raw),tokenText.split(' '),record.name+' fixture tokens in '+selector);assert.ok(symbols.every(s=>s.role==='img'&&s.label&&(blocked?s.glyph==='none'&&s.text===s.raw&&s.fallback!=='none':s.glyph!=='none'&&s.fallback==='none')),record.name+' fixture glyph/fallback in '+selector);}}await fixture.close();}  for(const scenario of ['missing','date','status','unsafe','binding']){const failure=await browser.newPage(),bad=structuredClone(payload),r=bad.records.find(r=>r.name==='Saddle');if(scenario==='date')r.researchDate='2026-10-29';if(scenario==='status')r.access.colors.W.status='invented';if(scenario==='unsafe'&&r.access.colors.W.cards.length)r.access.colors.W.cards[0].url='https://scryfall.com@evil.example/';if(scenario==='binding')bad.sourceBindings.at(-1).path='tampered.json';await failure.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));await failure.goto(url);await failure.waitForFunction(()=>VMX.assessments().status==='unavailable');assert.equal(await failure.evaluate(()=>VMX.assessments().records.length),0);await failure.close();}
  await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');});assert.equal(await page.evaluate(math),baseline);results.push('S focused browser check: 40 unmapped targets, saved objects/receipts, list/search/detail links, mana fallback, malformed isolation, keyboard, 360px containment, baseline output parity and frozen math.');
}async function checkP(page,browser,baseline){
  const maps={"Pack tactics":["R","G","RG"],"Parade!":["W"],"Paradigm":["W","U","B","R","G"],"Paradox":["U","R","G","UG"],"Parley":["W","U","G","WRG","WG","UR"],"Partner":["W","U","B","R","G","C","WU","WB","WR","WG","UB","UR","UG","BR","BG","RG"],"Persist":["W","U","B","R","G","C","WB","WG","UB","UG","BR","BG","RG"],"Phasing":["W","U","B","R","G","C","WUBRG","WUG","WB","UB","UR","UG"],"Plot":["W","U","B","R","G","WUG","UR","UG","BG"],"Populate":["W","B","R","G","WUR","WRG","WG","UBG"],"Power-up":["W","U","B","R","G","C","WBR","WG","UG","RG"],"Proliferate":["W","U","B","R","G","C","WUBG","WUR","WUG","WB","WG","UBG","UG","BG"],"Prototype":["W","U","B","R","G","C"],"Provoke":["W","R","G"],"Prowl":["U","B","R"],"Partner with":["W","U","B","R","G","WU","WB","WG","UB","UR","UG","BR","BG","RG"],"Plainscycling":["W","WU","WG"],"Prepared":["W","U","B","R","G","C","WU","WB","WR","WG","UB","UR","UG","BR","BG","RG"],"Plainswalk":["W","R","G"],"Poisonous":["B","G"],"Planeswalk":["W","U","B","R","G","C"],"Play":[]};
  const records=payload.records.filter(r=>r.name.startsWith('P'));
  const buckets=r=>[...Object.values(r.access.colors).filter(b=>b.status==='documented'),...r.access.combinations,...(r.access.colorless.status==='documented'?[r.access.colorless]:[])];
  assert.equal(records.length,22);assert.equal(records.flatMap(buckets).length,157);assert.equal(payload.records.length,329);assert.equal(payload.sourceBindings.length,26);
  assert.equal(createHash('sha256').update(JSON.stringify(payload.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')&&!r.name.startsWith('P')))).digest('hex'),'d70f8716c4b25501982bf640f08449604388ab217438b764e0f9eae4bf7c67b3','all 244 prior A–O rows unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(payload.sourceBindings.slice(0,23))).digest('hex'),'b9ca0c573a0feb67110ec3769a4053e820c8470b071179340e78ab2682d91981','all 23 prior bindings unchanged');
  assert.equal(records.find(r=>r.name==='Protection'),undefined);assert.equal(records.find(r=>r.name==='Prowess'),undefined);
  const packet=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/p-protocol.json'),'utf8'));
  assert.doesNotMatch(JSON.stringify(packet),/\uFFFD|TODO/);
  const receipts=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/p-protocol-evidence/complete-oracle-retrieval-receipts.json'),'utf8')).retrievals;
  assert.equal(receipts.length,22);
  for(const receipt of receipts){
    const raw=fs.readFileSync(path.join(root,receipt.path));assert.equal(createHash('sha256').update(raw).digest('hex'),receipt.rawSha256);assert.equal(receipt.status,200);
    assert.equal(new URL(receipt.url).hostname,'api.scryfall.com');assert.equal(new URL(receipt.url).searchParams.get('q'),receipt.query);assert.equal(receipt.method,'GET');
    assert.ok(Number.isFinite(Date.parse(receipt.requestStartedUtc))&&Date.parse(receipt.requestStartedUtc)<=Date.parse(receipt.requestEndedUtc));
    const body=JSON.parse(raw);assert.equal(body.has_more,false);assert.equal(body.data.length,body.total_cards,'complete single-page response');
  }
  const ordinary=c=>c.games.includes('paper')&&!c.digital&&c.released_at<='2026-10-30'&&c.security_stamp!=='acorn'&&!['silver','gold'].includes(c.border_color)&&!c.promo_types?.includes('playtest')&&(!['funny','memorabilia','token'].includes(c.set_type)||c.set==='unf')&&!['token','double_faced_token','emblem','planar','scheme','vanguard','augment','host','art_series'].includes(c.layout)&&!/\b(?:Token|Stickers|Plane|Phenomenon|Vanguard|Scheme|Conspiracy)\b/.test(c.type_line);
  const faceColors=f=>[...'WUBRG'].filter(c=>(f.colors||f.color_indicator||f.mana_cost?.match(/[WUBRG]/g)||[]).includes(c));
  const qualifies=(name,c,f)=>{
    const t=f.oracle_text||'';
    if(name==='Partner')return /^Partner(?:\s*\(|\s*$)/m.test(t);
    if(name==='Partner with')return /^Partner with /m.test(t);
    if(name==='Power-up')return /^Power-up [—-]/m.test(t);
    if(name==='Prowl')return /(?:^Prowl |have prowl )\{/mi.test(t);
    if(['Pack tactics','Paradox','Parley'].includes(name))return new RegExp('^'+name+' [—-]','mi').test(t);
    if(name==='Phasing')return !['Spatial Binding','The War Doctor'].includes(c.name)&&/\bphasing\b|\bphases? out\b/i.test(t);
    if(name==='Plot')return /^Plot \{|\b(?:has plot|becomes plotted|become plotted|are plotted)\b/mi.test(t);
    if(name==='Prepared')return /\b(?:enters prepared|becomes prepared|become prepared)\b/i.test(t);
    if(name==='Plainswalk')return !['Great Wall','Lord Magnus','Magical Hack','Whim of Volrath'].includes(c.name)&&/\bplainswalk\b/i.test(t);
    if(name==='Proliferate')return !['Venser, Corpse Puppet','Voidwing Hybrid','Scheming Aspirant','Tekuthal, Inquiry Dominus'].includes(c.name)&&/\bproliferate\b/i.test(t);
    if(name==='Provoke')return c.name!=='Provoke the Trolls'&&/\bprovoke\b/i.test(t);
    return t.toLowerCase().includes(name.toLowerCase());
  };
  for(const r of packet.records){
    if(r.mechanic.name==='Play'){assert.equal(r.card_review.length,0);continue;}
    const query=r.queries.find(q=>q.kind==='fresh_complete_oracle_discovery'),receipt=receipts.find(x=>x.path===query.path),body=JSON.parse(fs.readFileSync(path.join(root,query.path),'utf8'));
    assert.equal(query.rawSha256,receipt.rawSha256);assert.equal(query.url,receipt.url);
    const signatures=new Set();
    for(const fact of body.data)if(ordinary(fact))for(const face of fact.card_faces||[fact])if(qualifies(r.mechanic.name,fact,face)){
      signatures.add(faceColors(face).join('')||'C');
      if(r.mechanic.name==='Prototype'){const cost=face.oracle_text.match(/Prototype ((?:\{[^}]+\})+)/)[1];signatures.add([...'WUBRG'].filter(c=>cost.includes(c)).join(''));}
    }
    assert.deepEqual([...signatures].sort(),maps[r.mechanic.name].slice().sort(),r.mechanic.name+' complete eligible source/face signature screen');
    for(const card of r.card_review){
      const raw=fs.readFileSync(path.join(root,card.evidence_binding.path));assert.equal(createHash('sha256').update(raw).digest('hex'),card.evidence_binding.sha256);
      const fact=JSON.parse(raw).data.find(c=>c.oracle_id===card.oracle_id);assert.deepEqual(card.card_facts,fact);assert.equal(card.scryfall_url,fact.scryfall_uri);
      if(!card.included)continue;
      assert.ok(ordinary(fact),card.name+' released ordinary-paper scope');assert.equal(card.scope,'released paper');assert.equal(card.evidence_binding.sha256,receipt.rawSha256);
      const face=fact.card_faces?.find(f=>f.name===card.mechanic_face)||fact;assert.ok(qualifies(r.mechanic.name,fact,face));
      const actual=r.mechanic.name==='Prototype'&&card.characteristic_variant==='prototyped'?[...'WUBRG'].filter(c=>face.oracle_text.match(/Prototype ((?:\{[^}]+\})+)/)[1].includes(c)):faceColors(face);
      assert.deepEqual(card.attributed_colors,actual,card.name+' actual face/rules-defined variant colors');
      const note=buckets(records.find(x=>x.name===r.mechanic.name)).find(b=>b.cards[0].name===card.name).note;
      if(r.mechanic.name==='Power-up')assert.ok(note.includes(face.oracle_text.match(/^Power-up — ((?:\{[^}]+\})+)/m)[1]),card.name+' full cost');
      if(r.mechanic.name==='Prowl')assert.ok(note.includes(face.oracle_text.match(/prowl ((?:\{[^}]+\})+)/i)[1]),card.name+' complete prowl cost');
      if(r.mechanic.name==='Plainscycling')assert.match(note,/plainscycling \{2\}/i);
    }
  }
  assert.equal(packet.records.find(r=>r.mechanic.name==='Provoke').card_review.find(c=>c.name==='Squishy Sphinx Ninja').included,false);
  const proto=packet.records.find(r=>r.mechanic.name==='Prototype');assert.equal(proto.inherited_reference.fresh_retrieval,false);
  const rules=fs.readFileSync(path.join(root,proto.inherited_reference.capture),'utf8');assert.match(rules,/718\.3b[^\n]*spell and the permanent it becomes are also that color or colors/);assert.match(rules,/718\.4[^\n]*normal characteristics/);
  await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
  const actualTokens=new Map();let links=0;
  for(const record of records){
    const a=record.access, independent=[...'WUBRG'].filter(c=>a.colors[c].status==='documented').concat(a.colorless.status==='documented'?['C']:[]), combos=a.combinations.map(b=>b.colors.join(''));
    assert.deepEqual([...independent.filter(c=>c!=='C'),...combos,...independent.includes('C')?['C']:[]].sort(),maps[record.name].slice().sort(),record.name+' exact observed map');
    assert.ok(buckets(record).every(b=>b.cards.length===1));
    await page.evaluate(()=>VMX.setView('az'));const row=page.locator(`#list .ent[data-k="${record.id}"]`);
    assert.equal(await row.locator('.access-strip').count(),record.kind==='access'?1:0);
    assert.deepEqual(await row.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' list combinations');
    assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(items=>items.filter(i=>i.classList.contains('a-d')).map(i=>i.dataset.c)),independent);
    await page.locator('#q').fill(record.name);await page.locator('#q').focus();const option=page.locator(`#res-list .opt[data-k="${record.id}"]`);await option.waitFor({state:'visible'});
    assert.deepEqual(await option.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' actual search combinations');
    if(record.kind==='access')await checkAccessSizes(row,record.name+' list',18);await checkCIVectors(row,record.name+' list',18);if(record.kind==='access')await checkAccessSizes(option,record.name+' search',18);await checkCIVectors(option,record.name+' search',18);
    await page.locator('#q').fill('');await page.evaluate(id=>VMX.open(id),record.id);
    const panel=page.locator('#detail .supp-assessment');assert.match(await panel.innerText(),/October 30, 2026/);
    if(record.kind==='access')assert.equal(await panel.locator(':scope > .dx-note').first().innerText(),record.scopeLabel+'.','scope label does not repeat the definition');
    assert.equal(await panel.locator('.assessment-notes > p').first().textContent(),record.summary,'mechanic explanation appears once before card-specific notes');
    assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' detail combinations');
    if(combos.length)assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(items=>items.map(i=>i.dataset.c)),independent);
    await panel.locator('.assessment-notes > summary').focus();await page.keyboard.press('Enter');
    const expected=buckets(record).map(b=>b.cards[0].url).sort();links+=expected.length;assert.equal(new Set(expected).size,expected.length,record.name+' selected hrefs are unique');
    assert.deepEqual(await page.locator('#detail a').evaluateAll(items=>items.filter(i=>i.hostname==='scryfall.com'&&i.pathname.startsWith('/card/')).map(i=>i.href).sort()),expected,record.name+' exactly one selected link per bucket in whole detail');
    if(record.kind==='access')await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail',18);
    assert.equal(await panel.locator('.assessment-example').count(),expected.length);
    assert.equal(await panel.locator('.assessment-notes details').count(),0);
    assert.doesNotMatch(await panel.innerText(),/Selected .*document|presence evidence|independent example|reviewed scope|unselected discovery|individually reviewed|narrow witness|name matches/i);
    assert.deepEqual(await panel.locator('.assessment-sources a').evaluateAll(items=>items.map(i=>i.href)),record.sources.map(s=>s.url));
    assert.ok(await page.locator('#detail a').evaluateAll(items=>items.every(i=>i.protocol==='https:'&&['scryfall.com','magic.wizards.com','media.wizards.com'].includes(i.hostname)&&i.rel.includes('noopener'))));
    await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    const state=await page.locator('#detail').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));return {tokens:[...copy.textContent.matchAll(/\{[^{}\r\n]+\}/g)].map(m=>m[0]),rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({token:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms'),'::before').content,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})),visible:el.innerText};});
    assert.deepEqual(state.rendered.map(s=>s.token),state.tokens,record.name+' every actual prose/rule/reference token rendered');assert.doesNotMatch(state.visible,/\{[^{}\r\n]+\}/);
    assert.ok(state.rendered.every(s=>s.label&&s.fallback==='none'&&!['none','normal','""'].includes(s.glyph)));actualTokens.set(record.name,state.tokens);
    assert.ok(await page.locator('#detail .combo-mark').evaluateAll((items,label)=>items.every(i=>i.getAttribute('role')==='img'&&i.getAttribute('aria-label').endsWith(label)),'WUBRG'.split('').some(color=>record.access.colors[color].status==='documented')?'combination':'combination only'));
    await page.setViewportSize({width:360,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),record.name+' narrow containment');await page.setViewportSize({width:1440,height:900});
  }
  assert.equal(links,157);
  const tokenText='{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {12} {W} {U} {B} {R} {G} {C} {X} {B/G} {G/U} {B/R} {G/W} {U/R} {W/B} {U/B} {R/G} {R/W} {W/U} {S} {T}',unsafe='<img src=x onerror=alert(1)> {unknown} '+tokenText;
  for(const blocked of [false,true]){
    const fixture=await browser.newPage();if(blocked)await fixture.route('**/mana-font@1.18.0/**',route=>route.abort());
    const data=structuredClone(supplement),p=structuredClone(payload),scopes=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement-scope.v1.json'),'utf8'));
    for(const r of data.records.filter(r=>r.name.startsWith('P')&&r.target2021===null)){r.clauses=[{number:'fixture',text:unsafe}];r.reference={title:'Fixture',verification:'fixture',rules:[],summary:unsafe,source:{title:'Fixture',url:'https://magic.wizards.com/en/news/feature/mystery-booster-release-notes-2019-11-11'}};}
    const hash=createHash('sha256').update(JSON.stringify(data)).digest('hex');scopes.payloadCanonicalSha256=hash;p.supplementCanonicalSha256=hash;for(const r of p.records.filter(r=>r.name.startsWith('P')))r.summary=unsafe;
    await fixture.route('**/data/mechanics-supplement.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(data)}));await fixture.route('**/data/mechanics-supplement-scope.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(scopes)}));await fixture.route(assessmentRoute,r=>r.fulfill({contentType:'application/json',body:JSON.stringify(p)}));
    await fixture.goto(url);await fixture.waitForFunction(()=>VMX.assessments().status==='ready');if(!blocked)await fixture.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    for(const record of records){await fixture.evaluate(id=>VMX.open(id),record.id);await fixture.locator('.assessment-notes > summary').click();
      for(const selector of ['.assessment-notes > p','#detail .supp-rules .dx-ex','#detail .supp-reference .supp-quote']){
        const prose=fixture.locator(selector).first();assert.equal(await prose.locator('img').count(),0);assert.ok((await prose.textContent()).includes('<img src=x onerror=alert(1)> {unknown}'));
        const symbols=await prose.locator('.supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,role:s.getAttribute('role'),label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display,before:getComputedStyle(s.querySelector('.ms'),'::before').content,after:getComputedStyle(s.querySelector('.ms'),'::after').content})));
        assert.deepEqual(symbols.map(s=>s.raw),tokenText.split(' '),record.name+' all fixture tokens across '+selector);assert.ok(symbols.every(s=>s.label&&s.role==='img'&&(blocked?s.glyph==='none'&&s.text===s.raw&&s.fallback!=='none':s.glyph!=='none'&&s.fallback==='none'&&!['none','normal','""'].includes(s.before)&&(s.raw.includes('/')?!['none','normal','""'].includes(s.after):true))));
      }
    }await fixture.close();
  }
  const noFont=await browser.newPage();await noFont.route('**/mana-font@1.18.0/**',r=>r.abort());await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');await noFont.evaluate(()=>VMX.setView('az'));
  for(const record of records){await noFont.evaluate(id=>VMX.open(id),record.id);await noFont.locator('.assessment-notes > summary').click();
    const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));assert.deepEqual(symbols.map(s=>s.raw),actualTokens.get(record.name));assert.ok(symbols.every(s=>s.raw===s.text&&s.label&&s.glyph==='none'));
    if(record.kind==='access')await checkAccessSizes(noFont.locator('#detail .supp-assessment'),record.name+' fallback detail',18,true);
    const fallbackRow=noFont.locator(`#list .ent[data-k="${record.id}"]`);if(record.kind==='access')await checkAccessSizes(fallbackRow,record.name+' fallback list',18,true);
    await noFont.locator('#q').fill(record.name);await noFont.locator('#q').focus();const fallbackOption=noFont.locator(`#res-list .opt[data-k="${record.id}"]`);await fallbackOption.waitFor({state:'visible'});if(record.kind==='access')await checkAccessSizes(fallbackOption,record.name+' fallback search',18,true);await noFont.locator('#q').fill('');
    assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(items=>items.every(i=>getComputedStyle(i.querySelector('svg,.ms')).display==='none'&&i.innerText===i.dataset.combo)),record.name+' no-font combinations');
  }await noFont.close();
  for(const scenario of ['missing','date','status','unsafe','binding']){const failure=await browser.newPage(),bad=structuredClone(payload),r=bad.records.find(r=>r.name==='Pack tactics');if(scenario==='date')r.researchDate='2026-10-28';if(scenario==='status')r.access.colors.R.status='invented';if(scenario==='unsafe')r.access.colors.R.cards[0].url='https://scryfall.com@evil.example/';if(scenario==='binding')bad.sourceBindings.at(-1).path='tampered.json';await failure.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));await failure.goto(url);await failure.waitForFunction(()=>VMX.assessments().status==='unavailable');assert.equal(await failure.evaluate(()=>VMX.assessments().records.length),0);await failure.evaluate(()=>VMX.open('deck:vocabulary:pack tactics'));assert.ok(await failure.locator('#detail .supp-rules').count());await failure.close();}
  await page.locator('#q').fill('Pack tactics');await page.locator('#q').focus();await page.locator('#q').press('Enter');assert.equal(await page.locator('#dx-title').innerText(),'Pack tactics');await page.locator('#q').fill('');
  await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');});assert.equal(await page.evaluate(math),baseline);
  results.push('All 22 P records / 157 exact unique selected links: complete fresh receipts and objects, actual face/source colors, list/search/detail combinations, concise definitions, actual and fixture symbols in assessment/rules/references, escaping, accessible labels, blocked-font fallback, malformed isolation, keyboard, narrow containment and unchanged frozen math.');
}
async function checkO(page,browser,baseline){
  const records=payload.records.filter(r=>r.name.startsWith('O'));
  const maps={Offering:['W','U','B','R','G'],Offspring:['W','U','B','R','G','WUR'],'Open an Attraction':['W','U','B','R','G','UB','UR','BG','C'],Opus:['U','R','UR'],Outlast:['W','B','G','WG'],Overload:['W','U','B','R','G','UR','C']};
  const buckets=r=>[...Object.values(r.access.colors).filter(b=>b.status==='documented'),...r.access.combinations,...(r.access.colorless.status==='documented'?[r.access.colorless]:[])];
  assert.equal(records.length,6);assert.equal(records.flatMap(buckets).length,34);assert.equal(payload.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')&&!r.name.startsWith('P')).length,244);assert.equal(payload.sourceBindings.slice(0,23).length,23);
  assert.equal(createHash('sha256').update(JSON.stringify(payload.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')&&!r.name.startsWith('O')&&!r.name.startsWith('P')))).digest('hex'),'764869dcccf2a03250329d29005f135c934c832fa1bc8c922dee4750dd10d763','all 238 A–N rows unchanged');
  assert.equal(createHash('sha256').update(JSON.stringify(payload.sourceBindings.slice(0,22))).digest('hex'),'c95632b2c1ad6b5a609bedaa47a91b555de63163aeaac89f399c0fde7d1ca5e7','all 22 A–N bindings unchanged');
  const packet=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/o-protocol.json'),'utf8'));
  assert.doesNotMatch(JSON.stringify(packet),/\uFFFD/,'authored O text has no replacement characters');
  const receipts=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/o-protocol-evidence/retrieval-receipts.json'),'utf8')).retrievals;
  assert.equal(receipts.length,14);
  for(const receipt of receipts){
    const raw=fs.readFileSync(path.join(root,receipt.path));assert.equal(createHash('sha256').update(raw).digest('hex'),receipt.rawSha256);
    assert.equal(receipt.status,200);assert.ok(['api.scryfall.com','magic.wizards.com'].includes(new URL(receipt.url).hostname));
    assert.ok(Number.isFinite(Date.parse(receipt.requestStartedUtc))&&Date.parse(receipt.requestStartedUtc)<=Date.parse(receipt.requestEndedUtc));
    if(receipt.path.endsWith('.html')){assert.match(raw.toString('utf8'),/Opus \(Prismari\)/);assert.match(raw.toString('utf8'),/five or more mana/);continue;}
    const body=JSON.parse(raw);if(receipt.method==='GET')assert.equal(body.has_more,false,'discovery capture is complete');
    if(receipt.method==='POST'){const request=fs.readFileSync(path.join(root,receipt.requestBodyPath));assert.equal(createHash('sha256').update(request).digest('hex'),receipt.requestBodySha256);assert.equal(JSON.parse(request).identifiers.length,34);assert.equal(body.data.length,34);assert.deepEqual(body.not_found,[]);}
  }
  const ordinary=fact=>fact.games.includes('paper')&&!fact.digital&&fact.released_at<='2026-10-30'&&fact.security_stamp!=='acorn'&&fact.border_color!=='silver'&&(!['funny','token','memorabilia'].includes(fact.set_type)||fact.set==='unf')&&!['token','double_faced_token','emblem','planar','scheme','augment','host'].includes(fact.layout)&&!/\b(?:Stickers|Token|Scheme|Plane|Vanguard|Conspiracy)\b/.test(fact.type_line);
  const patterns={Offering:/^\w+ offering(?:\s*\(|\s*$)|\b(?:has|have|gain|gains) [^\n.]*\boffering\b/mi,Offspring:/\boffspring\b/i,'Open an Attraction':/\bopens? an Attraction\b/i,Opus:/^Opus\s+[\u2014-]/mi,Outlast:/\boutlast\b/i,Overload:/^Overload\s+\{/mi};
  for(const r of packet.records)for(const card of r.card_review){
    const raw=fs.readFileSync(path.join(root,card.evidence_binding.path)),receipt=receipts.find(x=>x.path===card.evidence_binding.path);
    assert.equal(createHash('sha256').update(raw).digest('hex'),card.evidence_binding.sha256);assert.equal(receipt.rawSha256,card.evidence_binding.sha256);
    const fact=JSON.parse(raw).data.find(c=>c.oracle_id===card.oracle_id),face=fact.card_faces?.find(f=>f.name===card.mechanic_face)||fact;
    assert.deepEqual(card.card_facts,fact);assert.deepEqual(card.attributed_colors,[...'WUBRG'].filter(c=>face.colors.includes(c)));
    assert.ok(JSON.parse(fs.readFileSync(path.join(root,receipt.requestBodyPath),'utf8')).identifiers.some(i=>i.id===fact.id||i.name===fact.name));assert.ok(ordinary(fact),card.name+' ordinary released paper scope');
    assert.match(face.oracle_text,patterns[r.mechanic.name]);assert.equal(card.scryfall_url,fact.scryfall_uri);
    if(r.mechanic.name==='Open an Attraction')assert.equal(fact.legalities.commander,'legal','ordinary Unfinity retained');
    const note=buckets(records.find(x=>x.name===r.mechanic.name)).find(b=>b.cards[0].name===card.name).note;
    const cost=face.oracle_text.match(new RegExp('(?:Offspring|Outlast|Overload) ((?:\\{[^}]+\\})+)','i'))?.[1];
    if(cost)assert.ok(note.includes(cost),card.name+' complete exact mechanic cost');
    if(r.mechanic.name==='Outlast')assert.ok(note.includes(', {T}'),card.name+' full activation cost includes tapping');
    assert.doesNotMatch(note,/is the (?:[WUBRG]+|colorless) example|has offering\{|open an attraction\{/i);
    if(card.name==="Zinnia, Valley's Voice")assert.deepEqual(card.roles,['explicit_grant']);
    if(card.name==='Arcus Acolyte'){assert.ok(card.roles.includes('explicit_grant'));assert.match(note,/each other creature you control without a \+1\/\+1 counter/);}
  }
  // Screen signatures from full Oracle text, including grants/reminders; names and payoffs do not qualify.
  for(const [name,pattern] of Object.entries(patterns)){
    const file=name.toLowerCase().replaceAll(' ','-')+'-full-oracle-discovery.json',body=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/o-protocol-evidence',file),'utf8')),signatures=new Set();
    for(const fact of body.data){if(!ordinary(fact))continue;for(const face of fact.card_faces||[fact])if(pattern.test(face.oracle_text||''))signatures.add([...'WUBRG'].filter(c=>face.colors.includes(c)).join('')||'C');}
    assert.deepEqual([...signatures].sort(),maps[name].slice().sort(),name+' complete discovered source/face signature screen');
    const query=packet.records.find(r=>r.mechanic.name===name).queries.find(q=>q.kind==='fresh_full_oracle_discovery');assert.equal(new URL(query.url).searchParams.get('q'),'fo:"'+name.toLowerCase()+'"');assert.equal(query.rawSha256,receipts.find(r=>r.path===query.path).rawSha256);
  }
  const opus=packet.records.find(r=>r.mechanic.name==='Opus');assert.match(opus.inherited_reference.url,/release-notes$/);assert.match(opus.sources[0].url,/mechanics$/);assert.equal(opus.queries.filter(q=>q.kind==='fresh_official_mechanics').length,1);
  await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
  const actualTokens=new Map();let links=0;
  for(const record of records){
    const a=record.access, independent=[...'WUBRG'].filter(c=>a.colors[c].status==='documented').concat(a.colorless.status==='documented'?['C']:[]), combos=a.combinations.map(b=>b.colors.join(''));
    assert.deepEqual([...independent.filter(c=>c!=='C'),...combos,...independent.includes('C')?['C']:[]],maps[record.name],record.name+' exact observed map');
    assert.ok(buckets(record).every(b=>b.cards.length===1));
    await page.evaluate(()=>VMX.setView('az'));const row=page.locator(`#list .ent[data-k="${record.id}"]`);
    assert.equal(await row.locator('.access-strip').count(),1);
    assert.deepEqual(await row.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' list combinations');
    assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(items=>items.filter(i=>i.classList.contains('a-d')).map(i=>i.dataset.c)),independent);
    await page.locator('#q').fill(record.name);await page.locator('#q').focus();const option=page.locator(`#res-list .opt[data-k="${record.id}"]`);await option.waitFor({state:'visible'});
    assert.deepEqual(await option.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' actual search combinations');
    await checkAccessSizes(row,record.name+' list',18);await checkCIVectors(row,record.name+' list',18);await checkAccessSizes(option,record.name+' search',18);await checkCIVectors(option,record.name+' search',18);
    await page.locator('#q').fill('');await page.evaluate(id=>VMX.open(id),record.id);
    const panel=page.locator('#detail .supp-assessment');assert.match(await panel.innerText(),/October 30, 2026/);
    assert.equal(await panel.locator(':scope > .dx-note').first().innerText(),record.scopeLabel+'.','scope label does not repeat the definition');
    assert.equal(await panel.locator('.assessment-notes > p').first().textContent(),record.summary,'mechanic explanation appears once before card-specific notes');
    assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos,record.name+' detail combinations');
    if(combos.length)assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(items=>items.map(i=>i.dataset.c)),independent);
    await panel.locator('.assessment-notes > summary').focus();await page.keyboard.press('Enter');
    const expected=buckets(record).map(b=>b.cards[0].url).sort();links+=expected.length;assert.equal(new Set(expected).size,expected.length,record.name+' selected hrefs are unique');
    assert.deepEqual(await page.locator('#detail a').evaluateAll(items=>items.filter(i=>i.hostname==='scryfall.com'&&i.pathname.startsWith('/card/')).map(i=>i.href).sort()),expected,record.name+' exactly one selected link per bucket in whole detail');
    await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail',18);
    assert.equal(await panel.locator('.assessment-example').count(),expected.length);
    assert.equal(await panel.locator('.assessment-notes details').count(),0);
    assert.doesNotMatch(await panel.innerText(),/Selected .*document|presence evidence|independent example|reviewed scope|unselected discovery|individually reviewed|narrow witness|name matches/i);
    assert.deepEqual(await panel.locator('.assessment-sources a').evaluateAll(items=>items.map(i=>i.href)),record.sources.map(s=>s.url));
    assert.ok(await page.locator('#detail a').evaluateAll(items=>items.every(i=>i.protocol==='https:'&&['scryfall.com','magic.wizards.com','media.wizards.com'].includes(i.hostname)&&i.rel.includes('noopener'))));
    await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    const state=await page.locator('#detail').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));return {tokens:[...copy.textContent.matchAll(/\{[^{}\r\n]+\}/g)].map(m=>m[0]),rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({token:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms'),'::before').content,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})),visible:el.innerText};});
    assert.deepEqual(state.rendered.map(s=>s.token),state.tokens,record.name+' every actual prose/rule/reference token rendered');assert.doesNotMatch(state.visible,/\{[^{}\r\n]+\}/);
    assert.ok(state.rendered.every(s=>s.label&&s.fallback==='none'&&!['none','normal','""'].includes(s.glyph)));actualTokens.set(record.name,state.tokens);
    assert.ok(await page.locator('#detail .combo-mark').evaluateAll((items,label)=>items.every(i=>i.getAttribute('role')==='img'&&i.getAttribute('aria-label').endsWith(label)),'WUBRG'.split('').some(color=>record.access.colors[color].status==='documented')?'combination':'combination only'));
    await page.setViewportSize({width:360,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),record.name+' narrow containment');await page.setViewportSize({width:1440,height:900});
  }
  assert.equal(links,34);
  const tokenText='{0} {1} {2} {3} {4} {5} {6} {7} {8} {9} {12} {W} {U} {B} {R} {G} {C} {X} {B/G} {G/U} {B/R} {G/W} {U/R} {W/B} {U/B} {R/G} {R/W} {W/U} {S} {T}',unsafe='<img src=x onerror=alert(1)> {unknown} '+tokenText;
  for(const blocked of [false,true]){
    const fixture=await browser.newPage();if(blocked)await fixture.route('**/mana-font@1.18.0/**',route=>route.abort());
    const data=structuredClone(supplement),p=structuredClone(payload),scopes=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement-scope.v1.json'),'utf8'));
    for(const r of data.records.filter(r=>r.name.startsWith('O')&&r.target2021===null)){r.clauses=[{number:'fixture',text:unsafe}];r.reference={title:'Fixture',verification:'fixture',rules:[],summary:unsafe,source:{title:'Fixture',url:'https://magic.wizards.com/en/news/feature/mystery-booster-release-notes-2019-11-11'}};}
    const hash=createHash('sha256').update(JSON.stringify(data)).digest('hex');scopes.payloadCanonicalSha256=hash;p.supplementCanonicalSha256=hash;for(const r of p.records.filter(r=>r.name.startsWith('O')))r.summary=unsafe;
    await fixture.route('**/data/mechanics-supplement.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(data)}));await fixture.route('**/data/mechanics-supplement-scope.v1.json*',r=>r.fulfill({contentType:'application/json',body:JSON.stringify(scopes)}));await fixture.route(assessmentRoute,r=>r.fulfill({contentType:'application/json',body:JSON.stringify(p)}));
    await fixture.goto(url);await fixture.waitForFunction(()=>VMX.assessments().status==='ready');if(!blocked)await fixture.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    for(const record of records){await fixture.evaluate(id=>VMX.open(id),record.id);await fixture.locator('.assessment-notes > summary').click();
      for(const selector of ['.assessment-notes > p','#detail .supp-rules .dx-ex','#detail .supp-reference .supp-quote']){
        const prose=fixture.locator(selector).first();assert.equal(await prose.locator('img').count(),0);assert.ok((await prose.textContent()).includes('<img src=x onerror=alert(1)> {unknown}'));
        const symbols=await prose.locator('.supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,role:s.getAttribute('role'),label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display,before:getComputedStyle(s.querySelector('.ms'),'::before').content,after:getComputedStyle(s.querySelector('.ms'),'::after').content})));
        assert.deepEqual(symbols.map(s=>s.raw),tokenText.split(' '),record.name+' all fixture tokens across '+selector);assert.ok(symbols.every(s=>s.label&&s.role==='img'&&(blocked?s.glyph==='none'&&s.text===s.raw&&s.fallback!=='none':s.glyph!=='none'&&s.fallback==='none'&&!['none','normal','""'].includes(s.before)&&(s.raw.includes('/')?!['none','normal','""'].includes(s.after):true))));
      }
    }await fixture.close();
  }
  const noFont=await browser.newPage();await noFont.route('**/mana-font@1.18.0/**',r=>r.abort());await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');await noFont.evaluate(()=>VMX.setView('az'));
  for(const record of records){await noFont.evaluate(id=>VMX.open(id),record.id);await noFont.locator('.assessment-notes > summary').click();
    const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));assert.deepEqual(symbols.map(s=>s.raw),actualTokens.get(record.name));assert.ok(symbols.every(s=>s.raw===s.text&&s.label&&s.glyph==='none'));
    await checkAccessSizes(noFont.locator('#detail .supp-assessment'),record.name+' fallback detail',18,true);
    const fallbackRow=noFont.locator(`#list .ent[data-k="${record.id}"]`);await checkAccessSizes(fallbackRow,record.name+' fallback list',18,true);
    await noFont.locator('#q').fill(record.name);await noFont.locator('#q').focus();const fallbackOption=noFont.locator(`#res-list .opt[data-k="${record.id}"]`);await fallbackOption.waitFor({state:'visible'});await checkAccessSizes(fallbackOption,record.name+' fallback search',18,true);await noFont.locator('#q').fill('');
    assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(items=>items.every(i=>getComputedStyle(i.querySelector('svg,.ms')).display==='none'&&i.innerText===i.dataset.combo)),record.name+' no-font combinations');
  }await noFont.close();
  for(const scenario of ['missing','date','status','unsafe','binding']){const failure=await browser.newPage(),bad=structuredClone(payload),r=bad.records.find(r=>r.name==='Offering');if(scenario==='date')r.researchDate='2026-10-28';if(scenario==='status')r.access.colors.W.status='invented';if(scenario==='unsafe')r.access.colors.W.cards[0].url='https://scryfall.com@evil.example/';if(scenario==='binding')bad.sourceBindings.at(-1).path='tampered.json';await failure.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));await failure.goto(url);await failure.waitForFunction(()=>VMX.assessments().status==='unavailable');assert.equal(await failure.evaluate(()=>VMX.assessments().records.length),0);await failure.evaluate(()=>VMX.open('deck:vocabulary:offering'));assert.ok(await failure.locator('#detail .supp-rules').count());await failure.close();}
  await page.locator('#q').fill('Offering');await page.locator('#q').focus();await page.locator('#q').press('Enter');assert.equal(await page.locator('#dx-title').innerText(),'Offering');await page.locator('#q').fill('');
  await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');});assert.equal(await page.evaluate(math),baseline);
  results.push('All 6 O records / 34 exact unique selected links: complete fresh receipts and objects, actual face/source colors, list/search/detail combinations, concise definitions, actual and fixture symbols in assessment/rules/references, escaping, accessible labels, blocked-font fallback, malformed isolation, keyboard, narrow containment and unchanged frozen math.');
}
async function checkV(page,browser,baseline){
  const packet=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/v-protocol.json'),'utf8'));
  const receipts=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/v-protocol-evidence/retrieval-receipts.json'),'utf8')).retrievals;
  const frozen=JSON.parse(execFileSync('git',['show','8f20f1ba8d9ee64c51ae2265ecaf68bf158f3a95:data/mechanics-assessments.v1.json'],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}));
  const records=payload.records.filter(r=>r.name.startsWith('V')), buckets=r=>[...Object.values(r.access.colors).filter(b=>b.status==='documented'),...r.access.combinations,...(r.access.colorless.status==='documented'?[r.access.colorless]:[])];
  assert.equal(records.length,6);assert.equal(payload.records.length,360);assert.equal(payload.sourceBindings.length,29);assert.deepEqual(payload.records.filter(r=>!r.name.startsWith('V')),frozen.records);assert.deepEqual(payload.sourceBindings.slice(0,28),frozen.sourceBindings);
  const byPath=new Map(receipts.map(r=>[r.path,r]));assert.ok(receipts.length>=10);
  for(const r of receipts){assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,r.path))).digest('hex'),r.rawSha256);assert.equal(r.status,200);assert.ok(Date.parse(r.requestStartedUtc)<=Date.parse(r.requestEndedUtc));if(r.requestBodyPath)assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,r.requestBodyPath))).digest('hex'),r.requestBodySha256);}
  for(const r of packet.records){for(const card of r.card_review){const binding=card.evidence_binding,receipt=byPath.get(binding.path);assert.ok(receipt&&!receipt.bindingStatus?.startsWith('unbound'));assert.equal(binding.sha256,receipt.rawSha256);const raw=JSON.parse(fs.readFileSync(path.join(root,binding.path),'utf8')),fact=(raw.data||[raw]).find(c=>c.id===card.card_facts.id);assert.deepEqual(card.card_facts,fact);assert.equal(card.scryfall_url,fact.scryfall_uri);const face=fact.card_faces?.find(f=>f.name===card.mechanic_face)||fact;assert.deepEqual(card.attributed_colors,[...'WUBRG'].filter(c=>face.colors.includes(c)));assert.ok(fact.games.includes('paper')&&fact.released_at<='2026-10-31'&&!fact.promo_types?.includes('playtest'));assert.ok(!fact.digital&&fact.border_color!=='silver'&&fact.security_stamp!=='acorn'&&(!['funny','token','memorabilia'].includes(fact.set_type)||fact.set==='unf'));}}
  assert.match(records.find(r=>r.name==='Vanishing').summary,/without a number/i);
  assert.ok(!records.find(r=>r.name==='Vote').access.combinations.some(b=>b.colors.join('')==='UBR'),'vote modifiers alone do not establish direct-action access');
  assert.ok(packet.records.every(r=>r.card_review.every(c=>c.name!=='Kimahri, Valiant Guardian')),'name-only valiant results cannot establish access');
  const voteSource=packet.records.find(r=>r.mechanic.name==='Vote');
  assert.match(voteSource.access_review.scope,/released paper/i);assert.notEqual(voteSource.access_review.scope,voteSource.access_review.summary);
  // A modifier can mention "each player votes" without initiating a vote.
  for(const file of voteSource.discovery_screen.paths){const body=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));for(const card of body.data){if(/choose how each player votes/i.test(card.oracle_text||'')){assert.ok(!Object.hasOwn(voteSource.discovery_screen.qualifying_oracle_signatures,card.oracle_id),'vote-casting modifiers cannot enter the direct-action discovery map');assert.ok(Object.keys(voteSource.discovery_screen.exclusions).some(key=>key.startsWith(card.name+' [')));}}}
  const actualTokens=new Map();let links=0;
  for(const record of records){
    const source=packet.records.find(r=>r.mechanic.name===record.name),independent=[...'WUBRG'].filter(c=>record.access.colors[c].status==='documented').concat(record.access.colorless.status==='documented'?['C']:[]),combos=record.access.combinations.map(b=>b.colors.join(''));
    assert.deepEqual([...independent,...combos].sort(),source.discovery_screen.observed_qualifying_signatures.slice().sort());
    await page.evaluate(()=>VMX.setView('az'));const row=page.locator(`#list .ent[data-k="${record.id}"]`);await row.waitFor({state:'visible'});
    assert.equal(await row.locator('.access-strip').count(),record.kind==='access'?1:0);assert.deepEqual(await row.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos);
    if(record.kind==='access'){assert.deepEqual(await row.locator('.access-strip > .sc.a-d').evaluateAll(items=>items.map(i=>i.dataset.c)),independent);await checkAccessSizes(row,record.name+' list',18);await checkCIVectors(row,record.name+' list',18);}
    await row.click();assert.equal(await page.locator('#dx-title').innerText(),record.name);
    await page.locator('#q').fill(record.name);await page.locator('#q').focus();const option=page.locator(`#res-list .opt[data-k="${record.id}"]`);await option.waitFor({state:'visible'});
    assert.deepEqual(await option.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos);if(record.kind==='access'){assert.deepEqual(await option.locator('.access-strip > .sc.a-d').evaluateAll(items=>items.map(i=>i.dataset.c)),independent);await checkAccessSizes(option,record.name+' search',18);await checkCIVectors(option,record.name+' search',18);}
    await page.locator('#q').press('Enter');assert.equal(await page.locator('#dx-title').innerText(),record.name);const panel=page.locator('#detail .supp-assessment');assert.match(await panel.innerText(),/October 31, 2026/);
    assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos);if(record.kind==='access'){assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(items=>items.map(i=>i.dataset.c)),combos.length?independent:[...'WUBRG',...(record.access.colorless.status==='documented'?['C']:[])]);await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail',18);}
    assert.equal(await panel.locator('.assessment-notes > p').first().textContent(),record.summary);await panel.locator('.assessment-notes > summary').focus();await page.keyboard.press('Enter');
    const expected=buckets(record).map(b=>b.cards[0].url).sort();links+=expected.length;assert.equal(new Set(expected).size,expected.length);
    await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    assert.deepEqual(await page.locator('#detail a').evaluateAll(items=>items.filter(i=>i.hostname==='scryfall.com'&&i.pathname.startsWith('/card/')).map(i=>i.href).sort()),expected);assert.equal(await page.locator('#detail .dx-eg,#detail .cite').count(),0);
    assert.ok(await page.locator('#detail a').evaluateAll(items=>items.every(i=>i.protocol==='https:'&&['scryfall.com','magic.wizards.com','media.wizards.com'].includes(i.hostname)&&i.rel.includes('noopener'))));
    const state=await page.locator('#detail').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));return {tokens:[...copy.textContent.matchAll(/\{[^{}\r\n]+\}/g)].map(m=>m[0]),rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),role:s.getAttribute('role'),glyph:getComputedStyle(s.querySelector('.ms'),'::before').content,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})),visible:el.innerText};});
    assert.deepEqual(state.rendered.map(s=>s.raw),state.tokens,record.name+' all encountered assessment/rule/reference tokens');assert.ok(state.rendered.every(s=>s.label&&s.role==='img'&&s.fallback==='none'&&!['none','normal','""'].includes(s.glyph)));assert.doesNotMatch(state.visible,/\{[^{}\r\n]+\}/);actualTokens.set(record.name,state.tokens);
    await page.setViewportSize({width:360,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:1440,height:900});await page.locator('#q').fill('');
  }
  assert.equal(links,40);assert.ok(actualTokens.get('Venture into the Dungeon').includes('{T}'));
  const noFont=await browser.newPage();await noFont.route('**/mana-font@1.18.0/**',r=>r.abort());await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');
  for(const record of records){await noFont.evaluate(id=>VMX.open(id),record.id);await noFont.locator('.assessment-notes > summary').click();const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));assert.deepEqual(symbols.map(s=>s.raw),actualTokens.get(record.name));assert.ok(symbols.every(s=>s.raw===s.text&&s.label&&s.glyph==='none'));assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(items=>items.every(i=>getComputedStyle(i.querySelector('svg,.ms')).display==='none'&&i.innerText===i.dataset.combo)));}await noFont.close();
  for(const scenario of ['missing','date','status','unsafe','binding']){const failure=await browser.newPage(),bad=structuredClone(payload),r=bad.records.find(r=>r.name==='Valiant');if(scenario==='date')r.researchDate='2026-10-30';if(scenario==='status')r.access.colors.W.status='invented';if(scenario==='unsafe')r.access.colors.W.cards[0].url='https://scryfall.com@evil.example/';if(scenario==='binding')bad.sourceBindings.at(-1).path='tampered.json';await failure.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));await failure.goto(url);await failure.waitForFunction(()=>VMX.assessments().status==='unavailable');assert.equal(await failure.evaluate(()=>VMX.assessments().records.length),0);await failure.evaluate(()=>VMX.open('deck:catalog-gaps:untap'));assert.ok(await failure.locator('#detail .supp-rules').count());await failure.close();}
  const escaped=await browser.newPage(),safe=structuredClone(payload);safe.records.find(r=>r.name==='Valiant').access.colors.W.note='Literal <img src=x onerror=alert(1)> & {2}{U} {E}';await escaped.route(assessmentRoute,route=>route.fulfill({contentType:'application/json',body:JSON.stringify(safe)}));await escaped.goto(url);await escaped.waitForFunction(()=>VMX.assessments().status==='ready');await escaped.evaluate(()=>VMX.open('deck:vocabulary:valiant'));await escaped.locator('.assessment-notes > summary').click();assert.ok((await escaped.locator('#detail').innerText()).includes('<img src=x onerror=alert(1)>'));assert.equal(await escaped.locator('#detail img[src="x"]').count(),0);await escaped.close();
  await page.evaluate(()=>VMX.open('deck:vocabulary:scavenge'));await page.locator('.assessment-notes > summary').click();assert.equal(await page.locator('.assessment-example a').count(),3);assert.equal(await page.locator('#detail .dx-eg,#detail .cite').count(),0);
  await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');});assert.equal(await page.evaluate(math),baseline);
  results.push('All 6 V entries / 40 selected links: receipts/full objects/source-face colors, exact prior 354-row/28-binding parity, list/search/detail maps, keyboard, native glyphs and whole-detail cost tokens, font fallback, safe links/escaping, malformed isolation, 360px containment, Scavenge control and frozen math.');
}

async function checkU(page,browser,baseline){
  const packet=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/u-protocol.json'),'utf8'));
  const receipts=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/u-protocol-evidence/retrieval-receipts.json'),'utf8')).retrievals;
  const frozen=JSON.parse(execFileSync('git',['show','618a0a2aa74f4f0ebb1584b2e0e937817a29c9a8:data/mechanics-assessments.v1.json'],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}));
  const records=payload.records.filter(r=>r.name.startsWith('U')), buckets=r=>[...Object.values(r.access.colors).filter(b=>b.status==='documented'),...r.access.combinations,...(r.access.colorless.status==='documented'?[r.access.colorless]:[])];
  assert.equal(records.length,8);assert.equal(payload.sourceBindings.length,28);assert.deepEqual(payload.records.filter(r=>!r.name.startsWith('U')),frozen.records);assert.deepEqual(payload.sourceBindings.slice(0,27),frozen.sourceBindings);
  const byPath=new Map(receipts.map(r=>[r.path,r]));assert.equal(receipts.length,19);
  for(const r of receipts){assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,r.path))).digest('hex'),r.rawSha256);assert.equal(r.status,200);assert.ok(Date.parse(r.requestStartedUtc)<=Date.parse(r.requestEndedUtc));if(r.requestBodyPath)assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,r.requestBodyPath))).digest('hex'),r.requestBodySha256);}
  for(const r of packet.records){for(const card of r.card_review){const binding=card.evidence_binding,receipt=byPath.get(binding.path);assert.ok(receipt&&!receipt.bindingStatus?.startsWith('unbound'));assert.equal(binding.sha256,receipt.rawSha256);const raw=JSON.parse(fs.readFileSync(path.join(root,binding.path),'utf8')),fact=(raw.data||[raw]).find(c=>c.id===card.card_facts.id);assert.deepEqual(card.card_facts,fact);assert.equal(card.scryfall_url,fact.scryfall_uri);const face=fact.card_faces?.find(f=>f.name===card.mechanic_face)||fact;assert.deepEqual(card.attributed_colors,[...'WUBRG'].filter(c=>face.colors.includes(c)));assert.ok(fact.games.includes('paper')&&fact.released_at<='2026-10-31');if(r.mechanic.name!=='Underdog')assert.ok(!fact.digital&&fact.border_color!=='silver'&&fact.security_stamp!=='acorn'&&!['funny','token','memorabilia'].includes(fact.set_type));}}
  assert.ok(records.find(r=>r.name==='Umbra Armor').access.combinations.some(b=>b.colors.join('')==='WUG'&&b.cards[0].name==='Estrid, the Masked'));
  assert.match(records.find(r=>r.name==='Unearth').access.colors.W.note,/eight \{E\}/);assert.doesNotMatch(records.find(r=>r.name==='Umbra Armor').access.colors.U.note,/\+1\/\+1/);
  const actualTokens=new Map();let links=0;
  for(const record of records){
    const source=packet.records.find(r=>r.mechanic.name===record.name),independent=[...'WUBRG'].filter(c=>record.access.colors[c].status==='documented').concat(record.access.colorless.status==='documented'?['C']:[]),combos=record.access.combinations.map(b=>b.colors.join(''));
    assert.deepEqual([...independent,...combos].sort(),source.discovery_screen.observed_qualifying_signatures.slice().sort());
    await page.evaluate(()=>VMX.setView('az'));const row=page.locator(`#list .ent[data-k="${record.id}"]`);await row.waitFor({state:'visible'});
    assert.equal(await row.locator('.access-strip').count(),record.kind==='access'?1:0);assert.deepEqual(await row.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos);
    if(record.kind==='access'){assert.deepEqual(await row.locator('.access-strip > .sc.a-d').evaluateAll(items=>items.map(i=>i.dataset.c)),independent);await checkAccessSizes(row,record.name+' list',18);await checkCIVectors(row,record.name+' list',18);}
    await row.click();assert.equal(await page.locator('#dx-title').innerText(),record.name);
    await page.locator('#q').fill(record.name);await page.locator('#q').focus();const option=page.locator(`#res-list .opt[data-k="${record.id}"]`);await option.waitFor({state:'visible'});
    assert.deepEqual(await option.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos);if(record.kind==='access'){assert.deepEqual(await option.locator('.access-strip > .sc.a-d').evaluateAll(items=>items.map(i=>i.dataset.c)),independent);await checkAccessSizes(option,record.name+' search',18);await checkCIVectors(option,record.name+' search',18);}
    await page.locator('#q').press('Enter');assert.equal(await page.locator('#dx-title').innerText(),record.name);const panel=page.locator('#detail .supp-assessment');assert.match(await panel.innerText(),/October 31, 2026/);
    assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos);if(record.kind==='access'){assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(items=>items.map(i=>i.dataset.c)),combos.length?independent:[...'WUBRG',...(record.access.colorless.status==='documented'?['C']:[])]);await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail',18);}
    assert.equal(await panel.locator('.assessment-notes > p').first().textContent(),record.summary);await panel.locator('.assessment-notes > summary').focus();await page.keyboard.press('Enter');
    const expected=buckets(record).map(b=>b.cards[0].url).sort();links+=expected.length;assert.equal(new Set(expected).size,expected.length);
    await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    assert.deepEqual(await page.locator('#detail a').evaluateAll(items=>items.filter(i=>i.hostname==='scryfall.com'&&i.pathname.startsWith('/card/')).map(i=>i.href).sort()),expected);assert.equal(await page.locator('#detail .dx-eg,#detail .cite').count(),0);
    assert.ok(await page.locator('#detail a').evaluateAll(items=>items.every(i=>i.protocol==='https:'&&['scryfall.com','magic.wizards.com','media.wizards.com'].includes(i.hostname)&&i.rel.includes('noopener'))));
    const state=await page.locator('#detail').evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));return {tokens:[...copy.textContent.matchAll(/\{[^{}\r\n]+\}/g)].map(m=>m[0]),rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),role:s.getAttribute('role'),glyph:getComputedStyle(s.querySelector('.ms'),'::before').content,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})),visible:el.innerText};});
    assert.deepEqual(state.rendered.map(s=>s.raw),state.tokens,record.name+' all encountered assessment/rule/reference tokens');assert.ok(state.rendered.every(s=>s.label&&s.role==='img'&&s.fallback==='none'&&!['none','normal','""'].includes(s.glyph)));assert.doesNotMatch(state.visible,/\{[^{}\r\n]+\}/);actualTokens.set(record.name,state.tokens);
    await page.setViewportSize({width:360,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:1440,height:900});await page.locator('#q').fill('');
  }
  assert.equal(links,31);assert.ok(actualTokens.get('Unearth').includes('{E}'));assert.ok(actualTokens.get('Unleash').includes('{B/R}'));
  const noFont=await browser.newPage();await noFont.route('**/mana-font@1.18.0/**',r=>r.abort());await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');
  for(const record of records){await noFont.evaluate(id=>VMX.open(id),record.id);await noFont.locator('.assessment-notes > summary').click();const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));assert.deepEqual(symbols.map(s=>s.raw),actualTokens.get(record.name));assert.ok(symbols.every(s=>s.raw===s.text&&s.label&&s.glyph==='none'));assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(items=>items.every(i=>getComputedStyle(i.querySelector('svg,.ms')).display==='none'&&i.innerText===i.dataset.combo)));}await noFont.close();
  for(const scenario of ['missing','date','status','unsafe','binding']){const failure=await browser.newPage(),bad=structuredClone(payload),r=bad.records.find(r=>r.name==='Umbra Armor');if(scenario==='date')r.researchDate='2026-10-30';if(scenario==='status')r.access.colors.W.status='invented';if(scenario==='unsafe')r.access.colors.W.cards[0].url='https://scryfall.com@evil.example/';if(scenario==='binding')bad.sourceBindings.at(-1).path='tampered.json';await failure.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));await failure.goto(url);await failure.waitForFunction(()=>VMX.assessments().status==='unavailable');assert.equal(await failure.evaluate(()=>VMX.assessments().records.length),0);await failure.evaluate(()=>VMX.open('deck:catalog-gaps:untap'));assert.ok(await failure.locator('#detail .supp-rules').count());await failure.close();}
  const escaped=await browser.newPage(),safe=structuredClone(payload);safe.records.find(r=>r.name==='Umbra Armor').access.colors.U.note='Literal <img src=x onerror=alert(1)> & {2}{U} {E}';await escaped.route(assessmentRoute,route=>route.fulfill({contentType:'application/json',body:JSON.stringify(safe)}));await escaped.goto(url);await escaped.waitForFunction(()=>VMX.assessments().status==='ready');await escaped.evaluate(()=>VMX.open('deck:vocabulary:umbra armor'));await escaped.locator('.assessment-notes > summary').click();assert.ok((await escaped.locator('#detail').innerText()).includes('<img src=x onerror=alert(1)>'));assert.equal(await escaped.locator('#detail img[src="x"]').count(),0);await escaped.close();
  await page.evaluate(()=>VMX.open('deck:vocabulary:scavenge'));await page.locator('.assessment-notes > summary').click();assert.equal(await page.locator('.assessment-example a').count(),3);assert.equal(await page.locator('#detail .dx-eg,#detail .cite').count(),0);
  await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');});assert.equal(await page.evaluate(math),baseline);
  results.push('All 8 U entries / 31 selected links: receipts/full objects/source colors, exact prior 346-row/27-binding parity, list/search/detail maps, keyboard, native glyphs and whole-detail tokens including energy/hybrid, font fallback, safe links/escaping, malformed isolation, 360px containment, Scavenge control and frozen math.');
}

async function checkT(page,browser,baseline){
  const packet=JSON.parse(fs.readFileSync(path.join(root,'docs/mechanics-research/t-protocol.json'),'utf8')), evidence=path.join(root,'docs/mechanics-research/t-protocol-evidence'), ledger=JSON.parse(fs.readFileSync(path.join(evidence,'retrieval-receipts.json'),'utf8')), receipts=ledger.retrievals;
  const records=payload.records.filter(r=>r.name.startsWith('T')), buckets=r=>[...Object.values(r.access.colors).filter(b=>b.status==='documented'),...r.access.combinations,...(r.access.colorless.status==='documented'?[r.access.colorless]:[])], receiptByBody=new Map(receipts.map(x=>[x.body_path,x]));
  const frozen=JSON.parse(execFileSync('git',['show','290976ac0bad9e1cc47a44c96fa22ac8795b98a0:data/mechanics-assessments.v1.json'],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024}));
  assert.equal(records.length,17);assert.equal(payload.records.filter(r=>!r.name.startsWith('T')).length,329);assert.deepEqual(payload.records.filter(r=>!r.name.startsWith('T')),frozen.records,'all prior 329 assessment rows remain byte-equivalent');assert.equal(payload.sourceBindings.length,27);assert.deepEqual(payload.sourceBindings.slice(0,26),frozen.sourceBindings,'all prior 26 source bindings remain exact');assert.equal(supplement.records.find(r=>r.name==='Trample').target2021,'trample');
  const packetByName=new Map(packet.records.map(r=>[r.mechanic.name,r]));assert.deepEqual([...packetByName.keys()].sort(),records.map(r=>r.name).sort());assert.equal(receipts.length,24);for(const receipt of receipts){const raw=fs.readFileSync(path.join(evidence,receipt.body_path));assert.equal(receipt.status,200,'authoritative retrieval is successful');assert.equal(createHash('sha256').update(raw).digest('hex'),receipt.sha256,'authoritative receipt raw hash');assert.ok(Date.parse(receipt.request_started_utc)<=Date.parse(receipt.retrieved_utc));}const historical=ledger.historical_unbound_retrievals||[],inventory=ledger.historical_body_inventory||[];assert.equal(historical.length,21,'all inherited receipt claims remain historical-unbound');assert.equal(inventory.length,21,'all inherited bodies retain an observed mismatch record');assert.ok(inventory.every(x=>x.integrity==='does_not_match_original_raw_receipt'&&x.body_path&&x.currently_saved_sha256&&x.original_claimed_sha256));
  for(const packetRecord of packet.records)for(const card of packetRecord.card_review.filter(c=>c.included)){const binding=card.evidence_binding;assert.ok(binding?.path&&binding?.sha256,card.name+' has an immutable selected-object binding');const raw=fs.readFileSync(path.join(root,binding.path));assert.equal(createHash('sha256').update(raw).digest('hex'),binding.sha256);const receipt=receiptByBody.get(path.basename(binding.path));assert.equal(receipt?.status,200,card.name+' selected evidence cannot come from a non-200 discovery response');assert.equal(receipt.sha256,binding.sha256);assert.ok(Date.parse(receipt.request_started_utc)<=Date.parse(receipt.retrieved_utc));const body=JSON.parse(raw),fact=(body.data||[body]).find(x=>x.oracle_id===card.oracle_id);assert.deepEqual(card.card_facts,fact);const face=fact.card_faces?.find(x=>x.name===card.mechanic_face)||fact;assert.deepEqual(card.attributed_colors,[...'WUBRG'].filter(c=>face.colors.includes(c)));assert.ok(fact.games.includes('paper')&&!fact.digital&&fact.released_at<='2026-10-30'&&fact.security_stamp!=='acorn'&&fact.border_color!=='silver'&&(!['funny','token','memorabilia'].includes(fact.set_type)||fact.set==='unf'));}
  let links=0;
  for(const record of records){const source=packetByName.get(record.name), represented=[...Object.entries(record.access.colors).filter(([,v])=>v.status==='documented').map(([c])=>c),...record.access.combinations.map(v=>v.colors.join('')),...(record.access.colorless.status==='documented'?['C']:[])],independent=[...'WUBRG'].filter(c=>record.access.colors[c].status==='documented').concat(record.access.colorless.status==='documented'?['C']:[]),combos=record.access.combinations.map(v=>v.colors.join('')),detailColors=record.kind!=='access'?[]:combos.length?independent:[...'WUBRG',...(record.access.colorless.status==='documented'?['C']:[])];assert.deepEqual(represented.sort(),(source.discovery_screen.observed_qualifying_signatures||[]).map(x=>x||'C').sort(),record.name+' projects every independently screened source/face signature');await page.evaluate(()=>VMX.setView('az'));const row=page.locator(`#list .ent[data-k="${record.id}"]`);await row.waitFor({state:'visible'});assert.equal(await row.locator('.access-strip').count(),record.kind==='access'?1:0);assert.deepEqual(await row.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos);if(record.kind==='access'){await checkAccessSizes(row,record.name+' list',18);await checkCIVectors(row,record.name+' list',18);}await page.locator('#q').fill(record.name);await page.locator('#q').focus();const option=page.locator(`#res-list .opt[data-k="${record.id}"]`);await option.waitFor({state:'visible'});assert.deepEqual(await option.locator('.combo-mark').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos);if(record.kind==='access'){await checkAccessSizes(option,record.name+' search',18);await checkCIVectors(option,record.name+' search',18);}await page.locator('#q').press('Enter');assert.equal(await page.locator('#dx-title').innerText(),record.name);const panel=page.locator('#detail .supp-assessment');assert.match(await panel.innerText(),/October 30, 2026/);assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(items=>items.map(i=>i.dataset.combo)),combos);if(record.kind==='access')assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(items=>items.map(i=>i.dataset.c)),detailColors);await panel.locator('.assessment-notes > summary').focus();await page.keyboard.press('Enter');const expected=buckets(record).map(b=>b.cards[0].url).sort();links+=expected.length;assert.equal(new Set(expected).size,expected.length);assert.deepEqual(await page.locator('#detail a').evaluateAll(items=>items.filter(i=>i.hostname==='scryfall.com'&&i.pathname.startsWith('/card/')).map(i=>i.href).sort()),expected);assert.equal(await page.locator('#detail .dx-eg, #detail .cite').count(),0,record.name+' suppresses legacy examples after hydration');assert.ok(await page.locator('#detail a').evaluateAll(items=>items.every(i=>i.protocol==='https:'&&i.rel.includes('noopener'))));await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));const state=await panel.evaluate(el=>{const copy=el.cloneNode(true);copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));return {tokens:[...copy.textContent.matchAll(/\{[^{}\r\n]+\}/g)].map(x=>x[0]),rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({raw:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms'),'::before').content,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display}))};});assert.deepEqual(state.rendered.map(s=>s.raw),state.tokens,record.name+' reconstructs every rendered raw token across assessment/rules/reference');assert.ok(state.rendered.every(s=>s.label&&s.fallback==='none'&&!['none','normal','""'].includes(s.glyph)));if(record.kind==='access'){await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail',18);}await page.setViewportSize({width:360,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:1440,height:900});await page.locator('#q').fill('');}
  const noFont=await browser.newPage();await noFont.route('**/mana-font@1.18.0/**',r=>r.abort());await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');for(const record of records){await noFont.evaluate(id=>VMX.open(id),record.id);await noFont.locator('.assessment-notes > summary').click();assert.ok(await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.every(s=>s.innerText===s.querySelector('.supp-symbol-text').textContent&&getComputedStyle(s.querySelector('.ms')).display==='none')));}await noFont.close();
  const bad=structuredClone(payload),badT=bad.records.find(r=>r.name==='Teamwork');badT.access.colors.W.status='invented';const failure=await browser.newPage();await failure.route(assessmentRoute,r=>r.fulfill({contentType:'application/json',body:JSON.stringify(bad)}));await failure.goto(url);await failure.waitForFunction(()=>VMX.assessments().status==='unavailable');assert.equal(await failure.evaluate(()=>VMX.assessments().records.length),0,'one malformed T record fails the sidecar atomically');await failure.close();const escaped=structuredClone(payload),escapedT=escaped.records.find(r=>r.name==='Teamwork');escapedT.summary='<img src=x onerror=alert(1)> {W}';const escPage=await browser.newPage();await escPage.route(assessmentRoute,r=>r.fulfill({contentType:'application/json',body:JSON.stringify(escaped)}));await escPage.goto(url);await escPage.waitForFunction(()=>VMX.assessments().status==='ready');await escPage.evaluate(id=>VMX.open(id),escapedT.id);await escPage.locator('#detail .assessment-notes > summary').click();assert.equal(await escPage.locator('#detail .assessment-notes img').count(),0);assert.ok((await escPage.locator('#detail .assessment-notes').innerText()).includes('<img src=x onerror=alert(1)>'));await escPage.close();assert.equal(records.find(r=>r.name==='Tap').kind,'rules');assert.equal(records.find(r=>r.name==='Triple').kind,'rules');assert.equal(links,records.flatMap(buckets).length);await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');});assert.equal(await page.evaluate(math),baseline);const sRecord=payload.records.find(r=>r.name==='Scavenge');await page.evaluate(id=>VMX.open(id),sRecord.id);assert.equal(await page.locator('#detail .supp-assessment').count(),1,'unchanged Scavenge renderer path remains available');await page.locator('#detail .assessment-notes > summary').click();assert.deepEqual(await page.locator('#detail .assessment-example a').evaluateAll(items=>items.map(a=>a.href).sort()),buckets(sRecord).map(b=>b.cards[0].url).sort(),'accepted Scavenge retains its three selected examples');assert.equal(await page.locator('#detail .dx-eg, #detail .cite').count(),0,'accepted Scavenge remains free of redundant legacy examples');results.push(`All 17 T records / ${links} source-derived selected witnesses: receipt/object/face binding, complete signatures, list/search/detail, compact links, glyph and no-font fallback, hydration suppression, escaping, malformed atomic isolation, keyboard, narrow containment, baseline 329/26 parity, prior S render regression, and frozen math.`);
}
let browser;const results=[];
try{
  browser=await chromium.launch({channel:opt('--channel','msedge'),headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}}), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.waitForFunction(()=>window.VMX?.assessments().status==='ready');
  await page.waitForFunction(()=>document.querySelector('#selftest').textContent.includes('84 of 84 passed'));
  const baseline=await page.evaluate(math);
  if(accessLabelsOnly){await checkAccessLabels(page);assert.deepEqual(errors,[]);results.push('All 173 mixed A–P access records emit Combination labels without changing their evidence; the seven no-independent-access records retain Combination only; Pack tactics search/detail confirms the player-facing rule.');}else if(args.includes('--mutate-pips-only')){await checkMutatePips(page,browser,baseline);assert.deepEqual(errors,[]);}else if(vOnly){await checkV(page,browser,baseline);assert.deepEqual(errors,[]);}else if(uOnly){await checkU(page,browser,baseline);assert.deepEqual(errors,[]);}else if(tOnly){await checkT(page,browser,baseline);assert.deepEqual(errors,[]);}else if(sCopyOnly){await checkSCopy(page,browser,baseline);assert.deepEqual(errors,[]);}else if(sOnly){await checkS(page,browser,baseline);assert.deepEqual(errors,[]);}else if(rOnly){await checkR(page,browser,baseline);assert.deepEqual(errors,[]);}else if(pOnly){await checkP(page,browser,baseline);assert.deepEqual(errors,[]);}else if(oOnly){await checkO(page,browser,baseline);assert.deepEqual(errors,[]);}else if(nOnly){await checkN(page,browser,baseline);assert.deepEqual(errors,[]);}else if(mOnly){await checkM(page,browser,baseline);assert.deepEqual(errors,[]);}else if(lOnly){await checkL(page,browser,baseline);assert.deepEqual(errors,[]);}else{
  assert.equal(await page.locator('#list .ent').count(),256);
  assert.equal(await page.evaluate(()=>VMX.assessments().records.length),360);
  const expectedAssessmentIds=supplement.records.filter(r=>/^[ABCDEFGHIJKLMNOPRSTUV]/.test(r.name)&&r.target2021===null).map(r=>r.id).sort();
  assert.deepEqual(payload.records.map(r=>r.id).sort(),expectedAssessmentIds,'every admitted A–P/R/S/T target has exactly one assessment');
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
    'docs/mechanics-research/c-protocol-special.json',
    'docs/mechanics-research/d-protocol.json',
    'docs/mechanics-research/e-protocol.json',
    'docs/mechanics-research/f-protocol.json',
    'docs/mechanics-research/g-protocol.json','docs/mechanics-research/h-protocol.json','docs/mechanics-research/i-protocol.json','docs/mechanics-research/j-protocol.json','docs/mechanics-research/k-protocol.json','docs/mechanics-research/l-protocol.json','docs/mechanics-research/m-protocol.json','docs/mechanics-research/n-protocol.json','docs/mechanics-research/o-protocol.json','docs/mechanics-research/p-protocol.json','docs/mechanics-research/r-protocol.json','docs/mechanics-research/s-protocol.json','docs/mechanics-research/t-protocol.json','docs/mechanics-research/u-protocol.json','docs/mechanics-research/v-protocol.json'
  ],'all twenty-seven canonical packet bindings are present');
  assert.deepEqual(['Cast','Counter','Create'].map(name=>payload.records.find(r=>r.name===name)?.kind),['rules','rules','rules'],'generic C rules actions have no invented color access');
  const dRecord=name=>payload.records.find(r=>r.name===name);
  assert.deepEqual(['Double','Destroy','Discard'].map(name=>dRecord(name).kind),['rules','rules','rules'],'generic D actions remain references');
  assert.equal(dRecord('Devoid').access.colorless.status,'documented');
  assert.ok(Object.values(dRecord('Devoid').access.colors).every(x=>x.status==='not_found'),'colored mana costs do not color Devoid cards');
  assert.equal(dRecord('Decayed').access.colors.U.cards[0].name,'Falcon Abomination','blue token creator establishes blue access, despite black tokens');
  assert.equal(dRecord('Disguise').access.colors.G.cards[0].name,'Aveline de Grandpré','black-green disguise cost does not change green card color');
  assert.equal(dRecord('Disguise').access.colorless.cards[0].name,'Branch of Vitu-Ghazi');
  assert.equal(dRecord('Descend').access.colors.R.status,'not_found','descended-this-turn examples do not enter the ability-word family');
  assert.match(dRecord('Descend').summary,/descend 4, descend 8 and fathomless descent/);
  assert.equal(dRecord('Double agenda').scopeLabel,'Conspiracy cards');
  assert.equal(dRecord('Double team').scopeLabel,'Arena cards');
  const fRecord=name=>payload.records.find(r=>r.name===name);
  assert.equal(payload.records.filter(r=>r.name.startsWith('F')).length,25);
  assert.equal(fRecord('Face a dilemma').kind,'rules');
  assert.equal(fRecord('Frenzy').access.colors.B.cards[0].name,'Frenzy Sliver');
  assert.equal(fRecord('Frenzy').access.colors.R.status,'not_found');
  assert.equal(fRecord('Fateseal').access.colors.B.status,'not_found');
  assert.equal(fRecord('Forecast').access.colorless.status,'not_found');
  assert.equal(fRecord('Ferocious').access.colors.B.status,'multicolor_only');
  assert.equal(fRecord('Fear').access.colors.U.cards[0].name,'Scornful Aether-Lich');
  assert.equal(fRecord('Firebending').access.colors.R.cards[0].name,'Fire Sages');
  assert.equal(fRecord('Firebending').access.colorless.cards[0].name,'The Legend of Roku // Avatar Roku');
  assert.equal(fRecord('Forestwalk').access.colors.G.cards[0].name,'Cat Warriors');
  assert.equal(fRecord('Forestwalk').access.colorless.status,'not_found');
  assert.equal(fRecord('Food').access.colors.B.cards[0].name,'Bake into a Pie');
  assert.equal(fRecord('Food').access.colors.R.status,'multicolor_only');
  const iRecords=payload.records.filter(r=>r.name.startsWith('I'));
  assert.equal(iRecords.length,15,'all fifteen supplemental I records project once');
  assert.equal(fRecord('Indestructible'),undefined,'mapped Indestructible remains frozen');
  const iMaps={Impending:['W','U','B','R','G'],Imprint:['W','U','R','UR','C'],Improvise:['W','U','B','R','UR','C'],Increment:['U','G','UG'],Incubate:['W','U','B','R','G','WB','BG'],Infect:['W','U','B','R','G','C'],Infusion:['B','G','BG'],Ingest:['C'],Inspired:['W','U','B','R','G','UB'],Intimidate:['W','B','R','G','UB','RG','BG','C'],Investigate:['W','U','B','R','G','WU','UB','BR','UR','UG','RG','WUB','WR','WUG','WB','UBR','C'],Islandwalk:['U','B','R','G','UB','UG','WU','C'],Islandcycling:['U','UB','WU'],Intensity:['W','U','B','R','G','WB','BR','RG','WG','UR','WR','C'],Incorporate:['W','U','B','R','G','UR']};
  const iBuckets=record=>[...Object.values(record.access.colors).filter(b=>b.status==='documented'),...record.access.combinations,...(record.access.colorless.status==='documented'?[record.access.colorless]:[])];
  for(const record of iRecords){
    assert.deepEqual([...Object.entries(record.access.colors).filter(([,b])=>b.status==='documented').map(([c])=>c),...record.access.combinations.map(b=>b.colors.join('')),...(record.access.colorless.status==='documented'?['C']:[])],iMaps[record.name],record.name+' exact observed I map');
    assert.ok(iBuckets(record).every(b=>b.cards.length===1),record.name+' exactly one selected witness per bucket');
  }
  assert.equal(iRecords.flatMap(iBuckets).length,96,'all 96 I selected links must render');
  const jRecords=payload.records.filter(r=>r.name.startsWith('J'));
  assert.equal(jRecords.length,4,'all four supplemental J records project once');
  const jMaps={'Job Select':['W','U','B','R','G','C'],'Join forces':['W','U','B','R','G'],'Jump':['W'],'Jump-Start':['U','R','UB','UR','WUBRG']};
  const jBuckets=record=>[...Object.values(record.access.colors).filter(b=>b.status==='documented'),...record.access.combinations,...(record.access.colorless.status==='documented'?[record.access.colorless]:[])];
  for(const record of jRecords){
    assert.deepEqual([...Object.entries(record.access.colors).filter(([,b])=>b.status==='documented').map(([c])=>c),...record.access.combinations.map(b=>b.colors.join('')),...(record.access.colorless.status==='documented'?['C']:[])],jMaps[record.name],record.name+' exact observed J map');
    assert.ok(jBuckets(record).every(b=>b.cards.length===1),record.name+' exactly one selected J witness per bucket');
  }
  assert.equal(jRecords.flatMap(jBuckets).length,17,'all 17 J selected links must render');
  const kRecords=payload.records.filter(r=>r.name.startsWith('K'));
  assert.equal(kRecords.length,3,'all three supplemental K records project once');
  const kMaps={Kicker:['W','U','B','R','G','WU','UB','BG','C'],Kinship:['W','U','B','R','G'],Kinfall:['G']};
  const kBuckets=record=>[...Object.values(record.access.colors).filter(b=>b.status==='documented'),...record.access.combinations,...(record.access.colorless.status==='documented'?[record.access.colorless]:[])];
  for(const record of kRecords){
    assert.deepEqual([...Object.entries(record.access.colors).filter(([,b])=>b.status==='documented').map(([c])=>c),...record.access.combinations.map(b=>b.colors.join('')),...(record.access.colorless.status==='documented'?['C']:[])],kMaps[record.name],record.name+' exact observed K map');
    assert.ok(kBuckets(record).every(b=>b.cards.length===1),record.name+' exactly one selected K witness per bucket');
  }
  assert.equal(kRecords.flatMap(kBuckets).length,15,'all 15 K selected links must render');
  assert.equal(fRecord('Kicker').access.colorless.cards[0].name,"Aang's Journey");
  assert.equal(fRecord('Kinfall').scopeLabel,'Mystery Booster playtest card');
  assert.match(fRecord('Kinfall').summary,/creatures you control.*\+1\/\+1.*no general Kinfall rules definition is provided/i);
  assert.match(fRecord('Kicker').summary,/additional cost.*Multikicker.*ticket counter.*sticker/i,'Kicker explains its CR702.33 variants in player terms');
  assert.match(fRecord('Kinship').summary,/top card.*shared creature type.*own reward/i,'Kinship explains its trigger and card-specific rewards');
  for(const [name,detail] of Object.entries({'Archangel of Wrath':'entry deal 2 damage','Academy Drake':'two +1/+1 counters','Aggressive Sabotage':'adds 3 damage','Breath of Darigaaz':'damage from 1 to 4','Baloth Gorger':'three +1/+1 counters',"Aang's Journey":'basic land and a Shrine','Kangee, Aerie Keeper':'feather counters','Mirror Universe Intrusion':'instead of a copy of one of those creatures','Moss-Pit Skeleton':'three +1/+1 counters','Kithkin Zephyrnaut':'flying and vigilance','Ink Dissolver':'mills three cards','Nightshade Schemers':'loses 2 life','Mudbutton Clanger':'gets +1/+1','Leaf-Crowned Elder':'without paying its mana cost'})){
    const bucket=kBuckets(fRecord(name==='Kithkin Zephyrnaut'||name==='Ink Dissolver'||name==='Nightshade Schemers'||name==='Mudbutton Clanger'||name==='Leaf-Crowned Elder'?'Kinship':'Kicker')).find(b=>b.cards[0].name===name);
    assert.ok(bucket.note.includes(detail),name+' selected note states its actual saved-card behavior');
  }
  assert.equal(fRecord('Jump').access.colors.W.cards[0].name,'Cid, Freeflier Pilot','Jump remains the Cid label, not Jump-Start');
  assert.equal(fRecord('Job Select').access.colorless.cards[0].name,"Monk's Fist");
  assert.equal(fRecord('Jump-Start').access.combinations.find(c=>c.colors.join('')==='WUBRG').cards[0].name,'Niv-Mizzet, Supreme');
  assert.equal(fRecord('Increment').scopeLabel,'Released paper cards','Increment is CR702.191, not inferred special material');
  assert.equal(fRecord('Ingest').access.colorless.cards[0].name,'Benthic Infiltrator');
  assert.ok(Object.values(fRecord('Ingest').access.colors).every(b=>b.status==='not_found'),'Devoid does not establish colored access');
  assert.equal(fRecord('Incubate').access.colorless.status,'not_found','funny discovery object is not paper evidence');
  assert.equal(fRecord('Islandwalk').access.colors.B.cards[0].name,'Shore Snapper');
  assert.equal(fRecord('Islandwalk').access.colorless.cards[0].name,'Adrestia');
  assert.match(fRecord('Islandwalk').access.colors.B.note,/source is black.*blue activation cost/i);
  assert.equal(fRecord('Improvise').access.colorless.cards[0].name,'Archway of Innovation');
  assert.equal(fRecord('Intensity').scopeLabel,'Digital / Alchemy material');
  assert.equal(fRecord('Incorporate').scopeLabel,'Digital / Alchemy material');
  assert.match(fRecord('Increment').summary,/mana spent.*power or toughness/);
  assert.match(fRecord('Inspired').summary,/becomes untapped/);
  assert.match(fRecord('Infusion').summary,/gained life this turn/);
  const hRecords=payload.records.filter(r=>r.name.startsWith('H'));
  assert.equal(hRecords.length,14,'all fourteen supplemental H records are projected once');
  assert.equal(fRecord('Haste'),undefined,'mapped Haste remains frozen outside assessment records');
  assert.equal(fRecord('Hexproof'),undefined,'mapped Hexproof remains frozen outside assessment records');
  assert.equal(fRecord('Hidden Agenda').scopeLabel,'Conspiracy material');
  assert.equal(fRecord('Heist').scopeLabel,'Digital / Alchemy material');
  assert.equal(fRecord("Hero's Reward").access.colorless.cards[0].name,'Hydra Head');
  assert.equal(fRecord('Harness').access.colors.W.cards[0].name,'The Mind Stone');
  assert.equal(fRecord('Harness').access.colors.B.cards[0].name,'The Soul Stone');
  const hexproofFrom=fRecord('Hexproof from');
  await page.evaluate(()=>VMX.setView('az'));
  const hexproofRow=page.locator(`#list .ent[data-k="${hexproofFrom.id}"]`);
  assert.deepEqual(await hexproofRow.locator('.access-strip .sc').evaluateAll(items=>items.map(item=>item.dataset.c)),['W','U','B','G','C'],'Hexproof from list/search strip exposes only independent colors and colorless slots');
  assert.deepEqual(await hexproofRow.locator('.access-strip .combo-mark').evaluateAll(items=>items.map(item=>item.dataset.combo)),hexproofFrom.access.combinations.map(item=>item.colors.join('')),'Hexproof from list/search strip retains every documented combination');
  assert.equal(await hexproofRow.locator('.combo-mark[data-combo="WUB"] .ci3-svg').count(),1,'Hexproof from uses the pinned Mana CI-3 vector for WUB');
  assert.equal(await hexproofRow.locator('.combo-mark[data-combo="WUBRG"] .ci5-svg').count(),1,'Hexproof from uses the pinned Mana CI-5 vector for WUBRG');
  await page.evaluate(id=>VMX.open(id),hexproofFrom.id);
  assert.deepEqual(await page.locator('#detail .own-row[data-c]').evaluateAll(items=>items.map(item=>item.dataset.c)),['W','U','B','G','C'],'Hexproof from detail rows expose only independent colors and colorless');
  assert.deepEqual(await page.locator('#detail .own-row[data-combo] .combo-mark').evaluateAll(items=>items.map(item=>item.dataset.combo)),hexproofFrom.access.combinations.map(item=>item.colors.join('')),'Hexproof from detail retains every combination in the Color Access summary');
  const hBuckets=record=>[...Object.values(record.access.colors).filter(b=>b.status==='documented'),...record.access.combinations,...(record.access.colorless.status==='documented'?[record.access.colorless]:[])];
  const hMaps={Harmonize:['U','R','G','UR','URG'],Haunt:['W','B','WB'],Heal:['W','B','R','G','RG','BR','C'],Hellbent:['B','R','BR','C'],Heroic:['W','U','B','R','G','WU','WR'],'Hidden Agenda':['C'],Hideaway:['W','U','B','R','G','C'],Horsemanship:['W','U','B','R','G'],'Hexproof from':['W','U','B','G','WR','WB','WUB','UG','WUBRG','C'],'Hire a Mercenary':['B'],Halflingcycling:['C'],Harness:['W','B'],Heist:['U','B','R','BR','UB','UBR'],"Hero's Reward":['C']};
  for(const record of hRecords){
    assert.deepEqual([...Object.entries(record.access.colors).filter(([,b])=>b.status==='documented').map(([c])=>c),...record.access.combinations.map(b=>b.colors.join('')),...(record.access.colorless.status==='documented'?['C']:[])],hMaps[record.name],record.name+' exact observed H access map');
    assert.ok(hBuckets(record).every(b=>b.cards.length===1),record.name+' one selected witness per bucket');
  }
  assert.equal(hRecords.flatMap(hBuckets).length,59);
  assert.match(fRecord('Harmonize').summary,/generic mana.*power.*exiled when it leaves the stack/i);
  assert.equal(fRecord('Heal').access.colors.W.cards[0].name,'Knight of the Holy Nimbus','unreleased Dr. McCoy cannot establish released-paper access');
  assert.match(fRecord('Heal').summary,/keyword action.*marked damage.*regeneration.*destruction.*activate/i);
  assert.match(fRecord('Heal').access.colors.R.note,/source is red.*black activation cost/i);
  assert.match(fRecord('Heal').access.colorless.note,/regenerates by discarding a card.*source is colorless/i);
  assert.match(fRecord('Hidden Agenda').summary,/whenever you have priority/i);
  assert.match(fRecord('Harness').summary,/designation lasts until it leaves the battlefield/i);
  assert.match(fRecord('Hire a Mercenary').summary,/3\/2 colorless Shapeshifter.*changeling.*lose 3 life/i);
  assert.doesNotMatch(fRecord('Hire a Mercenary').summary,/Mercenary token/i);
  assert.match(fRecord('Haunt').access.combinations[0].note,/lose 2 life.*gain.*2 life.*haunts dies/i);
  assert.match(fRecord('Hellbent').access.colorless.note,/land is colorless.*red mana/i);
  assert.match(fRecord('Hexproof from').access.combinations.find(c=>c.colors.join('')==='WUBRG').note,/Sphinx.*all five colors.*characteristic-defining ability/i);
  assert.match(fRecord('Heist').summary,/three random nonland.*exiles one face down/i);
  assert.match(fRecord("Hero's Reward").access.colorless.note,/gain 2 life when it leaves the battlefield/i);
  const gRecords=payload.records.filter(r=>r.name.startsWith('G'));
  const gRecord=name=>gRecords.find(r=>r.name===name);
  const gBuckets=record=>[...Object.values(record.access.colors).filter(b=>b.status==='documented'),...record.access.combinations,...(record.access.colorless.status==='documented'?[record.access.colorless]:[])];
  const gMaps={Gift:['W','U','B','R','G','UG','C'],Goad:['W','U','B','R','G','UB','BRG','UR','BR','RG','WB','WRG','WUG','UBR','WR','BG','C'],Graft:['U','G','UG','C'],Grandeur:['W','U','B','R','G','C'],Gravestorm:['U','B']};
  for(const record of payload.records) assert.equal(record.researchDate,(/^[NOPRS]/.test(record.name))?'2026-10-30':(record.name.startsWith('G')||record.name.startsWith('H')||record.name.startsWith('I')||record.name.startsWith('J')||record.name.startsWith('K')||record.name.startsWith('L')||record.name.startsWith('M'))?'2026-10-29':'2026-10-28',record.name+' historical review date');
  assert.equal(payload.researchDate,'2026-10-29');
  for(const record of gRecords){
    assert.deepEqual([...Object.entries(record.access.colors).filter(([,b])=>b.status==='documented').map(([c])=>c),...record.access.combinations.map(b=>b.colors.join('')),...(record.access.colorless.status==='documented'?['C']:[])],gMaps[record.name],record.name+' exact access map');
    assert.ok(gBuckets(record).every(b=>b.cards.length===1),record.name+' exactly one selected card per bucket');
  }
  assert.equal(gRecords.flatMap(gBuckets).length,36,'exactly 36 selected G witnesses');
  const goadNote=name=>gBuckets(gRecord('Goad')).find(b=>b.cards[0].name===name).note;
  for(const [name,required,forbidden] of [
    ['Frenzied Gorespawn',/entry trigger.*each opponent/i,/combat damage/i],
    ['Killian, Decisive Mentor',/whenever an enchantment you control enters/i,/activated ability/i],
    ['Kitt Kanto, Mayhem Diva',/tap two untapped creatures you control.*start of combat on each player's turn/i,/attacks with a Citizen/i],
    ['Kros, Defense Contractor',/creature you don't control whenever you put counters on it/i,/goads.*upkeep|goads.*with \+1\/\+1 counters/i],
    ['Maestros Confluence',/goads every creature controlled by a target player/i,/goads a creature\./i],
    ['Nelly Borca, Impulsive Accuser',/when she attacks.*goads all suspected creatures/i,/as it enters/i],
    ['Bhaal, Lord of Murder',/another nontoken creature you control dies/i,/after another nontoken creature dies/i],
    ['Alela, Cunning Conqueror',/player dealt combat damage by one or more Faeries you control/i,/after its Faeries deal combat damage/i]
  ]){assert.match(goadNote(name),required,name+' preserves its actual trigger and scope');assert.doesNotMatch(goadNote(name),forbidden,name+' rejects escaped factual error');}
  assert.match(gRecord('Goad').summary,/normally lasts until the next turn.*continuous effects or explicit durations can differ/i,'Goad preserves normal duration and exceptions');
  assert.match(gRecord('Graft').access.colorless.note,/after it enters/i,'graft transfer follows creature entry');
  assert.match(gRecord('Gift').summary,/while casting.*instant or sorcery.*before.*resolves.*permanent.*triggered ability.*enters/i,'Gift distinguishes promise, spell resolution and permanent entry');
  assert.match(gRecord('Gravestorm').access.colors.B.note,/triggers when cast.*copies each exile/i,'Bitter Ordeal cast trigger precedes its search effect');
  assert.doesNotMatch(gRecord('Gravestorm').access.colors.B.note,/when cast after searching/i);
  const normalGTokens=new Map(), normalHTokens=new Map(),normalITokens=new Map(),normalJTokens=new Map(),normalKTokens=new Map(); let gVisibleCardLinks=0, hVisibleCardLinks=0, iVisibleCardLinks=0, jVisibleCardLinks=0, kVisibleCardLinks=0;
  assert.equal(payload.records.filter(r=>r.name.startsWith('G')).length,5);
  assert.equal(gRecord('Gift').access.colors.G.cards[0].name,'Longstalk Brawl');
  assert.equal(gRecord('Gift').access.colorless.cards[0].name,'Starforged Sword');
  assert.equal(gRecord('Goad').access.colors.G.cards[0].name,'Predatory Impetus');
  assert.equal(gRecord('Goad').access.colorless.cards[0].name,'Bloodthirsty Blade');
  assert.equal(gRecord('Graft').access.colorless.cards[0].name,'Llanowar Reborn');
  assert.equal(gRecord('Grandeur').access.colorless.cards[0].name,'Page, Loose Leaf');
  assert.equal(gRecord('Gravestorm').access.colors.U.cards[0].name,'Follow the Bodies');
  assert.equal(fRecord('Fuse').access.colorless.status,'not_found');
  assert.equal(fRecord('Fuse').access.combinations.length,15);
  assert.ok(Object.values(fRecord('Fuse').access.colors).every(x=>x.status==='multicolor_only'));
  assert.ok(Object.values(fRecord('Friends forever').access.colors).every(x=>x.status==='multicolor_only'));
  for(const name of ['Fight','First Strike','Flash','Flying']) assert.ok(!fRecord(name),'mapped F stays in2021');
  const eRecord=name=>payload.records.find(r=>r.name===name);
  assert.deepEqual(['Exchange','Exile'].map(name=>eRecord(name).kind),['rules','rules'],'generic E actions remain references');
  assert.equal(eRecord('Emerge').access.colors.G.status,'not_found','Foul Emissary rewards Emerge but does not perform or grant it');
  assert.equal(eRecord('Explore').access.colorless.status,'not_found','Shadowed Caravel rewards Explore but does not perform or grant it');
  assert.equal(eRecord('Echo').access.colors.U.cards[0].name,'Raven Familiar');
  assert.ok(!eRecord('Echo').access.combinations.some(x=>x.colors.join('')==='UB'),'Echo flavor labels do not invent an ability');
  assert.ok(Object.values(eRecord('Eminence').access.colors).every(x=>x.status==='multicolor_only'),'Eminence combinations do not imply monocolor access');
  assert.equal(eRecord('Encore').access.combinations.find(x=>x.colors.join('')==='WUBRG').note,'Sliver Gravemother has encore {5}.','native encore cost is distinct from the granted cost');
  assert.equal(eRecord('Evolve').access.colorless.cards[0].name,'Propagator Drone','devoid grant is colorless despite colored costs');
  assert.equal(eRecord('Embalm').access.colors.B.cards[0].name,'Cursecloth Wrappings','grant source establishes black despite white tokens');
  assert.equal(eRecord('Extort').access.colors.W.cards[0].name,'Basilica Guards','hybrid reminder cost does not change source color');
  assert.equal(eRecord('Empower Jace').access.colors.R.cards[0].name,'No Admittance','blue Jace token does not recolor its red source');
  await page.evaluate(()=>VMX.setView('az'));
  assert.equal(await page.locator('#list .ent').count(),587);
  assert.equal(await page.locator('#list > .grp[data-scope="main"] .ent').count(),543);
  assert.equal(await page.locator('#list > .grp[data-scope="special-material"] .ent').count(),44);
  if(!copyOnly){
    /* Access-only contract: every supplemental A/B record retains five colors,
       rules actions have no invented map, and no access strip uses tier classes. */
    await page.evaluate(()=>VMX.setView('az'));
    await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
    // Use the real search renderer: its frozen-2021 strip has a 12px default,
    // which supplemental independent and combination access must override.
    if(!kOnly) for(const record of payload.records.filter(r=>['Fuse','Friends forever','Hexproof from','Intimidate','Islandcycling','Islandwalk'].includes(r.name))){
      await page.locator('#q').fill(record.name);await page.locator('#q').focus();
      const option=page.locator(`#res-list .opt[data-k="${record.id}"]`);
      await option.waitFor({state:'visible'});
      assert.deepEqual(await option.locator('.combo-mark').evaluateAll(marks=>marks.map(mark=>mark.dataset.combo)),record.access.combinations.map(item=>item.colors.join('')),record.name+' actual search exact combinations');
      assert.deepEqual(await option.locator('.access-strip > .sc').evaluateAll(marks=>marks.map(mark=>mark.dataset.c)),[...'WUBRG'].filter(c=>record.access.colors[c].status==='documented').concat(record.access.colorless.status==='documented'?['C']:[]),record.name+' actual search independent access');
      await checkAccessSizes(option,record.name+' search',14);
      await checkCIVectors(option,record.name+' search',14);
    }
    if(!kOnly){
      await page.locator('#q').fill('Flying');await page.locator('#q').focus();
      const frozenSearch=page.locator('#res-list .opt[data-k="flying"]');await frozenSearch.waitFor({state:'visible'});
      assert.ok(await frozenSearch.locator('.strip:not(.access-strip) > .sc').evaluateAll(marks=>marks.length===5&&marks.every(mark=>{const r=mark.getBoundingClientRect();return r.width===12&&r.height===12;})),'frozen2021 search notation remains12px');
      await page.locator('#q').fill('');
    }
    for(const record of kOnly ? kRecords : combinationsOnly ? payload.records.filter(r=>['Fuse','Friends forever','Hexproof from','Intimidate','Islandcycling','Islandwalk'].includes(r.name)) : payload.records.filter(r=>!r.name.startsWith('R')&&!r.name.startsWith('S')&&!r.name.startsWith('L'))){
      const row=page.locator(`#list .ent[data-k="${record.id}"]`), access=record.access, compactExamples=/^[CDEFGHIJKNT]/.test(record.name);
      assert.equal(await row.locator('.access-strip').count(),record.kind==='access'?1:0,record.name);
      if(record.kind==='access'){
        const comboPresentation=['Fuse','Friends forever'].includes(record.name), mixedPresentation=['Hexproof from','Intimidate','Islandcycling','Islandwalk','Kicker'].includes(record.name), independentSlots=[...('WUBRG')].filter(color=>access.colors[color].status==='documented').concat(access.colorless.status==='documented'?['C']:[]);
        if(comboPresentation || mixedPresentation){
          assert.deepEqual(await row.locator('.combo-mark').evaluateAll(marks=>marks.map(mark=>mark.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
          assert.equal(await row.locator('.combo-mark').evaluateAll((marks,label)=>marks.every(mark=>mark.getAttribute('role')==='img'&&mark.getAttribute('aria-label').includes(label)),'WUBRG'.split('').some(color=>access.colors[color].status==='documented')?'combination':'combination only'),true);
          assert.equal(await row.locator('.combo-mark .ms-wu,.combo-mark .ms-wb,.combo-mark .ms-ub,.combo-mark .ms-ur,.combo-mark .ms-br,.combo-mark .ms-bg,.combo-mark .ms-rg,.combo-mark .ms-rw,.combo-mark .ms-gw,.combo-mark .ms-gu').count(),access.combinations.filter(item=>item.colors.length===2).length);
          assert.equal(await row.locator('.combo-mark .ci3-svg').count(),access.combinations.filter(item=>item.colors.length===3).length);
          if(record.name==='Fuse') assert.deepEqual(await row.locator('.combo-mark .ci3-svg').evaluateAll(glyphs=>glyphs.map(glyph=>glyph.closest('.combo-mark').dataset.combo)),['WUG','UBR','WUR','BRG','WBG'],'Fuse covers every rendered three-color CI combination');
          assert.ok(await row.locator('.combo-mark .ms-cost').evaluateAll(glyphs=>glyphs.every(glyph=>{const style=getComputedStyle(glyph), size=parseFloat(style.fontSize);return Math.abs(parseFloat(style.lineHeight)-size*1.35)<=1;})),record.name+' keeps Mana-native pair metrics at the scoped glyph size');
          assert.ok(await row.locator('.combo-mark').evaluateAll(marks=>{const pair=marks.find(mark=>mark.querySelector('.ms-cost')), ci=marks.find(mark=>mark.querySelector('.ci3-svg,.ci4-svg,.ci5-svg'));if(!pair||!ci)return true;const a=pair.querySelector('.ms').getBoundingClientRect(),b=ci.querySelector('.ci3-svg,.ci4-svg,.ci5-svg').getBoundingClientRect();return Math.abs(a.width-b.width)<=.5&&Math.abs(a.height-b.height)<=.5;}),record.name+' normalizes pair and CI circle footprints');
          assert.ok(await row.locator('.combo-mark .ci3-svg').evaluateAll(glyphs=>glyphs.every(svg=>{const expected={WUG:['#3b6ba0','#3d684b','#fff'],UBR:['#c6553e','#3b6ba0','#383431'],WUR:['#c6553e','#fff','#3b6ba0'],BRG:['#3d684b','#383431','#c6553e'],WBG:['#383431','#3d684b','#fff'],WUB:['#383431','#fff','#3b6ba0']}[svg.closest('.combo-mark').dataset.combo], paths=[...svg.querySelectorAll('path')];return svg.getAttribute('viewBox')==='0 0 1024 1024'&&svg.querySelector('g')?.getAttribute('transform')==='translate(0 938.667) scale(1 -1)'&&paths.length===4&&paths[0].getAttribute('fill')==='#010101'&&paths.slice(1).map(path=>path.getAttribute('fill')).join('|')===expected.join('|');})),record.name+' renders the pinned Mana CI-3 outline and native interior colors in one shared vector frame');
          const listSize=record.name==='Kicker'?18:14;
          assert.ok(await row.locator('.combo-mark').evaluateAll((marks,size)=>marks.every(mark=>{const r=mark.getBoundingClientRect(), g=mark.querySelector('.ms,.ci3-svg,.ci4-svg,.ci5-svg').getBoundingClientRect();return Math.abs(r.width-size)<=.5&&Math.abs(r.height-size)<=.5&&Math.abs((r.left+r.width/2)-(g.left+g.width/2))<=.5&&Math.abs((r.top+r.height/2)-(g.top+g.height/2))<=.5;}),listSize),record.name+' combination markers have expected hosts and centered glyphs');
          await checkAccessSizes(row,record.name+' list',record.name==='Kicker'?18:14);
          await checkCIVectors(row,record.name+' list',record.name==='Kicker'?18:14);
          assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(slots=>slots.map(s=>s.dataset.c)),comboPresentation?[]:independentSlots);
        } else assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(slots=>slots.map(s=>s.dataset.c)),[...'WUBRG',...(access.colorless.status==='documented'?['C']:[])]);
        assert.equal(await row.locator('.access-strip .t-p,.access-strip .t-s,.access-strip .t-t,.access-strip .t-n').count(),0);
        for(const color of 'WUBRG') assert.equal(await row.locator(`.access-strip .sc[data-c="${color}"].a-d`).count(),access.colors[color].status==='documented'?1:0);
        if(record.name==='Kicker'){
          await page.locator('#q').fill(record.name); await page.locator('#q').focus();
          const option=page.locator(`#res-list .opt[data-k="${record.id}"]`); await option.waitFor({state:'visible'});
          assert.deepEqual(await option.locator('.access-strip > .sc').evaluateAll(items=>items.map(item=>item.dataset.c)),independentSlots,'Kicker search exposes only independent WUBRG/colorless slots');
          assert.deepEqual(await option.locator('.combo-mark').evaluateAll(items=>items.map(item=>item.dataset.combo)),access.combinations.map(item=>item.colors.join('')),'Kicker search retains exact documented combinations');
          assert.ok(await option.locator('.combo-mark').evaluateAll(items=>items.every(item=>item.getAttribute('aria-label').endsWith('combination'))),'Kicker search labels documented combinations');
          await checkAccessSizes(option,'Kicker search',18); await checkCIVectors(option,'Kicker search',18);
          await page.locator('#q').fill('');
        }
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
      assert.ok((await panel.innerText()).includes((/^[NOPRS]/.test(record.name))?'October 30, 2026':/^[GHIJK]/.test(record.name)?'October 29, 2026':'October 28, 2026'),record.name+' displayed review date');
      assert.doesNotMatch(await panel.innerText(),/Our assessment|Confidence:|Primary:|Secondary:|Tertiary:|assessment - provisional/i);
      if(record.kind==='access'){
        const comboPresentation=['Fuse','Friends forever'].includes(record.name), mixedPresentation=['Hexproof from','Intimidate','Islandcycling','Islandwalk','Kicker'].includes(record.name), independentSlots=[...('WUBRG')].filter(color=>access.colors[color].status==='documented').concat(access.colorless.status==='documented'?['C']:[]);
        assert.equal(await panel.locator('.own-row').count(),comboPresentation?access.combinations.length:mixedPresentation?independentSlots.length+access.combinations.length:5+(access.colorless.status==='documented'?1:0));
        if(comboPresentation){
          assert.equal(await panel.locator('.own-row[data-c]').count(),0,record.name+' has no implied monocolor rows');
          assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(rows=>rows.map(row=>row.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
          assert.ok(await panel.locator('.own-row .own-t').evaluateAll(nodes=>nodes.every(node=>node.textContent==='Combination only')));
          assert.deepEqual(await row.locator('.combo-mark').evaluateAll(marks=>marks.map(mark=>mark.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
          assert.ok(await panel.locator('.own-row .ci3-svg').evaluateAll(glyphs=>glyphs.every(svg=>svg.getAttribute('viewBox')==='0 0 1024 1024'&&svg.querySelectorAll('path').length===4&&svg.querySelector('g')?.getAttribute('transform')==='translate(0 938.667) scale(1 -1)')),record.name+' detail keeps the four-path Mana CI-3 vector in its shared frame');
          assert.ok(await panel.locator('.own-row.combo-row').evaluateAll(rows=>rows.every(item=>{const mark=item.querySelector('.combo-mark').getBoundingClientRect(), glyph=item.querySelector('.combo-mark .ms,.combo-mark .ci3-svg,.combo-mark .ci5-svg').getBoundingClientRect(), label=item.querySelector('.own-c').getBoundingClientRect();return Math.abs(mark.width-mark.height)<=.5&&Math.abs(glyph.width-glyph.height)<=.5&&Math.abs((mark.left+mark.width/2)-(glyph.left+glyph.width/2))<=.5&&Math.abs((mark.top+mark.height/2)-(glyph.top+glyph.height/2))<=.5&&Math.abs((mark.top+mark.height/2)-(label.top+label.height/2))<=.5;})),record.name+' detail markers and labels remain centered');
        } else if(mixedPresentation){
          assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(rows=>rows.map(row=>row.dataset.c)),independentSlots);
          assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(rows=>rows.map(row=>row.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
          assert.ok(await panel.locator('.own-row[data-combo] .own-t').evaluateAll(nodes=>nodes.every(node=>node.textContent==='Combination')),record.name+' labels documented combinations');
        }
        if(comboPresentation||mixedPresentation){await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail');}
        assert.ok((await panel.innerText()).includes(record.scopeLabel));
        if(!comboPresentation && !mixedPresentation) for(const color of 'WUBRG'){
          const item=access.colors[color], rowText=await panel.locator(`.own-row[data-c="${color}"]`).innerText();
          assert.match(rowText,new RegExp(item.status==='documented'?'Access':item.status==='multicolor_only'&&'WUBRG'.split('').some(color=>access.colors[color].status==='documented')?'No example found':item.status==='multicolor_only'?'Combination only':item.status==='not_found'?'No example found':item.status==='not_applicable'?'Not applicable':'Insufficient evidence'));
        }
      }
      await notes.locator(':scope > summary').focus(); await page.keyboard.press('Enter'); assert.equal(await notes.getAttribute('open'),'');
      // Restore symbol fallback text only for exact authored-prose comparisons.
      // Separate visible-DOM assertions below prove the braces are not displayed.
      const noteText = /^[EFGHIJK]/.test(record.name) ? await notes.evaluate(el=>{
        const copy=el.cloneNode(true);
        copy.querySelectorAll('.supp-symbol').forEach(symbol=>symbol.replaceWith(symbol.querySelector('.supp-symbol-text').textContent));
        return copy.textContent;
      }) : await notes.innerText();
      assert.ok(noteText.includes(record.summary));
      if(record.kind==='access') for(const color of 'WUBRG') {
        if(!compactExamples || access.colors[color].status==='documented') assert.ok(noteText.includes(access.colors[color].note),record.name+' '+color+' authored example visible');
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
        for(const item of [...access.combinations,...(access.colorless.status==='documented'?[access.colorless]:[])]) assert.ok(noteText.includes(item.note),record.name+' combination/colorless example visible');
      }
      assert.deepEqual(await notes.locator('a').evaluateAll(links=>links.filter(a=>a.hostname==='scryfall.com'&&a.pathname.startsWith('/card/')).map(a=>a.href).sort()),expectedCardLinks,record.name+' no redundant aggregate card list');
      if(/^[FGHIJK]/.test(record.name)) {
        assert.equal(await page.locator('#detail .dx-eg,#detail .cite').count(),0,record.name+' no inherited extra example/image');
        assert.deepEqual(await page.locator('#detail a').evaluateAll(links=>links.filter(a=>a.hostname==='scryfall.com'&&a.pathname.startsWith('/card/')).map(a=>a.href).sort()),expectedCardLinks,record.name+' whole-detail one-example link contract');
      }
      if(record.name.startsWith('G')) gVisibleCardLinks+=expectedCardLinks.length;
      if(record.name.startsWith('H')) hVisibleCardLinks+=expectedCardLinks.length;
      if(record.name.startsWith('I')) iVisibleCardLinks+=expectedCardLinks.length;
      if(record.name.startsWith('J')) jVisibleCardLinks+=expectedCardLinks.length;
      if(record.name.startsWith('K')) kVisibleCardLinks+=expectedCardLinks.length;
      const linkedBuckets=cardBuckets.filter(item=>item.findUrl && (!compactExamples || item.cards.length>1));
      for(const findUrl of new Set(linkedBuckets.map(item=>item.findUrl))) assert.equal(await notes.locator(`a[href="${findUrl}"]`).count(),linkedBuckets.filter(item=>item.findUrl===findUrl).length,record.name+' renders every exact reviewed-card bucket link');
      assert.deepEqual(await notes.locator('a').evaluateAll(links=>links.filter(a=>a.protocol!=='https:'||!['scryfall.com','magic.wizards.com'].includes(a.hostname)||a.rel!=='noopener noreferrer').map(a=>a.href)),[]);
      if(/^[EFGHIJK]/.test(record.name)) {
        await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
        const symbols=await page.locator('#detail').evaluate(el=>{
          const copy=el.cloneNode(true);
          copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));
          return {tokens:copy.textContent.match(/\{[^{}\r\n]+\}/g)||[],visible:el.innerText,
            rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({token:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),role:s.getAttribute('role'),fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display,glyph:getComputedStyle(s.querySelector('.ms')).display,before:getComputedStyle(s.querySelector('.ms'),'::before').content,after:getComputedStyle(s.querySelector('.ms'),'::after').content}))};
        });
        assert.deepEqual(symbols.rendered.map(s=>s.token),symbols.tokens,record.name+' every brace token becomes a symbol');
        if(record.name.startsWith('G')) normalGTokens.set(record.name,symbols.tokens);
        if(record.name.startsWith('H')) normalHTokens.set(record.name,symbols.tokens);
        if(record.name.startsWith('I')) normalITokens.set(record.name,symbols.tokens);
        if(record.name.startsWith('J')) normalJTokens.set(record.name,symbols.tokens);
        if(record.name.startsWith('K')) normalKTokens.set(record.name,symbols.tokens);
        assert.doesNotMatch(symbols.visible,/\{[^{}\r\n]+\}/,record.name+' no visible raw costs');
        for(const symbol of symbols.rendered){
          assert.equal(symbol.role,'img');assert.ok(symbol.label);assert.equal(symbol.fallback,'none');assert.notEqual(symbol.glyph,'none');
          assert.ok(symbol.before && !['none','normal','""'].includes(symbol.before),record.name+' real font glyph');
          if(symbol.token.includes('/'))assert.ok(symbol.after && !['none','normal','""'].includes(symbol.after),record.name+' both hybrid halves');
        }
        if(record.name==='Flashback') for(const token of ['{7}','{9}','{B}']) assert.ok(symbols.rendered.some(s=>s.token===token),token+' F numeric/black cost');
        if(record.name==='Firebending') assert.ok(symbols.rendered.some(s=>s.token==='{8}'));
        if(record.name==='Freerunning') assert.ok(symbols.rendered.some(s=>s.token==='{X}'&&s.label==='X generic mana'));
        if(record.name==='Forestwalk') assert.equal(symbols.rendered.filter(s=>s.token==='{B/G}'&&s.label==='One black or green mana').length,3);
        if(record.name==='Explore') assert.deepEqual(symbols.rendered.map(s=>s.label),['1 generic mana','1 generic mana','One black mana']);
        if(record.name==='Encore') assert.ok(symbols.rendered.some(s=>s.token==='{12}'&&s.label==='12 generic mana'));
        if(record.name==='Evoke') assert.deepEqual([...new Set(symbols.rendered.filter(s=>s.token.includes('/')).map(s=>s.token))].sort(),['{R/G}','{R/W}','{U/B}','{W/B}']);
      }
    }
    if(kOnly) assert.equal(kVisibleCardLinks,15,'all K detail panels show exactly the 15 selected links');
    else if(!combinationsOnly) {assert.equal(gVisibleCardLinks,36,'all G detail panels show exactly the 36 selected links');assert.equal(hVisibleCardLinks,59,'all H detail panels show exactly the 59 selected links');assert.equal(iVisibleCardLinks,96,'all I detail panels show exactly the 96 selected links');assert.equal(jVisibleCardLinks,17,'all J detail panels show exactly the 17 selected links');assert.equal(kVisibleCardLinks,15,'all K detail panels show exactly the 15 selected links');}
      const noFont=await browser.newPage();
    await noFont.route('**/mana-font@1.18.0/**',route=>route.abort());
    await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');
    await noFont.evaluate(()=>VMX.open('deck:vocabulary:explore'));
    await noFont.locator('.assessment-notes > summary').click();
    const fallback=await noFont.locator('.assessment-notes .supp-symbol').evaluateAll(symbols=>symbols.map(s=>({label:s.getAttribute('aria-label'),text:s.innerText,glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})));
    assert.deepEqual(fallback.map(s=>s.text),['{1}','{1}','{B}'],'costs remain readable without font');
    assert.ok(fallback.every(s=>s.label&&s.glyph==='none'&&s.fallback!=='none'));
    for(const record of (kOnly?kRecords:payload.records.filter(r=>/^[FGHIJK]/.test(r.name)))){
      await noFont.evaluate(id=>VMX.open(id),record.id);
      await noFont.locator('.assessment-notes > summary').click();
      const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({text:s.innerText,raw:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));
      assert.ok(symbols.every(s=>s.text===s.raw&&s.label&&s.glyph==='none'),record.name+' readable F/G/H/I/J/K font-failure fallback');
      if(/^[GHIJK]/.test(record.name)&&!combinationsOnly) assert.deepEqual(symbols.map(s=>s.raw),(record.name.startsWith('K')?normalKTokens:record.name.startsWith('J')?normalJTokens:record.name.startsWith('I')?normalITokens:record.name.startsWith('H')?normalHTokens:normalGTokens).get(record.name),record.name+' same actual tokens in normal and blocked-font states');
    }
    for(const record of (kOnly?[]:payload.records.filter(r=>['Fuse','Friends forever','Hexproof from','Intimidate','Islandcycling','Islandwalk'].includes(r.name)))){
      await noFont.evaluate(()=>VMX.setView('az'));
      await noFont.evaluate(id=>VMX.open(id),record.id);
      const expected=record.access.combinations.map(item=>item.colors.join(''));
      assert.deepEqual(await noFont.locator(`#list .ent[data-k="${record.id}"] .combo-mark`).evaluateAll(marks=>marks.map(mark=>mark.dataset.combo)),expected);
      assert.ok(await noFont.locator(`#list .ent[data-k="${record.id}"] .combo-mark`).evaluateAll(marks=>marks.every(mark=>{const glyph=mark.querySelector('.ci3-svg,.ci4-svg,.ci5-svg,.ms');return getComputedStyle(glyph).display==='none'&&getComputedStyle(mark.querySelector('.combo-text')).display!=='none'})),record.name+' retains readable list combination letters without Mana');
      assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(marks=>marks.every(mark=>{const glyph=mark.querySelector('.ci3-svg,.ci4-svg,.ci5-svg,.ms');return getComputedStyle(glyph).display==='none'&&getComputedStyle(mark.querySelector('.combo-text')).display!=='none'})),record.name+' retains readable detail combination letters without Mana');
      await checkAccessSizes(noFont.locator(`#list .ent[data-k="${record.id}"]`),record.name+' no-font list',14,true);
      await checkAccessSizes(noFont.locator('#detail .supp-assessment'),record.name+' no-font detail',18,true);
      await noFont.locator('#q').fill(record.name);await noFont.locator('#q').focus();
      const option=noFont.locator(`#res-list .opt[data-k="${record.id}"]`);await option.waitFor({state:'visible'});
      await checkAccessSizes(option,record.name+' no-font search',14,true);
      await noFont.locator('#q').fill('');
    }
    if(kOnly){
      const kicker=kRecords.find(record=>record.name==='Kicker');
      await noFont.evaluate(()=>VMX.setView('az')); await noFont.evaluate(id=>VMX.open(id),kicker.id);
      const expected=kicker.access.combinations.map(item=>item.colors.join(''));
      assert.deepEqual(await noFont.locator(`#list .ent[data-k="${kicker.id}"] .combo-mark`).evaluateAll(marks=>marks.map(mark=>mark.dataset.combo)),expected,'Kicker no-font list retains exact combinations');
      assert.ok(await noFont.locator(`#list .ent[data-k="${kicker.id}"] .combo-mark`).evaluateAll(marks=>marks.every(mark=>getComputedStyle(mark.querySelector('.ci3-svg,.ci4-svg,.ci5-svg,.ms')).display==='none'&&getComputedStyle(mark.querySelector('.combo-text')).display!=='none')),'Kicker no-font list retains readable combination letters');
      assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(marks=>marks.every(mark=>getComputedStyle(mark.querySelector('.ci3-svg,.ci4-svg,.ci5-svg,.ms')).display==='none'&&getComputedStyle(mark.querySelector('.combo-text')).display!=='none')),'Kicker no-font detail retains readable combination letters');
      await checkAccessSizes(noFont.locator(`#list .ent[data-k="${kicker.id}"]`),'Kicker no-font list',18,true);
      await checkAccessSizes(noFont.locator('#detail .supp-assessment'),'Kicker no-font detail',18,true);
      await noFont.locator('#q').fill('Kicker'); await noFont.locator('#q').focus();
      const option=noFont.locator(`#res-list .opt[data-k="${kicker.id}"]`); await option.waitFor({state:'visible'});
      await checkAccessSizes(option,'Kicker no-font search',18,true); await noFont.locator('#q').fill('');
    }
    await noFont.close();
    const escaped=await browser.newPage(), injected=structuredClone(payload);
    injected.records.find(r=>r.name==='Explore').summary='<img src=x onerror=alert(1)> {unknown} {B}';
    await escaped.route(assessmentRoute,route=>route.fulfill({contentType:'application/json',body:JSON.stringify(injected)}));
    await escaped.goto(url);await escaped.waitForFunction(()=>VMX.assessments().status==='ready');
    await escaped.evaluate(()=>VMX.open('deck:vocabulary:explore'));
    await escaped.locator('.assessment-notes > summary').click();
    const escapedSummary=escaped.locator('.assessment-notes > p').first();
    assert.equal(await escapedSummary.locator('img').count(),0,'prose markup is escaped');
    assert.ok((await escapedSummary.textContent()).includes('<img src=x onerror=alert(1)> {unknown}'),'unknown notation remains readable');
    assert.equal(await escapedSummary.locator('.supp-symbol').getAttribute('aria-label'),'One black mana');
    await escaped.close();
    const fEscaped=await browser.newPage(),fInjected=structuredClone(payload);
    fInjected.records.find(r=>r.name==='Flashback').summary='<img src=x onerror=alert(1)> {unknown} {B/G} {9}';
    await fEscaped.route(assessmentRoute,route=>route.fulfill({contentType:'application/json',body:JSON.stringify(fInjected)}));
    await fEscaped.goto(url);await fEscaped.waitForFunction(()=>VMX.assessments().status==='ready');
    await fEscaped.evaluate(()=>VMX.open('deck:vocabulary:flashback'));await fEscaped.locator('.assessment-notes > summary').click();
    const fSummary=fEscaped.locator('.assessment-notes > p').first();
    assert.equal(await fSummary.locator('img').count(),0);assert.ok((await fSummary.textContent()).includes('<img src=x onerror=alert(1)> {unknown}'));
    assert.deepEqual(await fSummary.locator('.supp-symbol').evaluateAll(items=>items.map(s=>s.getAttribute('aria-label'))),['One black or green mana','9 generic mana']);
    await fEscaped.close();
    const gTokenText='{9} {W} {U} {B} {R} {G} {C} {X} {B/G} {G/U} {B/R} {G/W} {U/R} {W/B}';
    const gTokenLabels=['9 generic mana','One white mana','One blue mana','One black mana','One red mana','One green mana','One colorless mana','X generic mana','One black or green mana','One green or blue mana','One black or red mana','One green or white mana','One blue or red mana','One white or black mana'];
    const gUnsafe='<img src=x onerror=alert(1)> {unknown} '+gTokenText;
    for(const blocked of [false,true]){
      const gSafe=await browser.newPage(),gInjected=structuredClone(payload),gSupplement=structuredClone(supplement);
      const gScopes=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement-scope.v1.json'),'utf8'));
      for(const record of gSupplement.records.filter(r=>(kOnly?/^K/:/^[GHIJK]/).test(r.name)&&r.target2021===null)){
        record.clauses=[{number:'fixture',text:gUnsafe}];
        record.reference={title:'Fixture',verification:'fixture',rules:[],summary:gUnsafe,source:{title:'Fixture',url:'https://magic.wizards.com/en/news/making-magic/back-future-sight-part-3-2020-08-24'}};
      }
      const fixtureHash=createHash('sha256').update(JSON.stringify(gSupplement)).digest('hex');
      gScopes.payloadCanonicalSha256=fixtureHash;gInjected.supplementCanonicalSha256=fixtureHash;
      await gSafe.route('**/data/mechanics-supplement.v1.json*',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(gSupplement)}));
      await gSafe.route('**/data/mechanics-supplement-scope.v1.json*',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(gScopes)}));
      for(const record of gInjected.records.filter(r=>(kOnly?/^K/:/^[GHIJK]/).test(r.name))) record.summary=gUnsafe;
      if(blocked) await gSafe.route('**/mana-font@1.18.0/**',route=>route.abort());
      await gSafe.route(assessmentRoute,route=>route.fulfill({contentType:'application/json',body:JSON.stringify(gInjected)}));
      await gSafe.goto(url);await gSafe.waitForFunction(()=>VMX.assessments().status==='ready');
      if(!blocked) await gSafe.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
      for(const record of (kOnly?kRecords:[...gRecords,...hRecords,...iRecords,...jRecords,...kRecords])){
        await gSafe.evaluate(id=>VMX.open(id),record.id);await gSafe.locator('.assessment-notes > summary').click();
        for(const selector of ['.assessment-notes > p','#detail .supp-rules .dx-ex','#detail .supp-reference .supp-quote']){
          const prose=gSafe.locator(selector).first();assert.equal(await prose.locator('img').count(),0,record.name+' escapes markup in '+selector);
          assert.ok((await prose.textContent()).includes('<img src=x onerror=alert(1)> {unknown}'),record.name+' preserves unknown notation as text');
          const symbols=await prose.locator('.supp-symbol').evaluateAll(items=>items.map(s=>({label:s.getAttribute('aria-label'),role:s.getAttribute('role'),raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display,before:getComputedStyle(s.querySelector('.ms'),'::before').content,after:getComputedStyle(s.querySelector('.ms'),'::after').content})));
          assert.deepEqual(symbols.map(s=>s.label),gTokenLabels,record.name+' all G/H/I/J/K numeric/colored/colorless/X/hybrid tokens in '+selector);
          assert.ok(symbols.every(s=>s.role==='img'&&(blocked?s.glyph==='none'&&s.text===s.raw&&s.fallback!=='none':s.glyph!=='none'&&s.fallback==='none'&&s.before&&!['none','normal','""'].includes(s.before)&&(s.raw.includes('/')?s.after&&!['none','normal','""'].includes(s.after):true))),record.name+' accessible real glyphs or readable fallback');
          if(!blocked) assert.doesNotMatch(await prose.innerText(),/\{(?:9|W|U|B|R|G|C|X|B\/G|G\/U|B\/R|G\/W|U\/R|W\/B)\}/);
        }
      }
      await gSafe.close();
    }
    const blue=payload.records.find(r=>r.access.colors.U.status==='documented'); assert.ok(blue,'a documented blue example exists');
    await page.locator('#q').fill(blue.name); await page.locator('#q').press('Enter'); assert.equal(await page.locator('#dx-title').innerText(),blue.name);
    const accessBefore=await page.locator('.access-strip .sc').evaluateAll(slots=>slots.map(s=>s.className));
    await page.evaluate(()=>{VMX.chooseCombo('W');VMX.clearColors();VMX.setView('article');VMX.setView('az');}); assert.equal(await page.evaluate(math),baseline);
    assert.deepEqual(await page.locator('.access-strip .sc').evaluateAll(slots=>slots.map(s=>s.className)),accessBefore,'color lens never retiers access symbols');
    await page.setViewportSize({width:360,height:900}); assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true); await page.setViewportSize({width:1440,height:900});
    for(const scenario of ['missing','bad-status','unsafe-url','bad-binding','bad-g-date','bad-h-date','bad-i-date','bad-j-date','bad-k-date']){
      const fail=await browser.newPage(), bad=structuredClone(payload);
      if(scenario==='bad-status') bad.records[0].access.colors.W.status='invented';
      if(scenario==='unsafe-url') bad.records.find(r=>r.kind==='access').access.colors.W.findUrl='https://scryfall.com@evil.example/';
      if(scenario==='bad-binding') bad.sourceBindings[0].path='docs/mechanics-research/tampered.json';
      if(scenario==='bad-g-date') bad.records.find(r=>r.name==='Gift').researchDate='2026-10-28';
      if(scenario==='bad-h-date') bad.records.find(r=>r.name==='Harmonize').researchDate='2026-10-28';
      if(scenario==='bad-i-date') bad.records.find(r=>r.name==='Increment').researchDate='2026-10-28';
      if(scenario==='bad-j-date') bad.records.find(r=>r.name==='Jump').researchDate='2026-10-28';
      if(scenario==='bad-k-date') bad.records.find(r=>r.name==='Kicker').researchDate='2026-10-28';
      await fail.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));
      await fail.goto(url); await fail.waitForFunction(()=>VMX.assessments().status==='unavailable');
      assert.equal(await fail.evaluate(()=>VMX.assessments().records.length),0); assert.equal(await fail.locator('#list .access-strip').count(),0); await fail.close();
    }
    assert.deepEqual(errors,[]);
    results.push(kOnly ? 'Kicker, Kinship and Kinfall detail/search: exact selected links and card-specific prose, safe escaped assessment/rules/reference tokens, accessible glyph/no-font fallback, malformed K-date fail-soft, mobile containment and frozen baseline.' : combinationsOnly ? 'Fuse/Friends forever, Hexproof from, Intimidate, Islandcycling and Islandwalk list/detail: exact combinations, original Mana CI-3/CI-5 paths and native section colors, contained fills, 14px compact list/search and18px detail circles, matching independent access sizes and frozen2021 search12px, accessible labels and readable no-font fallback.' : 'All28 E,25 F,5 G,14 H,15 I,4 J and3 K mana-symbol paths: actual tokens plus G/H/I/J/K numeric/colored/colorless/X/hybrid fixtures in assessment/rules/reference, accessible real glyphs, no-font fallback and escaping; 36 exact G,59 H,96 I,17 J and15 K selected links, full observed H/I/J/K maps and factual trigger/timing regressions and Oct29 dates; C/D/E/F/G/H/I/J/K representative sources, unique combination citations and concise copy; 199 A/B/C/D/E/F/G/H/I/J/K access maps; documented/no-example/joint/colorless/rules cases; exact-example and retained non-card links; atomic malformed fail-soft; search keyboard/mobile; unchanged 2021 84 checks');
  }
  }
  await page.close();
  console.log(JSON.stringify({result:'PASS',checks:results},null,2));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
