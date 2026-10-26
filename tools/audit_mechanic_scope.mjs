/** Offline scope audit of the pinned accepted supplement. Does not alter source evidence. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=p=>fs.readFileSync(path.join(root,p));
const input='data/mechanics-supplement.v1.json', bytes=read(input), payload=JSON.parse(bytes);
assert.equal(hash(bytes),'4557644a977efdd3a7db122cfb8a2810eb81ea2cddfcd7b69f16174fdd0f96c3','Audit requires the reviewed transfer bytes');
const archive=JSON.parse(read('docs/mechanics-transfer/sources.json'));
const snapshots=new Map(archive.files.map(f=>{
 const b=zlib.gunzipSync(Buffer.from(f.data,'base64'));
 assert.equal(hash(b),f.sha256);assert.equal(f.sha256,f.revisionSha256);assert(f.matchesRevision);
 return [f.path,{sha256:f.sha256,text:b.toString('utf8')}];
}));
assert.equal(payload.source.revision,'6c54dbb49d6161985d104625efd5bd46f36e31d2');
const groups=[
 {id:'rules',label:'Rules-backed entries',description:'Specific Comprehensive Rules material, including named variants and concepts. This is evidence scope, not a format-legality claim.'},
 {id:'ability-words',label:'Official ability words',description:'Officially documented ability words and families. The general ability-word rule is not an individual mechanic definition.'},
 {id:'card-specific',label:'Card-specific labels',description:'Flavor words and other labels tied to particular cards. Their text is not a general mechanic definition.'},
 {id:'digital',label:'Digital / Alchemy material',description:'Official digital mechanic references and separately identified card-specific evidence.'},
 {id:'special',label:'Special-format and Un-set material',description:'Rules and references with an explicit special context. No blanket card-legality claim is made.'},
 {id:'preview',label:'Official preview references',description:'Evidence retained from an official preview; kept separate from rules-backed entries.'},
 {id:'playtest',label:'Playtest material',description:'Playtest-card records. These are not presented as ordinary mechanics or ordinary example-card choices.'},
 {id:'designer',label:'Designer-only material',description:'A designer publication supports a narrow example, not an established general rules definition.'},
 {id:'unresolved',label:'Scope not established',description:'The retained evidence does not establish a more specific scope. No ordinary-mechanic status is inferred.'}
];
const digital=new Set(['Specialize','Intensity','Double team','Seek','Conjure','Draft from a spellbook','Heist','Incorporate','Actualize','Covercast']);
const playtest=new Set(['Kinfall','Landship','Legacy','Underdog']);
const preview=new Set(['Assimilate','Face a dilemma']);
const special={
 'Assemble':'Unstable / Contraptions. The retained rule directs readers outside the included Comprehensive Rules for these mechanics.',
 'Hidden Agenda':'Conspiracy-card procedure in the command zone.',
 'Double agenda':'Conspiracy-card variant of hidden agenda.',
 'Open an Attraction':'Attraction-deck rules.',
 'Roll to Visit Your Attractions':'Attraction-deck visiting rules.',
 'Planeswalk':'Planechase variant rules.',
 'Abandon':'Archenemy variant / ongoing scheme rules.',
 'Set in motion':'Archenemy variant / scheme rules.',
 'Augment':'Unstable mechanic reference; kept in its Un-set context.',
 "Hero's Reward":'Archived Wizards design discussion about Face the Hydra. It is not a general definition for all Challenge Deck cards.'
};
// These are narrow, reviewed context assignments, not name-based guesses. Assert
// the owning evidence still carries the context before applying the assignments.
const get=n=>{const r=payload.records.find(r=>r.name===n);assert(r,n);return r;};
for(const n of digital){const r=get(n);assert(r.reference?.source);if(!['Actualize','Covercast'].includes(n))assert.match(r.reference.source.title+' '+r.reference.source.section,/Alchemy/i);}
for(const n of preview)assert.match(get(n).reference.source.title,/Star Trek.*First Look/);
for(const n of ['Legacy','Underdog'])assert.match(get(n).reference.source.title,/Mystery Booster Release Notes/);
const mystery=[...snapshots.entries()].find(([p,s])=>s.sha256==='85e2156d1985e93694f349e0a19c2ecc8fd11fc5392d78295d759cbf5a56f590');
assert(mystery);for(const term of ['Playtest','Gold Mine','Inspirational Antelope','Ruff, Underdog Champ'])assert(mystery[1].text.includes(term),term);
const evidenceType=r=>{
 if(r.reference?.referenceKind==='designer-card-example')return 'Designer card example';
 if(r.reference?.referenceKind==='archived-mechanic-discussion')return 'Archived official discussion';
 if(r.reference?.referenceKind==='official-card-example'||r.reference?.referenceKind==='playtest-card-example'||r.reference?.source?.kind==='card-example')return 'Card-specific evidence';
 if(r.category==='flavor word')return 'Card-specific flavor word';
 if(r.category==='ability word')return 'Ability-word reference';
 if(r.category.includes('variant')||r.name==='Friends forever')return 'Rules family / variant';
 if(r.category==='designation')return 'Rules designation';
 if(r.category==='token and subtype concept')return 'Token / subtype rules';
 if(r.clauses.some(c=>!['207.2c','207.2d'].includes(c.number)))return 'Specific rules material';
 if(r.reference?.referenceKind==='official-mechanic-reference')return 'Official mechanic reference';
 return 'Scope not established';
};
const records=payload.records.map(r=>{
 const specific=r.clauses.filter(c=>!['207.2c','207.2d'].includes(c.number));
 let group='unresolved',scopeNote='The retained evidence does not establish ordinary-mechanic status.';
 if(r.name==='Affinitycycling'){
  assert.equal(r.reference.referenceKind,'designer-card-example');assert.equal(r.reference.definitionVerified,false);
  group='designer';scopeNote='Designer-only playtest example. No Wizards general definition was verified.';
 }else if(playtest.has(r.name)){
  group='playtest';scopeNote=['Legacy','Underdog'].includes(r.name)?'Official release notes document named playtest cards. This remains playtest material, not an ordinary mechanic entry.':'Playtest-card evidence. Official card existence is documented, but a general definition was not verified.';
 }else if(preview.has(r.name)){
  group='preview';scopeNote='Official preview reference. The retained evidence is preview-scoped and supplies no Comprehensive Rules entry.';
 }else if(digital.has(r.name)){
  group='digital';scopeNote=r.reference.definitionVerified===false?'Digital card-specific evidence. A general mechanic definition was not verified.':'Official digital / Alchemy mechanic reference. Keep this digital context separate from paper rules-backed entries.';
 }else if(Object.hasOwn(special,r.name)){
  group='special';scopeNote=special[r.name];
 }else if(r.category==='flavor word'||r.name==='Jump'||r.name==='Parade!'){
  group='card-specific';scopeNote=r.category==='flavor word'?'Card-specific flavor label. Rule 207.2d describes flavor words as a group, not this label as a general mechanic.':'Card-specific label supported by the named card reference, not a standalone general mechanic definition.';
 }else if(r.category==='ability word'&&r.clauses.some(c=>c.number==='207.2c')&&r.reference?.source){
  group='ability-words';scopeNote=r.name==='Descend'?'Official reference for the Descend 4 / Descend 8 ability-word family. The generic ability-word rule is not an individual definition.':'Officially documented ability word. The generic ability-word rule is category guidance, not an individual mechanic definition.';
 }else if(specific.length){
  group='rules';scopeNote=r.category.includes('variant')||r.name==='Friends forever'?'The retained rules support a named variant or rules family. No separate standalone definition or color ranking is inferred.':r.category==='designation'?'The retained rules describe the prepared designation for permanents with a prepare spell, not a keyword ability.':r.category==='token and subtype concept'?'The retained rules describe tokens and subtypes, not a keyword ability.':'Specific Comprehensive Rules material is retained for this entry.';
 }
 const basis=[];
 if(r.clauses.length)basis.push({field:'clauses',detail:r.clauses.map(c=>c.number).join(', ')});
 if(r.reference?.source)basis.push({field:'reference.source',detail:`${r.reference.source.title} — ${r.reference.source.section||r.name} — ${r.reference.source.url}`});
 if(r.qualifications.acceptedSourceReview)basis.push({field:'qualifications.acceptedSourceReview',detail:r.qualifications.acceptedSourceReview.status});
 if(playtest.has(r.name))basis.push({field:'retained Mystery Booster release notes',detail:`${mystery[0]} SHA-256 ${mystery[1].sha256}: playtest context; ${r.reference.source.section}`});
 const qualifications=[];
 if(r.reference?.definitionVerified===false||r.qualifications.acceptedSourceReview?.officialGeneralDefinitionVerified===false)qualifications.push('General definition unverified');
 if(r.name==='Parade!')qualifications.push('Unfinity card-specific reference; set name alone does not establish acorn status or illegality');
 if(r.name==='Assemble')qualifications.push('Rule 701.45a does not include the Contraption mechanics rules');
 if(r.reference?.playtest?.commander==='not_legal')qualifications.push(`Named playtest card recorded as not legal in Commander, checked ${r.reference.playtest.checkedOn}`);
 return {id:r.id,sourceId:r.sourceId,name:r.name,population:r.population,target2021:r.target2021||null,sourceCategory:r.category,group,evidenceLabel:evidenceType(r),scopeNote,qualifications,examplePolicy:['playtest','designer','preview','unresolved'].includes(group)?'hold':['digital','special','card-specific'].includes(group)?'scoped-review':'ordinary',basis};
});
assert.equal(records.length,390);assert.equal(new Set(records.map(r=>r.id)).size,390);
const counts=Object.fromEntries(groups.map(g=>[g.id,records.filter(r=>r.group===g.id).length]));
assert.deepEqual(counts,{rules:284,'ability-words':62,'card-specific':17,digital:10,special:10,preview:2,playtest:4,designer:1,unresolved:0});
for(const r of records)assert(r.basis.length&&r.scopeNote&&r.evidenceLabel!=='Scope not established',r.id);
const data={schemaVersion:1,payloadSha256:hash(bytes),payloadCanonicalSha256:hash(JSON.stringify(payload)),sourceRevision:payload.source.revision,sourceWorkingTreeDirty:payload.source.workingTreeDirty,scope:'Audit of retained accepted evidence, not new mechanic research or current format legality.',groups,counts,records};
const rows=records.map(r=>`| ${r.id} | ${r.name.replaceAll('|','\\|')} | ${r.group} | ${r.evidenceLabel} | ${r.examplePolicy} | ${r.scopeNote} | ${r.basis.map(b=>b.detail.replaceAll('|','\\|')).join('<br>')} |`);
const report=['# Supplemental evidence and scope audit','',`Pinned source: ${data.sourceRevision}. Original checkout had unrelated working-tree changes; accepted input bytes match that revision. Raw transport SHA-256: ${data.payloadSha256}. All 127 retained snapshots verified against their stored and revision hashes.`,
 '', '390 accepted source records are accounted for: 371 supplemental destinations and 19 mappings to existing 2021 entries. Original 2021 source/runtime bytes, explanations, examples, placements and calculations are unchanged.', '',
 '## Method and limitations','',
 'Classify the retained evidence and play context separately. Specific rules are not a claim of tournament legality. Generic rule 207.2c supports ability-word background; 207.2d supports flavor-word background. Neither is a definition of every individual label. Corrupted, Will of the Planeswalkers and Descend rely on their separate official references rather than an exact name in the generic rule list. Variants/families keep their identity and scope.', '',
 'No live research, discovery query, inferred tier, new definition or source correction was performed. The immutable accepted transport remains intact; this versioned sidecar is a presentation audit. Missing or invalid scope data must disable supplemental presentation while keeping 2021 usable.', '',
 'Critical corrections: Affinitycycling is designer-only playtest evidence; Legacy and Underdog are playtest material as well as Kinfall/Landship. Actualize/Covercast are digital card examples with general definitions unverified. Hero’s Reward is Hydra-specific archived discussion. Assimilate/Face a dilemma are official-preview references. The 15 flavor labels, Jump and Parade! are card-specific. Unfinity origin alone does not establish acorn status or illegality.', '',
 '## Population','', '| Scope | Accepted records | Supplemental destinations |', '| --- | ---: | ---: |',
 ...groups.map(g=>`| ${g.label} | ${counts[g.id]} | ${records.filter(r=>r.group===g.id&&!r.target2021).length} |`), '',
 '## Example review policy','',
 'ordinary: rules-backed or official ability-word evidence; still requires Owner card selection. scoped-review: card-specific, digital or special-context selection, never ordinary universal examples. hold: playtest, designer-only, preview or unresolved material kept separate from ordinary example selection. Existing generated hold suggestions are withdrawn from choice fields but retained as source evidence. This policy approves no cards.', '',
 '## Reproduce','', '`node tools/audit_mechanic_scope.mjs --check` verifies both generated files from unchanged transport and retained snapshots. `node tools/transfer_mechanics.mjs --check --source C:/dev/mtg-deck-explorer` independently verifies source/target preservation.', '',
 '## Record-by-record manifest','', '| Original transport identity | Name | Scope | Evidence | Example policy | Scope boundary | Retained basis |', '| --- | --- | --- | --- | --- | --- | --- |',...rows,''].join('\n');
for(const [file,content] of [['data/mechanics-supplement-scope.v1.json',JSON.stringify(data,null,2)+'\n'],['docs/mechanics-transfer/SCOPE-AUDIT.md',report]]){
 if(process.argv.includes('--check'))assert.equal(read(file).toString(),content,`Scope audit drift: ${file}`);else fs.writeFileSync(path.join(root,file),content);
}
console.log(JSON.stringify({passed:true,records:records.length,counts,sourceSnapshots:snapshots.size,payloadSha256:data.payloadSha256}));
