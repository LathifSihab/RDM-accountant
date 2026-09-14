#!/usr/bin/env bash
# Run every check. Use this before a deploy; preflight is the one that blocks.
set -u
cd "$(dirname "$0")/.."
fail=0

run() {
  printf '
=== %s ===
' "$1"; shift
  "$@" || fail=1
}

run "Structure (headings, labels, links, titles)" python tools/check_structure.py
run "Palette contrast"                            python tools/check_contrast.py
run "Pricing rules vs 06 worked examples"         node   tools/test_pricing.js
run "PREFLIGHT - launch gate"                     python tools/preflight.py

if [ "$fail" -ne 0 ]; then
  printf '
One or more checks failed. Do not deploy.
'; exit 1
fi
printf '
All checks passed.
'
