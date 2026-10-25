/** Offline, deterministic transport of existing trusted mechanic evidence. No network or query execution. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {pathToFileURL,fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const REVISION='6c54dbb49d6161985d104625efd5bd46f36e31d2';
const EVIDENCE='docs/mechanics-transfer';
const PAYLOAD='data/mechanics-supplement.v1.json';
const OUTPUTS=[PAYLOAD,`${EVIDENCE}/manifest.json`,`${EVIDENCE}/sources.json`,`${EVIDENCE}/REPORT.md`];
const ALLOWED=new Set(['HANDOFF.md','vox-color/mechanical-explorer.html',PAYLOAD,'.github/pages/package.py','tools/transfer_mechanics.mjs','tools/check_supplement_browser.mjs',...OUTPUTS]);
const SHARED=['deathtouch','defender','double strike','fight','first strike','flash','flying','haste','hexproof','indestructible','lifelink','menace','protection','prowess','reach','scry','trample','vigilance'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const json=value=>JSON.stringify(value,null,2)+'\n';
const read=(base,file)=>fs.readFileSync(path.join(base,file));
const parse=(base,file)=>JSON.parse(read(base,file));
const git=(base,args)=>execFileSync('git',['-C',base,...args],{encoding:'utf8',maxBuffer:16*1024*1024}).trimEnd();
const imported=async(base,file)=>import(pathToFileURL(path.join(base,file)).href);
const assertEqual=(a,b,message)=>assert.equal(JSON.stringify(a),JSON.stringify(b),message);
const sourceArgs=process.argv.indexOf('--source');
const sourceDir=sourceArgs<0?null:path.resolve(process.argv[sourceArgs+1]??'');
const checking=process.argv.includes('--check');
assert(checking||sourceDir,'Transfer requires --source <trusted source checkout>; --check reproduces offline from snapshots.');
const frozenFiles=()=>git(ROOT,['ls-files','-z']).split('\0').filter(f=>f&&!ALLOWED.has(f));
const fileHashes=(base,files)=>Object.fromEntries([...new Set(files)].sort().filter(f=>fs.existsSync(path.join(base,f))).map(f=>[f,hash(read(base,f))]));
function sourceFiles(base){
  // The complete tracked checkout plus untracked source/query paths is byte-protected.
  const tracked=git(base,['ls-files','-z']).split('\0').filter(Boolean);
  const untracked=git(base,['ls-files','--others','--exclude-standard','-z','--','public','inputs','lib','scripts','tests']).split('\0').filter(Boolean);
  return [...tracked,...untracked];
}
function verifyHashes(base,entries,label){
  for(const [file,sha] of Object.entries(entries))assert.equal(hash(read(base,file)),sha,`${label} drift: ${file}`);
}
function collectSnapshots(base){
  const files=new Map();
  function add(file){
    file=file.replaceAll('\\','/');
    assert(!path.isAbsolute(file)&&!file.startsWith('../'),'Unsafe snapshot path');
    if(files.has(file))return;
    const bytes=read(base,file);files.set(file,bytes);
    if(file.endsWith('.mjs')){
      for(const m of bytes.toString('utf8').matchAll(/^(?:import|export)\s+(?:[^;\r\n]*?\sfrom\s*)?['"](\.[^'"]+)['"]/gm))add(path.posix.normalize(path.posix.join(path.posix.dirname(file),m[1])));
    }
  }
  for(const file of ['scripts/build-mechanics-vocabulary.mjs','scripts/build-catalog-gaps.mjs','scripts/catalog-gap-reference-updates.mjs','scripts/catalog-gap-spec.mjs','public/catalog-gap-references.mjs','public/mechanics-vocabulary.mjs','public/mechanic-supplement.mjs','public/mechanic-variants.mjs','lib/catalog.mjs','public/rules-data.json','evidence/MagicCompRules-20260925.txt','reports/mechanics-coverage/metadata-validation.json','reports/catalog-gaps-20261019/verification.json','reports/catalog-gaps-20261019/sources.json','reports/remaining-six-sources-20261019/REPORT.txt','reports/remaining-six-sources-20261019/findings.json','reports/six-reference-update-20261019/REPORT.txt','reports/six-reference-update-20261019/receipts.json','lib/data/crosswalk.json','lib/mechanic-discovery.catalog-gaps.json'])add(file);
  // The owning gap builder imports this module for corpus access. It is retained
  // as producer history but never executed by the transfer; no recognizers run.
  for(const file of ['mtg-mechanics-master-list.md','atlas_v2.0.json','mechanical-color-pie.runtime.json','MECHANICS-CONTRACT.md','atlas_v2.1.json','mechanic-discovery.v1.json','mechanic-discovery.shortlist.json','mechanic-discovery.variants.json'])add('inputs/'+file);
  const dir='reports/catalog-gaps-20261019';
  for(const s of parse(base,dir+'/sources.json').sources){add(dir+'/'+s.file);assert.equal(hash(files.get(dir+'/'+s.file)),s.sha256,'Retained article drift');}
  for(const p of parse(base,dir+'/verification.json').rows)for(const r of [p.validation.membership,p.validation.commander]){add(dir+'/'+r.file);assert.equal(hash(files.get(dir+'/'+r.file)),r.sha256,'Retained validation response drift');}
  const research='reports/remaining-six-sources-20261019';
  for(const row of parse(base,research+'/findings.json').rows)for(const r of [...row.evidence,...(row.artifacts??[])]){add(research+'/'+r.file);assert.equal(hash(files.get(research+'/'+r.file)),r.sha256,'Retained scoped source drift');}
  const review='reports/six-reference-update-20261019';
  for(const r of parse(base,review+'/receipts.json')){add(review+'/'+r.file);assert.equal(hash(files.get(review+'/'+r.file)),r.sha256,'Retained six-source response drift');}
  return [...files].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([file,bytes])=>{
    const revisionBytes=execFileSync('git',['-C',base,'show',REVISION+':'+file],{maxBuffer:16*1024*1024});
    const revisionSha256=hash(revisionBytes),sha256=hash(bytes);
    assert.equal(sha256,revisionSha256,'Accepted input differs from pinned revision: '+file);
    return {path:file,bytes:bytes.length,sha256,revisionSha256,matchesRevision:true,encoding:'gzip+base64',data:zlib.gzipSync(bytes,{level:9}).toString('base64')};
  });
}
function reconstructGaps(base,rules,specs,updates){
  const dir='reports/catalog-gaps-20261019',proofBytes=read(base,dir+'/verification.json'),proof=JSON.parse(proofBytes),sourceProof=parse(base,dir+'/sources.json');
  assert.equal(proof.rows.length,42);assert.equal(specs.length,42);assert.equal(updates.size,6);
  const gaps=[];
  for(const spec of specs){
    const p=proof.rows.find(r=>r.key===spec.key);
    assert(p&&p.pattern===spec.pattern&&p.rule===spec.rule&&p.expression===(spec.pattern?`fo:/${spec.pattern}/`:`kw:${JSON.stringify(spec.label)}`),'Owning gap specification drift');
    for(const receipt of [p.validation.membership,p.validation.commander])assert.equal(hash(read(base,`${dir}/${receipt.file}`)),receipt.sha256);
    const clauses={};
    if(spec.rule)for(const c of rules.sections[spec.rule]?.paragraphs??[rules.rules[spec.rule]]){assert(c?.number&&c.text&&rules.rules[c.number]?.text===c.text);clauses[c.number]=c.text;}
    const example=p.positives[0];
    const reference=spec.rule?{title:spec.label,rules:Object.keys(clauses),verification:'verified'}:{title:spec.label,rules:[],verification:'provider-card-example',referenceKind:'provider-card-example',source:{title:'Oracle card record',section:example.name,url:example.scryfall_uri.split('?')[0],kind:'card-example',verifiedOn:p.validation.checkedAt.slice(0,10)}};
    const article=sourceProof.sources.find(s=>s.labels.includes(spec.label));
    if(article){assert.equal(hash(read(base,dir+'/'+article.file)),article.sha256);Object.assign(reference,{verification:'verified',referenceKind:'official-mechanic-reference',source:{title:article.title,section:article.section,url:article.url,kind:'article',verifiedOn:article.checkedAt.slice(0,10),sourceSha256:article.sha256}});}
    const update=updates.get(spec.key);
    if(update){assert(!spec.rule&&!article&&reference.referenceKind==='provider-card-example');Object.assign(reference,update);}
    gaps.push({key:spec.key,term:spec.label,category:p.category,review:proof.version,discovery:'reviewed-search',pattern:spec.pattern,clauses,reference});
  }
  const expected=`// Generated only from retained catalogs, card records, and verbatim Wizards clauses.\nimport {deepFreeze} from './core.mjs';\nexport const CATALOG_GAP_REVIEW=Object.freeze(${JSON.stringify({version:proof.version,evidenceSha256:hash(proofBytes)})});\nexport const CATALOG_GAPS=deepFreeze(${JSON.stringify(gaps,null,2)});\n`;
  assert.equal(read(base,'public/catalog-gap-data.mjs').toString(),expected,'Gap transfer view differs from owning specifications, retained proofs, sources or six updates');
  return gaps;
}
async function build(base,snapshot){
  const previous=process.cwd();process.chdir(base);
  try{
    const vocabulary=(await imported(base,'public/mechanics-vocabulary.mjs')).default;
    const {SHORTLIST_LABELS}=await imported(base,'public/mechanic-supplement.mjs');
    const {VARIANT_LABELS}=await imported(base,'public/mechanic-variants.mjs');
    const {GAP_SPECS}=await imported(base,'scripts/catalog-gap-spec.mjs');
    const {REFERENCE_UPDATES}=await imported(base,'scripts/catalog-gap-reference-updates.mjs');
    const {MECHANIC_EXPLANATIONS}=await imported(base,'public/mechanic-explanations.mjs');
    const {mechanicRule,mechanicExplanation}=await imported(base,'public/catalog-gap-references.mjs');
    const {RULES_REVISION}=await imported(base,'public/mechanic-rules.mjs');
    const rules=parse(base,'public/rules-data.json');
    const crBytes=read(base,'evidence/MagicCompRules-20260925.txt');
    assert.equal(hash(crBytes),RULES_REVISION.sourceSha256,'Retained CR revision drift');
    assertEqual({date:rules.date,sourceUrl:rules.sourceUrl,sourceSha256:rules.sourceSha256},RULES_REVISION,'Rules projection revision drift');
    const auditBytes=read(base,'reports/mechanics-coverage/metadata-validation.json'),audit=JSON.parse(auditBytes);
    const categories={'keyword-abilities':'keyword ability','keyword-actions':'keyword action','ability-words':'ability word'};
    const labels=audit.results.filter(r=>r.status==='observed_exact_metadata').map(r=>({key:r.term.toLowerCase(),term:r.term,category:r.catalog_category_agrees&&r.listed_in_catalogs.length===1?categories[r.listed_in_catalogs[0]]:'other provider-reported term',sourceCategories:r.expected_catalogs,providerCategories:r.listed_in_catalogs})).sort((a,b)=>a.key<b.key?-1:a.key>b.key?1:0);
    const expectedVocabulary={version:'2026-10-17',auditSha256:hash(auditBytes),manifestSha256:audit.manifest_sha256,bulkUpdatedAt:audit.bulk_updated_at,normalization:'lowercase exact; no other normalization',labels};
    assert.equal(read(base,'public/mechanics-vocabulary.mjs').toString(),'// Generated by scripts/build-mechanics-vocabulary.mjs from the retained audit. No card memberships or definitions.\nexport default '+JSON.stringify(expectedVocabulary,null,2)+';\n','Vocabulary transfer view differs from owning audit');
    assertEqual(vocabulary,expectedVocabulary,'Vocabulary owning-field drift');
    const gaps=reconstructGaps(base,rules,GAP_SPECS,REFERENCE_UPDATES);
    const {loadCatalog}=await imported(base,'lib/catalog.mjs');
    const catalog=await loadCatalog(base);assert.equal(catalog.records.length,374,'Discovery catalog population drift');
    const research=parse(base,'reports/remaining-six-sources-20261019/findings.json');
    const populations=[['vocabulary',labels,'reports/mechanics-coverage/metadata-validation.json','scripts/build-mechanics-vocabulary.mjs'],['shortlist',SHORTLIST_LABELS,'public/mechanic-supplement.mjs','public/mechanic-supplement.mjs'],['variants',VARIANT_LABELS,'public/mechanic-variants.mjs','public/mechanic-variants.mjs'],['catalog-gaps',gaps,'scripts/catalog-gap-spec.mjs','scripts/build-catalog-gaps.mjs']];
    assertEqual(populations.map(([,ls])=>ls.length),[296,32,20,42]);
    const target=parse(ROOT,'data/mechanical-color-pie.runtime.json');
    assert.equal(Object.keys(target.byMechanic).length,216);
    const crLines=crBytes.toString('utf8').replaceAll('\r\n','\n').split('\n');
    const clauseProof=new Map(),rows=[],records=[];
    for(const [population,ls,owner,producer] of populations)for(const label of ls){
      assert.equal(label.key,label.term.toLowerCase());
      const sourceId=label.key,id=`deck:${population}:${sourceId}`;
      const target2021=SHARED.includes(label.key)?label.key:label.key==='mill'?'milling':null;
      if(target2021)assert(target.byMechanic[target2021],'Missing mapping destination');
      const authored=MECHANIC_EXPLANATIONS[label.key];
      const reference=mechanicExplanation(rules,label.term,authored?.cardOracleIds??[]);
      const rule=mechanicRule(rules,label.term);
      const numbers=new Set([...(reference?.rules??[]),...(rule?(rules.sections[rule]?.paragraphs??[]).map(p=>p.number):[])]);
      const clauses=[...numbers].map(number=>{
        const c=rules.rules[number];assert(c&&c.number===number&&c.text,'Missing referenced clause '+number);
        // The projection records its exact numbered-entry source line. Blank
        // separator lines alone are normalized, matching the retained extractor.
        const start=c.sourceLine-1,prefix=crLines[start]?.startsWith(number+'. ')?number+'. ':number+' ';assert(crLines[start]?.startsWith(prefix),'CR clause location drift '+number);
        let end=start+1;while(end<crLines.length&&!/^\d{3}(?:\.\d+)?[a-z]?\.?\s/.test(crLines[end]))end++;
        const text=crLines.slice(start,end).filter(l=>l.trim()).join('\n').slice(prefix.length).trim();
        assert.equal(text,c.text,'Clause differs from retained CR '+number);
        clauseProof.set(number,{number,sourceLine:c.sourceLine,textSha256:hash(c.text),sourceFile:'evidence/MagicCompRules-20260925.txt'});
        return {number,text:c.text};
      });
      const qualifications=Object.fromEntries(Object.entries(label).filter(([k])=>!['key','term','category','aliases','pattern','clauses','reference'].includes(k)));
      if(authored?.cardOracleIds)qualifications.cardOracleIds=[...authored.cardOracleIds];
      const scoped=research.rows.find(r=>r.name===label.term);
      if(scoped)qualifications.acceptedSourceReview=Object.fromEntries(Object.entries(scoped).filter(([k])=>['status','officialGeneralDefinitionVerified','locator','exactExcerpt','verifiedScope','limits','evidence','artifacts'].includes(k)));
      const record={id,sourceId,population,name:label.term,aliases:label.aliases??[],category:label.category,target2021,reference:reference??null,rule:rule??null,clauses,rulesSource:RULES_REVISION,qualifications,rankings:[]};
      records.push(record);
      rows.push({id,sourceId,population,name:label.term,disposition:target2021?'mapped':'supplemental',target2021,reason:target2021==='milling'?'Explicit definition equivalence: target milling label describes top N library cards into that playerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢s graveyard; source retained CR 701.17a defines mill with the same operation.':target2021?'Exact shared mechanic identity and retained source label; 2021 placement remains authoritative only for the existing target record.':'Distinct accepted source identity; no reviewed exact 2021 mapping. No tier inference.',owner,producer,ownerSha256:snapshot.files.find(f=>f.path===owner).sha256,transportSha256:hash(json(record)),referenceSha256:reference?hash(json(reference)):null,clausesSha256:hash(json(clauses)),fieldProof:{name:'term',sourceId:'key',aliases:Object.hasOwn(label,'aliases')?'aliases':'No authored aliases; empty array.',category:'category',qualifications:'All remaining authored label fields except detection patterns and duplicate clauses/reference; scoped accepted source-review fields when present. Discovery recipe coverage remains development-only.',reference:'mechanicExplanation(rules, term, recorded cardOracleIds)',rule:'mechanicRule(rules, term)',clauses:'Pinned rules-data.json numbered text checked against retained CR lines.'}});
    }
    assert.equal(records.length,390);assert.equal(new Set(records.map(r=>r.id)).size,390);assert(catalog.records.every(r=>records.some(record=>record.sourceId===r.discovery.key)),'Unaccounted discovery identity');
    const source={revision:REVISION,workingTreeDirty:!!snapshot.source.workingTreeStatus,workingTreeStatusSha256:hash(snapshot.source.workingTreeStatus),snapshotSha256:hash(json(snapshot.files.map(({data,...f})=>f)))};
    const populationInfo=populations.map(([id,ls,owner,producer])=>({id,count:ls.length,owner,producer}));
    const payload={schemaVersion:1,source,populations:populationInfo,records};
    const manifest={schemaVersion:1,source:{...source,workingTreeStatus:snapshot.source.workingTreeStatus,scope:'Accepted owning inputs are pinned independently of unrelated dirty source work.'},populations:populationInfo,counts:{acceptedRows:390,mappedRows:records.filter(r=>r.target2021).length,supplementalRows:records.filter(r=>!r.target2021).length,excludedRows:0,discoveryRecords:catalog.records.length},mappingEvidence:{exactShared:SHARED,mill:{targetKey:'milling',targetFile:'data/mechanical-color-pie.runtime.json',targetFileSha256:hash(read(ROOT,'data/mechanical-color-pie.runtime.json')),targetLabel:target.byMechanic.milling.label,sourceFile:'public/rules-data.json',clause:rules.rules['701.17a']},distinct:[{source:'Ward',target:['ward (for life)','ward (for mana)'],reason:'Generic keyword and cost-qualified variants retain separate identities.'},{source:'Treasure',target:['treasure creation'],reason:'Token concept and token-creation action retain separate identities.'}]},payloadSha256:hash(json(payload)),snapshotFiles:snapshot.files.map(({data,...f})=>f),clauseProof:[...clauseProof.values()],discovery:{count:catalog.records.length,scope:'Discovery recipes, separate from the accepted display/evidence populations. No query execution or recognition was performed.',records:catalog.records.map(r=>({sourceId:r.discovery.key,name:r.master_name,acceptedIds:records.filter(record=>record.sourceId===r.discovery.key).map(record=>record.id),atlasRowId:r.atlas_row_id,querySha256:hash(r.atlas.query),recipeOnlyCoverage:r.blind_spot}))},rows};
    return {payload,manifest};
  }finally{process.chdir(previous);}
}
function report(manifest,snapshot){
  const c=manifest.counts;
  return `# Mechanics evidence transfer\n\nAccepted source revision: \`${REVISION}\`. Source checkout is dirty; its exact Git status is retained in the manifest and snapshot. The dirty work is unrelated to the accepted owning mechanic inputs; no source checkout file is written.\n\n| Population | Accepted rows |\n|---|---:|\n${manifest.populations.map(p=>`| ${p.id} | ${p.count} |`).join('\n')}\n\n${c.acceptedRows} accepted rows: ${c.mappedRows} mapped to existing 2021 details, ${c.supplementalRows} separate supplemental identities, zero excluded. The ${c.discoveryRecords} discovery records are enumerated separately with query hashes; they authorize no execution here.\n\nThe initial complete disposition manifest was recorded before UI implementation. Every final row retains its original key, exact accepted name, authored aliases (none supplied by these owners), category, remaining label qualifications, full resolved reference, and relevant numbered CR clauses. Reference quote and summary fields are preserved when present. No explanation is generated. Ranking arrays remain empty; no P/S/T claim is inferred. Detection patterns, query expressions and discovery recipe coverage never become runtime mechanic identity, aliases or evidence limitations. Recipe coverage is retained only in the manifest's separately labelled discovery entries.\n\nThe 18 shared identities map only on exact approved identity. Mill additionally maps to milling because the frozen target's explicit operation matches retained CR 701.17a. Both byte sources and the numbered clause are retained in mappingEvidence. Ward remains separate from cost-qualified Ward records; Treasure remains separate from treasure creation. Families and variants remain separate.\n\nVocabulary is reconstructed from the owning metadata audit with the owning producer's exact export format. Catalog gaps are reconstructed from GAP_SPECS, retained validation, retained sources and all six REFERENCE_UPDATES, then compared byte for byte to the generated view. Shortlist and variants are authored inputs. The original reference resolvers run against the pinned rules, with recorded cardOracleIds for card-specific references. The complete discovery catalog is loaded and validated without query execution. These are transport checks of trusted retained evidence, not renewed source research or certification.\n\nThe six narrow source reviews retain their status, source type, dates, exact accepted scope and limitations. Affinitycycling is a designer card example; Hero's Reward is archived official discussion; Actualize and Covercast are official card examples. Kinfall and Landship retain dated playtest-card provenance and not-legal Commander status, not verified general definitions. Unsupported wiki generalizations are not transferred into the runtime.\n\nManifest proofs bind each transport row, full reference and clause array by SHA-256 and bind ${manifest.clauseProof.length} unique numbered clauses to retained CR source lines. ${snapshot.files.length} owning/producer/retained files are snapshotted as deterministic gzip+base64 snapshots of exact original bytes in the single development-only sources.json. Snapshot integrity is checked before reconstruction. Every snapshot raw-byte SHA-256 is also compared with its exact file at the pinned Git revision; all match. Existing retained verification is trusted, never rerun as new source research or membership certification. The manifest records every source snapshot hash and the final payload hash.\n\n## Reproduction\n\n- Initial transfer: \`node tools/transfer_mechanics.mjs --source C:/dev/mtg-deck-explorer\`\n- Offline deterministic check: \`node tools/transfer_mechanics.mjs --check\`\n- Check plus actual source/query preservation: \`node tools/transfer_mechanics.mjs --check --source C:/dev/mtg-deck-explorer\`\n\nChecks return nonzero on output, snapshot, clause, mapping, source/query or protected target drift. Offline verification reconstructs a temporary copy of retained inputs, never reads the original source checkout, and cleans it afterward. With --source, the pinned revision and ${Object.keys(snapshot.source.protectedHashes).length} source/query byte hashes are verified too. All ${Object.keys(snapshot.targetProtectedHashes).length} target tracked files outside the admitted envelope are byte-protected in either mode.\n\nThe source snapshots, transfer manifest, tool and report are development evidence only; only data/mechanics-supplement.v1.json is runtime payload. Agent route: available Codex specialist acting under local RobDev; prescribed Claude route unavailable. No commit, push, publication or deployment is performed by this worker.\n\n## Developer validation\n\n- \`node --check tools/transfer_mechanics.mjs\` — PASS.\n- \`node tools/transfer_mechanics.mjs --check\` — PASS; all four generated outputs reproduce byte for byte without a source checkout.\n- \`node tools/transfer_mechanics.mjs --check --source C:/dev/mtg-deck-explorer\` — PASS; exact source revision and source/query bytes preserved.\n- Focused inline Node validation in an isolated temporary target copy — PASS: clean offline baseline, changed runtime payload rejected, changed frozen target runtime rejected, changed snapshot hash rejected; each drift returns nonzero. The live source and target artifacts were untouched.\n- \`git diff --no-index --check -- NUL <owned-file>\` for each of the five owned files — PASS; expected exit 1 for untracked differences, no whitespace defects.\n\nThis worker supplies developer transfer evidence only. The coordinator owns the combined candidate, final required mechanics gate chain, commit, separate QA handoff and Owner review.\n`;
}
let temporary=null;
try{
  let snapshot,base;
  if(checking){
    snapshot=parse(ROOT,`${EVIDENCE}/sources.json`);
    assert.equal(snapshot.schemaVersion,1);assert.equal(snapshot.source.revision,REVISION);
    verifyHashes(ROOT,snapshot.targetProtectedHashes,'Protected target');
    if(sourceDir){assert.equal(git(sourceDir,['rev-parse','HEAD']),REVISION,'Source revision drift');verifyHashes(sourceDir,snapshot.source.protectedHashes,'Source/query');assertEqual(fileHashes(sourceDir,sourceFiles(sourceDir)),snapshot.source.protectedHashes,'Source/query file inventory drift');}
    temporary=fs.mkdtempSync(path.join(os.tmpdir(),'mechanics-transfer-'));base=temporary;
    for(const entry of snapshot.files){assert.equal(entry.encoding,'gzip+base64');assert.equal(entry.revisionSha256,entry.sha256);assert.equal(entry.matchesRevision,true);assert(!path.isAbsolute(entry.path)&&!entry.path.includes('..'),'Unsafe snapshot path');const bytes=zlib.gunzipSync(Buffer.from(entry.data,'base64'));assert.equal(bytes.length,entry.bytes);assert.equal(hash(bytes),entry.sha256,'Snapshot drift '+entry.path);const dest=path.join(base,entry.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);}
  }else{
    base=sourceDir;assert.equal(git(base,['rev-parse','HEAD']),REVISION,'Source revision drift');
    // Re-running transfer never replaces the preservation baseline.
    const prior=fs.existsSync(path.join(ROOT,EVIDENCE,'sources.json'))?parse(ROOT,`${EVIDENCE}/sources.json`):null;
    if(prior){verifyHashes(ROOT,prior.targetProtectedHashes,'Protected target');verifyHashes(base,prior.source.protectedHashes,'Source/query');}
    snapshot={schemaVersion:1,source:{revision:REVISION,workingTreeStatus:prior?.source.workingTreeStatus??git(base,['status','--porcelain=v1','--untracked-files=all']),protectedHashes:prior?.source.protectedHashes??fileHashes(base,sourceFiles(base))},targetProtectedHashes:prior?.targetProtectedHashes??fileHashes(ROOT,frozenFiles()),files:collectSnapshots(base)};
  }
  const {payload,manifest}=await build(base,snapshot);
  const outputs={[PAYLOAD]:json(payload),[`${EVIDENCE}/manifest.json`]:json(manifest),[`${EVIDENCE}/sources.json`]:json(snapshot),[`${EVIDENCE}/REPORT.md`]:report(manifest,snapshot)};
  for(const [file,bytes] of Object.entries(outputs)){
    if(checking)assert.equal(read(ROOT,file).toString(),bytes,'Deterministic output drift: '+file);
    else{fs.mkdirSync(path.dirname(path.join(ROOT,file)),{recursive:true});fs.writeFileSync(path.join(ROOT,file),bytes);}
  }
  if(sourceDir)verifyHashes(sourceDir,snapshot.source.protectedHashes,'Source/query');
  verifyHashes(ROOT,snapshot.targetProtectedHashes,'Protected target');
  console.log(`${checking?'PASS unchanged':'TRANSFERRED'}: 296 vocabulary + 32 shortlist + 20 variants + 42 catalog gaps = 390; ${manifest.counts.mappedRows} mapped, ${manifest.counts.supplementalRows} supplemental, 0 excluded; 374 separate discovery records; ${manifest.clauseProof.length} unique CR clauses; payload ${manifest.payloadSha256}.`);
}finally{
  if(temporary)fs.rmSync(temporary,{recursive:true,force:true});
}
