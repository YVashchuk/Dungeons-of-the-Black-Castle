# Title-screen rider — Midjourney prompt for art chat

> Task: regenerate the hero rider illustration that appears on the
> game's title screen (currently `TITLE_RIDER` in `src/title_art.js`,
> a 1991 b/w line-scan that pixelates at 560 px width).
>
> Target: full-resolution Midjourney output, then web-export to JPEG
> Q82 ≤ 900 px short side, base64-embed into `src/title_art.js` as
> `TITLE_RIDER` (replacing the current value).

## Suggested prompt (paste into the art chat / Midjourney MCP)

```
A lone medieval Slavic hero on horseback, riding away from the viewer
into a dark enchanted forest at twilight, side-back three-quarter view,
cape flowing in the wind, sword at the hip, leather armor with
embroidered Slavic ornaments, the horse caparisoned in dark cloth,
distant silhouette of a black castle on a hillside under a heavy
star-filled sky, atmospheric moonlight catching the rider's profile and
the horse's flank, dramatic chiaroscuro, oil painting on canvas,
medieval-fantasy book cover composition with empty negative space at
the top for sky and stars, painterly brushwork visible, deep blacks,
warm gold rim-light on the rider, cool deep-violet midtones in the
forest, NO text, NO logo, NO frame, NO border
--ar 4:5 --style raw --v 6.1 --stylize 250
--cref https://cdn.midjourney.com/7115e2f5-78b6-488b-9cf0-285652478210/0_0.png
--cw 60
```

## Why this prompt

- **`--cref` + `--cw 60`** ties the hero's appearance to the same
  reference URL used across all 43 Batch 1-4 illustrations
  (per `userMemories`: hero --cref URL is canonical for the project).
- **`--ar 4:5`** matches the left-column aspect of the new title
  layout (rider is taller than wide, max-width 560 px,
  max-height 78 vh).
- **`side-back three-quarter view, riding away`** mirrors the
  composition of the existing 1991 b/w line-art so the hero feels
  continuous with the legacy reference.
- **`Slavic ornaments / armor / dark forest / black castle silhouette`**
  reinforces the same world-building rules used in the 43 paragraph
  illustrations.
- **`empty negative space at the top`** keeps room for the gold-glow
  drop-shadow and the starfield CSS overlay (`.title-stars`) without
  the artwork crowding it.
- **`NO text / NO logo / NO frame / NO border`** is critical — the
  title lettering is a separate base64 element (`TITLE_ART`) on the
  right column, so the rider PNG must be free of any typography.

## Variants worth submitting (parallel `imagine` jobs)

1. **Heroic forward charge** — replace `riding away from the viewer`
   with `riding toward the viewer at full gallop`. Same `--cref`,
   same `--ar`. Good if the away-from-viewer composition reads too
   passive at title size.
2. **Static portrait at the forest edge** — replace `riding away ...
   into a dark enchanted forest` with `halted at the edge of a dark
   enchanted forest, looking back over the shoulder toward the
   viewer`. More cover-art feel, less motion.
3. **Twilight ridge silhouette** — add `viewed from below, against a
   bruised sunset sky` and bump `--ar` to `2:3` for a steeper
   composition.

Submit all three with `mode: fast`, poll once after ~75 s, hand-pick
the best variant, upscale, then base64-embed.

## Integration steps after a winner is picked

1. Resize PNG → JPEG Q82, short side ≤ 900 px (matches the
   `assets/illustrations/web/` pipeline used for the 43 MJ arts).
2. Convert to base64.
3. Replace the `TITLE_RIDER='...'` value in `src/title_art.js` with
   the new base64 string.
4. `bash build.sh` → verify dist size delta is sane (~150-300 KB).
5. Smoke-test the title screen at 1920 × 1080, 1280 × 800, and
   412 × 915 (Pixel 7a portrait via Chrome devtools).

## Notes

- The current title lettering (`TITLE_ART`, the "П-as-tower" logo)
  stays as-is. User feedback explicitly accepted it. A regeneration
  is not needed in this round.
- Author line and "Книга-игра" sub-label are pure CSS now —
  no art change required for them.
