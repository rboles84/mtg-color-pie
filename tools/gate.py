#!/usr/bin/env python3
"""
Shared upstream gate. Downstream tools call require_source_gate() FIRST.

Making each downstream tool run the gate itself -- rather than documenting an
order somebody has to remember -- is the same decision as making identity
rulings an input to the parser. A convention gets skipped; a call does not.
The failure it prevents is rebuilding three stories of derived data on a
corrupted source layer and only finding out at the top.
"""
import pathlib
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent


def _run(script, data_dir, label):
    r = subprocess.run([sys.executable, str(HERE / script), "--data", str(data_dir)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        sys.stdout.write(r.stdout)
        sys.stdout.write(r.stderr)
        print("\n%s FAILED. Downstream generation will not start." % label)
        sys.exit(1)
    print("%-20s: PASS" % label)


def require_taxonomy_gate(data_dir):
    """Runtime depends on the taxonomy, so the taxonomy gate runs before it."""
    _run("check_taxonomy.py", data_dir, "taxonomy gate")


def require_source_gate(data_dir):
    r = subprocess.run([sys.executable, str(HERE / "check_invariants.py"),
                        "--data", str(data_dir)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        sys.stdout.write(r.stdout)
        sys.stdout.write(r.stderr)
        print("\nSOURCE GATE FAILED. Downstream generation will not start.")
        sys.exit(1)
    print("source gate         : PASS")


if __name__ == "__main__":
    import argparse
    ap = argparse.ArgumentParser(description="Run the source gate, then the taxonomy gate.")
    ap.add_argument("--data", type=pathlib.Path, default=pathlib.Path("data"))
    a = ap.parse_args()
    require_source_gate(a.data)
    require_taxonomy_gate(a.data)
