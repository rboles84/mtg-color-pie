#!/usr/bin/env python3
"""Build a single self-contained HTML dossier over data/.

Read-only over the frozen source layer. Touches nothing in data/ or
vox-color/. Emits docs/DATA-DOSSIER.html, which opens from file:// with no
dependencies and no build step.

    python tools/build_dossier.py
"""
import collections
import hashlib
import json
import os
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')
OUT = os.path.join(ROOT, 'docs', 'DATA-DOSSIER.html')
TEMPLATE = os.path.join(ROOT, 'tools', 'dossier_template.html')

CS = 'WUBRG'


def load(rel):
    with open(os.path.join(DATA, rel), encoding='utf-8') as fh:
        return json.load(fh)


def digest(path):
    h = hashlib.sha256()
    with open(path, 'rb') as fh:
        for chunk in iter(lambda: fh.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()[:12]


FILE_ROLE = {
    'mechanical_pie_2021.json': ('L0 capture', 'First structured capture of the article: the five colour blocks as printed, plus the provenance headers every later layer inherits.'),
    'mechanical_pie_review.md': ('L0 capture', 'Review notes over the first capture.'),
    'mcp2021.abilities.json': ('L1 catalog', "The ability catalog parsed into records: label, optional group header, per-tier colour assignments, the tier words exactly as printed, and the explanatory sentence."),
    'mcp2021.lists.json': ('L1 lists', 'The fifteen colour-by-tier lists as printed, plus a capture-coverage receipt for each of the fifteen.'),
    'mcp2021.reconciled.raw.json': ('L2 reconcile', 'Catalog and lists joined before identity adjudication. Kept so the merge stays auditable.'),
    'mcp2021.reconciled.json': ('L2 reconcile', 'The adjudicated source truth. One record per source identity; every colour carries a tier and the basis for that tier.'),
    'mcp2021.identity_rulings.json': ('L2 reconcile', 'Every case where a list label and a catalog label might or might not name the same mechanic, with the verdict and the reason for it.'),
    'mcp2021.identity_review.md': ('L2 reconcile', 'Prose record of the identity review.'),
    'mcp2021.audit.md': ('L2 reconcile', 'Capture audit of the source layer.'),
    'vox.families.json': ('L3 taxonomy', 'The Vox-Mana navigation index. 23 families, exactly one canonical family per mechanic plus optional secondary cross-links, each carrying the rule that fired.'),
    'vox.families.pilot.json': ('L3 taxonomy', 'The 30-mechanic pilot run, kept as evidence the rules were reviewed before they were scaled to all 216.'),
    'mechanical-color-pie.runtime.json': ('L4 runtime', 'The projection the page actually reads. The same 216 mechanics denormalised three ways: byMechanic, byColor, byFamily.'),
    'recon.md': ('L5 measurement', 'Narrative reconnaissance notes.'),
}

RECON_ROLE = {
    'mechanics-statistics.json': 'The frozen statistical corpus. Every figure in this dossier that is not recomputed live is quoted from here.',
    'matrices.json': 'Square matrices: pair overlap, family-by-colour, family-by-selection, colour breadth.',
    'mechanics-statistics-recon.md': 'The seventeen-section human-readable recon report.',
    'family-statistics.csv': 'One row per family (23).',
    'identity-statistics.csv': 'One row per canonical colour selection (31).',
    'color-signatures.csv': 'One row per observed exact-access signature (28).',
    'pair-overlap.csv': 'One row per colour pair (10).',
    'marginal-additions.csv': 'One row per base-selection plus added-colour transition (75).',
    'four-color-absence.csv': 'One row per omitted colour (5).',
    'registry-identity-audit.csv': 'One row per display-name registry record (37).',
}


def describe(rel, obj):
    if rel == 'mechanical-color-pie.runtime.json':
        return '216 mechanics, 5 colours, 23 families'
    if rel == 'mcp2021.abilities.json':
        return '%d ability records' % len(obj['abilities'])
    if rel == 'mcp2021.lists.json':
        return '%d lists, %d entries' % (len(obj['lists']), sum(len(v) for v in obj['lists'].values()))
    if rel.startswith('mcp2021.reconciled'):
        return '%d source identities' % len(obj['mechanics'])
    if rel == 'mcp2021.identity_rulings.json':
        return '%d rulings' % len(obj['rulings'])
    if rel.startswith('vox.families'):
        return '%d families, %d assignments' % (len(obj['families']), len(obj['assignments']))
    if rel == 'mechanical_pie_2021.json':
        return '%d colour blocks' % len(obj.get('colors', {}))
    if rel.startswith('fixtures/'):
        return '%d assertions' % len(obj)
    if isinstance(obj, dict):
        return '%d top-level keys' % len(obj)
    return ''


def build_inventory():
    rows = []
    for dirpath, _dirs, files in os.walk(DATA):
        for name in sorted(files):
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, DATA).replace('\\', '/')
            layer, role = FILE_ROLE.get(name, ('', ''))
            if rel.startswith('recon/'):
                layer, role = 'L5 measurement', RECON_ROLE.get(name, '')
            if rel.startswith('fixtures/'):
                layer = 'L5 golden'
                role = 'Frozen expected output for one selection or one adjudication case.'
            if name.endswith('.json'):
                try:
                    records = describe(rel, json.load(open(full, encoding='utf-8')))
                except Exception:
                    records = ''
            else:
                records = '%d lines' % sum(1 for _ in open(full, encoding='utf-8'))
            rows.append({
                'path': rel,
                'bytes': os.path.getsize(full),
                'sha': digest(full),
                'layer': layer,
                'role': role,
                'records': records,
            })
    rows.sort(key=lambda r: (r['layer'], r['path']))
    return rows


