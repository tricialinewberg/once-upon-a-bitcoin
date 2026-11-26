# Developer handoff mapping

| Handoff | Implementation references | Acceptance for future work |
|---|---|---|
| Foundations | style.css, editorial-layout.css, chapter.css, tokens.json | Preserve approved brand and contextual semantic roles. Verify exact live styles at compact/large widths and both languages. Compare against visual-source classes before introducing normalized values. |
| Routing and focus | main.tsx, vercel.json | Direct and refreshed root plus seven chapter routes work. Any chapter is accessible from any route. Scroll/focus reset, history restoration, hash links and language continuity continue to function. |
| Header and navigation | Main app and CSS chapter/index selectors | No obstruction at sticky position. Keyboard opens and closes disclosure and reaches all rows; active chapter and selected language are exposed. Touch targets and menu overflow work on compact viewports. |
| Educational behavior | interactions.tsx, activity-state.ts, ChapterOne.tsx, CustodyChapters.tsx, ChapterFive.tsx, FinalChapters.tsx | Toggling chapters does not erase document-scoped activity state. Preserve valid/invalid amount behavior, real boundaries, choice feedback, and practice progress. Checklist state is tab-session scoped and distinct from reading progress. |
| Layout and art | ChapterArt, HeroVisual, TimelineArt, WebPs, brand PNGs, chapter CSS | Keep responsive cropping, image dimensions, contrast and route-specific layout. Static assets and live imagery preserve the same visual concept. No unauthorized third-party asset reuse. |
| Accessibility | accessibility.md, native semantics in App and activity code | Test keyboard, focus-visible, both language names/pressed states, live feedback, table association and responsive reflow. Repeat targeted contrast and label checks. Manual assistive testing remains required. |
| Motion | motion.md, hero-* files, scene.ts, Network.tsx and ScenePanel.tsx | Preserve responsive CTA access and educational timing. Check normal motion, reduced motion, offscreen and hidden states, WebGL loss and background tab. Record initial paint and first draw separately. |
| Educational safety | content.ts and interactive implementations | Only masked, fictional or illustrative data. No secrets, payment addresses copied from live accounts, wallet connections or real transfers. Fees remain hypothetical; retain official outbound links. |
| Build and evidence | package scripts, browser tests, vercel.json | Build with Node 24. Choose a dedicated ignored test output directory for transient runs. Preserve audit snapshots independently. Need a physical-device performance baseline before treating lab scores as typical. |

Use semantic structures, selectors and exact data requirements in the [component inventory](component-inventory.md), plus [known limitations](known-limitations.md). A future Figma/Storybook artifact can label each entry with the baseline SHA and implementation class.
