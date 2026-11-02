# BRIEF — Deep Research (Gemini 4 Argon): hosting, access control and offline play for a static gamebook built from a private repository

**Date:** November 2026. **Deliverable:** `DISTRIBUTION_MEMO.md`. This is technical and commercial research, not legal advice.

## Context (facts — do not research these)

- The product is a static web game: «Подземелья Чёрного замка», a non-commercial fan remake of a 1991 Russian gamebook. No server code, no accounts, no database; saves live in the browser's `localStorage`.
- **Build output (`dist/`), ≈ 650 MB in ≈ 5,400 files:**
  - one HTML file of 3.7 MB (game code, four languages, inlined fonts);
  - 75 JPEG illustrations (7.6 MB), 3 map backgrounds (1.1 MB), 20 OGG sound effects (0.7 MB), PWA icons;
  - a narration pack: **4,893 AAC files (`.m4a`, 48 kbps mono), 605 MB** — 4 languages × 1,223 files ≈ 150 MB per language, files from 50 to 700 KB — plus `audio/manifest.json`. Audio is fetched on demand when the player presses 🔊.
  - `sw.js` and `manifest.webmanifest` are present but deliberately **not registered**; there is no offline mode today.
- **Hosting today:** GitHub Pages from the public repository `YVashchuk/Dungeons-of-the-Black-Castle`, plus a second public repository `DotBC` whose `index.html` is a JavaScript redirect that keeps the `#N` anchor (deep links to paragraphs: `…/DotBC/#585`).
- **Plan:** make the main repository **private** after testing. The game text is a copyrighted book; the author has decided to keep distribution small and private. Audience: the author, family, friends and a handful of testers (≈ 5–25 people), mostly on phones (Android Chrome, iPhone Safari), some Windows laptops. A typical player downloads one language's audio over a full playthrough (≈ 150 MB).
- Budget: free is preferred; up to ≈ US$ 10 per month is acceptable if it buys something real.

## Questions

**Q1. Hosting a static site built from a private GitHub repository.** For each of: GitHub Pages (Pro / Team, Pages from private repositories — and whether the *published site* is then public or access-restricted), Cloudflare Pages and Cloudflare Workers static assets, Netlify, Vercel (Hobby plan terms for non-commercial use), Firebase Hosting, itch.io (HTML5 game pages: upload size and file-count limits, draft / restricted / password or secret-URL pages), GitLab Pages, Codeberg Pages, Cloudflare R2 or S3 behind a CDN — report, with a source and an access date for every number:
- price and plan needed; private-repository deploys (Git integration or CLI upload);
- the limits that bite for **650 MB / 5,400 files / individual files up to 3.7 MB / audio**: total size, file count, per-file size, bandwidth and request quotas, build minutes, cache headers;
- custom domain and HTTPS; whether `#N` fragments and relative paths keep working;
- estimated monthly cost for 25 players × 150 MB ≈ 4 GB of transfer.

**Q2. Access control with minimal friction.** Compare: an unlisted (secret) URL; HTTP Basic auth; platform password protection (which plans include it); Cloudflare Access / Zero Trust with an email allowlist and one-time PIN (free-tier user limits, session length); itch.io restricted pages; any other credible option. For each: does it work on iPhone Safari and Android Chrome, including a page added to the home screen; does it survive Safari's tracking prevention and cookie limits; does it stop search indexing; what it does **not** protect against (link forwarding, a determined copier). One paragraph on what access control changes and does not change about the legal exposure of distributing a copyrighted text — without giving legal advice.

**Q3. Keeping the short link and deep links.** If the public `DotBC` redirect stays and the game moves behind access control: does the `#N` fragment survive the redirect plus an authentication round-trip on each option (fragments are not sent to servers; check how each login flow returns the user); what to change in `DotBC`.

**Q4. Offline play in 2026 (Progressive Web App).** With current documentation from Chrome / Android, WebKit / iOS Safari and Microsoft Edge:
- installability criteria on each platform;
- storage quotas and eviction: per-origin limits, Safari's eviction of script-writable storage for sites not used for 7 days and how installed home-screen apps differ, `navigator.storage.persist()` and `estimate()` behaviour on each platform;
- the right store for ≈ 150 MB of audio per language: Cache Storage vs IndexedDB vs the Origin Private File System; playing cached media in Safari when the `<audio>` element sends **Range** requests (known pitfalls with service-worker responses); Background Fetch availability;
- a download UX that fits a gamebook: "make this language available offline" per language with progress, resumable, deletable;
- an update strategy that **never** serves a stale game build (versioned caches, the HTML file not cached-first, `skipWaiting` pitfalls) — this project already had a stale-build scare and wants it impossible;
- whether any of the access-control options in Q2 breaks service workers or offline start.

**Q5. Packaging.** Android: a Trusted Web Activity APK built with Bubblewrap or PWABuilder and sideloaded to testers without a store — requirements (Digital Asset Links) and pitfalls. iOS: what is possible without an Apple developer account (Add to Home Screen) and what TestFlight would require. Desktop: Chrome / Edge install. Store publication of fan content based on a copyrighted book — the relevant Google Play and App Store intellectual-property policies, in one paragraph, to confirm that stores are not an option.

**Q6. Recommendation.** Rank two or three complete setups (for example: A — GitHub Pro with private Pages; B — Cloudflare Pages + Cloudflare Access + offline pack; C — itch.io restricted page) by yearly cost, effort, friction for a non-technical player on an iPhone, offline capability and risks. For the top choice give a step-by-step migration checklist: hosting setup, what changes in the repository (paths, the audio manifest, service-worker scope, cache headers), how deep links and the `DotBC` short link keep working, how a tester gets in for the first time, and a rollback plan.

## Rules
- Primary sources first: vendor documentation, pricing pages, platform release notes, WebKit / Chromium blogs and specs. Give every limit and price with its source and the date you read it. Community posts only to illustrate a pitfall, and marked as such.
- Mark every inference. If a number cannot be found, write "not found" — never estimate a vendor limit.
- Note anything that changed in 2025–2026 (plans renamed, free tiers reduced, new limits).
- Do not research the game's content or audit its code.

## Deliverable — `DISTRIBUTION_MEMO.md`
1. Executive summary (≤ 15 lines) with the recommendation.
2. Hosting matrix (one row per option; columns: price, private-repo deploy, size / file / per-file limits, bandwidth, access control, `#N` deep links, offline-friendly, verdict).
3. Answers to Q1–Q6.
4. Migration checklist for the recommended setup.
5. Sources with access dates.
