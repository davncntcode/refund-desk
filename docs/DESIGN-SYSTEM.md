# Design System

Light, airy, friendly and restrained — rounded cards on an off-white canvas, one saturated
brand colour plus one warm accent, pastel tints to tell content apart, progress made
visible. It should read like a current SaaS product, not a back-office database form.

Tokens live in [`app/globals.css`](../app/globals.css). Change them there; never hard-code
a hex in a component.

## Colour

`off-white canvas` + `ONE saturated brand` + `ONE warm accent` + `pastel tints`.

**Brand is indigo.** Money movement reads as fintech, and indigo is the colour that carries
it without turning cold. It fills the active nav pill, the primary button and the focus ring.

**Accent is amber.** Used sparingly, and only where something wants attention: the ring on
the "awaiting decision" tile, the busiest bar on the intake chart, the pending share of the
queue breakdown.

The brand ramp is organised by role rather than by lightness, because the dark theme
inverts which end is light:

| Token | Role | Light | Dark |
| --- | --- | --- | --- |
| `brand-50/100/200` | tinted surfaces | `#EEF0FF` `#E0E3FF` `#C6CAFB` | `#1B1D3A` `#252A4D` `#333A66` |
| `brand-500` | the bright brand — links, icons, focus ring | `#4F46E5` | `#8B84FF` |
| `brand-600` | the primary fill, white text on top | `#4338CA` | `#4F46E5` |
| `brand-700` | text sitting on a brand surface | `#3730A3` | `#B7B1FF` |
| `background` | canvas — never pure white | `#F7F8FC` | `#0D0F1A` |
| `card` | every panel | `#FFFFFF` | `#151827` |
| `border` | hairlines that whisper | `#E4E7F2` | `#272C42` |
| `input` | control boundaries, held at 3:1 | `#828CAD` | `#5E6994` |
| `amber-mark` / `amber-fg` | accent fill / accent text | `#F59E0B` `#9A4A08` | `#FBBF24` `#F0A81C` |

### Pastel tints

`mint` `sky` `lilac` `peach` `butter` `rose`, each with a darkened `-fg` counterpart. They
carry two kinds of meaning and are the most characteristic move in the system: colour as a
way of telling things apart.

**Status** — pending `butter`, in review `sky`, approved `mint`, rejected `rose`, refunded
`lilac`. **Reason category** — duplicate charge `sky`, item not received `peach`, damaged
item `rose`, cancelled order `lilac`, billing error `butter`, other `muted`.

Two rules, both non-negotiable:

1. **Always use the pair.** `bg-mint text-mint-fg`. Never set text in the pastel itself.
2. **Never let the tint be the only signal.** Every status pill carries its label and an
   icon; every category chip carries its label.

## Typography

Two families, self-hosted through `next/font`:

- **Plus Jakarta Sans** (`font-heading`) — headings, KPI numbers, references.
- **Inter** (`font-sans`, the default) — body, forms, tables. Its tabular figures keep the
  amount column lined up.

**Tailwind's default type scale, unmodified.** No custom scale, no modular ratio. Restraint
comes from usage:

| Role | Class |
| --- | --- |
| Page title | `text-2xl sm:text-3xl font-bold tracking-tight` |
| Card / section title | `font-heading text-base font-semibold` |
| Body and form text | `text-sm` |
| Labels, captions, meta | `text-xs text-muted-foreground` |
| KPI number | `text-2xl sm:text-3xl font-bold` + `.numeric` |

`.numeric` sets tabular figures and the heading face. Put it on every number a person
compares down a column: amounts, counts, references, page numbers.

## Shape and depth

- Cards `rounded-xl`, hairline `border-border`, `shadow-card` — a border *and* a soft
  shadow, never a heavy one.
- Buttons, pills, filter tabs and pagination controls are `rounded-full`.
- Icons sit in a `size-9 rounded-lg` tinted square beside a label.
- Prefer lightening to adding. If a panel feels heavy, remove the shadow before reaching
  for another border.

## Layout

Three zones: **sidebar 240px** · **main column** · **right rail** (dashboard and detail).
Content caps at `max-w-7xl`. The sidebar's active item is a filled brand pill; inactive
items are muted with no background. The bottom card holds the cleared-queue fraction with a
progress bar.

Below `lg` the sidebar becomes a sheet. Below `md` the refund table becomes a card list —
the same rows, re-arranged, not a horizontally scrolling table.

## Progress, made visible

The taste this follows asks for progress everywhere, and every number here has a
denominator: the cleared-queue bar in the sidebar, the share bars in the queue breakdown,
the intake chart with its busiest day called out, `Showing 1–15 of 44` under the list, and
the character count on the reason field.

## Dark theme

Derived, not taken from a reference. Every token has a dark counterpart, so a component
built from tokens works in both themes with no `dark:` class. The theme follows the
operating system by default and the header toggle overrides it. Reach for `dark:` only when
a component needs a genuinely different treatment — the theme toggle's two icons are the
only place that does.

## Accessibility floor

Every text pair in the token set was checked by computation, not by eye, and clears 4.5:1 in
both themes. The tightest are `amber-fg` on `amber-100` at 5.36:1 light, `mutedFg` on
`muted` at 5.60:1 light, and `brand-500` on `card` at 5.74:1 dark. Re-check after any
colour change.

- Control boundaries (`input`) clear 3:1 against both the card and the canvas. Decorative
  card hairlines sit below that deliberately — they are not the only indicator of a
  component, and the focus ring (`brand-500`, 5.7–6.3:1) is.
- Colour never carries meaning alone.
- Every interactive element has a visible focus ring.
- Icon-only buttons carry an `aria-label`; chart bars carry `sr-only` text.
- Filter tabs are real tabs, the search field is a real `role="search"` form, and the
  status history is an ordered list.
