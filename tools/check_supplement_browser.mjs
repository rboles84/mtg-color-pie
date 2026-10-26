// Focused integration checks. Uses an externally supplied Playwright installation;
// no package manager, runtime dependency, or remote provider query is introduced.
// node tools/check_supplement_browser.mjs --root . --playwright <absolute module>
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const args=process.argv.slice(2), option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const root=path.resolve(option('--root','.'));
const modulePath=option('--playwright',process.env.PLAYWRIGHT_PATH||'playwright');
const {chromium}=createRequire(import.meta.url)(modulePath);
const payload=JSON.parse(fs.readFileSync(path.join(root,'data/mechanics-supplement.v1.json'),'utf8'));
assert.equal(payload.schemaVersion,1); assert.equal(payload.records.length,390);
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
  const sorted=await page.evaluate(()=>[...document.querySelectorAll('#list .ent')].map(e=>{
    const label=e.querySelector('.e-lab').cloneNode(true);
    label.querySelectorAll('.e-tag,.e-q').forEach(e=>e.remove());
    return label.textContent.toLowerCase().replace(/[\u2018\u2019]/g,"'")
      .replace(/[\u201c\u201d"]/g,'').replace(/[\u2013\u2014]/g,'-').replace(/\u200b/g,'').replace(/\s+/g,' ').trim()
      .replace(/[.\s]+$/,'').replace(/^["'+\-]+/,'').replace(/['"]/g,'')+' '+(e.querySelector('.e-q')?.textContent.replace(/^ · /,'')||'');
  }));
  assert.ok(sorted.every((v,i)=>i===0||sorted[i-1]<=v));
  assert.match(await page.locator('#list-cap').innerText(),/587.*216.*2021.*371.*supplemental/);
  assert.match(await page.locator('#meta').innerText(),/216.*2021 entries.*2021 color placements/);
  const supplementalKeys=payload.records.filter(r=>!r.target2021).map(r=>r.id);
  for(const code of ['W','WB','WUBR','WUBRG']){
    await page.evaluate(code=>VMX.chooseCombo(code),code);
    const failures=await page.evaluate(keys=>keys.filter(k=>{
      const e=[...document.querySelectorAll('#list .ent')].find(e=>e.dataset.k===k);
      return !e||e.classList.contains('is-out')||e.classList.contains('is-off')||e.querySelector('.strip')||
        getComputedStyle(e).display==='none'||getComputedStyle(e).opacity!=='1'||
        !e.textContent.includes('Supplemental · Rankings unassigned')||!e.getAttribute('aria-label').includes('Rankings unassigned');
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
  assert.equal(await page.evaluate(mathSnapshot),beforeViews);
  pass('A–Z all 587 unique sorted destinations; 371 rows outside every tested lens/spotlight; immutable maths',true);
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
    assert.deepEqual(typography.map(p=>p.text),['No sourced Primary/Secondary/Tertiary assignment is recorded.',...training.clauses.map(c=>c.number+' '+c.text)]);
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
  for(const [kind,response] of [
    ['missing',{status:404,body:'missing'}],
    ['malformed',{status:200,body:'{'}],
    ['malformed record',{status:200,body:JSON.stringify({...payload,records:[{...payload.records[0],reference:42},...payload.records.slice(1)]})}],
    ['unsupported schema',{status:200,body:JSON.stringify({...payload,schemaVersion:999})}],
  ]) {
    const p=await browser.newPage();const failures=[];p.on('pageerror',e=>failures.push(e.message));
    await p.route('**/data/mechanics-supplement.v1.json',route=>route.fulfill({...response,contentType:'application/json'}));
    await p.goto(base+'/vox-color/mechanical-explorer.html');
    await p.waitForFunction(()=>window.VMX?.supplemental().status==='unavailable');
    assert.match(await p.locator('#supplement-status').innerText(),/unavailable/i);
    await p.locator('#q').fill('Flying');await p.locator('#q').press('Enter');
    assert.equal(await p.locator('#detail #dx-title').innerText(),'Flying');
    assert.equal(await p.locator('#detail .own-row').count(),5);
    assert.deepEqual(failures,[]);
    pass('supplement failure: '+kind,{status:'unavailable',legacyUsable:true});await p.close();
  }
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
