# Visual direction — Signal · Ethical Portfolio

The brief, as given:

> Use "Signal · Ethical Portfolio" as the visual direction for this interface. It belongs to
> Financial Apps / Work & Wealth. Study the reference for its hierarchy, typography, color
> system, spacing, density, border treatment, and interaction vocabulary. Adapt those
> principles to my product and content — do not copy the sample brand or wording. If I
> provide an unslop.site HTML export, inspect its inline computed CSS, embedded fonts, and
> asset data for exact visual values; treat it as an implementation reference, not
> production-ready source. Keep the result responsive, accessible, and production-ready.

Reference (AI-only): `https://unslop.site/reference/signal-ethical-portfolio`

The reference renders inside an iframe at
`/source/Financial Apps.html?focus=financial-specialist/fin-signal`. Both the page and that
frame are client-rendered shells, so the values below were read off the **live computed
styles** in the rendered frame, not from source CSS. It is a single mobile screen, 402px
wide, for an impact-investing portfolio.

## Measured values

**Typeface** — Inter Tight throughout, one family doing all the work. Weights 400, 700, 800.

**Colour**

| Role | Value |
| --- | --- |
| Brand field (the whole canvas) | `#D9F35A` acid lime |
| Ink — text, borders, inverted panels | `#13251D` |
| Inverted panel inner tile | `#20392F` |
| Muted on ink | `#8DA79B`, `#99AEA4` |
| Paper card | `#F5F8E9` |
| Plain card | `#FFFFFF` |
| Muted on paper | `#63756B` |
| Positive delta | `#26764F` |
| Bottom bar | `rgba(11,13,18,0.95)`, hairline `rgba(255,255,255,0.08)`, inactive `#6B8076` |
| Category chips | `#FFD06A` `#77D7D0` `#DA9DE8` `#9DC58C`, always with ink text |

**Type scale** (at 402px, so treat as the compact end of a responsive scale)

| Role | Value |
| --- | --- |
| Hero figure | `45px / w800 / letter-spacing -2.7px` (−0.06em) |
| Wordmark | `22px w700` + `11px w700` secondary |
| Micro label | `13.33px w400`, and `8–11px` for the smallest |
| Card title | `16px w700` · panel title `12px w700` |
| Stat figure | `17px w700` · stat label `8px w400` |
| Row title | `11px w700` · row secondary `13.33px w400` · row figures `10px w700` |
| Chip code | `9px w800` · nav label `9px w700` |

**Border treatment** — `1px solid #13251D` on every card, panel and callout. **No shadow
anywhere in the reference.** The two shadows present belong to the phone mockup frame around
it, not to the design.

**Radius** — cards and panels `17px`, inner tiles `10px`, chips `11px`, avatar `50%`.

**Spacing and density** — card padding `14px`, inner tile padding `9px`, list rows
`10px 0` with `7px` gaps, page `54px 16px 88px`. Moderate density: generous inside cards,
tight between related figures.

**Hierarchy** — one enormous figure carries the screen; everything else is deliberately
small. The most important block is inverted (ink fill, lime figures) so it reads first
after the hero. Content types are told apart by pastel chips, never by type size.

## How it was adapted here

The reference is one mobile screen on a saturated field. This is a data-dense desktop
console, so a full-bleed lime canvas behind a 44-row table would be unreadable. The
principles were kept and the proportions moved:

- **Lime becomes the signal, not the ground.** It fills the dashboard exposure band, the
  active sidebar item, primary buttons, the busiest chart bar and the focus ring — the
  places the eye should land. The working canvas is the reference's own paper instead.
- **The ink hairline is kept literally.** 1px `#13251D` on every card, and **every shadow
  was removed from the build.** This is the largest change from what was here before.
- **The inverted ink panel is kept** and carries the headline metric on the dashboard, with
  lime figures, exactly as the reference does for its impact block.
- **The hero figure is kept**, with the reference's own −0.06em tracking and weight 800.
- **Pastel chips carry status**, since status is this product's primary signal. Reason
  categories take an ink-outline chip instead, so the two families never read alike.
- **One typeface**, Inter Tight, replacing the previous heading/body pair.
- Micro labels move up to 11–12px for a desktop viewing distance; 8px would not survive it.
- A dark theme is derived — the reference has none. Ink becomes the canvas and lime stays
  put, which suits a design that already inverts panels.

Every pair was checked by computation; see the accessibility section of
[`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md).
