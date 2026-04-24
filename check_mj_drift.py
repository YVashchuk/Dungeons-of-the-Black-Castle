import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

with open(r'C:\Users\I828868\Downloads\Dungeons-of-the-Black-Castle\src\mj_art.js', 'r', encoding='utf-8') as f:
    src = f.read()

# 1. Count keys in MJ_DATA (they look like "art01_xxx": "data:image/...", one per line)
# Find the MJ_DATA = { ... }; block
m = re.search(r'MJ_DATA\s*=\s*\{', src)
print(f"MJ_DATA found at offset: {m.start() if m else 'NO'}")
if m:
    # Find matching close brace (naive but works for this flat object)
    start = m.end() - 1  # position of {
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(src)):
        c = src[i]
        if in_str:
            if esc: esc = False
            elif c == '\\': esc = True
            elif c == "'" or c == '"': in_str = False
        else:
            if c == "'" or c == '"': in_str = True
            elif c == '{': depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    end = i
                    break
    block = src[start:end+1]
    keys = re.findall(r"^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*['\"]data:image", block, re.MULTILINE)
    print(f"MJ_DATA keys (art_ids with base64): {len(keys)}")
    for k in sorted(keys):
        print(f"  {k}")

# 2. Count MJ_META entries
mm = re.search(r'MJ_META\s*=\s*\{', src)
if mm:
    start = mm.end() - 1
    depth = 0; in_str = False; esc = False
    for i in range(start, len(src)):
        c = src[i]
        if in_str:
            if esc: esc = False
            elif c == '\\': esc = True
            elif c == "'" or c == '"': in_str = False
        else:
            if c == "'" or c == '"': in_str = True
            elif c == '{': depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    end = i
                    break
    meta_block = src[start:end+1]
    meta_keys = re.findall(r"^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*\{", meta_block, re.MULTILINE)
    # Filter to art_NN pattern
    art_keys = [k for k in meta_keys if re.match(r'art\d+_', k)]
    print(f"\nMJ_META entries: {len(art_keys)}")
