#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Build script for Dungeons of the Black Castle
# Combines source files into a single self-contained HTML.
# ═══════════════════════════════════════════════════════════════
#
# File order matters:
#   1. game_shell_top.html  ← HTML+CSS frame, opens <script>
#   2. remake_data.js        ← GD (1221 paragraphs)
#   3. illustrations.js      ← legacy 1991 b/w scans (fallback)
#   4. title_art.js          ← title-screen lineart
#   5. mj_art.js             ← Midjourney color art (MJ_DATA/MJ_MAP/MJ_META)
#   6. map_module.js         ← map / fog-of-war panel
#   7. game_logic.js         ← engine — renders MJ first, ILLUST fallback
#   8. closing </script></body></html>
#
# ═══════════════════════════════════════════════════════════════

set -e

SRC_DIR="src"
DIST_DIR="dist"
OUTPUT="$DIST_DIR/podzemelye-chyornogo-zamka-remake.html"

echo "🔨 Building Dungeons of the Black Castle..."

# Check all required source files are present
REQUIRED_FILES=(
  game_shell_top.html
  remake_data.js
  illustrations.js
  title_art.js
  mj_art.js
  map_module.js
  game_logic.js
)

for f in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$SRC_DIR/$f" ]; then
    echo "❌ Missing file: $SRC_DIR/$f"
    exit 1
  fi
done

mkdir -p "$DIST_DIR"

# Assemble the file (shell already contains opening <script>)
cat "$SRC_DIR/game_shell_top.html" > "$OUTPUT"
{
  echo ""
  echo "// ═══ DATA: remake 1221 paragraphs ═══"
  cat "$SRC_DIR/remake_data.js"
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

# Validate <script>/</script> balance
SCRIPTS_OPEN=$(grep -c "<script>" "$OUTPUT" || true)
SCRIPTS_CLOSE=$(grep -c "</script>" "$OUTPUT" || true)
if [ "$SCRIPTS_OPEN" -ne "$SCRIPTS_CLOSE" ]; then
  echo "⚠ Warning: <script>=$SCRIPTS_OPEN, </script>=$SCRIPTS_CLOSE (should be equal)"
fi

# Optional JS syntax check if node is available
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
