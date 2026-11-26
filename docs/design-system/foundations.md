# Foundations

## Color and cascade

| Category | Production source and usage |
|---|---|
| Brand | `--brand #F7931A` supplies the CTA fill and dark accent alias, plus graphics. `--brand-deep #D97706` is declared separately. Brand assets carry their own raster colors. |
| Neutral and surface | `--ink #202020`, `--muted #555`, `--canvas #F8F5EF`, `--surface #FFF`, `--border #E5DED3`, `--tint #FFF1DF` in the root. Journey and VII use hardcoded `#F2ECE2`. Chapter II reverses ink/canvas and overrides five semantic variables. Colophon uses a dark surface with its own copy, rule and focus declarations. |
| Accent and interaction | `--action #A84E08`, `--focus #8F3C04`, and the three Correction 21 accent tokens. The matching root hex on action and small accent represents two distinct roles. |
| Feedback | Success `#237A45 / #F0F5EE / #8FB69A`. Error `#B42318 / #FFF0ED / #D99B94`. Outcome selectors alias ink, surface and border to `--feedback-*`. Warning and information treatments are local, including wallet and lesson guidance. |
| Component and art palettes | CTA outline, inset and state styling, historic section surfaces, diagram fills, gradients and 3D hexes are kept as authored. See source-indexed lists in [tokens.json](tokens.json). No standardized warning palette is shared across routes. |

See [contrast evidence](accessibility.md) for measured surface pairs. The inventory counts 14 unique primitive names (15 declarations) and 17 semantic root declarations by documented audit classification. This classification does not imply a CSS primitive-to-semantic architecture. Scoped declarations are tracked separately. A literal color index covers authored CSS and inline/Three.js art values. Raster art is catalogued by asset, since its pixels are not authored UI tokens.

## Typography

Vite imports Fontsource variable Manrope and Inter from `main.tsx`. Production bundles subset WOFF2 files. Display and headings use Manrope Variable, body and controls default to Inter Variable, with Arial and sans-serif fallbacks. Font synthesis is disabled. Weights are used continuously, including 500, 550, 600, 620, 650 and 700. The base body is `clamp(1rem,1.4vw,1.125rem)/1.65`; local lesson and panel rules override it. Base h1/h2/h3 rules use fluid clamps and negative tracking. See computed type samples below and the fuller per-route selector record in [tokens.json](tokens.json).

The hero headline uses three display-block nowrap spans. Headings generally use balance; supporting copy and pillar descriptions use pretty wrapping where set. Narrow habits rows and reference URLs have their own overflow rules. Chapter numbers and calculator outputs use numeric variants where specified. Figma text-style names describe rendered roles and viewport reference endpoints.

## Spacing and layout

At the default 16 px root, global gutter `clamp(1.25rem,4vw,4rem)` yields 20 px at 390 and 57.6 px at 1440. Shared wrap caps at 80rem. Chapters use contextual 77rem and 80rem caps and a 76ch reading measure. Global section spacing `clamp(3.5rem,8vw,7rem)` yields 56px and 112px at the two reference widths where used. Duplicate values such as .5rem, .75rem, 1rem, 1.5rem and 2rem recur without one enforced spacing scale.

The header bar starts at a 4.3rem minimum. The header is sticky and has a 2px reading rail. The header switches from compact menu utilities to direct custody access at the larger layout. The footer centers within 65rem, with 51rem link and disclaimer measures, outer padding `clamp(3rem,7vw,5.5rem) 1.7rem`, and a two-column navigation grouping above 34rem. Its height is content driven. Pillars move from one column to three at 54rem. Content grids add columns at 40rem, 48rem and 52rem according to route. Journey disclosure caps at 53rem. Chapter navigation becomes two columns at 48rem. Full threshold operators, mixed dimensional conditions and art DPR switching are listed in the token index.

## Shape and elevation

Global radius is .75rem with local 8/12/16px chapter values. The index uses square rows and 1px separators. Destination arrows use circles. The CTA carries a pill outline and inset ring; field controls, guidance panels, and table edges use contextual radii. Focus outlines use a separate semantic color. Real depth is selective in the dropdown and illustration scenes. Chapter bands and the CSS practice phone use authored decorative gradients. Exact rules and sources are in the shape inventory, and the sampled key selectors include their effective border, radius and shadow. The rejected tactile CTA and removed hero controls are excluded from active style specifications.

## Computed type reference styles

Each sample is size / weight / line height / tracking from live Edge. These are reference styles for Figma, with the per-route samples and remaining selectors in the JSON. The chapter index numerals are defined independently as Manrope 28–32px, weight 500, line height 1 and tracking −.045em. Their copy styles are 15.68px/600/1.28 and 13px/1.43.

