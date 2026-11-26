# Motion

| Pattern | Implementation |
|---|---|
| Shared CSS | 100/150/200/280/400 ms custom durations and `cubic-bezier(0.22,1,0.36,1)`; some components use local hardcoded values and ease curves. |
| Header and index | Panel fades, translates from −6px and scales from .985 over 220ms. Visibility flips after the closing transition. Fine-pointer row arrows translate 2px over 150ms. |
| Editorial reveal | One-shot IntersectionObserver marks `data-entered`. Journey/footer use 400ms with 80/160ms offsets. Image hover lifts 3px on fine pointers. Native disclosure conditionally animates height at 280ms with supported CSS. |
| Headline and CTA | 550ms line reveals with 150ms stagger and slight vertical/opacity entrance. CTA changes transform and inset with 200ms easing, with pressed feedback on touch, focus outline and immediate link activation. |
| Chapters | Heading entrance is 450ms generally and 400ms in V. Route direction uses 280ms page turn. Destination affordances use 240ms, with fine-pointer and touch treatments. Benefits/history details use local entrance timing. |
| Educational details | Quiz feedback enters over 150ms; CSS key movement in custody uses 600ms. Backup card settle 760ms and creation marks 620ms. Summary object motion and Chapter II number changes are local. Security row entrance uses 300ms plus a row stagger. |

## Hero playback and artwork

`HeroVisual.tsx` decodes the 8×5 atlas, then plays it with Web Animations API step timing over 2150ms, approximately 53.75ms per frame. `index.html` primes the matching image. `hero-boot.ts` and `hero-player.ts` warm the runtime and prefer the worker with OffscreenCanvas where supported. `hero-runtime.ts` schedules frame and visibility work. When the atlas leads, live frames must be synchronized and within a frame interval before the layer swaps. The animated atlas can continue when live WebGL fails. Settled artwork is the fallback for reduced motion or loss of both paths. The CSS headline is independent of renderer readiness.

`hero-scene.ts` renders the layered paper and articulated cover, bronze/gold medallion, broad contact shadow and warm light rig. Opening uses smooth normalized `time / 2.15`; coin emergence is smooth normalized `(time - .50) / 1.27` and ambient movement ramps with `(time - 2.30) / .6`. It uses ACES filmic tone mapping at 1.28 exposure, a room-derived environment at .78 intensity, two warm directional lights at 2 and .77, and a warm hemisphere at .72. Material values and contact-shadow gradient are indexed by source in tokens.json. The hero uses ResizeObserver and page visibility. It stops drawing while the tab is hidden and on unmount. Scrolling the hero offscreen is not an independent playback gate. DPR is capped at 1.5 with a coarse pointer or 2 otherwise. After 2.30s, touch ambient drawing is throttled to about 30 fps.

## Other scenes

`scene.ts` creates an alpha WebGL renderer with antialiasing, sRGB output, ACES filmic tone mapping and exposure 1.28. Warm hemisphere and two directionals run with a contact-shadow plane. Coin and network scene entry waits for intersection. Medallion lift is a 2.8s one-shot cycle. Peer network particles continuously traverse link paths with phase offsets and instancing. Scene scheduling observes size and view, pauses hidden pages, and spaces animating frames by at least 32ms. DPR caps are 1.25 for coarse-pointer peer scenes and 1.6 otherwise.

Reduced-motion CSS disables or bypasses the entrance and transition rules where specified. The hero uses the settled artwork, the peer network stays on its static illustration, and the coin avoids WebGL mounting on an initial reduced-motion preference. Chapter III illustration movement is preference-gated independently. See [limitations](known-limitations.md) for the measured initialization cost.
