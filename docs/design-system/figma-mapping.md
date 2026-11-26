# Figma mapping proposal

Use [foundations](foundations.md) and source-indexed values in [tokens.json](tokens.json). Names below are proposed organizational labels. CSS declarations and browser samples retain their original values and scope.

| Collection | Suggested paths | Rules |
|---|---|---|
| Primitives | Color/Brand/Bitcoin Orange, Color/Palette/<authored hex>, Dimension/Radius/<authored value>, Motion/Duration/<authored value> | Preserve literal values. Deduplicate identical primitive hexes while keeping role aliases. Spacing literals remain an inventory until consolidation is approved. |
| Semantic | Color/Text/Accent/On Light, On Dark, Small, Color/Text/Primary, Color/Surface/Canvas, Color/Border/Default, Color/Focus/Outline, Color/Feedback/{Success, Error}/{Ink, Surface, Border} | Alias known values. Light and dark mode examples use actual Chapter II or colophon overrides. Footer and chapter dark contexts have different values and should not be flattened. |
| Component | Navigation/Index/Numeral, Action/Signature/Ring, Table/Habits/Row Alternate | Only promote values with repeated or documented contextual behavior. Hardcoded and implemented are provenance fields. |
| Type | Display/Hero, Display/Supply, Heading/Chapter, Heading/Section, Heading/Lesson, Body/Intro, Body/Reading, Label/Action, Label/Index, Caption/Meta | Use Manrope/Inter variable faces. Keep viewport endpoints and document CSS clamp, balance/pretty, and tracking separately. |
| Effects | Navigation/Dropdown, Navigation/Current Row Inset, Action/Pressed Inset | Capture active shadow rules from tokens.json. Separate native focus outline from shadow and keep scene shadows in art notes. |

## Component sets and layout

| Candidate set | Properties and responsive instructions |
|---|---|
| Action / Signature and Underlined | Action style and complete PT/EN label. Signature is fixed minimum-height with horizontal padding and auto width. State default/hover/pressed/focus follows production. |
| Navigation / Chapter Index Row | Current boolean, label/title/description, arrow. Numeral and arrow fixed, center grows and wraps. Stack rows with top rules, with denser menu variant. |
| Navigation / Header, Chapter Destination and Language | Use left/right auto layout and no fixed width on text. Desktop custody visibility is a layout property. Separate PT/EN header state from footer control treatment. Previous/next/home properties and direction ordering. |
| Editorial / Disclosure, Panel, Art | Open boolean for disclosures with natural measured height. Distinguish unrelated open patterns and separate static notice styles. Art fits within reserved ratios. |
| Activity / Calculator, Scenario and Guided Transfer | Mode, outcome, size/context and progress properties. Show text plus semantic color, native focus and boundary examples. Use fixtures and safe placeholder content. |
| Data / Security Habits and History | Model rule-separated rows with a mobile stacked variant for the table. History year selected and disabled endpoints. Responsive specs include real copy lengths. |

Use 390 and 1440 CSS-pixel reference frames, then annotate thresholds rather than inventing column counts for the whole site. The shared wrap stays centered with fluid gutter. Build component-level layout grids where the CSS actually switches columns. Annotate long titles, Portuguese/English line counts, dynamic footer height, and 200% zoom intent. Source-only legacy selectors have no Figma variants. Figma construction is a subsequent step.
