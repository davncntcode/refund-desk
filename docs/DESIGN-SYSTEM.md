# Design System

The visual direction is **Signal · Ethical Portfolio** — see [`DESIGN-BRIEF.md`](DESIGN-BRIEF.md)
for the brief, the values measured off the reference, and what was adapted rather than copied.

In one line: a paper canvas, **1px ink hairlines instead of shadows**, one acid lime used only
where the eye should land, inverted ink panels for the figures that matter, and one typeface
carrying the whole hierarchy through weight and size.

Tokens live in [`app/globals.css`](../app/globals.css). Never hard-code a hex in a component.

## Colour

Three families and nothing else: **paper** (the ground), **ink** (text, hairlines, inverted
panels), **lime** (the signal). Chips add six pastels that only ever carry status.

| Token | Role | Light | Dark |
| --- | --- | --- | --- |
| `background` | the ground | `#E9E9DE` | `#0E1712` |
| `card` | every panel | `#F7F8EF` | `#16241E` |
| `card-alt` | inputs, tabs, callouts | `#FFFFFF` | `#1B2C24` |
| `foreground` | all text | `#13251D` | `#EFF3E4` |
| `muted-foreground` | labels, meta | `#4F615A` | `#93A89C` |
| `border` | the hairline, on everything | `#13251D` | `#527465` |
| `divider` | incidental rules inside a card | `#B9BFB4` | `#354E43` |
| `lime` / `primary` | the signal | `#D9F35A` | `#D9F35A` |
| `primary-foreground` | text on lime — **ink in both themes** | `#13251D` | `#13251D` |
| `ink` / `ink-tile` | inverted panel and its tiles | `#13251D` / `#20392F` | `#08110D` / `#1B2C24` |
| `on-ink` / `on-ink-muted` | text inside an inverted panel | `#FFFFFF` / `#8DA79B` | same |
| `positive` / `negative` | deltas, rejection | `#1F6543` / `#9C2F14` | `#7BD3A4` / `#FF9C7A` |

**Where lime is allowed:** the exposure band, the active sidebar item, primary buttons, the
busiest bar on the intake chart, the figures inside an inverted panel, and the focus ring in
dark. Nowhere else. It stops being a signal the moment it becomes decoration.

### Status chips

`chip-amber` `chip-peri` `chip-sage` `chip-clay` `chip-teal` — pending, in review, approved,
rejected, refunded. Each is a saturated pastel with **ink text in both themes**, an ink
hairline, and 11px corners.

Two rules:

1. **Colour is reserved for status.** Reason categories get an outlined code square
   (`DUP` `NRC` `DMG` `CXL` `BIL` `OTH`) instead of a colour, so the two families never read
   alike. The square is the reference's holdings badge, re-purposed.
2. **Never colour alone.** Every chip carries its label and an icon.

## Typography

**Inter Tight**, one family, via `next/font`. Weights 400, 600, 700, 800. Hierarchy comes
from weight and size, never from a second face.

| Role | Class |
| --- | --- |
| Hero figure | `.display` + `text-[2.75rem] sm:text-6xl` |
| Page title | `text-2xl sm:text-3xl font-extrabold tracking-tight` |
| Card title | `text-base font-bold` |
| Body | `text-sm` · figures in a column `.numeric` |
| Micro label | `.micro` |

Three utilities carry the direction:

- **`.display`** — weight 800, `letter-spacing: -0.06em`, `line-height: 0.95`, tabular
  figures. The reference's hero tracking, measured off it exactly.
- **`.numeric`** — tabular figures with a hair of negative tracking, for anything compared
  down a column.
- **`.micro`** — 11px, weight 700, `0.08em` tracking, uppercase. The label above every
  figure. The reference goes down to 8px; 11px is the floor at desktop viewing distance.

## Shape, depth and density

- **No shadows anywhere.** A 1px ink border separates every surface. This is the direction's
  signature and the biggest departure from a conventional dashboard.
- Cards and panels `rounded-2xl` (17px), inner tiles 10px, chips and controls
  `rounded-lg` (11px). Only a bare progress bar is fully round.
- Card padding 20px, inner tiles 14px, list rows 12px, grid gap 16px.
- Controls are 32–36px tall. Denser than the previous build, in line with the reference.

## Layout

Sidebar 240px · main column capped at `max-w-7xl` · right rail on the dashboard and the
detail page. The sidebar's active item is a lime block with an ink border; its bottom slot
holds an inverted panel with the cleared-queue figure.

Each screen opens with a **band**: lime and full width on the dashboard (open exposure) and
on the detail page (the amount requested). Below `lg` the sidebar becomes a sheet; below
`md` the table becomes a card list.

## Dark theme

Derived — the reference is light only. Ink becomes the ground, paper inverts to deep green,
and **lime does not move**: it is the same `#D9F35A` in both themes, always with ink text.
Chips keep their pastels and their ink text, which is why they read as brightly on the dark
ground as on paper. The theme follows the OS and the header toggle overrides it.

## Accessibility floor

Every pair was checked by computation in both themes. The tightest are `muted-foreground`
on `background` at 5.38:1 light, `on-ink-muted` on the ink panel at 6.21:1, and
`muted-foreground` on `card-alt` at 5.81:1 dark. Ink on lime is 12.91:1; ink on the palest
chip is 7.61:1. Re-check after any colour change.

- Control boundaries clear 3:1 against both card and ground in both themes — 14.98:1 light,
  3.10:1 dark. Incidental dividers inside a card sit below that on purpose.
- Colour never carries meaning alone.
- Every interactive element has a visible focus ring.
- Icon-only buttons carry an `aria-label`; chart bars carry `sr-only` text; the reason code
  square is `aria-hidden` with the full label beside it.
- Every screen has one `h1`, visually hidden on the dashboard where the band is the masthead.
