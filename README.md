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
| 2 | 2 | Gloomy Eyes 2019 — four laurels, Colin Farrell, the loop |
| 3 | 3 | Paper Birds 2021 — five laurels, Norton and Stone, the loop |
| 4 | 4 | Eggscape 2026 — three laurels, the loop |
| 5 | 5 | 2026 — We landed here |
| 6 | 6 | "Nunca estuvimos tan conectados y a la vez tan solos" |
| 7 | 7 | "¿Por qué nos aterra tanto la soledad?" |
| 8 | 8 | "Si hay tanto para aprender de ella…" |
| 9 | 9 | Title card — the teaser, autoplay |
| 10 | 10 | Opi |
| 11 | 11 | Visiting solitudes — the format |
| 12 | 12 → 28 | The story — 16-scene slideshow, holds on the last frame |
| 13 | 29 | The reflection |
| 14 | 30 | If this were a feature — three acts |
| 15 | 31 | Where we are |
| 16 | 32 | What we're looking for |
| 17 | 33 | No loneliness is ever entirely alone |

Screen 12 covers deck pages 12→28: 16 scenes at 2s each, then it **holds on the last frame** until
you move on. To slow it down, change `--beat` in `assets/css/deck.css` — that one value drives
both the CSS and the JS.

Screens 2, 3 and 4 are one shape: art on one side, the words and the laurel row on the other, and
the project's own loop in the opposite bottom corner. The loops are silent, restart from frame 0
every time you enter the screen, and pause when you leave. On a phone the loop card steps out —
there is no corner left for it, and the laurels are what has to survive.

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
| `07-teaser.mp4` | `THE SILENCE BETWEEN\VENICE VIDEO\MAT\OPI_08_h264.mp4` |
| `logo-opi.webp` | `THE SILENCE BETWEEN\MAT\LOGO\output\Logo_001 copy.png` |
| `logo-3dar.webp` | `_MOSAICO\MAT\LOGOP\3DAR Logo_white.png` |
| `03/04/05-*-loop.mp4` | `…\MAT\GIFS\gloomy.gif`, `birds.gif`, `eggscape.gif` |
| `credits/aw-*-*.webp` | `…\MAT\AWARDS\` — see below |
| `03/04/05-*` | kept from the previous build (extracted from the PPTX) |

The Opi wordmark has no alpha channel of its own — the PSD exports flat ink on grey paper.
`build-assets.sh` lifts the alpha from ink density (`alpha = (234 − luma) / 234`) and repaints
it gold, which is why the spray keeps its real opacity instead of being cut out.

### Where the laurels came from

The twelve marks are cut out of three sources, each needing a different way of getting white
onto transparency. All three keys live in `build-assets.sh`.

| Marks | Source | Key |
|---|---|---|
| Gloomy: SXSW 2019, Venezia 76, Annecy 2019, Sundance 2019 | `MAT\AWARDS\gloomy-eyes-poster.png` | `ART` — alpha from the **min** channel, so the coloured artwork behind them keys out and the neutral white mark survives. Sundance also needs two hand-punched rectangles: specks of the glowing gem sit inside its bounding box. |
| Paper Birds: Tribeca, Red Sea, Raindance, SXSW 2021, Venezia 77 | `MAT\AWARDS\fD52…webp` — 3dar's own 1920×541 strip, ten marks wide, off `3dar.com/p/paper-birds` | `KNOCK` for Tribeca, Red Sea and SXSW, which ship as white baked onto a solid black box; the other two already have alpha. |
| Eggscape: Venezia 79, SXSW 2023 | `MAT\AWARDS\image.jpg` | `WHITE` — alpha from ink density. That sheet never goes darker than 181/255, so the divisor is 40; at the usual 75 the whole row comes out grey. |
| Eggscape: NewImages 2023 | already in the repo, 460×276 | none — it had been mis-filed on the Gloomy row, where NewImages was never won. |

The GIFs are `ppt/media/image19|30|37.gif` inside
`Venice Pitch Deck STRUCTURE.pptx`, extracted once into `MAT\GIFS\` rather than re-read on every
build — the pptx is 209 MB. 70 MB of GIF comes out as ~2.3 MB of H.264.

Type is self-hosted: **Fraunces** for statements, **Space Grotesk** for labels. No CDN — this
has to work on a festival wifi, or none.

## Open

- **Which prize Eggscape actually won at Venice.** The Google Slides says *Golden Lion*; the press
  from 2022 says *Venice Immersive Special Jury Prize* at Venezia 79 (third place). The screen and
  the notes say the neutral "awarded at Venice Immersive" until someone settles it — the slide of a
  pitch deck is the wrong place to guess.
- **The Eggscape loop is the wrong clip** and the deck already knew: page 4 of the Slides carries the
  note *"Busquemos un GIF que cuente más del juego / Multiplayer / No solo auto / Mixed reality (no
  tanto piso)"*. The current one is mostly floor. Drop a better GIF in `MAT\GIFS\eggscape.gif` and
  rebuild.
- **The laurels are as sharp as their sources, no sharper.** The tallest is 276px, most are 110–150px,
  shown at up to 92px. Fine on a projector, slightly soft on a retina laptop. Only official
  festival artwork would fix it, and none of the five festivals publishes one.
- **The cast portraits** were lifted out of the Google Slides render, so they are only as sharp as
  the deck's own copies. Colin Farrell comes from a ~480px source, Norton and Stone from ~300px.
- **The loops are 600×338 and 800×450** — the size the Slides deck stored them at. In a 340px card
  that is fine; they would not survive full-bleed.
- **Language** is mixed on purpose for now: screens 8 and 9 in Spanish as dictated, the rest
  in English.