| Role and selector | Face | 390px | 1440px |
|---|---|---|---|
| Hero display · `.hero h1` | Manrope Variable | 39.585px / 620 / 39.1891px / -2.49385px | 68px / 620 / 67.32px / -4.284px |
| Hero lead · `.hero .intro` | Inter Variable | 16px / 400 / 23.2px / normal | 18px / 400 / 26.1px / normal |
| Hero support · `.hero-support` | Inter Variable | 14px / 400 / 19.6px / normal | 14px / 400 / 19.6px / normal |
| Hero meta · `.hero-note` | Inter Variable | 13px / 400 / 17.55px / normal | 13px / 400 / 17.55px / normal |
| Signature action · `.cta-signature` | Inter Variable | 15px / 600 / 24.75px / normal | 15px / 600 / 24.75px / normal |
| Journey heading · `.journey h2` | Manrope Variable | 30.4px / 600 / 34.352px / -1.1248px | 53.6px / 600 / 60.568px / -1.9832px |
| Pillar heading · `.pillars h3` | Manrope Variable | 21.6px / 600 / 23.544px / -0.4752px | 26.4px / 600 / 28.776px / -0.5808px |
| Pillar description · `.pillar-detail` | Inter Variable | 14.88px / 400 / 22.32px / normal | 14.88px / 400 / 22.32px / normal |
| Menu trigger · `.menu-toggle` | Inter Variable | 14px / 620 / 23.1px / normal | 15px / 620 / 24.75px / normal |
| Language code · `.language button` | Inter Variable | 14px / 750 / 23.1px / 0.56px | 14px / 750 / 23.1px / 0.56px |
| Footer section heading · `.colophon h2` | Manrope Variable | 16.8px / 650 / 18.312px / -0.6216px | 16.8px / 650 / 18.312px / -0.6216px |
| Footer body · `.colophon p` | Inter Variable | 16px / 400 / 26.4px / normal | 18px / 400 / 29.7px / normal |
| Chapter title · `.chapter-head h1` | Manrope Variable | 33.6px / 600 / 35.952px / -1.848px | 68px / 600 / 72.76px / -3.74px |
| Chapter introduction · `.chapter-head .intro` | Inter Variable | 18px / 400 / 29.7px / normal | 20px / 400 / 33px / normal |
| Chapter I section heading · `.chapter h2` | Manrope Variable | 30.4px / 600 / 33.44px / -1.52px | 59.2px / 600 / 65.12px / -2.96px |
| Chapter III lesson heading · `.chapter h3` | Manrope Variable | 26.4px / 650 / 30.096px / -1.056px | 45.6px / 650 / 51.984px / -1.824px |
| Chapter III body · `.chapter-lesson p` | Inter Variable | 16px / 400 / 26.4px / normal | 18px / 400 / 29.7px / normal |
| Destination label · `.destination-label` | Inter Variable | 12px / 650 / 17.16px / normal | 12px / 650 / 17.16px / normal |
| Lab title · `.lab h3` | Manrope Variable | 29.6px / 600 / 32.264px / -0.6512px | 52px / 600 / 56.68px / -1.144px |
| Lab field label · `.lab label` | Inter Variable | 15px / 620 / 24.75px / normal | 15px / 620 / 24.75px / normal |
| Lab result · `.results dd` | Inter Variable | 24px / 700 / 39.6px / normal | 38.4px / 700 / 63.36px / normal |
| Lab control · `.controls button` | Inter Variable | 15px / 650 / 24.75px / normal | 15px / 650 / 24.75px / normal |
| Security habit · `.habit-table tbody th` | Inter Variable | 16px / 650 / 24px / normal | 18px / 650 / 27px / normal |
| Security reason · `.habit-table td` | Inter Variable | 15px / 400 / 22.5px / normal | 18px / 400 / 27px / normal |
| FAQ summary · `.faq summary` | Inter Variable | 16px / 650 / 26.4px / normal | 18px / 650 / 29.7px / normal |

## Breakpoint inventory

The nine width threshold values are 22rem (paired with max-height 38rem), 375px (paired with min-resolution 2.5dppx), 24rem, 34rem, 40rem, 47.99rem, 48rem, 52rem, and 54rem. The tenth distinct dimensional threshold is the 38rem height qualifier. Inclusive, strict and near-boundary queries coexist. Keep those operators as specified in the source index. The 34rem and 48rem thresholds each drive more than one independent rule.

The source index records 114 distinct literal spacing expressions found inside padding, margin, inset and gap declarations, including negatives, zero, fluid-expression terms and overridden values. This count is an inventory of authored literals. Use the matched selector and browser computed values for actual layout measurements.

## Font assets and shell measurements

The build emits 12 WOFF2 assets. File names below identify the inspected build. The subset and file selection is managed by CSS font faces.

- `inter-cyrillic-ext-wght-normal-BOeWTOD4.woff2`
- `inter-cyrillic-wght-normal-DqGufNeO.woff2`
- `inter-greek-ext-wght-normal-DlzME5K_.woff2`
- `inter-greek-wght-normal-CkhJZR-_.woff2`
- `inter-latin-ext-wght-normal-DO1Apj_S.woff2`
- `inter-latin-wght-normal-Dx4kXJAl.woff2`
- `inter-vietnamese-wght-normal-CBcvBZtf.woff2`
- `manrope-cyrillic-wght-normal-Dvxsihut.woff2`
- `manrope-greek-wght-normal-DL7QRZyv.woff2`
- `manrope-latin-ext-wght-normal-Ch3YOpNY.woff2`
- `manrope-latin-wght-normal-DHIcAJRg.woff2`
- `manrope-vietnamese-wght-normal-usUDDRr7.woff2`

| Viewport | Sticky header height | Header wrap width | Homepage colophon height |
|---:|---:|---:|---:|
| 390px | 69.796875px | 350px | 938.125px |
| 1440px | 81px | 1280px | 729.34375px |

Measurements use Portuguese, unopened footer sources, and Edge. Footer height changes with locale, wrapping and disclosure state.
