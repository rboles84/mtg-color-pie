// Focused A/B/C/D/E/F/G/H assessment checks using externally supplied Playwright; no new dependency.
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
  assert.equal(await page.evaluate(()=>VMX.assessments().records.length),177);
  const expectedAssessmentIds=supplement.records.filter(r=>/^[ABCDEFGH]/.test(r.name)&&r.target2021===null).map(r=>r.id).sort();
  assert.deepEqual(payload.records.map(r=>r.id).sort(),expectedAssessmentIds,'every admitted A/B/C/D/E/F/G/H target has exactly one assessment');
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
    'docs/mechanics-research/g-protocol.json','docs/mechanics-research/h-protocol.json'
  ],'all sixteen canonical packet bindings are present');
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
  assert.equal(await hexproofRow.locator('.combo-mark[data-combo="WUB"] .ms-ci-3.ms-ci-wub').count(),1,'Hexproof from uses the pinned Mana CI-3 glyph for WUB');
  assert.equal(await hexproofRow.locator('.combo-mark[data-combo="WUBRG"] .ms-ci-5.ms-ci-wubrg').count(),1,'Hexproof from uses the pinned Mana CI-5 glyph for WUBRG');
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
  for(const record of payload.records) assert.equal(record.researchDate,(record.name.startsWith('G')||record.name.startsWith('H'))?'2026-10-29':'2026-10-28',record.name+' historical review date');
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
  const normalGTokens=new Map(), normalHTokens=new Map(); let gVisibleCardLinks=0, hVisibleCardLinks=0;
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
    for(const record of combinationsOnly ? payload.records.filter(r=>['Fuse','Friends forever','Hexproof from'].includes(r.name)) : payload.records){
      const row=page.locator(`#list .ent[data-k="${record.id}"]`), access=record.access, compactExamples=/^[CDEFGH]/.test(record.name);
      assert.equal(await row.locator('.access-strip').count(),record.kind==='access'?1:0,record.name);
      if(record.kind==='access'){
        const comboPresentation=['Fuse','Friends forever'].includes(record.name), mixedPresentation=record.name==='Hexproof from';
        if(comboPresentation || mixedPresentation){
          assert.deepEqual(await row.locator('.combo-mark').evaluateAll(marks=>marks.map(mark=>mark.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
          assert.equal(await row.locator('.combo-mark').evaluateAll(marks=>marks.every(mark=>mark.getAttribute('role')==='img'&&mark.getAttribute('aria-label').includes('combination only'))),true);
          assert.equal(await row.locator('.combo-mark .ms-wu,.combo-mark .ms-wb,.combo-mark .ms-ub,.combo-mark .ms-ur,.combo-mark .ms-br,.combo-mark .ms-bg,.combo-mark .ms-rg,.combo-mark .ms-rw,.combo-mark .ms-gw,.combo-mark .ms-gu').count(),access.combinations.filter(item=>item.colors.length===2).length);
          assert.equal(await row.locator('.combo-mark .ci3-svg').count(),access.combinations.filter(item=>['WUG','UBR','WUR','BRG','WBG'].includes(item.colors.join(''))).length);
          if(record.name==='Fuse') assert.deepEqual(await row.locator('.combo-mark .ci3-svg').evaluateAll(glyphs=>glyphs.map(glyph=>glyph.closest('.combo-mark').dataset.combo)),['WUG','UBR','WUR','BRG','WBG'],'Fuse covers every rendered three-color CI combination');
          assert.ok(await row.locator('.combo-mark .ms-cost').evaluateAll(glyphs=>glyphs.every(glyph=>{const style=getComputedStyle(glyph), size=parseFloat(style.fontSize);return Math.abs(parseFloat(style.lineHeight)-size*1.35)<=1;})),record.name+' keeps Mana-native pair metrics at the scoped glyph size');
          assert.ok(await row.locator('.combo-mark').evaluateAll(marks=>{const pair=marks.find(mark=>mark.querySelector('.ms-cost')), ci=marks.find(mark=>mark.querySelector('.ci3-svg'));if(!pair||!ci)return true;const a=pair.querySelector('.ms').getBoundingClientRect(),b=ci.querySelector('.ci3-svg').getBoundingClientRect();return Math.abs(a.width-b.width)<=.5&&Math.abs(a.height-b.height)<=.5;}),record.name+' normalizes pair and CI circle footprints');
          assert.ok(await row.locator('.combo-mark .ci3-svg').evaluateAll(glyphs=>glyphs.every(svg=>{const expected={WUG:['#3b6ba0','#3d684b','#fff'],UBR:['#c6553e','#3b6ba0','#383431'],WUR:['#c6553e','#fff','#3b6ba0'],BRG:['#3d684b','#383431','#c6553e'],WBG:['#383431','#3d684b','#fff']}[svg.closest('.combo-mark').dataset.combo], paths=[...svg.querySelectorAll('path')];return svg.getAttribute('viewBox')==='0 0 1024 1024'&&svg.querySelector('g')?.getAttribute('transform')==='translate(0 938.667) scale(1 -1)'&&paths.length===4&&paths[0].getAttribute('fill')==='#010101'&&paths.slice(1).map(path=>path.getAttribute('fill')).join('|')===expected.join('|');})),record.name+' renders the pinned Mana CI-3 outline and native interior colors in one shared vector frame');
          assert.ok(await row.locator('.combo-mark').evaluateAll(marks=>marks.every(mark=>{const r=mark.getBoundingClientRect(), g=mark.querySelector('.ms,.ci3-svg').getBoundingClientRect();return Math.abs(r.width-18)<=.5&&Math.abs(r.height-18)<=.5&&Math.abs((r.left+r.width/2)-(g.left+g.width/2))<=.5&&Math.abs((r.top+r.height/2)-(g.top+g.height/2))<=.5;})),record.name+' markers are stable square centered glyph hosts');
          assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(slots=>slots.map(s=>s.dataset.c)),comboPresentation?[]:['W','U','B','G','C']);
        } else assert.deepEqual(await row.locator('.access-strip > .sc').evaluateAll(slots=>slots.map(s=>s.dataset.c)),[...'WUBRG',...(access.colorless.status==='documented'?['C']:[])]);
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
      assert.ok((await panel.innerText()).includes(/^[GH]/.test(record.name)?'October 29, 2026':'October 28, 2026'),record.name+' displayed review date');
      assert.doesNotMatch(await panel.innerText(),/Our assessment|Confidence:|Primary:|Secondary:|Tertiary:|assessment - provisional/i);
      if(record.kind==='access'){
        const comboPresentation=['Fuse','Friends forever'].includes(record.name), mixedPresentation=record.name==='Hexproof from';
        assert.equal(await panel.locator('.own-row').count(),comboPresentation?access.combinations.length:mixedPresentation?5+access.combinations.length:5+(access.colorless.status==='documented'?1:0));
        if(comboPresentation){
          assert.equal(await panel.locator('.own-row[data-c]').count(),0,record.name+' has no implied monocolor rows');
          assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(rows=>rows.map(row=>row.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
          assert.ok(await panel.locator('.own-row .own-t').evaluateAll(nodes=>nodes.every(node=>node.textContent==='Combination only')));
          assert.deepEqual(await row.locator('.combo-mark').evaluateAll(marks=>marks.map(mark=>mark.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
          assert.ok(await panel.locator('.own-row .ci3-svg').evaluateAll(glyphs=>glyphs.every(svg=>svg.getAttribute('viewBox')==='0 0 1024 1024'&&svg.querySelectorAll('path').length===4&&svg.querySelector('g')?.getAttribute('transform')==='translate(0 938.667) scale(1 -1)')),record.name+' detail keeps the four-path Mana CI-3 vector in its shared frame');
          assert.ok(await panel.locator('.own-row.combo-row').evaluateAll(rows=>rows.every(item=>{const mark=item.querySelector('.combo-mark').getBoundingClientRect(), glyph=item.querySelector('.combo-mark .ms,.combo-mark .ci3-svg').getBoundingClientRect(), label=item.querySelector('.own-c').getBoundingClientRect();return Math.abs(mark.width-mark.height)<=.5&&Math.abs(glyph.width-glyph.height)<=.5&&Math.abs((mark.left+mark.width/2)-(glyph.left+glyph.width/2))<=.5&&Math.abs((mark.top+mark.height/2)-(glyph.top+glyph.height/2))<=.5&&Math.abs((mark.top+mark.height/2)-(label.top+label.height/2))<=.5;})),record.name+' detail markers and labels remain centered');
        } else if(mixedPresentation){
          assert.deepEqual(await panel.locator('.own-row[data-c]').evaluateAll(rows=>rows.map(row=>row.dataset.c)),['W','U','B','G','C']);
          assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(rows=>rows.map(row=>row.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
        }
        assert.ok((await panel.innerText()).includes(record.scopeLabel));
        if(!comboPresentation && !mixedPresentation) for(const color of 'WUBRG'){
          const item=access.colors[color], rowText=await panel.locator(`.own-row[data-c="${color}"]`).innerText();
          assert.match(rowText,new RegExp(item.status==='documented'?'Access':item.status==='multicolor_only'?'Combination only':item.status==='not_found'?'No example found':item.status==='not_applicable'?'Not applicable':'Insufficient evidence'));
        }
      }
      await notes.locator(':scope > summary').focus(); await page.keyboard.press('Enter'); assert.equal(await notes.getAttribute('open'),'');
      // Restore symbol fallback text only for exact authored-prose comparisons.
      // Separate visible-DOM assertions below prove the braces are not displayed.
      const noteText = /^[EFGH]/.test(record.name) ? await notes.evaluate(el=>{
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
      if(/^[FGH]/.test(record.name)) {
        assert.equal(await page.locator('#detail .dx-eg,#detail .cite').count(),0,record.name+' no inherited extra example/image');
        assert.deepEqual(await page.locator('#detail a').evaluateAll(links=>links.filter(a=>a.hostname==='scryfall.com'&&a.pathname.startsWith('/card/')).map(a=>a.href).sort()),expectedCardLinks,record.name+' whole-detail one-example link contract');
      }
      if(record.name.startsWith('G')) gVisibleCardLinks+=expectedCardLinks.length;
      if(record.name.startsWith('H')) hVisibleCardLinks+=expectedCardLinks.length;
      const linkedBuckets=cardBuckets.filter(item=>item.findUrl && (!compactExamples || item.cards.length>1));
      for(const findUrl of new Set(linkedBuckets.map(item=>item.findUrl))) assert.equal(await notes.locator(`a[href="${findUrl}"]`).count(),linkedBuckets.filter(item=>item.findUrl===findUrl).length,record.name+' renders every exact reviewed-card bucket link');
      assert.deepEqual(await notes.locator('a').evaluateAll(links=>links.filter(a=>a.protocol!=='https:'||!['scryfall.com','magic.wizards.com'].includes(a.hostname)||a.rel!=='noopener noreferrer').map(a=>a.href)),[]);
      if(/^[EFGH]/.test(record.name)) {
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
    if(!combinationsOnly) {assert.equal(gVisibleCardLinks,36,'all G detail panels show exactly the 36 selected links');assert.equal(hVisibleCardLinks,59,'all H detail panels show exactly the 59 selected links');}
    const noFont=await browser.newPage();
    await noFont.route('**/mana-font@1.18.0/**',route=>route.abort());
    await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');
    await noFont.evaluate(()=>VMX.open('deck:vocabulary:explore'));
    await noFont.locator('.assessment-notes > summary').click();
    const fallback=await noFont.locator('.assessment-notes .supp-symbol').evaluateAll(symbols=>symbols.map(s=>({label:s.getAttribute('aria-label'),text:s.innerText,glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})));
    assert.deepEqual(fallback.map(s=>s.text),['{1}','{1}','{B}'],'costs remain readable without font');
    assert.ok(fallback.every(s=>s.label&&s.glyph==='none'&&s.fallback!=='none'));
    for(const record of payload.records.filter(r=>/^[FGH]/.test(r.name))){
      await noFont.evaluate(id=>VMX.open(id),record.id);
      await noFont.locator('.assessment-notes > summary').click();
      const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({text:s.innerText,raw:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));
      assert.ok(symbols.every(s=>s.text===s.raw&&s.label&&s.glyph==='none'),record.name+' readable F/G/H font-failure fallback');
      if(/^[GH]/.test(record.name)&&!combinationsOnly) assert.deepEqual(symbols.map(s=>s.raw),(record.name.startsWith('H')?normalHTokens:normalGTokens).get(record.name),record.name+' same actual tokens in normal and blocked-font states');
    }
    for(const record of payload.records.filter(r=>['Fuse','Friends forever','Hexproof from'].includes(r.name))){
      await noFont.evaluate(()=>VMX.setView('az'));
      await noFont.evaluate(id=>VMX.open(id),record.id);
      const expected=record.access.combinations.map(item=>item.colors.join(''));
      assert.deepEqual(await noFont.locator(`#list .ent[data-k="${record.id}"] .combo-mark`).evaluateAll(marks=>marks.map(mark=>mark.dataset.combo)),expected);
      assert.ok(await noFont.locator(`#list .ent[data-k="${record.id}"] .combo-mark`).evaluateAll(marks=>marks.every(mark=>{const glyph=mark.querySelector('.ci3-svg,.ms');return getComputedStyle(glyph).display==='none'&&getComputedStyle(mark.querySelector('.combo-text')).display!=='none'})),record.name+' retains readable list combination letters without Mana');
      assert.ok(await noFont.locator('#detail .combo-mark').evaluateAll(marks=>marks.every(mark=>{const glyph=mark.querySelector('.ci3-svg,.ms');return getComputedStyle(glyph).display==='none'&&getComputedStyle(mark.querySelector('.combo-text')).display!=='none'})),record.name+' retains readable detail combination letters without Mana');
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
      for(const record of gSupplement.records.filter(r=>/^[GH]/.test(r.name)&&r.target2021===null)){
        record.clauses=[{number:'fixture',text:gUnsafe}];
        record.reference={title:'Fixture',verification:'fixture',rules:[],summary:gUnsafe,source:{title:'Fixture',url:'https://magic.wizards.com/en/news/making-magic/back-future-sight-part-3-2020-08-24'}};
      }
      const fixtureHash=createHash('sha256').update(JSON.stringify(gSupplement)).digest('hex');
      gScopes.payloadCanonicalSha256=fixtureHash;gInjected.supplementCanonicalSha256=fixtureHash;
      await gSafe.route('**/data/mechanics-supplement.v1.json*',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(gSupplement)}));
      await gSafe.route('**/data/mechanics-supplement-scope.v1.json*',route=>route.fulfill({contentType:'application/json',body:JSON.stringify(gScopes)}));
      for(const record of gInjected.records.filter(r=>/^[GH]/.test(r.name))) record.summary=gUnsafe;
      if(blocked) await gSafe.route('**/mana-font@1.18.0/**',route=>route.abort());
      await gSafe.route(assessmentRoute,route=>route.fulfill({contentType:'application/json',body:JSON.stringify(gInjected)}));
      await gSafe.goto(url);await gSafe.waitForFunction(()=>VMX.assessments().status==='ready');
      if(!blocked) await gSafe.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
      for(const record of [...gRecords,...hRecords]){
        await gSafe.evaluate(id=>VMX.open(id),record.id);await gSafe.locator('.assessment-notes > summary').click();
        for(const selector of ['.assessment-notes > p','#detail .supp-rules .dx-ex','#detail .supp-reference .supp-quote']){
          const prose=gSafe.locator(selector).first();assert.equal(await prose.locator('img').count(),0,record.name+' escapes markup in '+selector);
          assert.ok((await prose.textContent()).includes('<img src=x onerror=alert(1)> {unknown}'),record.name+' preserves unknown notation as text');
          const symbols=await prose.locator('.supp-symbol').evaluateAll(items=>items.map(s=>({label:s.getAttribute('aria-label'),role:s.getAttribute('role'),raw:s.querySelector('.supp-symbol-text').textContent,text:s.innerText,glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display,before:getComputedStyle(s.querySelector('.ms'),'::before').content,after:getComputedStyle(s.querySelector('.ms'),'::after').content})));
          assert.deepEqual(symbols.map(s=>s.label),gTokenLabels,record.name+' all G/H numeric/colored/colorless/X/hybrid tokens in '+selector);
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
    for(const scenario of ['missing','bad-status','unsafe-url','bad-binding','bad-g-date','bad-h-date']){
      const fail=await browser.newPage(), bad=structuredClone(payload);
      if(scenario==='bad-status') bad.records[0].access.colors.W.status='invented';
      if(scenario==='unsafe-url') bad.records.find(r=>r.kind==='access').access.colors.W.findUrl='https://scryfall.com@evil.example/';
      if(scenario==='bad-binding') bad.sourceBindings[0].path='docs/mechanics-research/tampered.json';
      if(scenario==='bad-g-date') bad.records.find(r=>r.name==='Gift').researchDate='2026-10-28';
      if(scenario==='bad-h-date') bad.records.find(r=>r.name==='Harmonize').researchDate='2026-10-28';
      await fail.route(assessmentRoute,route=>route.fulfill(scenario==='missing'?{status:404,body:'Missing'}:{contentType:'application/json',body:JSON.stringify(bad)}));
      await fail.goto(url); await fail.waitForFunction(()=>VMX.assessments().status==='unavailable');
      assert.equal(await fail.evaluate(()=>VMX.assessments().records.length),0); assert.equal(await fail.locator('#list .access-strip').count(),0); await fail.close();
    }
    assert.deepEqual(errors,[]);
    results.push(combinationsOnly ? 'Fuse and Friends forever combination-only strips and detail rows: exact combinations, pinned Mana CI-3 vectors, accessible labels, readable no-font fallback, and no implied monocolor sockets.' : 'All28 E,25 F,5 G and14 H mana-symbol paths: actual tokens plus G/H numeric/colored/colorless/X/hybrid fixtures in assessment/rules/reference, accessible real glyphs, no-font fallback and escaping; 36 exact G and59 H selected links, full observed H maps and factual trigger/timing regressions and Oct29 dates; C/D/E/F/G/H representative sources, unique combination citations and concise copy; 177 A/B/C/D/E/F/G/H access maps; documented/no-example/joint/colorless/rules cases; exact-example and retained non-card links; atomic malformed fail-soft; search keyboard/mobile; unchanged 2021 84 checks');
  }
  await page.close();
  console.log(JSON.stringify({result:'PASS',checks:results},null,2));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
