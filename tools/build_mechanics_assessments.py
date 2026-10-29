"""Deterministic access-only projection from the admitted A/B/C/D/E/F/G/H protocol packets."""
import argparse, hashlib, json
from pathlib import Path
from urllib.parse import quote, urlsplit
ROOT=Path(__file__).resolve().parents[1]
REVIEW_NAMES=('a-protocol-core.json','a-protocol-extended.json','a-protocol-special.json',
              'b-protocol-core.json','b-protocol-extended.json',
              'c-protocol-core.json','c-protocol-extended.json','c-protocol-special.json','d-protocol.json','e-protocol.json','f-protocol.json','g-protocol.json','h-protocol.json')
REVIEWS=[ROOT/'docs/mechanics-research'/n for n in REVIEW_NAMES]
ADDENDUM=ROOT/'docs/mechanics-research/a-classification-addendum.json'; SUPPLEMENT=ROOT/'data/mechanics-supplement.v1.json'; OUTPUT=ROOT/'data/mechanics-assessments.v1.json'
LEGACY_A=ROOT/'docs/mechanics-research/a-assessments-source.json'; LEGACY_ABSORB=ROOT/'docs/mechanics-research/absorb-assessment-source.json'
SOURCE_INPUTS=[LEGACY_A,LEGACY_ABSORB,ADDENDUM,*REVIEWS]
COLORS='WUBRG'; STATUSES={'documented','multicolor_only','not_found','not_applicable','insufficient_evidence'}
TARGET_PREFIXES=('A','B','C','D','E','F','G','H'); RULES_ACTIONS={'Abandon','Activate','Attach','Cast','Counter','Create','Double','Destroy','Discard','Exchange','Exile','Face a dilemma'}
# These two admitted A records predate the packet-level scope declaration.
# Keep their frozen behavior while requiring every newly special-scoped packet
# to declare its own scope in access_review.evidence_scope.
LEGACY_EVIDENCE_SCOPES={'Actualize':['digital'],'Affinitycycling':['designer_playtest']}
def read(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def canonical(v): return json.dumps(v,ensure_ascii=False,separators=(',',':')).encode('utf-8')
def sha(v): return hashlib.sha256(v).hexdigest()
def safe_url(url):
 p=urlsplit(url); assert p.scheme=='https' and p.hostname in {'scryfall.com','magic.wizards.com'} and not p.username and not p.password and not p.port; return url
def card_url(c):
 url=c.get('scryfall_url') or c.get('card_facts',{}).get('scryfall_uri')
 return safe_url(url) if url else None
def cards_for(ids,cards):
 assert isinstance(ids,list); out=[]
 for i in ids: assert i in cards,i; out.append({'name':cards[i]['name'],'url':card_url(cards[i])})
 return out
def find_url(cards):
 return safe_url('https://scryfall.com/search?q='+quote('('+ ' or '.join('!"'+c['name'].replace('"','')+'"' for c in cards)+') include:extras')) if cards and all(c['url'] for c in cards) else None
def entry(v,cards,colorless=False):
 assert isinstance(v,dict) and v.get('status') in STATUSES and (not colorless or v['status']!='multicolor_only') and isinstance(v.get('note'),str) and v['note'].strip()
 found=cards_for(v.get('card_ids'),cards); assert bool(found)==(v['status'] in {'documented','multicolor_only'})
 return {'status':v['status'],'note':v['note'],'cards':found,'findUrl':find_url(found)}
def sources(record):
 out=[]
 for s in record.get('sources',[]):
  try: item={'title':s.get('title') or 'Source','url':safe_url(s.get('url'))}
  except (AssertionError,TypeError): continue
  if item not in out:out.append(item)
 return out
def related(name,addendum):
 if name!='Attach':return []
 ov=next(r for r in addendum['records'] if r['mechanic']=='Attach'); return [{'name':e['name'],'label':e['label'],'placements':e['placements'],'url':safe_url(addendum['sources'][e['source']]['url']),'note':'This historical 2017 placement describes the named effect, not every Attach action. It does not change 2021 or documented access.'} for e in ov['related_effects']]
def legacy_cards():
 out={}; main=read(LEGACY_A)
 for assessment in main['assessments']:
  for card in assessment['card_review']:
   if card.get('include'): out[card['oracle_id']]={'name':card['name'],'scryfall_url':card.get('card_facts',{}).get('scryfall_uri')}
 absorb=read(LEGACY_ABSORB)
 for card in absorb['observed_population']['cards']: out[card['oracle_id']]={'name':card['name'],'scryfall_url':card.get('scryfall_url')}
 return out
def build():
 supplement=read(SUPPLEMENT); accepted={r['id']:r for r in supplement['records'] if r['name'].startswith(TARGET_PREFIXES) and r['target2021'] is None}; assert len(accepted)==177
 reviews=[r for p in REVIEWS for r in read(p)['records']];assert len(reviews)==len({r['mechanic']['name'] for r in reviews})==177
 addendum=read(ADDENDUM); legacy=legacy_cards(); rows=[]
 for r in reviews:
  name,key=r['mechanic']['name'],r['mechanic']['accepted_id'];assert key in accepted and accepted[key]['name']==name
  a=r['access_review'];assert a.get('version')=='2.0' and a.get('review_date')==('2026-10-29' if name.startswith(('G','H')) else '2026-10-28');assert all(isinstance(a.get(k),str) and a[k].strip() for k in ('scope_label','scope','summary'))
  rawcards={c['oracle_id']:c for c in r['card_review'] if c.get('included')}; cardmap=dict(rawcards); cardmap.update({key:value for key,value in legacy.items() if key in cardmap}); assert set(a.get('colors',{}))==set(COLORS)
  excluded=set(a.get('excluded_access_card_ids',[])); assert excluded <= set(rawcards)
  used=set()
  for color in COLORS:
   item=a['colors'][color]; ids=item.get('card_ids',[]); used.update(ids)
   for oracle_id in ids:
    assert oracle_id in rawcards; attributed=rawcards[oracle_id].get('attributed_colors',[])
    if item['status']=='documented': assert attributed==[color],(name,color,oracle_id,attributed)
    if item['status']=='multicolor_only': assert color in attributed and len(attributed)>1,(name,color,oracle_id,attributed)
  for combo in a.get('combinations',[]):
   for oracle_id in combo.get('card_ids',[]):
    used.add(oracle_id); assert oracle_id in rawcards and set(rawcards[oracle_id].get('attributed_colors',[]))==set(combo['colors']),(name,combo['colors'],oracle_id)
  for oracle_id in a.get('colorless',{}).get('card_ids',[]):
   used.add(oracle_id); assert oracle_id in rawcards and rawcards[oracle_id].get('attributed_colors',[])==[],(name,oracle_id)
  assert not used & excluded
  if name in RULES_ACTIONS: assert not used
  else:
   # A special-material packet must declare its review scope itself.  This
   # keeps the producer from silently assigning special treatment by name.
   allowed=a.get('evidence_scope',LEGACY_EVIDENCE_SCOPES.get(name,['released_paper','released paper']))
   assert isinstance(allowed,list) and allowed and all(isinstance(scope,str) and scope.strip() for scope in allowed)
   allowed=set(allowed)
   eligible={oracle_id for oracle_id,card in rawcards.items() if card.get('scope') in allowed and ({'native','explicit_grant','card_specific_label'} & set(card.get('roles',[])))} - excluded
   assert used==eligible,(name,'access references must cover exactly the normalized qualifying scope',sorted(used),sorted(eligible))
   for color in COLORS:
    item=a['colors'][color]; ids=set(item.get('card_ids',[])); direct={oracle_id for oracle_id in eligible if rawcards[oracle_id].get('attributed_colors',[])==[color]}; joint={oracle_id for oracle_id in eligible if color in rawcards[oracle_id].get('attributed_colors',[]) and len(rawcards[oracle_id].get('attributed_colors',[]))>1}
    if item['status']=='documented': assert ids==direct,(name,color,'documented bucket',sorted(ids),sorted(direct))
    elif item['status']=='multicolor_only': assert ids==joint,(name,color,'joint bucket',sorted(ids),sorted(joint))
    else: assert not ids and not direct and not joint,(name,color,'unrepresented qualifying access')
   combos_by_key={''.join(combo['colors']):combo for combo in a.get('combinations',[])}
   combo_key=lambda colors:''.join(sorted(colors,key=COLORS.index))
   expected_combo_keys={combo_key(rawcards[oracle_id].get('attributed_colors',[])) for oracle_id in eligible if len(rawcards[oracle_id].get('attributed_colors',[]))>1}
   assert len(combos_by_key)==len(a.get('combinations',[])) and set(combos_by_key)==expected_combo_keys,(name,'combination keys',sorted(combos_by_key),sorted(expected_combo_keys))
   for combo in combos_by_key.values():
    expected={oracle_id for oracle_id in eligible if combo_key(rawcards[oracle_id].get('attributed_colors',[]))==''.join(combo['colors'])}
    assert set(combo['card_ids'])==expected,(name,combo['colors'],'combination bucket',sorted(combo['card_ids']),sorted(expected))
   colorless_ids=set(a.get('colorless',{}).get('card_ids',[]))
   expected_colorless={oracle_id for oracle_id in eligible if rawcards[oracle_id].get('attributed_colors',[])==[]}
   assert colorless_ids==expected_colorless,(name,'colorless bucket',sorted(colorless_ids),sorted(expected_colorless))
  colors={c:entry(a['colors'][c],cardmap) for c in COLORS}; combos=[]
  for combo in a.get('combinations',[]):
   cs=combo.get('colors');assert isinstance(cs,list) and len(cs)>=2 and cs==sorted(cs,key=COLORS.index) and all(c in COLORS for c in cs);found=cards_for(combo.get('card_ids'),cardmap);assert found and isinstance(combo.get('note'),str) and combo['note'].strip();combos.append({'colors':cs,'note':combo['note'],'cards':found,'findUrl':find_url(found)})
  limitations=a.get('limitations');assert isinstance(limitations,list) and all(isinstance(x,str) and x.strip() for x in limitations)
  rows.append({'id':key,'name':name,'kind':'rules' if all(x['status']=='not_applicable' for x in colors.values()) else 'access','researchDate':a['review_date'],'scopeLabel':a['scope_label'],'scope':a['scope'],'summary':a['summary'],'access':{'colors':colors,'combinations':combos,'colorless':entry(a.get('colorless'),cardmap,True),'limitations':limitations},'citationCards':[{'name':c['name'],'url':card_url(c)} for c in cardmap.values()],'sources':sources(r),'relatedEffects':related(name,addendum)})
 assert len(rows)==len({r['id'] for r in rows})==177
 return {'schemaVersion':3,'protocolVersion':'2.0','researchDate':'2026-10-29','supplementCanonicalSha256':sha(canonical(supplement)),'sourceBindingFormat':'canonical-json-utf8','sourceBindings':[{'path':p.relative_to(ROOT).as_posix(),'sha256':sha(canonical(read(p)))} for p in SOURCE_INPUTS],'records':sorted(rows,key=lambda r:r['name'])}
def main():
 p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args();text=json.dumps(build(),indent=2,ensure_ascii=False)+'\n'
 if args.check: assert OUTPUT.read_text(encoding='utf-8')==text,'Generated assessment payload is stale';print('PASS: 177 protocol v2.0 A/B/C/D/E/F/G/H documented-access records; deterministic payload and source bindings')
 else:OUTPUT.write_text(text,encoding='utf-8');print('Wrote 177 A/B/C/D/E/F/G/H documented-access records')
if __name__=='__main__':main()
