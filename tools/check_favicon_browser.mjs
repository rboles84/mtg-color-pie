import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';

const args=process.argv.slice(2), opt=(name,fallback)=>{const i=args.indexOf(name);return i<0?fallback:args[i+1];};
const root=path.resolve(opt('--root','.')),site=path.resolve(opt('--site-root',root));
const {chromium}=createRequire(import.meta.url)(opt('--playwright','playwright'));
const types={'.html':'text/html; charset=utf-8','.json':'application/json','.ico':'image/vnd.microsoft.icon','.csv':'text/csv; charset=utf-8'};
const server=http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);}catch{res.writeHead(400);return res.end();}const file=path.resolve(site,'.'+pathname+(pathname.endsWith('/')?'index.html':''));if(!file.startsWith(site+path.sep)){res.writeHead(403);return res.end();}try{const bytes=fs.readFileSync(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(bytes);}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
const results=[];let failed=false;
try{
  for(const entry of ['/','/vox-color/color-wheel.html','/vox-color/mechanical-explorer.html','/vox-color/index.html']){
    const browser=await chromium.launch({channel:'msedge',headless:true});
    const context=await browser.newContext(),page=await context.newPage(),cdp=await context.newCDPSession(page);
    const record={entry,responses:[],console:[],logs:[],pageErrors:[],requestFailures:[]};results.push(record);
    page.on('console',m=>{if(m.type()==='error')record.console.push({text:m.text(),location:m.location()});});
    page.on('pageerror',e=>record.pageErrors.push(String(e)));
    page.on('requestfailed',r=>record.requestFailures.push({url:r.url(),failure:r.failure()?.errorText}));
    cdp.on('Log.entryAdded',({entry:e})=>{if(e.level==='error')record.logs.push({text:e.text,url:e.url,lineNumber:e.lineNumber,source:e.source});});
    cdp.on('Network.responseReceived',({response:r})=>{if(r.url.endsWith('/favicon.ico')||r.status>=400)record.responses.push({url:r.url,status:r.status,mimeType:r.mimeType});});
    await cdp.send('Network.enable');await cdp.send('Log.enable');
    try{
      await page.goto(origin+entry,{waitUntil:'domcontentloaded'});
      if(entry.endsWith('mechanical-explorer.html')) await page.waitForFunction(()=>window.VMX && document.querySelectorAll('#list .ent').length >= 216);
      else if(entry.endsWith('color-wheel.html')) await page.waitForFunction(()=>document.querySelector('#wheel') && document.querySelectorAll('#atlas > *').length > 0);
      else await page.frameLocator('#frame-wheel').locator('#wheel').waitFor();
      record.startup='PASS';await page.waitForTimeout(1800);
      const implicit=record.responses.filter(r=>r.url===origin+'/favicon.ico');record.implicitFavicon=implicit;
      record.decode=await page.evaluate(async()=>{const image=new Image();return await new Promise(resolve=>{image.onload=()=>resolve({ok:true,width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>resolve({ok:false});image.src='/favicon.ico?decode=1';});});
      const errors=[];if(!implicit.length)errors.push('implicit favicon request was not observed');else if(implicit.some(r=>r.status!==200))errors.push('implicit favicon response was not HTTP 200');
      if(!record.decode.ok||!record.decode.width||!record.decode.height)errors.push('favicon failed browser image decode');
      if(record.responses.some(r=>r.status>=400))errors.push('HTTP error response');if(record.console.length)errors.push('console error');if(record.logs.length)errors.push('CDP log error');if(record.pageErrors.length)errors.push('page error');if(record.requestFailures.length)errors.push('request failure');
      record.errors=errors;record.status=errors.length?'FAIL':'PASS';if(errors.length)failed=true;
    }catch(e){record.status='FAIL';record.errors=[String(e)];failed=true;}
    await context.close();await browser.close();
  }
  console.log(JSON.stringify({result:failed?'FAIL':'PASS',site,results},null,2));
  assert.equal(failed,false,'one or more cold entry checks failed; see diagnostics above');
}finally{await new Promise(resolve=>server.close(resolve));}