def build():
    rt = load('mechanical-color-pie.runtime.json')
    bm = rt['byMechanic']
    stats = load('recon/mechanics-statistics.json')
    matrices = load('recon/matrices.json')
    fams = load('vox.families.json')
    rulings = load('mcp2021.identity_rulings.json')
    abilities = load('mcp2021.abilities.json')
    lists = load('mcp2021.lists.json')
    reconciled = load('mcp2021.reconciled.json')

    mechs = []
    for key in sorted(bm):
        r = bm[key]
        mechs.append({
            'k': key,
            'l': r['label'],
            'c': {c: [d['tier'], d.get('basis', '')] for c, d in r['colors'].items()},
            'f': r['family'],
            's': r['families_secondary'],
            'x': bool(r['has_restriction']),
            'a': r.get('source_aliases', []),
            'e': r.get('explanation', ''),
        })

    rule_for = {}
    for a in fams['assignments']:
        rule_for.setdefault(a['primary'], a.get('rule', ''))

    famrows = []
    for f in stats['families']:
        row = {k: f[k] for k in (
            'family', 'canonical_family_members', 'secondary_family_links',
            'expanded_family_neighborhood', 'conditional_member_count',
            'canonical_selections_reaching_family') if k in f}
        row['reach'] = {c: f['canonical_reach_' + c] for c in CS}
        row['prim'] = {c: f['canonical_primary_' + c] for c in CS}
        row['rule'] = rule_for.get(f['family'], '')
        row['gloss'] = fams['families'].get(f['family'], '')
        famrows.append(row)

    selrows = [{k: s[k] for k in (
        'key', 'colors', 'color_count', 'reachable_count', 'primary_available',
        'secondary_only', 'tertiary_only', 'unavailable_count', 'shared_any_access',
        'shared_primary', 'shared_mixed_tier', 'complementary',
        'conditional_reachable', 'families_reached', 'families_with_primary_access',
        'display', 'common_names') if k in s} for s in stats['selections']]

    adjud = []
    for key in sorted(bm):
        for c, d in bm[key]['colors'].items():
            if d.get('basis') != 'both-agree':
                adjud.append({
                    'mech': key, 'color': c, 'tier': d['tier'], 'basis': d['basis'],
                    'conflict': d.get('conflict'), 'ruling': d.get('ruling'),
                })

    cond_fam = collections.Counter(r['family'] for r in bm.values() if r['has_restriction'])
    tot_fam = collections.Counter(r['family'] for r in bm.values())

    live = {
        'assignments': dict(collections.Counter(
            d['tier'] for r in bm.values() for d in r['colors'].values())),
        'basis': dict(collections.Counter(
            d.get('basis') for r in bm.values() for d in r['colors'].values())),
        'conditional': sum(1 for r in bm.values() if r['has_restriction']),
        'with_explanation': sum(1 for r in bm.values() if r.get('explanation')),
        'alias_records': sum(1 for r in bm.values() if r.get('source_aliases')),
        'alias_total': sum(len(r.get('source_aliases', [])) for r in bm.values()),
        'cross_links': sum(len(r['families_secondary']) for r in bm.values()),
        'family_partition': sum(len(v) for v in rt['byFamily'].values()),
        'bycolor': {c: {t: len(v) for t, v in rt['byColor'][c].items()} for c in CS},
        'catalog_records': len(abilities['abilities']),
        'catalog_groups': len({a['group'] for a in abilities['abilities'] if a['group']}),
        'catalog_ungrouped': sum(1 for a in abilities['abilities'] if not a['group']),
        'list_entries': sum(len(v) for v in lists['lists'].values()),
        'list_sizes': {k: len(v) for k, v in sorted(lists['lists'].items())},
        'source_identities': len(reconciled['mechanics']),
        'ruling_verdicts': dict(collections.Counter(
            v.get('ruling') for v in rulings['rulings'].values())),
        'conditional_by_family': {f: [cond_fam[f], tot_fam[f]] for f in sorted(tot_fam)},
        'zero_primary': [k for k, v in bm.items()
                         if not any(d['tier'] == 'primary' for d in v['colors'].values())],
        'three_primary': [k for k, v in bm.items()
                          if sum(d['tier'] == 'primary' for d in v['colors'].values()) == 3],
    }

    fixtures = []
    fdir = os.path.join(DATA, 'fixtures')
    for name in sorted(os.listdir(fdir)):
        with open(os.path.join(fdir, name), encoding='utf-8') as fh:
            fixtures.append({'name': name, 'body': json.load(fh)})

    return {
        'meta': rt['meta'],
        'generated': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC'),
        'inventory': build_inventory(),
        'overall': stats['overall'],
        'placement': stats['placement_accounting'],
        'registry': stats['registry_audit'],
        'special': stats['special_identities'],
        'definitions': stats['frozen_definitions'],
        'breadth': {k: {'n': v['mechanics_assigned_to_exactly_n_colors'], 'pct': v['pct_of_216']}
                    for k, v in stats['color_breadth'].items()},
        'signatures': stats['color_signatures'],
        'per_color': {c: {k: v for k, v in stats['per_color'][c].items()
                          if not k.endswith('_keys') and not k.endswith('distribution')}
                      for c in CS},
        'per_color_families': {c: stats['per_color'][c]['primary_family_distribution'] for c in CS},
        'exclusive_keys': {c: stats['per_color'][c]['exclusive_access_keys'] for c in CS},
        'unique_primary_keys': {c: stats['per_color'][c]['unique_primary_owner_keys'] for c in CS},
        'selections': selrows,
        'size_dist': stats['selection_size_distributions'],
        'pairs': stats['pair_overlap'],
        'matrices': matrices,
        'marginal': stats['marginal_additions'],
        'transitions': stats['tier_transition_totals'],
        'absence': stats['four_color_absence'],
        'families': famrows,
        'mechanics': mechs,
        'adjudications': adjud,
        'rulings': rulings['rulings'],
        'fixtures': fixtures,
        'naming': stats['naming_model'],
        'live': live,
    }


def main():
    payload = build()
    blob = json.dumps(payload, ensure_ascii=False, separators=(',', ':'))
    with open(TEMPLATE, encoding='utf-8') as fh:
        tpl = fh.read()
    if '/*__PAYLOAD__*/null' not in tpl:
        raise SystemExit('template is missing the payload marker')
    html = tpl.replace('/*__PAYLOAD__*/null', blob)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(html)
    print('wrote %s  (%.0f KB)' % (OUT, os.path.getsize(OUT) / 1024))


if __name__ == '__main__':
    main()
