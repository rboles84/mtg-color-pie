// Focused A/B/C/D/E/F assessment checks using externally supplied Playwright; no new dependency.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
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
  assert.equal(await page.evaluate(()=>VMX.assessments().records.length),158);
  const expectedAssessmentIds=supplement.records.filter(r=>/^[ABCDEF]/.test(r.name)&&r.target2021===null).map(r=>r.id).sort();
  assert.deepEqual(payload.records.map(r=>r.id).sort(),expectedAssessmentIds,'every admitted A/B/C/D/E target has exactly one assessment');
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
    'docs/mechanics-research/f-protocol.json'
  ],'all fourteen canonical packet bindings are present');
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
    for(const record of combinationsOnly ? payload.records.filter(r=>['Fuse','Friends forever'].includes(r.name)) : payload.records){
      const row=page.locator(`#list .ent[data-k="${record.id}"]`), access=record.access, compactExamples=/^[CDEF]/.test(record.name);
      assert.equal(await row.locator('.access-strip').count(),record.kind==='access'?1:0,record.name);
      if(record.kind==='access'){
        const comboPresentation=['Fuse','Friends forever'].includes(record.name);
        if(comboPresentation){
          assert.deepEqual(await row.locator('.combo-mark').evaluateAll(marks=>marks.map(mark=>mark.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
          assert.equal(await row.locator('.combo-mark').evaluateAll(marks=>marks.every(mark=>mark.getAttribute('role')==='img'&&mark.getAttribute('aria-label').includes('combination only'))),true);
          assert.equal(await row.locator('.combo-mark .ms-wu,.combo-mark .ms-wb,.combo-mark .ms-ub,.combo-mark .ms-ur,.combo-mark .ms-br,.combo-mark .ms-bg,.combo-mark .ms-rg,.combo-mark .ms-rw,.combo-mark .ms-gw,.combo-mark .ms-gu').count(),access.combinations.filter(item=>item.colors.length===2).length);
          assert.equal(await row.locator('.combo-mark .ms-ci.ms-ci-3').count(),access.combinations.filter(item=>item.colors.length===3).length);
          if(record.name==='Fuse') assert.deepEqual(await row.locator('.combo-mark .ms-ci').evaluateAll(glyphs=>glyphs.map(glyph=>glyph.closest('.combo-mark').dataset.combo)),['WUG','UBR','WUR','BRG','WBG'],'Fuse covers every rendered three-color CI combination');
          assert.ok(await row.locator('.combo-mark .ms').evaluateAll(glyphs=>glyphs.every(glyph=>{const style=getComputedStyle(glyph), size=parseFloat(style.fontSize), nativeFactor=glyph.classList.contains('ms-cost')?1.35:.95;return Math.abs(parseFloat(style.lineHeight)-size*nativeFactor)<=1;})),record.name+' keeps Mana-native metrics at the scoped glyph size');
          assert.ok(await row.locator('.combo-mark').evaluateAll(marks=>{const pair=marks.find(mark=>mark.querySelector('.ms-cost')), ci=marks.find(mark=>mark.querySelector('.ms-ci'));if(!pair||!ci)return true;const a=pair.querySelector('.ms').getBoundingClientRect(),b=ci.querySelector('.ms').getBoundingClientRect();return Math.abs(a.width-b.width)<=.5&&Math.abs(a.height-b.height)<=.5;}),record.name+' normalizes pair and CI circle footprints');
          assert.ok(await row.locator('.combo-mark .ms-ci').evaluateAll(glyphs=>glyphs.every(glyph=>{const style=getComputedStyle(glyph), before=getComputedStyle(glyph,'::before');return style.boxShadow==='none'&&before.content!==''&&before.content!=='none'&&Math.abs(parseFloat(before.fontSize)-glyph.getBoundingClientRect().width)<=.5;})),record.name+' keeps each native CI border glyph while removing only its conflicting inset paint shadow');
          assert.ok(await row.locator('.combo-mark').evaluateAll(marks=>marks.every(mark=>{const r=mark.getBoundingClientRect(), g=mark.querySelector('.ms').getBoundingClientRect();return Math.abs(r.width-18)<=.5&&Math.abs(r.height-18)<=.5&&Math.abs((r.left+r.width/2)-(g.left+g.width/2))<=.5&&Math.abs((r.top+r.height/2)-(g.top+g.height/2))<=.5;})),record.name+' markers are stable square centered glyph hosts');
          assert.equal(await row.locator('.access-strip > .sc').count(),0);
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
      assert.doesNotMatch(await panel.innerText(),/Our assessment|Confidence:|Primary:|Secondary:|Tertiary:|assessment - provisional/i);
      if(record.kind==='access'){
        const comboPresentation=['Fuse','Friends forever'].includes(record.name);
        assert.equal(await panel.locator('.own-row').count(),comboPresentation?access.combinations.length:5+(access.colorless.status==='documented'?1:0));
        if(comboPresentation){
          assert.equal(await panel.locator('.own-row[data-c]').count(),0,record.name+' has no implied monocolor rows');
          assert.deepEqual(await panel.locator('.own-row[data-combo]').evaluateAll(rows=>rows.map(row=>row.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
          assert.ok(await panel.locator('.own-row .own-t').evaluateAll(nodes=>nodes.every(node=>node.textContent==='Combination only')));
          assert.deepEqual(await row.locator('.combo-mark').evaluateAll(marks=>marks.map(mark=>mark.dataset.combo)),access.combinations.map(item=>item.colors.join('')));
          assert.ok(await panel.locator('.own-row .ms-ci').evaluateAll(glyphs=>glyphs.every(glyph=>getComputedStyle(glyph).boxShadow==='none'&&getComputedStyle(glyph,'::before').content!=='none')),record.name+' detail keeps the native CI border without its conflicting inset paint shadow');
          assert.ok(await panel.locator('.own-row.combo-row').evaluateAll(rows=>rows.every(item=>{const mark=item.querySelector('.combo-mark').getBoundingClientRect(), glyph=item.querySelector('.combo-mark .ms').getBoundingClientRect(), label=item.querySelector('.own-c').getBoundingClientRect();return Math.abs(mark.width-mark.height)<=.5&&Math.abs(glyph.width-glyph.height)<=.5&&Math.abs((mark.left+mark.width/2)-(glyph.left+glyph.width/2))<=.5&&Math.abs((mark.top+mark.height/2)-(glyph.top+glyph.height/2))<=.5&&Math.abs((mark.top+mark.height/2)-(label.top+label.height/2))<=.5;})),record.name+' detail markers and labels remain centered');
        }
        assert.ok((await panel.innerText()).includes(record.scopeLabel));
        if(!comboPresentation) for(const color of 'WUBRG'){
          const item=access.colors[color], rowText=await panel.locator(`.own-row[data-c="${color}"]`).innerText();
          assert.match(rowText,new RegExp(item.status==='documented'?'Access':item.status==='multicolor_only'?'Combination only':item.status==='not_found'?'No example found':item.status==='not_applicable'?'Not applicable':'Insufficient evidence'));
        }
      }
      await notes.locator(':scope > summary').focus(); await page.keyboard.press('Enter'); assert.equal(await notes.getAttribute('open'),'');
      // Restore symbol fallback text only for exact authored-prose comparisons.
      // Separate visible-DOM assertions below prove the braces are not displayed.
      const noteText = /^[EF]/.test(record.name) ? await notes.evaluate(el=>{
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
      if(record.name.startsWith('F')) {
        assert.equal(await page.locator('#detail .dx-eg,#detail .cite').count(),0,record.name+' no inherited extra example/image');
        assert.deepEqual(await page.locator('#detail a').evaluateAll(links=>links.filter(a=>a.hostname==='scryfall.com'&&a.pathname.startsWith('/card/')).map(a=>a.href).sort()),expectedCardLinks,record.name+' whole-detail one-example link contract');
      }
      const linkedBuckets=cardBuckets.filter(item=>item.findUrl && (!compactExamples || item.cards.length>1));
      for(const findUrl of new Set(linkedBuckets.map(item=>item.findUrl))) assert.equal(await notes.locator(`a[href="${findUrl}"]`).count(),linkedBuckets.filter(item=>item.findUrl===findUrl).length,record.name+' renders every exact reviewed-card bucket link');
      assert.deepEqual(await notes.locator('a').evaluateAll(links=>links.filter(a=>a.protocol!=='https:'||!['scryfall.com','magic.wizards.com'].includes(a.hostname)||a.rel!=='noopener noreferrer').map(a=>a.href)),[]);
      if(/^[EF]/.test(record.name)) {
        await page.waitForFunction(()=>document.documentElement.classList.contains('supp-mana-ready'));
        const symbols=await page.locator('#detail').evaluate(el=>{
          const copy=el.cloneNode(true);
          copy.querySelectorAll('.supp-symbol').forEach(s=>s.replaceWith(s.querySelector('.supp-symbol-text').textContent));
          return {tokens:copy.textContent.match(/\{[^{}\r\n]+\}/g)||[],visible:el.innerText,
            rendered:[...el.querySelectorAll('.supp-symbol')].map(s=>({token:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),role:s.getAttribute('role'),fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display,glyph:getComputedStyle(s.querySelector('.ms')).display,before:getComputedStyle(s.querySelector('.ms'),'::before').content,after:getComputedStyle(s.querySelector('.ms'),'::after').content}))};
        });
        assert.deepEqual(symbols.rendered.map(s=>s.token),symbols.tokens,record.name+' every brace token becomes a symbol');
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
    const noFont=await browser.newPage();
    await noFont.route('**/mana-font@1.18.0/**',route=>route.abort());
    await noFont.goto(url);await noFont.waitForFunction(()=>VMX.assessments().status==='ready');
    await noFont.evaluate(()=>VMX.open('deck:vocabulary:explore'));
    await noFont.locator('.assessment-notes > summary').click();
    const fallback=await noFont.locator('.assessment-notes .supp-symbol').evaluateAll(symbols=>symbols.map(s=>({label:s.getAttribute('aria-label'),text:s.innerText,glyph:getComputedStyle(s.querySelector('.ms')).display,fallback:getComputedStyle(s.querySelector('.supp-symbol-text')).display})));
    assert.deepEqual(fallback.map(s=>s.text),['{1}','{1}','{B}'],'costs remain readable without font');
    assert.ok(fallback.every(s=>s.label&&s.glyph==='none'&&s.fallback!=='none'));
    for(const record of payload.records.filter(r=>r.name.startsWith('F'))){
      await noFont.evaluate(id=>VMX.open(id),record.id);
      await noFont.locator('.assessment-notes > summary').click();
      const symbols=await noFont.locator('#detail .supp-symbol').evaluateAll(items=>items.map(s=>({text:s.innerText,raw:s.querySelector('.supp-symbol-text').textContent,label:s.getAttribute('aria-label'),glyph:getComputedStyle(s.querySelector('.ms')).display})));
      assert.ok(symbols.every(s=>s.text===s.raw&&s.label&&s.glyph==='none'),record.name+' readable F font-failure fallback');
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
    results.push(combinationsOnly ? 'Fuse and Friends forever combination-only strips and detail rows: exact combinations, native CI borders without inset-shadow fringe, mana glyph classes, accessible labels, and no implied monocolor sockets.' : 'All28 E and25 F mana symbols, accessible names, hybrid halves, no-font fallback and escaping; C/D/E/F representative sources, unique combination citations and concise copy; 158 A/B/C/D/E/F access maps; documented/no-example/joint/colorless/rules cases; exact-example and retained non-card links; atomic malformed fail-soft; search keyboard/mobile; unchanged 2021 84 checks');
  }
  await page.close();
  console.log(JSON.stringify({result:'PASS',checks:results},null,2));
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
