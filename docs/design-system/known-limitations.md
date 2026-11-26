# Known limitations and open verification

| Finding | Evidence and scope |
|---|---|
| Chapter II lab main-thread blocking | QA 20 observed 11.785s TBT. Correction 21 repeats were 5.719s, 8.705s and 9.613s with median 8.705s; deployed spot check 11.983s. Scene bundle repeatedly included the longest task. A software WebGL diagnostic measured about 465ms context setup, with a 2.718s task before first shader calls. The expensive function remains unattributed. |
| Real-device performance and INP | Existing creator device approval is visual. Physical-device trace measurements and field INP remain unverified. Simulated mobile runs carry host/GPU/throttling effects. |
| Accessibility | Targeted matched-label and contrast checks passed. Manual screen reader, speech activation and zoom/reflow are pending. QA 20 reported broader heading-order findings. No WCAG conformance claim follows from this audit. |
| Playwright drift | Older activity test uses `.timeline-detail`; current history lives in ChapterOne `.history-event`. Prior timeouts are inconclusive. The pre-release Chapter V assertion is historical and the later QA 20 run did not reproduce the gap. |
| Metadata | Vercel serves a shared HTML shell. Titles, canonical and Open Graph route details update client-side. Robots and sitemap are server-delivered. Social crawlers may use the generic shell. |
| CSS specificity and taxonomy | Cascade layers plus unlayered chapter overrides create context-specific values. Some variables have identical hexes in separate roles, local radii and per-feature breakpoints. Authored inventory includes source-only values; computed inventory is the runtime reference. |
| Component boundaries | App-local navigation, route-local education widgets and historic dormant variants limit direct isolation. HTML disclosure and pressed styles recur across separately implemented components. |
| Manual specs and evidence | No production design tokens for a unified spacing scale, generic warning state, global elevation levels or canonical responsive text tokens. Earlier ignored QA 20 raw files were cleared by Playwright; recreated Correction 21 baseline evidence came from the original commit. This audit uses fresh production viewport samples and keeps permanent specifications in this directory. |
| Asset rights | Project artwork remains rights-reserved. Bitkit screenshot reuse remains unverified. Source MIT license remains inactive. |
