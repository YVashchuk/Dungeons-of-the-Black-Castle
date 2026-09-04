#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Build script for Dungeons of the Black Castle
# Combines source files into a single self-contained HTML.
# ═══════════════════════════════════════════════════════════════
#
# Steps:
#   1. Build the HTML shell from src/game_shell_top.html via
#      scripts/build_shell.py — strips fonts.googleapis.com @import,
#      injects src/fonts/fonts.css with woff2 embedded as base64 data:
#      URLs, and injects src/mobile.css. Both go inside the existing
#      <style> block. Result: dist HTML is fully self-contained and
#      mobile-aware on first cold launch (no Google Fonts dependency,
#      no external dist/fonts/ directory needed).
#   2. Append the JS modules in fixed order:
#        game_structure.js → locale.ru.js → locale.{en,fr,uk}.js → illustrations.js → title_art.js → mj_art.js
#        → map_module.js → game_logic.js
#   3. Close </script>, </body>, </html>.
#   4. Copy static art assets: assets/art -> dist/art (externalized, group_70).
#
# ═══════════════════════════════════════════════════════════════

set -e

SRC_DIR="src"
DIST_DIR="dist"
OUTPUT="$DIST_DIR/dungeons-of-the-black-castle.html"

echo "🔨 Building Dungeons of the Black Castle..."

# ── Required source files ──
REQUIRED_FILES=(
  game_shell_top.html
  game_structure.js
  locale.ru.js
  locale.en.js
  locale.fr.js
  locale.uk.js
  illustrations.js
  title_art.js
  mj_art.js
  map_module.js
  game_logic.js
  mobile.css
  fonts/fonts.css
)
for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$SRC_DIR/$f" ]; then
    echo "❌ Missing file: $SRC_DIR/$f"
    exit 1
  fi
done

mkdir -p "$DIST_DIR"

# ── Step 1: HTML shell with mobile.css + fonts.css injected ──
PYBIN=$(command -v python || command -v python3 || true)
if [ -z "$PYBIN" ]; then
  echo "❌ Python not found in PATH (needed for shell transform)"
  exit 1
fi
"$PYBIN" -X utf8 scripts/build_shell.py "$SRC_DIR" "$OUTPUT"

# ── Step 2: append JS modules ──
{
  echo ""
  echo "// ═══ DATA: remake 1221 paragraphs ═══"
  cat "$SRC_DIR/game_structure.js"
  echo ""
  echo ""
  echo "// ═══ LOCALE: RU text (paragraph prose + choice labels) ═══"
  cat "$SRC_DIR/locale.ru.js"
echo "// ═══ LOCALE: EN skeleton (group_72) ═══"
cat "$SRC_DIR/locale.en.js"
echo "// ═══ LOCALE: FR skeleton (group_72) ═══"
cat "$SRC_DIR/locale.fr.js"
echo "// ═══ LOCALE: UK skeleton (group_72) ═══"
cat "$SRC_DIR/locale.uk.js"
  echo ""
  echo ""
  echo "// ═══ DATA: legacy 1991 b/w scan illustrations (fallback) ═══"
  cat "$SRC_DIR/illustrations.js"
  echo ""
  echo ""
  echo "// ═══ DATA: title-screen lineart ═══"
  cat "$SRC_DIR/title_art.js"
  echo ""
  echo ""
  echo "// ═══ DATA: Midjourney color illustrations (preferred) ═══"
  cat "$SRC_DIR/mj_art.js"
  echo ""
  echo ""
  echo "// ═══ MODULE: map / fog-of-war ═══"
  cat "$SRC_DIR/map_module.js"
  echo ""
  echo ""
  echo "// ═══ ENGINE: game logic (combat, luck, rendering) ═══"
  cat "$SRC_DIR/game_logic.js"
  echo ""
  echo "</script>"
  echo "</body>"
  echo "</html>"
} >> "$OUTPUT"

# ── Step 3: static art assets (externalized 2026-07-01, group_70) ──
# group_82 CU-07: the font license travels with the built artifact
cp "$SRC_DIR/fonts/OFL.txt" "$DIST_DIR/OFL.txt"

if [ -d "assets/art" ]; then
  mkdir -p "$DIST_DIR/art"
  cp -r assets/art/. "$DIST_DIR/art/"
  ART_COUNT=0
  for f in "$DIST_DIR"/art/*/*; do [ -f "$f" ] && ART_COUNT=$((ART_COUNT+1)); done
  echo "🖼  Art assets copied: $ART_COUNT files -> $DIST_DIR/art/"
else
  echo "❌ Missing assets/art (externalized art payloads)"
  exit 1
fi

# ── Sanity: <script>/</script> balance ──
SCRIPTS_OPEN=$(grep -c "<script>" "$OUTPUT" || true)
SCRIPTS_CLOSE=$(grep -c "</script>" "$OUTPUT" || true)
if [ "$SCRIPTS_OPEN" -ne "$SCRIPTS_CLOSE" ]; then
  echo "⚠ Warning: <script>=$SCRIPTS_OPEN, </script>=$SCRIPTS_CLOSE (should be equal)"
fi

# ── Sanity: no Google Fonts pulled at runtime (offline build broken if so) ──
if grep -E -q "@import[[:space:]]+url\([\"']https://fonts\.googleapis\.com" "$OUTPUT"; then
  echo "⚠ Warning: live @import from fonts.googleapis.com still present in $OUTPUT"
fi

# ── Optional JS syntax check ──
if command -v node >/dev/null 2>&1; then
  for f in "${REQUIRED_FILES[@]}"; do
    case "$f" in
      *.js)
        if ! node --check "$SRC_DIR/$f" 2>/dev/null; then
          echo "⚠ Syntax warning in $SRC_DIR/$f"
        fi
        ;;
    esac
  done
fi

SIZE=$(wc -c < "$OUTPUT")
SIZE_KB=$((SIZE / 1024))
SIZE_MB=$((SIZE_KB / 1024))
echo "✅ Built: $OUTPUT (${SIZE_KB}KB ≈ ${SIZE_MB}MB)"
