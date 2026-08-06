# Opi and the Quiet Ones — Venice pitch

Live: https://carlinifederico.github.io/opi-and-the-quiet-ones/ (public repo, `noindex`)

A 17-screen deck built to be **spoken over**, not read. Rebuilt from scratch on 2026-08-06
following the structure of the Google Slides
[Venice Pitch Deck STRUCTURE](https://docs.google.com/presentation/d/1mwgtz6ICPVdQ9cslkzLoaliqTfGHmQmKZ9qU8iwr4BI/edit).

## Driving it

| | |
|---|---|
| Forward | `→` `↓` `Space` `Enter`, scroll down, swipe up, or the `›` arrow |
| Back | `←` `↑` `Backspace`, scroll up, swipe down, `‹` |
| Jump | `Home` / `End`, or a deep link — `/#12` opens the story slideshow |
| Presenter notes | `N`, or the **notas** tab bottom left. `Esc` closes it |
| Teaser sound | the `sound` button, bottom right of screen 7 |

The notes drawer carries every annotation from the Google Slides, sorted per screen, with the
load-bearing ideas in **bold** and the ones not to forget <u>underlined</u>. Nothing in there is
invented — it is the deck's own working text, the comments on it, and the synopsis, reorganised.
The story synopsis lives in the notes for screen 12.

The teaser plays **with sound** as long as you have already pressed a key or clicked
(you will have, getting there). Cold-opening straight to `/#7` starts it muted — browsers
do not allow otherwise.

## The screens

| # | Deck page | What |
|---|---|---|
| 1 | 1 | Cover — key art, 3dar mark |
| 2 | 2 | 3dar — studio loop, festival strip |
| 3–5 | 3, 4, 5 | Gloomy Eyes 2019 · Paper Birds 2021 · Eggscape 2026 |
| 6 | 6 | 2026 — We landed here |
| 7 | 7 | Teaser, autoplay |
| 8 | 8 | "Vivimos en una época más solitaria que antes" |
| 9 | 9 | "¿Por qué nos aterra tanto la soledad?" |
| 10 | 10 | Visiting solitudes — the format |
| 11 | 11 | Opi |
| 12 | 12 → 28 | The story — 16-scene slideshow on loop, synopsis behind the eye |
| 13 | 29 | The reflection |
| 14 | 30 | If this were a feature — three acts |
| 15 | 31 | Where we are |
| 16 | 32 | What we're looking for |
| 17 | 33 | No loneliness is ever entirely alone |

Screen 12 covers deck pages 12→28: 16 scenes at 2s each, then it **holds on the last frame** until
you move on. To slow it down, change `--beat` in `assets/css/deck.css` — that one value drives
both the CSS and the JS.

Screen 14 puts the key art inside a streaming frame — the film shown in the medium it would
live in — over the three acts. No body copy on screen; the treatment and the character work are
in the notes.

## Assets

Everything is generated from the originals on the shared drive:

```bash
bash tools/build-assets.sh
```

Sources — `H:\Shared drives\BROTACIONES\`:

| Web asset | Original |
|---|---|
| `01-cover`, `08-artdir`, `09-door`, `10-experience`, `11-opi`, `30-roses`, `33-thanks` | `THE SILENCE BETWEEN\_REPO\THE SILENCE BETWEEN\MAT\ALL CONCEPTS\OTHER\` |
| `scenes/01…16` | `…\ALL CONCEPTS\SCENES\` (chronological by filename) |
| `02-about3dar.mp4` | `…\MAT\EDIT_About3dar_001.gif` |
| `07-teaser.mp4` | `THE SILENCE BETWEEN\VENICE VIDEO\MAT\OPI_08_h264.mp4` |
| `logo-opi.webp` | `THE SILENCE BETWEEN\MAT\LOGO\output\Logo_001 copy.png` |
| `logo-3dar.webp` | `_MOSAICO\MAT\LOGOP\3DAR Logo_white.png` |
| `03/04/05-*` | kept from the previous build (extracted from the PPTX) |

The Opi wordmark has no alpha channel of its own — the PSD exports flat ink on grey paper.
`build-assets.sh` lifts the alpha from ink density (`alpha = (234 − luma) / 234`) and repaints
it gold, which is why the spray keeps its real opacity instead of being cut out.

Type is self-hosted: **Fraunces** for statements, **Space Grotesk** for labels. No CDN — this
has to work on a festival wifi, or none.

## Open

- **The cast portraits and award marks** on screens 3–5 were lifted out of the Google Slides
  render, so they are only as sharp as the deck's own copies (~120–260px). Fine at the size they
  are shown; originals would be better.
- **The 3dar loop** comes from a 560×315 GIF, so it is soft at full-bleed. A higher-res source
  would fix it.
- **Language** is mixed on purpose for now: screens 8 and 9 in Spanish as dictated, the rest
  in English.
