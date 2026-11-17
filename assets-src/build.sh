#!/usr/bin/env bash
# Rebuild the generated site assets from their HTML sources with headless Chrome.
#   assets-src/sample-report.html -> sample-decision-package.pdf
#   assets-src/og-card.html       -> og-image.png (1200x630)
#
# Usage (from the repo root):  bash assets-src/build.sh
# Override the browser with:   CHROME=/path/to/chrome bash assets-src/build.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PROFILE="$(mktemp -d)"
trap 'rm -rf "$PROFILE"' EXIT

if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found at: $CHROME (set CHROME=...)" >&2
  exit 1
fi

"$CHROME" --headless=new --disable-gpu --user-data-dir="$PROFILE" --no-pdf-header-footer \
  --print-to-pdf="$ROOT/sample-decision-package.pdf" "file://$ROOT/assets-src/sample-report.html" 2>/dev/null

"$CHROME" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$PROFILE" --window-size=1200,630 \
  --screenshot="$ROOT/og-image.png" "file://$ROOT/assets-src/og-card.html" 2>/dev/null

echo "Rebuilt sample-decision-package.pdf and og-image.png"
