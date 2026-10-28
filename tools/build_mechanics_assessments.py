"""Deterministic display projection of reviewed A research. No network or 2021 edits."""
import argparse, hashlib, json
from pathlib import Path
from urllib.parse import urlsplit, quote
ROOT = Path(__file__).resolve().parents[1]
SOURCES = [ROOT/'docs/mechanics-research'/n for n in ('a-assessments-source.json','absorb-assessment-source.json','a-classification-addendum.json')]
REVIEWS = [ROOT/'docs/mechanics-research'/n for n in ('a-protocol-core.json','a-protocol-extended.json','a-protocol-special.json')]
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
    # Retained packets supply card links and the historical Attach effect.
    # Protocol records exclusively own current judgments and player-facing copy.
    reviews=[a for p in REVIEWS for a in read(p)['records']]
    assert len(reviews)==len({a['mechanic']['name'] for a in reviews})==25
    by_name={a['mechanic']['name']:a for a in reviews}
    assert set(by_name)=={r['name'] for r in rows}
    statuses={'assigned','proposed_home','observed_tier_unresolved','no_support_in_sample','incomplete_evidence','conflicted','not_applicable'}
    for r in rows:
        a=by_name[r['name']]; ds=a['decisions']; outside=a['outside_five_colors']
        player=a.get('player_copy')
        assert a['protocol_version']=='1.0' and a['record_status'] in {'draft','reviewed'}
        assert a['mechanic']['accepted_id']==r['id'],r['name']
        assert set(ds)==set(COLORS)
        assert isinstance(player,dict) and set(player)=={'scope','summary','rationale','limitations'}
        assert set(player['rationale'])==set(COLORS)
        assert all(isinstance(player[k],str) and player[k].strip() for k in ('scope','summary'))
        assert all(isinstance(text,str) and text.strip() for text in list(player['rationale'].values())+player['limitations'])
        for c,d in ds.items():
            assert d['tier'] in {None,'Primary','Secondary','Tertiary'}
            assert d['status'] in statuses and d['route'] in {None,'E1','E2','E3','E3_limited_sample','U'}
            assert d['confidence'] in {'High','Moderate','Low','Not applicable'}
            assert (d['tier'] is not None)==(d['status'] in {'assigned','proposed_home'}),(r['name'],c)
            assert all(isinstance(d[k],str) and d[k].strip() for k in ('rationale','why_chosen','closest_alternative'))
            if d['tier']:
                assert d['route'] and (d['support_card_ids'] or d['support_source_ids'])
                if d['route']=='E3_limited_sample':assert d['confidence']=='Low' and d['status']=='proposed_home'
        routes={d['route'] for d in ds.values()}|{outside.get('route')}
        short='Rules action' if r['kind']=='rules' else 'User-selected' if 'U' in routes else 'Source-informed' if 'E2' in routes else 'Official placement' if 'E1' in routes else 'Scryfall-derived'
        r.update(protocolVersion='1.0',reviewStatus=a['record_status'],judgmentDate=a['provenance']['judgment_date'],shortLabel=short,
                 label='Rules action - not ranked' if r['kind']=='rules' else 'User-selected classification' if 'U' in routes else short+' assessment - provisional',
                 scope=player['scope'],classification=a['mechanic']['classification'],summary=player['summary'],limitations=player['limitations'],
                 placements={c:ds[c]['tier'] for c in COLORS},rationale=player['rationale'],
                 decisionStatus={c:ds[c]['status'] for c in COLORS},decisionRoute={c:ds[c]['route'] for c in COLORS},decisionConfidence={c:ds[c]['confidence'] for c in COLORS},
                 outsidePrimary='Colorless' if r['kind']=='colorless' and outside.get('proposed_tier')=='Primary' else None,
                 outsideTier=outside.get('proposed_tier') if r['kind']=='colorless' else None,outsideStatus=outside['status'])
        confidence=sorted({d['confidence'] for d in ds.values() if d['tier']})
        r['confidence']=' / '.join(confidence) if confidence else 'Low; observed tiers unresolved' if r['kind']=='derived' else outside.get('confidence','Not applicable')
        if r['name']=='Annihilator':r['confidence']='User-selected; evidence supports Colorless access'
        r['sources']=[]
        for s in a['sources']:
            if s.get('url') and urlsplit(s['url']).hostname=='magic.wizards.com':
                item={'title':s['title'],'url':safe_url(s['url'])}
                if item not in r['sources']:r['sources'].append(item)
        assert r['kind']=='derived' or not any(r['placements'].values())
    return {'schemaVersion':2,'protocolVersion':'1.0','researchDate':'2026-10-26','judgmentDate':'2026-10-27','supplementCanonicalSha256':sha(canonical(supplement)),'sourceBindingFormat':'canonical-json-utf8','sourceBindings':[{'path':p.relative_to(ROOT).as_posix(),'sha256':sha(canonical(read(p)))} for p in SOURCES+REVIEWS],'records':sorted(rows,key=lambda r:r['name'])}
def main():
    p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args()
    text=json.dumps(build(),indent=2,ensure_ascii=False)+'\n'
    if args.check:
        assert OUTPUT.read_text(encoding='utf-8')==text,'Generated assessment payload is stale'
        print('PASS: 25 protocol v1.0 A records; deterministic payload and source bindings')
    else:OUTPUT.write_text(text,encoding='utf-8');print('Wrote 25 reviewed A assessments')
if __name__=='__main__':main()
