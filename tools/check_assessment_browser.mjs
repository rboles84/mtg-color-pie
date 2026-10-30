// Focused A/B/C/D/E/F/G/H/I/J/K assessment checks using externally supplied Playwright; no new dependency.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const args=process.argv.slice(2), opt=(n,d)=>args.includes(n)?args[args.indexOf(n)+1]:d;
const root=path.resolve(opt('--root','.'));
const copyOnly=args.includes('--copy-only');
const combinationsOnly=args.includes('--combinations-only');
const kOnly=args.includes('--k-only');
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
const ciPalettes={"WUG":["#3b6ba0","#3d684b","#fff"],"UBR":["#c6553e","#3b6ba0","#383431"],"WUR":["#c6553e","#fff","#3b6ba0"],"BRG":["#3d684b","#383431","#c6553e"],"WBG":["#383431","#3d684b","#fff"],"WUB":["#383431","#fff","#3b6ba0"],"WUBRG":["#c6553e","#383431","#3b6ba0","#3d684b","#fff"]};
async function checkCIVectors(host,label,size=18){
  assert.equal(await host.locator('.combo-mark .ms-ci').count(),0,label+' has no independent CI font/gradient layer');
  const glyphs=await host.locator('.ci3-svg,.ci5-svg').evaluateAll(items=>items.map(svg=>{
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
  const marks=await host.locator('.combo-mark,.access-strip > .sc,.own-row > .sc').evaluateAll(items=>items.map(mark=>{
    const box=mark.getBoundingClientRect(),combo=mark.classList.contains('combo-mark');
    const glyph=mark.querySelector('.ms,.ci3-svg,.ci5-svg'),ink=glyph.getBoundingClientRect();
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
  assert.equal(await page.evaluate(()=>VMX.assessments().records.length),199);
  const expectedAssessmentIds=supplement.records.filter(r=>/^[ABCDEFGHIJK]/.test(r.name)&&r.target2021===null).map(r=>r.id).sort();
  assert.deepEqual(payload.records.map(r=>r.id).sort(),expectedAssessmentIds,'every admitted A/B/C/D/E/F/G/H/I/J/K target has exactly one assessment');
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
    'docs/mechanics-research/g-protocol.json','docs/mechanics-research/h-protocol.json','docs/mechanics-research/i-protocol.json','docs/mechanics-research/j-protocol.json','docs/mechanics-research/k-protocol.json'
  ],'all nineteen canonical packet bindings are present');
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
  for(const record of payload.records) assert.equal(record.researchDate,(record.name.startsWith('G')||record.name.startsWith('H')||record.name.startsWith('I')||record.name.startsWith('J')||record.name.startsWith('K'))?'2026-10-29':'2026-10-28',record.name+' historical review date');
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
    for(const record of kOnly ? kRecords : combinationsOnly ? payload.records.filter(r=>['Fuse','Friends forever','Hexproof from','Intimidate','Islandcycling','Islandwalk'].includes(r.name)) : payload.records){
      const row=page.locator(`#list .ent[data-k="${record.id}"]`), access=record.access, compactExamples=/^[CDEFGHIJK]/.test(record.name);
      assert.equal(await row.locator('.access-strip').count(),record.kind==='access'?1:0,record.name);
      if(record.kind==='access'){
        const comboPresentation=['Fuse','Friends forever'].includes(record.name), mixedPresentation=['Hexproof from','Intimidate','Islandcycling','Islandwalk','Kicker'].includes(record.name), independentSlots=[...('WUBRG')].filter(color=>access.colors[color].status==='documented').concat(access.colorless.status==='documented'?['C']:[]);
        if(comboPresentation || mixedPresentation){
          assert.deepEqual(await row.locator('.combo-mark').evaluateAll(marks=>marks.map(mark=>mark.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
          assert.equal(await row.locator('.combo-mark').evaluateAll(marks=>marks.every(mark=>mark.getAttribute('role')==='img'&&mark.getAttribute('aria-label').includes('combination only'))),true);
          assert.equal(await row.locator('.combo-mark .ms-wu,.combo-mark .ms-wb,.combo-mark .ms-ub,.combo-mark .ms-ur,.combo-mark .ms-br,.combo-mark .ms-bg,.combo-mark .ms-rg,.combo-mark .ms-rw,.combo-mark .ms-gw,.combo-mark .ms-gu').count(),access.combinations.filter(item=>item.colors.length===2).length);
          assert.equal(await row.locator('.combo-mark .ci3-svg').count(),access.combinations.filter(item=>item.colors.length===3).length);
          if(record.name==='Fuse') assert.deepEqual(await row.locator('.combo-mark .ci3-svg').evaluateAll(glyphs=>glyphs.map(glyph=>glyph.closest('.combo-mark').dataset.combo)),['WUG','UBR','WUR','BRG','WBG'],'Fuse covers every rendered three-color CI combination');
          assert.ok(await row.locator('.combo-mark .ms-cost').evaluateAll(glyphs=>glyphs.every(glyph=>{const style=getComputedStyle(glyph), size=parseFloat(style.fontSize);return Math.abs(parseFloat(style.lineHeight)-size*1.35)<=1;})),record.name+' keeps Mana-native pair metrics at the scoped glyph size');
          assert.ok(await row.locator('.combo-mark').evaluateAll(marks=>{const pair=marks.find(mark=>mark.querySelector('.ms-cost')), ci=marks.find(mark=>mark.querySelector('.ci3-svg,.ci5-svg'));if(!pair||!ci)return true;const a=pair.querySelector('.ms').getBoundingClientRect(),b=ci.querySelector('.ci3-svg,.ci5-svg').getBoundingClientRect();return Math.abs(a.width-b.width)<=.5&&Math.abs(a.height-b.height)<=.5;}),record.name+' normalizes pair and CI circle footprints');
          assert.ok(await row.locator('.combo-mark .ci3-svg').evaluateAll(glyphs=>glyphs.every(svg=>{const expected={WUG:['#3b6ba0','#3d684b','#fff'],UBR:['#c6553e','#3b6ba0','#383431'],WUR:['#c6553e','#fff','#3b6ba0'],BRG:['#3d684b','#383431','#c6553e'],WBG:['#383431','#3d684b','#fff'],WUB:['#383431','#fff','#3b6ba0']}[svg.closest('.combo-mark').dataset.combo], paths=[...svg.querySelectorAll('path')];return svg.getAttribute('viewBox')==='0 0 1024 1024'&&svg.querySelector('g')?.getAttribute('transform')==='translate(0 938.667) scale(1 -1)'&&paths.length===4&&paths[0].getAttribute('fill')==='#010101'&&paths.slice(1).map(path=>path.getAttribute('fill')).join('|')===expected.join('|');})),record.name+' renders the pinned Mana CI-3 outline and native interior colors in one shared vector frame');
          const listSize=record.name==='Kicker'?18:14;
          assert.ok(await row.locator('.combo-mark').evaluateAll((marks,size)=>marks.every(mark=>{const r=mark.getBoundingClientRect(), g=mark.querySelector('.ms,.ci3-svg,.ci5-svg').getBoundingClientRect();return Math.abs(r.width-size)<=.5&&Math.abs(r.height-size)<=.5&&Math.abs((r.left+r.width/2)-(g.left+g.width/2))<=.5&&Math.abs((r.top+r.height/2)-(g.top+g.height/2))<=.5;}),listSize),record.name+' combination markers have expected hosts and centered glyphs');
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
          assert.ok(await option.locator('.combo-mark').evaluateAll(items=>items.every(item=>item.getAttribute('aria-label').endsWith('combination only'))),'Kicker search labels combinations without implied independent access');
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
      assert.ok((await panel.innerText()).includes(/^[GHIJK]/.test(record.name)?'October 29, 2026':'October 28, 2026'),record.name+' displayed review date');
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
          assert.ok(await panel.locator('.own-row[data-combo] .own-t').evaluateAll(nodes=>nodes.every(node=>node.textContent==='Combination only')),record.name+' labels combinations without implying independent access');
        }
        if(comboPresentation||mixedPresentation){await checkAccessSizes(panel,record.name+' detail',18);await checkCIVectors(panel,record.name+' detail');}
        assert.ok((await panel.innerText()).includes(record.scopeLabel));
        if(!comboPresentation && !mixedPresentation) for(const color of 'WUBRG'){
          const item=access.colors[color], rowText=await panel.locator(`.own-row[data-c="${color}"]`).innerText();
          assert.match(rowText,new RegExp(item.status==='documented'?'Access':item.status==='multicolor_only'?'Combination only':item.status==='not_found'?'No example found':item.status==='not_applicable'?'Not applicable':'Insufficient evidence'));
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
      assert.ok(await noFont.locator(`#list .ent[data-k="${record.id}"] .combo-mark`).evaluateAll(marks=>marks.every(mark=>{const glyph=mark.querySelector('.ci3-svg,.ci5-svg,.ms');return getComputedStyle(glyph).display==='none'&&getComputedStyle(mark.querySelector('.combo-text')).display!=='none'})),record.name+' retains readable list combination letters without Mana');
      assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(marks=>marks.every(mark=>{const glyph=mark.querySelector('.ci3-svg,.ci5-svg,.ms');return getComputedStyle(glyph).display==='none'&&getComputedStyle(mark.querySelector('.combo-text')).display!=='none'})),record.name+' retains readable detail combination letters without Mana');
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
      assert.ok(await noFont.locator(`#list .ent[data-k="${kicker.id}"] .combo-mark`).evaluateAll(marks=>marks.every(mark=>getComputedStyle(mark.querySelector('.ci3-svg,.ci5-svg,.ms')).display==='none'&&getComputedStyle(mark.querySelector('.combo-text')).display!=='none')),'Kicker no-font list retains readable combination letters');
      assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(marks=>marks.every(mark=>getComputedStyle(mark.querySelector('.ci3-svg,.ci5-svg,.ms')).display==='none'&&getComputedStyle(mark.querySelector('.combo-text')).display!=='none')),'Kicker no-font detail retains readable combination letters');
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
  await page.close();
  console.log(JSON.stringify({result:'PASS',checks:results},null,2));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
