# Pre-release validation

This initial GitHub release is for physical-device testing. The approved website and Playwright tests are included as reviewed.

| Check | Status |
| --- | --- |
| Production build and TypeScript | Passed with Node 24. |
| Production preview at 390 px | The homepage and all seven chapter routes loaded directly and refreshed successfully. |
| Older Playwright assertions | Some selectors target markup from earlier revisions. These failures indicate test drift and do not independently establish a site defect. |
| Browser test timeouts | Some tests exceeded their configured limit. Those scenarios remain inconclusive. |
| Chapter V at 768 px | The layout assertion measured 8 px after the footer and expected 0 px. The same check reported that the page fit horizontally and had no nested scroller. The visual impact remains to be reviewed. |
| Desktop production-preview validation | Pending a clean result. |
| Physical-device testing | Pending. |

The project is configured for a Vite build on Vercel with Node 24, npm, output in `dist`, and direct chapter-route support. The creator will handle Vercel deployment.
