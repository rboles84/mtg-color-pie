# Historical generators

These emitted the HTML files one directory up. They are NOT a build pipeline and
are not maintained — edit the HTML directly.

They're kept for one reason: they show how the data was derived.

- `build_wheel.py` — solves the pentagon vertices and the five star-chord
  intersections numerically, and asserts there are exactly five distinct
  four-colour exclusions. If you ever need to re-derive the geometry, it's here.
- `build_directory.py` — the 37-tile data table and the conic-gradient ring
  construction.

Both are plain Python 3, no dependencies: `python3 build_wheel.py`.
Note they write to /mnt/user-data/outputs/ — change the path if you run them.
