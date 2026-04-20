#!/bin/bash
# Build script for Dungeons of the Black Castle
# Combines source files into a single HTML for distribution

set -e

SRC_DIR="src"
DIST_DIR="dist"
OUTPUT="$DIST_DIR/podzemelye-chyornogo-zamka-remake.html"

echo "🔨 Building Dungeons of the Black Castle..."

# Check prerequisites
for f in game_shell_top.html remake_data.js illustrations.js title_art.js game_logic.js map_module.js; do
  if [ ! -f "$SRC_DIR/$f" ]; then
    echo "❌ Missing file: $SRC_DIR/$f"
    exit 1
  fi
done

mkdir -p "$DIST_DIR"

# Assemble the file
cat "$SRC_DIR/game_shell_top.html" > "$OUTPUT"
cat "$SRC_DIR/remake_data.js" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$SRC_DIR/illustrations.js" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$SRC_DIR/title_art.js" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$SRC_DIR/game_logic.js" >> "$OUTPUT"
echo "" >> "$OUTPUT"
cat "$SRC_DIR/map_module.js" >> "$OUTPUT"
echo -e "\n</script>\n</body>\n</html>" >> "$OUTPUT"

# Validate
if command -v node &> /dev/null; then
  # Check that </script> appears exactly once
  SCRIPTS_OPEN=$(grep -c "<script>" "$OUTPUT" || true)
  SCRIPTS_CLOSE=$(grep -c "</script>" "$OUTPUT" || true)
  if [ "$SCRIPTS_OPEN" -ne "$SCRIPTS_CLOSE" ]; then
    echo "⚠ Warning: <script>=$SCRIPTS_OPEN, </script>=$SCRIPTS_CLOSE"
  fi
fi

SIZE=$(wc -c < "$OUTPUT")
SIZE_KB=$((SIZE / 1024))
echo "✅ Built: $OUTPUT (${SIZE_KB}KB)"
