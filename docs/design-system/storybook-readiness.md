# Storybook readiness

Storybook candidates are existing exports unless indicated. Use Node 24, project font imports, and the existing styles in production cascade order. Add theme wrapper classes to reproduce route-scoped CSS overrides. Pass `lang:pt|en` wherever required. Keep demo inputs synthetic. Add a preference and GPU test lane for scene stories.

| Candidate and source | Context and fixtures | First stories and isolation concerns |
|---|---|---|
| SignatureCTA · SignatureCTA.tsx | MemoryRouter, site styles, localized label and to. | Compact and desktop, focus, pointer states. App touch data handlers are wrapper behavior. |
| HeroVisual · HeroVisual.tsx | Public atlas/static assets, hero styles, browser worker and Three.js bundling. | Live, reduced motion, worker unavailable, WebGL failure. Stable screenshots use poster; live benefits from browser integration. |
| ChapterArt · ChapterArt.tsx | Public WebPs and optional alt/eager. | Peer network sizing, object variant, decorative vs informative. |
| Network · Network.tsx | Public peer art, chapter CSS, IntersectionObserver, ResizeObserver and WebGL. | Visible playback, out of view, static and reduced motion. Allow real viewport sizing. |
| ScenePanel · ScenePanel.tsx | Chapter wrapper, static coin art, Three.js and browser observers. | Coin ready/failure/reduced. Other kinds belong in a source-only note, unless later approved as new product stories. |
| Emphasis and Prose · editorial.tsx | Pass text/phrase or existing static copy fixtures. Chapter CSS context. | Inline emphasis on different surfaces, supported lists/table/headings. Exact content parser conventions matter. |
| TimelineArt · TimelineArt.tsx | Date/art fixture, lang, chapter and public assets. | Each actually used kind, readable sizing with matched caption. Active history selector is route local. |
| Calculator · interactions.tsx | lang and fee on II/V visual wrappers. | Default, alternate preset, invalid input, boundaries and localized formatting. Shared in-memory keys can leak across stories in a reused document. |
| Scenario · interactions.tsx | Three kinds and lang. | Unanswered / correct / incorrect with keyboard and actual live region. Module-key persistence makes independent remount context important. |
| FeedbackIcon · FeedbackIcon.tsx | Semantic foreground on a representative light surface. | Four kind values. Show with accessible adjacent text for feedback context. |
| Checklist · interactions.tsx | lang, content module and isolated session storage. | Empty, partial, complete, reload. Avoid preexisting user data. |

The header, shared chapter index helper, footer, destination rows and chapter shell are part of App. Prefer route-level examples until extraction is approved. History, Benefits, CustodyDemo, Guidance, StepList, WalletVisual, TransferGuide and the habits table are local. Route examples may exercise them through wrappers. Whole-chapter stories require chapter container, route labels/assets, and state isolation. No changes to source boundaries or dependencies are included.
