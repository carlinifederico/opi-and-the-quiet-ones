# OPI AND THE QUIET ONES — pitch deck

Live: **https://carlinifederico.github.io/opi-and-the-quiet-ones/**

18 slides, ~7 minutes. Static site, no build step, no external requests — it runs
with the venue wifi off. Headlines in English; the presenter notes are in Spanish
and hidden by default.

## Presenting

| key | |
|---|---|
| `←` `→` `space` | move. On the synopsis slide the arrows step the story beats first, then move on. |
| `N` | presenter notes for the current slide |
| `T` | rehearsal timer — elapsed vs. the target, and where the current slide should end |
| `O` | overview grid, click to jump |
| `P` | resume the synopsis autoplay after you've taken it over manually |
| `F` | fullscreen |
| `Esc` | close notes / overview |

Swipe works on touch, and clicking the left/right edge of the screen moves too.
`#/7` in the URL opens straight at slide 7.

`Ctrl+P` prints one slide per landscape page — that's the PDF you can email.

## Structure

| | slide | s |
|---|---|---|
| **Cover** | Opi and the Quiet Ones | 12 |
| **Where we come from** | 3DAR, 2012 → 2027 · 2026, we landed here | 44 |
| **The hook** | Why does being alone terrify us? · It didn't arrive with the screens · The fear is the illness | 54 |
| **The experience** | Visiting solitudes · VR is lonely by nature | 35 |
| **Opi** | The shape loneliness takes · There are many of them | 38 |
| **The story** | Five lives · Synopsis (13 beats) · What it's for · The VR quote | 160 |
| **Scale** | The VR piece is one door | 26 |
| **Where we are / the ask** | Prototype-ready + 4-month timeline · What we're looking for | 44 |
| **Close** | No loneliness is ever entirely alone | 12 |

Total target: **7:05**. The timer reads these from `data-budget` on each
`<section>` — change a number there and the timer follows.

## Editing

Everything is in three files: `index.html`, `assets/css/deck.css`,
`assets/js/deck.js`.

**Adding or moving a slide** — copy a `<section class="slide">` block. `data-chapter`
is the label in the bottom-right, `data-budget` is its share of the seven minutes.

**The synopsis** (slide 12) — the images are the `<figure>`s inside `.show`, the
captions are the JSON array in `#synopsis-beats`, one `["what happens", "what Opi
learns"]` pair per image, in the same order. `data-beat="8000"` is the autoplay
interval in ms.

**Removing the presenter notes when the deck is final** — every note is wrapped in

```html
<!-- NOTES: remove before final ─── -->
<aside class="notes"> … </aside>
<!-- /NOTES ─── -->
```

Delete those blocks and the `.notes` rules in the CSS. Nothing else depends on them.

## Images

`assets/img/*.webp` are web-sized copies. The originals live on the shared drive at
`H:\Shared drives\BROTACIONES\THE SILENCE BETWEEN\` — `tools/build-assets.ps1` maps
each name to its source and re-encodes with ffmpeg (2200px wide, WebP q80, 7–25 MB
PNG → 40–400 KB). Re-run it after any art update:

```
powershell -ExecutionPolicy Bypass -File tools\build-assets.ps1
```

Two notes on the art:

- The cover uses `SCX_Encuentro` (the gas station diorama). The crosswalk key art
  in the Google Slides only exists inside that document — drop the file on the
  shared drive and add it to `build-assets.ps1` to swap it in.
- The cinema shot on the IP slide is **mirrored** in CSS (`.bg--flip`) so Opi sits
  clear of the copy. Remove that class to see it the right way round.

The Venice video (1.2 GB) is deliberately not in this repo. If it should be in the
deck, put it on Vimeo and link it.

## Still to confirm

- **Eggscape's award year.** The Google Slides contradicts itself — p2 says Golden
  Lion 2022, p5 says 2023 plus a Gamechangers award in 2024. The timeline uses the
  appendix version: *Golden Lion for Best Immersive Experience, Venezia 2022*.
- **The 80 / 20 financing split** on the ask slide, and whether a dollar figure goes
  next to it.
- **The feature treatment** on the IP slide is a first pass to react to, not a
  decision — it's marked as a proposal on the slide.
- The cover art still carries the "repintar / digital" note from the Slides.

## Deploy

Push to `main`; GitHub Pages serves the root. `robots.txt` and a `noindex` meta tag
keep it out of search results — the repo is public, so treat the URL as the only
thing standing between this and the world.
