# Implementation inventory

## Method and provenance

The Git baseline and Vercel production application define scope. The three imported stylesheets establish the cascade. `style.css` supplies layered foundations, `editorial-layout.css` adds layered navigation and editorial rules, and unlayered `chapter.css` supplies chapter-wide and route-local overrides. `tokens.json` pairs authored declarations with computed route samples. The [original master](../../Documento-Mestre-Bitcoin-Autocustodia-PT-EN.md) and [historical design system](../../ONCE-UPON-A-BITCOIN-DESIGN-SYSTEM.md) establish intent. When they differ from production, this inventory follows production.

| Route | Entry and active learning surfaces |
|---|---|
| / | `App` hero and `HeroVisual`, signature action, linked learning pillars, chapter disclosure |
| /chapter/1 | `ChapterOne`, peer network, benefits selector, five-event history, recap and conclusion |
| /chapter/2 | `ChapterTwo`, supply number, coin scene, satoshi converter, volatility and learning panels |
| /chapter/3 | `ChapterThree`, peer network, comparison table and custody toggle with illustrated key |
| /chapter/4 | `ChapterFour`, masked recovery card, creation steps, storage guidance, storage/loss scenarios |
| /chapter/5 | `ChapterFive`, wallet/balance comparisons, six setup steps, official Bitkit links, transfer practice and fee calculator |
| /chapter/6 | `ChapterSix`, shield, scam scenario, seven-row habits table |
| /chapter/7 | `ChapterSeven`, ten-item checklist, FAQ and finale |

Sixteen production samples returned HTTP 200 and identified the same JavaScript asset, index-CHjhtM4f.js, as the verified baseline. No sampled route reported horizontal overflow at 390 or 1440 CSS pixels. These are Portuguese, reduced-motion Edge samples. Current component behavior is also traced to source and prior bilingual evidence.

Every route uses `App` in `src/main.tsx`, the sticky header, logo, chapter dropdown, bilingual switch, reading progress and footer. The chapter shell and destination rows are local functions. The same index-row helper serves the menu and homepage disclosure. Seven chapter components accept `lang` and compose route content. Twelve active exported support component types are named in the component inventory, excluding route wrappers and shell. Two additional local types, WalletVisual and StepList, render repeatedly inside Chapter V. All twelve exports have candidate Storybook stories, with browser-dependent scene entries needing dedicated fixtures. The repeated visual vocabulary includes underlined actions, rules and rows, localized pressed groups, disclosure sections, image-and-copy splits, inset editorial bands, progress indicators, and accent emphasis.

## Icons and assets

| Area | Actual implementation |
|---|---|
| Navigation | CSS border chevrons, directional text glyphs, close ×. Index and chapter destination arrows are decorative inside named controls. |
| Feedback | `FeedbackIcon` uses inline 20×20 SVGs, 24×24 viewBox, 1.8 stroke, rounded caps and joins, currentColor. |
| Security | Table uses 20×20 ink/accent SVGs, 24×24 viewBox, 1.65 stroke. Footer shield uses 28×28, 1.5 stroke. Recovery guidance also has a separate local `SecurityIcon`. |
| Hero and identity | Approved raster logo PNGs, hero WebP render atlas and settled WebP. Atlas source switches by viewport and pixel density. The older approved hero PNG and two WebPs remain in assets. |
| Journey and chapter art | The opening-book WebP is reused for the journey. Network and wallet journey WebPs and 13 named chapter WebPs live under public. `ChapterArt` sets intrinsic dimensions and eager/lazy priority. |
| Three.js | Homepage scene, Chapter II medallion, peer network on I and III. Meshes use warm metal, paper and leather, warm multi-source lighting and soft grounding shadows. See [motion](motion.md). |
| CSS illustrations | Chapter III custody scene uses layered WebPs and animated key position. Chapter IV uses an illustrated card and HTML masked marks. Chapter V practice phone uses CSS and glyphs. |

No third-party icon package is imported. The exported `Art` helper, historic `Timeline` and alternative `ScenePanel` branches exist in source. The active history is Chapter I’s `History`, and only the coin variant of `ScenePanel` is mounted by current routes. See [asset licenses](../../ASSET-LICENSES.md). Project artwork and identity are rights-reserved. Inter and Manrope use OFL 1.1. Bitkit assets are absent and reuse permission remains unverified. The source MIT license is inactive.
