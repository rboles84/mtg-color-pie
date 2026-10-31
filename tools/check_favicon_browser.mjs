import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';

const args=process.argv.slice(2), arg=n=>{const i=args.indexOf(n);return i<0?null:args[i+1];}, root=path.resolve(arg('--root')||'.'), site=arg('--site-root')&&path.resolve(arg('--site-root'));
const { chromium }=createRequire(import.meta.url)(arg('--playwright'));
const base=site||root, icon=fs.readFileSync(path.join(base,'favicon.ico'));
assert.ok(icon.subarray(0,4).equals(Buffer.from([0,0,1,0])),'favicon is ICO');
const server=http.createServer((req,res)=>{const rel=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\//,'')||'index.html', file=path.join(base,rel);if(!file.startsWith(base)||!fs.existsSync(file)){res.writeHead(404);return res.end();}res.writeHead(200);res.end(fs.readFileSync(file));});
await new Promise(done=>server.listen(0,'127.0.0.1',done));const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'msedge',headless:true});try{const page=await browser.newPage(), cdp=await page.context().newCDPSession(page), seen=[];cdp.on('Network.responseReceived',e=>seen.push([e.response.url,e.response.status]));await cdp.send('Network.enable');await page.goto(origin+'/',{waitUntil:'networkidle'});await page.goto(origin+'/vox-color/mechanical-explorer.html',{waitUntil:'networkidle'});const icons=seen.filter(([u])=>u.endsWith('/favicon.ico'));assert.ok(icons.length,'cold browser requested favicon');assert.ok(icons.every(([,s])=>s===200),JSON.stringify(icons));console.log(JSON.stringify({result:'PASS',favicon:icons}));}finally{await browser.close();server.close();}
