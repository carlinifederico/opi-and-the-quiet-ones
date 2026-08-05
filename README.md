# OPI AND THE QUIET ONES — pitch deck

Live: **https://carlinifederico.github.io/opi-and-the-quiet-ones/**

16 slides, 7:00. Static site, no build step, no external requests — it runs with
the venue wifi off. Headlines in English; the presenter notes are in Spanish and
hidden by default.

Every image and every headline comes from the Google Slides
[OPI AND THE QUIET ONES | Venice Pitch Deck STRUCTURE](https://docs.google.com/presentation/d/1mwgtz6ICPVdQ9cslkzLoaliqTfGHmQmKZ9qU8iwr4BI/).
Files in `assets/img/` are named after the deck page they came from, so anything
on screen can be traced back to its slide.

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

Swipe works on touch, and clicking the left/right edge moves too. `#/7` in the
URL opens straight at slide 7. `Ctrl+P` prints one slide per landscape page —
that's the PDF you can email.

## Structure — mapped to the original deck

| # | slide | deck page | s |
|---|---|---|---|
| 1 | Key art, untouched | p1 | 10 |
| 2 | 3DAR, 2012 → 2027 | p2–p5 | 40 |
| 3 | 2026. We landed here | p6 | 6 |
| 4 | Title card | p7 | 5 |
| 5 | Why does being alone terrify us so much? | p8 | 15 |
| 6 | Loneliness didn't arrive with the screens | p8 comment | 22 |
| 7 | Visiting solitudes, in a 30-minute journey through silence | p9 | 25 |
| 8 | Opi is the shape loneliness takes | p10 | 25 |
| 9 | Crossed lives that barely touch | p11 | 20 |
| 10 | **Synopsis** — slideshow over p13 → p33, 18 beats | p12 | 120 |
| 11 | We want you to come out less afraid of being alone | p12 comment | 20 |
| 12 | "Every screen we ever built points outward…" | p33 | 20 |
| 13 | The VR piece is one door | p34 | 30 |
| 14 | Prototype-ready + 4-month timeline | p35 | 25 |
| 15 | Looking for the right partners | p35 | 25 |
| 16 | No loneliness is ever entirely alone | p36 | 12 |

Total **7:00**. The timer reads these from `data-budget` on each `<section>` —
change a number there and the timer follows.

The eight open comments on the Slides are all answered: the hook opens with
distance instead of blaming technology (p8), the closing quote is used to close
(p9), Opi is introduced as one of many (p10), the synopsis runs as a slideshow
and states the objective (p12 ×3), and the feature treatment is written out (p33).

## Editing

Everything is in three files: `index.html`, `assets/css/deck.css`,
`assets/js/deck.js`.

**The synopsis** (slide 10) — the images are the `<figure>`s inside `.show`, the
captions are the JSON array in `#synopsis-beats`, one `["the deck's own headline",
"what Opi learns"]` pair per image, in the same order. Pages with no headline in
the original get an empty string and show the image alone. `data-beat="6700"` is
the autoplay interval in ms.

**Removing the presenter notes when the deck is final** — every note is wrapped in

```html
<!-- NOTES: remove before final ─── -->
<aside class="notes"> … </aside>
<!-- /NOTES ─── -->
```

Delete those blocks and the `.notes` rules in the CSS. Nothing else depends on them.

## Images

`tools/build-assets.ps1` re-encodes them from the Slides export:

1. File > Download > Microsoft PowerPoint (.pptx) from the Google Slides
2. unzip it, then `$env:OPI_PPTX_MEDIA = "…\ppt\media"`
3. `powershell -ExecutionPolicy Bypass -File tools\build-assets.ps1`

The script maps each web filename to its source file **and its deck page**, and
resizes to 2200px WebP (11–310 KB each, ~2.5 MB total). Re-run it whenever the
art in the Slides changes.

One liberty taken: the cinema shot on the Opi slide is **mirrored** in CSS
(`.bg--flip`) so Opi sits clear of the copy. Remove that class to see it the
right way round.

The Venice video (1.2 GB) is deliberately not in this repo. If it should be in
the deck, put it on Vimeo and link it.

## Still to confirm

- **Eggscape's award year.** The Slides contradicts itself — p2 says Golden Lion
  2022, p5 says 2023 plus a Gamechangers award in 2024. The timeline uses the
  appendix version: *Golden Lion for Best Immersive Experience, Venezia 2022*.
- **The 80 / 20 financing split**, and whether a dollar figure goes next to it.
- **The feature treatment** on slide 13 is a first pass to react to, not a
  decision — it's marked as a proposal on the slide.
- The key art still carries the "repintar / digital" note from the Slides.

## Deploy

Push to `main`; GitHub Pages serves the root. `robots.txt` and a `noindex` meta
tag keep it out of search results — the repo is public, so treat the URL as the
only thing standing between this and the world.
