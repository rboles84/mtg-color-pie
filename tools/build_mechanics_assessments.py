"""Deterministic display projection of reviewed A research. No network or 2021 edits."""
import argparse, hashlib, json
from pathlib import Path
from urllib.parse import urlsplit, quote
ROOT = Path(__file__).resolve().parents[1]
SOURCES = [ROOT/'docs/mechanics-research'/n for n in ('a-assessments-source.json','absorb-assessment-source.json','a-classification-addendum.json')]
OUTPUT = ROOT/'data/mechanics-assessments.v1.json'
COLORS = 'WUBRG'
LABEL = 'Scryfall-derived assessment - provisional'
def read(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def sha(b): return hashlib.sha256(b).hexdigest()
def canonical(value): return json.dumps(value,ensure_ascii=False,separators=(',',':')).encode('utf-8')
def safe_url(url):
    p=urlsplit(url)
    assert p.scheme=='https' and p.hostname in {'scryfall.com','magic.wizards.com'}
    assert not p.username and not p.password and not p.port
    return url
def build():
    main,ab,addendum=map(read,SOURCES)
    supplement=read(ROOT/'data/mechanics-supplement.v1.json')
    accepted={r['id']:r for r in supplement['records'] if r['name'].startswith('A') and r['target2021'] is None}
    assert len(accepted)==25
    overrides={r['mechanic']:r for r in addendum['records']}
    contexts={a['name']:a.get('supporting_design_context') for a in main['assessments']}
    contexts['Absorb']=ab['supporting_design_context']
    rows=[]
    for a in main['assessments']:
        cards=[{'name':c['name'],'url':safe_url(c['card_facts']['scryfall_uri'])} for c in a['card_review'] if c['include']]
        rows.append(dict(id=a['id'],name=a['name'],scope=a['scope'],confidence=a['confidence'],placements=a['placements'],rationale=a['rationale'],summary=a['summary'],limitations=a['limitations'],citationCards=cards))
        # Four research-only IDs used the wrong population prefix. Preserve
        # their source spelling while binding explicitly to the accepted IDs.
        if a['name'] in {'Abandon','Activate','Actualize','Affinitycycling'}:
            assert a['id']=='deck:vocabulary:'+a['name'].lower()
            rows[-1]['researchRecordId']=a['id']
            rows[-1]['id']='deck:catalog-gaps:'+a['name'].lower()
    rows.append(dict(id=ab['mechanic_id'],name='Absorb',scope='Exact Absorb keyword and explicit native grants; one observed white design.',confidence='low-to-moderate',placements={r['color']:r['tier'] for r in ab['recommended_placements']},rationale={r['color']:r['rationale'] for r in ab['recommended_placements']},summary='Lymph Sliver supports white as a provisional home. Two printings represent one design.',limitations=ab['limitations'],citationCards=[{'name':c['name'],'url':safe_url(c['scryfall_url'])} for c in ab['observed_population']['cards']]))
    for r in rows:
        r.update(label=LABEL,researchDate='2026-10-26',kind='derived',classification='Provisional color placements',outsidePrimary=None,relatedEffects=[],sources=[])
        if contexts.get(r['name']):
            s=contexts[r['name']];r['sources'].append({'title':s['title'],'url':safe_url(s['url'])})
        ov=overrides.get(r['name'])
        if ov:
            r['placements']=ov['wubrg_placements']
            r['classification']=ov['classification']
            r['outsidePrimary']=ov['outside_five_colors']['primary']
            r['kind']='colorless' if r['outsidePrimary'] else 'rules'
            r['label']=LABEL if r['kind']=='colorless' else 'Rules action - not ranked'
            r['scope']=ov['classification'];r['summary']=ov['rationale']
            r['rationale']={c:'No independent '+c+' placement is assigned; see the classification and rationale below.' for c in COLORS}
            r['confidence']=ov.get('confidence','Not applicable to the general rules action')
            r['limitations']=[]
            titles={'wizards_activate':'Evergreen Eggs & Ham (2015)','wizards_archenemy':'Wizards: Archenemy','scryfall_enforcermite':"Sojourner's Enforcermite"}
            for key in ov.get('sources',[]):
                s=addendum['sources'][key]
                if 'url' in s:r['sources'].append({'title':s.get('source_heading') or titles.get(key,key),'url':safe_url(s['url'])})
            for e in ov.get('related_effects',[]):
                r['relatedEffects'].append({'name':e['name'],'label':e['label'],'placements':e['placements'],'url':safe_url(addendum['sources'][e['source']]['url']),'note':'This 2017 placement describes the named effect, not every Attach action. It does not change the 2021 snapshot.'})
        if r['name']=='Annihilator':
            assert ov['label']=='Owner-directed classification; Scryfall-derived rationale'
            r['label']='User-selected classification; Scryfall-derived rationale'
            r['summary']='The observed population is dominated by colorless native uses and grants. Primary: Colorless. Secondary: None. Tertiary: None. A five-color playtest grant does not establish independent W/U/B/R/G tiers.'
            r['confidence']='Strong evidence for a colorless home'
            r['limitations']=['Colorless is outside the five colors; it is not a sixth Magic color or a synonym for the colorless mana symbol.']
        if r['name']=='Affinitycycling':
            r['summary']="Sojourner's Enforcermite is the sole observed Affinitycycling design and is colorless. Primary Colorless is a provisional home based on that small playtest sample; no W/U/B/R/G tiers are assigned."
            r['limitations']=['Playtest-only evidence. This is not an official color-pie ranking or an ordinary format-availability claim.']
        if r['name']=='Abandon':
            r['limitations']=['Search t:scheme o:abandon include:extras to see the 20 relevant scheme designs. The default search excludes schemes and finds unrelated word matches.']
        query='t:scheme o:abandon include:extras' if r['name']=='Abandon' else 'o:/\\b'+r['name']+'\\b/ include:extras'
        r['queryUrl']=safe_url('https://scryfall.com/search?q='+quote(query))
        assert r['id'] in accepted and accepted[r['id']]['name']==r['name']
        assert set(r['placements'])==set(COLORS) and set(r['rationale'])==set(COLORS)
        assert all(t in {None,'Primary','Secondary','Tertiary'} for t in r['placements'].values())
        assert all(isinstance(r[f],str) and r[f].strip() for f in ('scope','summary','confidence'))
        assert all(isinstance(t,str) and t.strip() for t in r['limitations']+list(r['rationale'].values()))
        assert r['kind']=='derived' or not any(r['placements'].values())
    assert len(rows)==len({r['id'] for r in rows})==25 and {r['id'] for r in rows}==set(accepted)
    assert sum(t is not None for r in rows for t in r['placements'].values())==70
    return {'schemaVersion':1,'researchDate':'2026-10-26','supplementCanonicalSha256':sha(canonical(supplement)),'sourceBindingFormat':'canonical-json-utf8','sourceBindings':[{'path':p.relative_to(ROOT).as_posix(),'sha256':sha(canonical(read(p)))} for p in SOURCES],'records':sorted(rows,key=lambda r:r['name'])}
def main():
    p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
    text=json.dumps(build(),indent=2,ensure_ascii=False)+'\n'
    if args.check:
        assert OUTPUT.read_text(encoding='utf-8')==text,'Generated assessment payload is stale'
        print('PASS: 25 accepted unmapped A records; 70 WUBRG tiers; deterministic payload and source bindings')
    else:OUTPUT.write_text(text,encoding='utf-8');print('Wrote 25 reviewed A assessments')
if __name__=='__main__':main()
