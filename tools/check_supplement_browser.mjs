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
  pass('mapped Flash retains 2021 plus transferred text',true);
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
