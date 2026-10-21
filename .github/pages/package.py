"""Assemble and verify the GitHub Pages package.

    python .github/pages/package.py --rev <sha>            # build _site/
    python .github/pages/package.py --rev <sha> --verify   # build, then check

The package is an explicit allowlist (FILES): nothing else is published.
Every file is copied byte for byte except the shell, whose `var REV = '';`
is stamped with the revision so the shell loads each instrument as
`<file>?v=<rev>`. --verify syntax-checks each shipped inline script with
`node --check`, serves the package over local HTTP, and confirms every
allowlisted path returns its expected bytes and that excluded paths 404.
Stdlib only. Nothing here edits the source tree.
"""
import argparse
import hashlib
import http.server
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[2]

FIXTURES = ['01_W_single_colour', '02_WB_pair', '03_BG_complementary',
            '04_UBR_grixis', '05_WUBR_four_colour', '06_WUBRG_all_five',
            '07_flying_restriction', '08_flash_adjudicated',
            '09_no_primary_colour', '10_tertiary_best_access',
            '11_alias_provenance']

FILES = [
    'index.html',
    'vox-color/index.html',
    'vox-color/color-wheel.html',
    'vox-color/mechanical-explorer.html',
    'vox-color/mechanical-examples.json',
    'data/mechanical-color-pie.runtime.json',
    'data/mcp2021.abilities.json',
    *[f'data/fixtures/{n}.json' for n in FIXTURES],
    'data/recon/marginal-additions.csv',
]

SHELL = 'vox-color/index.html'
STAMP = "var REV = '';"
SCRIPTS = ['index.html', 'vox-color/index.html', 'vox-color/color-wheel.html',
           'vox-color/mechanical-explorer.html']

# Must not be served: a sample of what sits beside the allowlisted files.
EXCLUDED = ['vox-color/mechanical-periodic-table.html',
            'vox-color/reference/current-weave-annotated.html',
            'vox-color/build/build_wheel.py', 'data/recon.md',
            'data/mcp2021.reconciled.json', 'tools/gate.py',
            'docs/card-examples-map.xlsx', 'HANDOFF.md', 'CLAUDE.md',
            'AGENTS.md', '.claude/settings.json', '.github/pages/package.py']


def fail(msg):
    sys.exit(f'package: FAIL: {msg}')


def build(out, rev):
    if out.exists():
        if not out.name.startswith('_site'):
            fail(f'refusing to replace {out}: not a _site directory')
        shutil.rmtree(out)
    for rel in FILES:
        src = ROOT / rel
        if not src.is_file():
            fail(f'missing source file {rel}')
        dst = out / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dst)
    if (ROOT / SHELL).read_bytes().count(STAMP.encode()) != 1:
        fail(f'{SHELL}: expected exactly one {STAMP!r}')
    (out / SHELL).write_bytes(expected(SHELL, rev))


def expected(rel, rev):
    data = (ROOT / rel).read_bytes()
    if rel == SHELL:
        data = data.replace(STAMP.encode(), f"var REV = '{rev}';".encode())
    return data


def verify(out, rev):
    # 1. Inventory: exactly the allowlist, with the expected bytes.
    found = sorted(p.relative_to(out).as_posix() for p in out.rglob('*') if p.is_file())
    if found != sorted(FILES):
        fail(f'inventory differs: extra {sorted(set(found) - set(FILES))}, '
             f'missing {sorted(set(FILES) - set(found))}')
    for rel in FILES:
        if (out / rel).read_bytes() != expected(rel, rev):
            fail(f'{rel}: bytes differ from source')
    print(f'inventory   : {len(FILES)} files, byte-identical (shell stamped v={rev})')

    # 2. Syntax of every shipped inline script.
    with tempfile.TemporaryDirectory() as tmp:
        for rel in SCRIPTS:
            html = (out / rel).read_text(encoding='utf-8')
            blocks = re.findall(r'<script>(.*?)</script>', html, re.S)
            if len(blocks) != 1:
                fail(f'{rel}: expected one inline script, found {len(blocks)}')
            js = pathlib.Path(tmp) / (pathlib.Path(rel).stem + '.js')
            js.write_text(blocks[0], encoding='utf-8')
            r = subprocess.run(['node', '--check', str(js)], capture_output=True, text=True)
            if r.returncode:
                fail(f'{rel}: node --check\n{r.stderr}')
    print(f'node --check: {len(SCRIPTS)} inline scripts clean')

    # 3. Over HTTP: every allowlisted path, and excluded paths 404.
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **k):
            super().__init__(*a, directory=str(out), **k)

        def log_message(self, *a):
            pass

    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Quiet)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{srv.server_address[1]}/'
    try:
        for rel in FILES:
            with urllib.request.urlopen(base + rel) as r:
                if r.status != 200 or r.read() != expected(rel, rev):
                    fail(f'HTTP {rel}: unexpected status or content')
        with urllib.request.urlopen(base) as r:
            if r.read() != expected('index.html', rev):
                fail('HTTP /: does not serve the root entry')
        for rel in EXCLUDED:
            try:
                urllib.request.urlopen(base + rel)
                fail(f'HTTP {rel}: excluded file is served')
            except urllib.error.HTTPError as e:
                if e.code != 404:
                    fail(f'HTTP {rel}: status {e.code}, expected 404')
    finally:
        srv.shutdown()
    print(f'http        : {len(FILES)} paths 200 with expected bytes; '
          f'{len(EXCLUDED)} excluded paths 404')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--rev', required=True, help='revision token, e.g. the commit sha')
    ap.add_argument('--out', default=str(ROOT / '_site'))
    ap.add_argument('--verify', action='store_true')
    a = ap.parse_args()
    if not re.fullmatch(r'[0-9A-Za-z]{1,40}', a.rev):
        fail('--rev must be 1-40 letters or digits')
    out = pathlib.Path(a.out).resolve()
    build(out, a.rev)
    print(f'built       : {out}')
    if a.verify:
        verify(out, a.rev)
    print('package     : PASS')


if __name__ == '__main__':
    main()
