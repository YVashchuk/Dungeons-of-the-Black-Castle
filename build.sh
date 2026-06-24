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
#        remake_data.js → locale.ru.js → illustrations.js → title_art.js → mj_art.js
#        → map_module.js → game_logic.js
#   3. Close </script>, </body>, </html>.
#
# ═══════════════════════════════════════════════════════════════

set -e

SRC_DIR="src"
DIST_DIR="dist"
OUTPUT="$DIST_DIR/podzemelye-chyornogo-zamka-remake.html"

echo "🔨 Building Dungeons of the Black Castle..."

# ── Required source files ──
REQUIRED_FILES=(
  game_shell_top.html
  remake_data.js
  locale.ru.js
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
  cat "$SRC_DIR/remake_data.js"
  echo ""
  echo ""
  echo "// ═══ LOCALE: RU text (paragraph prose + choice labels) ═══"
  cat "$SRC_DIR/locale.ru.js"
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
