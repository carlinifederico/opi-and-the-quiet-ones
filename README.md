# Opi and the Quiet Ones — Venice pitch

Live: https://carlinifederico.github.io/opi-and-the-quiet-ones/ (public repo, `noindex`)

A 32-screen deck built to be **spoken over**, not read. All English. Rebuilt from scratch on
2026-08-06 following the structure of the Google Slides
[Venice Pitch Deck STRUCTURE](https://docs.google.com/presentation/d/1mwgtz6ICPVdQ9cslkzLoaliqTfGHmQmKZ9qU8iwr4BI/edit);
the story act was rebuilt on 2026-08-13 from the narrative treatment (`VR v3.0`) and the
synopsis told from Opi (`TSB - Sinopsis desde Opi`, version 2).

## Driving it

| | |
|---|---|
| Forward | `→` `↓` `Space` `Enter`, scroll down, swipe up, or the `›` arrow |
| Back | `←` `↑` `Backspace`, scroll up, swipe down, `‹` |
| Jump | `Home` / `End`, or a deep link — `/#12` opens the first story screen |
| Presenter notes | `N`, or the **notes** tab bottom left. `Esc` closes it |
| Write a note | `E`, or click the panel |
| The clock | `T` starts and pauses, `shift T` resets — or click the chip in the nav |
| Teaser sound | the `sound` button, bottom right of screen 9 |

The teaser plays **with sound** as long as you have already pressed a key or clicked
(you will have, getting there). Cold-opening straight to `/#9` starts it muted — browsers
do not allow otherwise.

## The seven-minute clock

The chip on the left of the nav bar counts **down** from 7:00 and then keeps counting **up** with
a `+` in front, because once the alarm has gone the useful number is how far over you are. At zero
it plays four beeps and flashes a red frame around the whole deck — the room is dark and the
laptop may well be muted, so it is worth seeing as well as hearing.

The beeps are synthesised with WebAudio rather than loaded from a file: no asset, and no request
that can fail on a festival wifi. Browsers only allow sound after a gesture, which is exactly what
pressing play is.

For a different slot, put the minutes in the URL: `/?clock=5`.

## Writing the presenter notes

The notes are **not in the source**. They are written in the browser, in the panel itself, and kept
in that browser's storage under `opi-deck-notes-v1`.

- Press `N` to open the panel, `E` (or click it) to start writing, `Esc` or click away to stop.
- It saves as you type. The word *saved* appears top-right of the panel when it lands.
- Formatting is deliberately small, so a note is still readable as plain text in the export file:
  `# heading`, `- bullet`, `**bold**`, `__underline__`, `*italic*`.
- Notes are keyed to a screen's `data-id`, **not** its position, so inserting or reordering screens
  never shuffles notes onto the wrong one.

Because storage is per-browser, **Export** before you change machines: it downloads every note as
one JSON file, and **Import** reads it back (same screen id wins, everything else is kept). That
file is also the way to hand the notes over to be committed into the repo.

`notes/archive-2026-08-13-es.json` holds the previous Spanish notes, in the same format — import it
if you ever want them back.

## The screens

| # | What |
|---|---|
| 1 | Cover — key art, 3dar mark |
| 2 | Gloomy Eyes 2019 — four laurels, Colin Farrell, the loop |
| 3 | Paper Birds 2021 — five laurels, Norton and Stone, the loop |
| 4 | Eggscape 2026 — three laurels, the loop |
| 5 | 2026 — We landed here |
| 6 | "We have never been so connected and so alone." |
| 7 | "Why does being alone frighten us so much?" |
| 8 | "If there is so much to learn from it…" |
| 9 | Title card — the teaser, autoplay |
| 10 | Opi — the shape loneliness takes |
| 11 | Visiting solitudes — the format |
| 12–19 | **The story · act one** — Opi watches, and learns |
| 20–26 | **The story · act two** — Opi intervenes |
| 27 | **The story · you** — the viewer in front of Opi |
| 28 | The reflection |
| 29 | If this were a feature — three acts |
| 30 | Where we are |
| 31 | What we're looking for |
| 32 | No loneliness is ever entirely alone |

### The story, screen by screen

Sixteen screens, one per piece of art, each with the line that carries it. The order is the
synopsis's order, and the point of view is Opi's: every visit is a question the previous one left
open, which is what turns a list of sad scenes into an argument.

| # | Scene | Line |
|---|---|---|
| 12 | Simón · the wake | "In their absence." |
| 13 | Zulma · the crowd | "Sometimes we feel most alone in the middle of a crowd." |
| 14 | Zulma · the tunnels | This is not her prison. It is her home. |
| 15 | Lucy · the park | "Some run from others just to find quiet…" |
| 16 | Lucy · the maze and the lake | "…and end up lost in it." |
| 17 | Luis · the windows | "Sometimes routine feels like safety…" |
| 18 | Luis · the doors | "…until you notice it never ends." |
| 19 | **Turning point** | Loneliness did not come to punish anyone. It came to teach them something. |
| 20 | Luis · the night | "At night, thoughts behave slightly differently." |
| 21 | Simón · the swing | A swing that nobody pushes. |
| 22 | Simón · the imagination | For the first time, someone runs towards him. |
| 23 | The gas station | "Where silences meet." |
| 24 | The gas station · he steps aside | No words. The silence between them grew smaller. |
| 25 | Seraphine · the candle | "Everyone leaves, sooner or later…" |
| 26 | Seraphine and Simón | "…except the ones who love you." |
| 27 | **The viewer** | "Opi stands where you stand, reflecting the side of you no one sees." |

Screen 19 is the hinge the whole act turns on — Opi stops watching and starts acting — and it is
the only screen in the story block that carries an eyebrow label. Screen 27 is the close: the line
is the treatment's own last line, and the art is the viewer wearing the headset.

Screens 2, 3 and 4 are one shape: art on one side, the words and the laurel row on the other, and
the project's own loop in the opposite bottom corner. The loops are silent, restart from frame 0
every time you enter the screen, and pause when you leave. On a phone the loop card steps out —
there is no corner left for it, and the laurels are what has to survive.

Screen 29 puts the key art inside a streaming frame — the film shown in the medium it would
live in — over the three acts. No body copy on screen.

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
- **The notes live in one browser at a time.** That is the trade for having no backend. Export
  before switching machines, and hand the file over if they should be committed here.
