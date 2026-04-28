#!/usr/bin/env python3
"""
Build the dist HTML <head>/<body> shell from src/game_shell_top.html with:

  1. The Google Fonts @import line stripped (offline build).
  2. src/fonts/fonts.css injected before the first </style>, with every
     `url('./fonts/Foo.woff2')` replaced by a base64 data: URL so the
     final HTML is fully self-contained (no external dist/fonts/).
  3. src/mobile.css injected after the fonts block, before </style>.

Called from build.sh:
    python -X utf8 scripts/build_shell.py <src_dir> <output_html>

Inputs:
    <src_dir>/game_shell_top.html
    <src_dir>/fonts/fonts.css
    <src_dir>/fonts/*.woff2
    <src_dir>/mobile.css

Output:
    <output_html>   — overwritten with the transformed shell HTML.

The script is intentionally idempotent: re-running it produces the same
output. It does not append the </script>/</body>/</html> tail — build.sh
does that after concatenating the JS modules.
"""

import sys
import re
import base64
from pathlib import Path


def main() -> int:
    if len(sys.argv) != 3:
        print(f"usage: {sys.argv[0]} <src_dir> <output_html>", file=sys.stderr)
        return 2

    src_dir = Path(sys.argv[1])
    output_path = Path(sys.argv[2])

    shell_path = src_dir / "game_shell_top.html"
    fonts_css_path = src_dir / "fonts" / "fonts.css"
    mobile_css_path = src_dir / "mobile.css"
    fonts_dir = src_dir / "fonts"

    for p in (shell_path, fonts_css_path, mobile_css_path):
        if not p.is_file():
            print(f"missing: {p}", file=sys.stderr)
            return 1

    shell = shell_path.read_text(encoding="utf-8")
    fonts_css = fonts_css_path.read_text(encoding="utf-8")
    mobile_css = mobile_css_path.read_text(encoding="utf-8")

    # 1. Strip Google Fonts @import (handles ' or ", optional trailing semicolon)
    google_import_re = re.compile(
        r"@import\s+url\(\s*['\"]https://fonts\.googleapis\.com[^)]*['\"]\s*\);?\s*\n?",
        re.IGNORECASE,
    )
    new_shell, n_removed = google_import_re.subn("", shell)
    if n_removed == 0:
        print("note: no Google Fonts @import found in shell (already removed?)")
    else:
        print(f"stripped Google Fonts @import (removed {n_removed} occurrence)")
    shell = new_shell

    # 2. Embed every .woff2 referenced from fonts.css as a base64 data: URL.
    woff2_url_re = re.compile(r"url\(\s*['\"]([^'\"]+\.woff2)['\"]\s*\)")
    embedded_total_kb = 0
    embedded_count = 0
    missing_fonts: list[str] = []

    def _embed(match: re.Match) -> str:
        nonlocal embedded_total_kb, embedded_count
        rel = match.group(1)
        # Resolve relative to fonts.css (which lives in src/fonts/).
        # Common forms: './fonts/X.woff2' or './X.woff2' or 'X.woff2'.
        fname = rel.rsplit("/", 1)[-1]
        woff2_path = fonts_dir / fname
        if not woff2_path.is_file():
            missing_fonts.append(str(woff2_path))
            return match.group(0)
        data = woff2_path.read_bytes()
        b64 = base64.b64encode(data).decode("ascii")
        embedded_total_kb += len(data) / 1024.0
        embedded_count += 1
        return f"url('data:font/woff2;base64,{b64}')"

    fonts_css = woff2_url_re.sub(_embed, fonts_css)
    if missing_fonts:
        for m in missing_fonts:
            print(f"warning: font missing: {m}", file=sys.stderr)
    print(
        f"embedded {embedded_count} woff2 file(s) "
        f"as base64 data: URLs ({embedded_total_kb:.1f} KB raw)"
    )

    # 3. Inject fonts.css + mobile.css before the first </style>.
    if "</style>" not in shell:
        print("error: no </style> found in shell HTML", file=sys.stderr)
        return 1

    # 3a. Neutralise any literal '</style>' inside the injected CSS, including
    # inside comments. HTML5 raw-text parsing rules are blunt: the very first
    # '</style>' closes the <style> element regardless of CSS comment syntax,
    # so even a comment that mentions '<style>...</style>' as documentation
    # would terminate the stylesheet early and dump the rest of the file into
    # the page body. Replace with '<\/style>' which is harmless inside CSS
    # comments and inside CSS strings, and (crucially) is not recognised by
    # the HTML parser as a closing tag.
    style_close_re = re.compile(r"</style>", re.IGNORECASE)
    n_neutralised = 0
    new_fonts, n1 = style_close_re.subn(r"<\/style>", fonts_css)
    new_mobile, n2 = style_close_re.subn(r"<\/style>", mobile_css)
    fonts_css = new_fonts
    mobile_css = new_mobile
    n_neutralised = n1 + n2
    if n_neutralised:
        print(
            f"neutralised {n_neutralised} literal '</style>' substring(s) "
            f"in injected CSS (fonts={n1}, mobile={n2})"
        )

    inject = (
        "\n/* ===== injected by build.sh: src/fonts/fonts.css (base64-inlined) ===== */\n"
        + fonts_css
        + "\n/* ===== injected by build.sh: src/mobile.css ===== */\n"
        + mobile_css
        + "\n"
    )
    shell = shell.replace("</style>", inject + "</style>", 1)

    # Write result.
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(shell, encoding="utf-8")

    out_kb = output_path.stat().st_size / 1024.0
    print(f"shell written: {output_path} ({out_kb:.1f} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
