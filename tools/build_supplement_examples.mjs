/* Build/check the optional local supplemental-example transport. No provider calls. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const runtimeFile=path.join(root,'vox-color/mechanical-supplement-examples.json');
const sourceFile=path.join(root,'docs/mechanics-transfer/supplemental-examples-source.json');
const supplementFile=path.join(root,'data/mechanics-supplement.v1.json');
const scopeFile=path.join(root,'data/mechanics-supplement-scope.v1.json');
const args=process.argv.slice(2), arg=name=>args.includes(name)?args[args.indexOf(name)+1]:null;
const sha=value=>createHash('sha256').update(value).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const write=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');
const die=message=>{throw new Error('supplement examples: '+message);};
const namedEvidence=new Set(['Actualize','Affinitycycling','Covercast','Eminence','Hellbent','Join forces','Jump','Kinfall','Landship','Parade!','Tempting offer','Threshold','Underdog']);
const boundary=text=>new RegExp(`(^|[^a-z0-9])${text.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}(?=$|[^a-z0-9])`,'i');
function cardFrom(cache, selected, mechanic){
  const card=Object.values(cache).flatMap(page=>page?.data||[]).find(item=>item.id===selected.id);
  if(!card) die(`cache does not contain ${selected.id}`);
  const faces=card.card_faces||[], matching=faces.filter(face=>boundary(mechanic).test(face.oracle_text||''));
  /* The first exact qualifying face is deterministic; names are never fuzzy-matched. */
  const face=matching[0]||null, image=face?.image_uris?.normal||card.image_uris?.normal;
  const artist=face?.artist||card.artist, oracleText=face?.oracle_text||card.oracle_text||selected.oracleText||'', typeLine=face?.type_line||card.type_line||selected.typeLine||'';
  if(!image||!artist||!card.set_name||!card.collector_number||!card.scryfall_uri) die(`missing presentation fields for ${selected.name}`);
  return {id:card.id,name:card.name,set_name:card.set_name,collector_number:String(card.collector_number),artist,scryfall_uri:card.scryfall_uri,image_uris:{normal:image},oracle_text:oracleText,type_line:typeLine,chosenFace:face?{name:face.name,oracle_text:face.oracle_text,type_line:face.type_line}:null};
}
function selectedFields(selected, card){return {name:selected.name,url:selected.url,printing:selected.printing,id:selected.id,oracleId:selected.oracleId,query:selected.query,searchUrl:selected.searchUrl,checkedAt:selected.checkedAt,totalMatches:selected.totalMatches,fetched:selected.fetched,eligible:selected.eligible,position:selected.position,selection:selected.selection,oracleText:card.oracle_text,typeLine:card.type_line,keywords:selected.keywords||[],games:selected.games||[],legality:selected.legality,setType:selected.setType,securityStamp:selected.securityStamp||null,card};}
function build(selectionsFile, cacheFile){
  if(!selectionsFile||!cacheFile) die('--import requires --selections and --cache');
  const selections=read(selectionsFile),cache=read(cacheFile),payload=read(supplementFile),scopes=read(scopeFile);
  if(!Array.isArray(selections)||selections.length!==373||payload.records.length!==390||scopes.records.length!==390) die('unexpected approved input population');
  const byKey=new Map(payload.records.map(item=>[item.target2021||item.id,item])), scoped=new Map(scopes.records.map(item=>[item.id,item]));
  const records=selections.map(row=>{const source=byKey.get(row.key), scope=source&&scoped.get(source.id), supplemental=!!source&&!source.target2021;let disposition='no-verified-match',selected=null;
    if(row.selected&&supplemental){if(namedEvidence.has(source.name)) disposition='preserve-existing-named-evidence';else {disposition='include';const card=cardFrom(cache,row.selected,row.mechanic);selected=selectedFields(row.selected,card);}}
    else if(row.selected) disposition='preserve-2021';
    return {key:row.key,mechanic:row.mechanic,scope:row.scope,policy:row.policy,status:row.status,sourceRecordId:source?.id||null,sourceName:source?.name||null,scopeGroup:scope?.group||null,disposition,selected};});
  const include=records.filter(item=>item.disposition==='include');
  if(include.length!==358||records.filter(item=>item.disposition==='preserve-existing-named-evidence').length!==13||records.filter(item=>item.disposition==='preserve-2021').length!==1) die('unexpected inclusion disposition');
  const snapshot={schemaVersion:1,source:{description:'Retained minimal snapshot of approved selection rows and cached Scryfall fields. No live provider lookup is used.',externalInputs:{selectionsFile,cacheFile},hashes:{selectionsSha256:sha(fs.readFileSync(selectionsFile)),cacheSha256:sha(fs.readFileSync(cacheFile)),supplementSha256:sha(fs.readFileSync(supplementFile)),scopeSha256:sha(fs.readFileSync(scopeFile))},supplementPayloadCanonicalSha256:sha(JSON.stringify(payload)),scopePayloadCanonicalSha256:sha(JSON.stringify(scopes))},records};
  const runtime={schemaVersion:1,sourceSnapshotSha256:sha(JSON.stringify(snapshot)),supplementPayloadCanonicalSha256:sha(JSON.stringify(payload)),records:include.map(item=>({key:item.key,sourceRecordId:item.sourceRecordId,scopeGroup:item.scopeGroup,card:(({oracle_text,type_line,chosenFace,...card})=>({...card,display_name:chosenFace?.name||card.name}))(item.selected.card)}))};
  write(sourceFile,snapshot);write(runtimeFile,runtime);console.log(`supplement examples: wrote ${runtime.records.length} records`);
}
function check(){
  const snapshot=read(sourceFile),runtime=read(runtimeFile),payload=read(supplementFile),scopes=read(scopeFile);
  if(snapshot.schemaVersion!==1||runtime.schemaVersion!==1||runtime.sourceSnapshotSha256!==sha(JSON.stringify(snapshot))||runtime.supplementPayloadCanonicalSha256!==sha(JSON.stringify(payload))||snapshot.source.supplementPayloadCanonicalSha256!==sha(JSON.stringify(payload))||snapshot.source.scopePayloadCanonicalSha256!==sha(JSON.stringify(scopes))) die('transport binding mismatch');
  const byKey=new Map(payload.records.map(item=>[item.target2021||item.id,item])),scoped=new Map(scopes.records.map(item=>[item.id,item])),include=snapshot.records.filter(item=>item.disposition==='include'),keys=new Set();
  if(snapshot.records.length!==373||include.length!==358||runtime.records.length!==358) die('unexpected counts');
  for(const item of runtime.records){const source=byKey.get(item.key),scope=source&&scoped.get(source.id),retained=include.find(record=>record.key===item.key),card=item.card;
    if(!source||source.target2021||namedEvidence.has(source.name)||!scope||!retained||keys.has(item.key)||item.sourceRecordId!==source.id||item.scopeGroup!==scope.group||card.id!==retained.selected.card.id) die(`invalid provenance for ${item.key}`);keys.add(item.key);
    if(!/^[0-9a-f-]{36}$/i.test(card.id||'')||!card.name||!card.set_name||!card.collector_number||!card.artist||!/^https:\/\/scryfall\.com\//.test(card.scryfall_uri||'')||!/^https:\/\/cards\.scryfall\.io\//.test(card.image_uris?.normal||'')) die(`invalid card for ${item.key}`);}
  if(!['rules:265','ability-words:57','card-specific:15','digital:8','special:10','preview:2','playtest:1'].every(expect=>{const [group,count]=expect.split(':');return runtime.records.filter(item=>item.scopeGroup===group).length===+count;})) die('scope totals changed');
  console.log('supplement examples: PASS 358 included; 13 named-evidence and 1 frozen-2021 exclusion');
}
try{if(args.includes('--import'))build(arg('--selections'),arg('--cache'));else if(args.includes('--check'))check();else die('use --import or --check');}catch(error){console.error(error.message);process.exitCode=1;}
