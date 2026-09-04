# PWA Implementation Plan — Dungeons of the Black Castle

Based on ChatGPT 5.5 Research task C-1 (April 2026).

> **Status: prepared, NOT activated.** All files required for PWA-ification have been
> created in the repository, but `src/game_shell_top.html` and `build.sh` have NOT been
> modified. The built `dist/*.html` behaves exactly as before. When you're ready to
> deploy, follow the "Activation" section below.

---

## What's already in place

| Asset | Path | Purpose |
|---|---|---|
| Web App Manifest | `dist/manifest.webmanifest` | Install metadata (name, icons, start_url, theme) |
| Service Worker | `dist/sw.js` | Precache + offline fallback |
| App icons | `dist/icons/icon-192.png` (62 KB) | Standard launcher icon |
| | `dist/icons/icon-512.png` (409 KB) | High-res launcher icon |
| | `dist/icons/icon-maskable-512.png` (270 KB) | Adaptive Android icon (80% safe zone) |
| Mobile CSS | `src/mobile.css` | Pixel 7a / iPhone 15 layout, safe-area-inset, portrait/landscape |
| Self-hosted fonts | `src/fonts/*.woff2` (7 files, 149 KB) | Removes Google Fonts dependency |
| Font @font-face rules | `src/fonts/fonts.css` (13 rules) | Drop-in replacement for `@import url(fonts.googleapis.com…)` |

---

## The shape of the decision

**What was chosen:**
- Prepare every file, do not activate yet.
- No Google Drive sync (localStorage is enough).
- Self-host Google Fonts woff2 (adds ~149 KB but removes online dependency).

**What this means:**
- The current `dist/*.html` still works standalone (open from disk, play offline).
- To become a "real PWA" (installable from browser "Add to Home Screen" with app icon, runs full-screen, updates via service worker) — you need an **HTTPS origin**.
  - Recommended: Cloudflare Pages, Netlify, or Vercel (all free tiers, keep repo private).
  - Alternative: GitHub Pages (requires public repo OR GitHub Pro).
  - Do **not** use `raw.githubusercontent.com` — manifest/SW must be same-origin.

---

## Activation steps (when ready to deploy)

### Step 1: Patch `src/game_shell_top.html`

**1a.** Remove the Google Fonts `@import` line:
```diff
 <style>
-@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
 :root{
```

**1b.** Update `<head>` with PWA metadata, improved viewport, and SW registration:
```diff
 <meta charset="UTF-8">
-<meta name="viewport" content="width=device-width,initial-scale=1">
+<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
+<meta name="theme-color" content="#0a0810">
+<link rel="manifest" href="./manifest.webmanifest">
+<link rel="icon" href="./icons/icon-192.png">
+<link rel="apple-touch-icon" href="./icons/icon-192.png">
 <title>Подземелья Чёрного замка</title>
```

**1c.** Just before the closing `</body>`, add SW registration:
```html
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./sw.js', {
        scope: './',
        updateViaCache: 'none'
      });
    } catch (err) { console.error('SW registration failed:', err); }
  });
}
</script>
```

### Step 2: Patch `build.sh` to inline the new CSS files

Two new source files need to be concatenated into the final HTML:
- `src/fonts/fonts.css` — must go **first** (inside the `<style>` block at the top, replacing the old `@import`)
- `src/mobile.css` — must go **last** (inside `<style>`, so its media queries override base rules)

Simplest integration: modify `build.sh` so that when it emits `game_shell_top.html`, it inlines both CSS files into the `<style>` block. Or keep them external and copy to `dist/` — but for the single-file philosophy, inline is cleaner.

Suggested pipeline in `build.sh`:
1. Read `game_shell_top.html`
2. Inject `src/fonts/fonts.css` content after the `:root{` block opens (or right at the start of `<style>`)
3. Inject `src/mobile.css` content right before `</style>`
4. Continue with the rest of the existing concatenation

**Alternatively (simpler):** keep `fonts.css` and `mobile.css` external, and `<link rel="stylesheet">` them. This breaks the "one file" philosophy but keeps build.sh simple. Also means `dist/` would need `fonts/*.woff2` alongside the HTML.

### Step 3: Copy `dist/fonts/` alongside the HTML

If fonts stay external (recommended for PWA simplicity), `build.sh` must copy `src/fonts/*` into `dist/fonts/`:
```bash
mkdir -p dist/fonts
cp src/fonts/*.woff2 dist/fonts/
```

### Step 4: Deploy

Deploy the contents of `dist/` to your chosen HTTPS host:
```
dist/
├── dungeons-of-the-black-castle.html
├── manifest.webmanifest
├── sw.js
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   └── icon-maskable-512.png
└── fonts/                            (if fonts stay external)
    └── *.woff2
```

### Step 5: Verify on Pixel 7a / iPhone 15

1. Open the deployed URL in Chrome.
2. Chrome menu → "Install app" (or "Add to Home Screen"). Icon should appear on the launcher.
3. Enable airplane mode, relaunch from the icon — the game should load.
4. Check DevTools → Application → Service Workers for a registered SW.
5. Check Lighthouse PWA audit — should score green on "Installable".

---

## Update workflow

Every time you rebuild:
1. Bump the `VERSION` string at the top of `dist/sw.js`:
   ```js
   const VERSION = '2026-05-15-001';  // new date-based string
   ```
2. This invalidates old caches automatically on next page load.
3. Users may need to close/reopen the installed PWA to pick up new SW.

---

## What was deliberately NOT done

### 1. Google Drive save sync — skipped by user request
The C-1 report included a full Drive AppData OAuth implementation. That code is NOT
integrated here. `localStorage` remains the only save storage. If you ever change
your mind, the reference implementation is in the original C-1 report.

### 2. Asset splitting — deferred
The HTML is currently ~9.8 MB monolithic (all 36 Midjourney artworks base64-inlined).
C-1 recommends leaving this for now, but splitting to ordinary image files once
art count exceeds ~50. When that time comes:
- Move base64 data out of `mj_art.js` into PNG files under `dist/art/`
- Update `game_logic.js` to reference `./art/artNN_*.png` directly
- Service worker will cache them as ordinary assets on first load

### 3. Build integration
The files are prepared but `build.sh` still uses the old pipeline. This is deliberate:
until deployment is scheduled, keeping `build.sh` stable prevents accidental breakage.

---

## References

- [web.dev — Service Worker Lifecycle](https://web.dev/articles/service-worker-lifecycle)
- [MDN — Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
- [MDN — Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [W3C — Maskable Icons](https://w3c.github.io/manifest/#icon-masks)
- [CSS env() safe-area-inset](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- [Chrome interactive-widget viewport setting](https://developer.chrome.com/blog/viewport-resize-behavior) (Chrome 108+)
