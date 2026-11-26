# Accessibility

Correction 21 verified zero targeted axe violations for text contrast and label-in-name across all eight routes in both locales. This is scoped evidence for those checks in browser emulation. Foreground ratios use browser-computed colors on the actual surfaces.

| Token | Foreground | Background | Before | After |
|---|---|---|---:|---:|
| Large light accent | #C66A00 | #F8F5EF | 2.111 | 3.533 |
| Large light accent | #C66A00 | #FFF1DF | 2.067 | 3.460 |
| Large light accent | #C66A00 | #F2ECE2 | 1.955 | 3.272 |
| Small accent | #A84E08 | #F8F5EF | 2.111 | 5.135 |
| Dark accent | #F7931A | #25211E | 6.953 | 6.953 |
| Dark accent | #F7931A | #202020 | 7.094 | 7.094 |

Large is at least 3:1 and normal text at least 4.5:1. The scoped color adjustment keeps the emphasis words and base font measurements. Mobile measured heading text ranged from 26.4 to 39.585px for the corrected large usage, and the conclusion measured 21.6px at weight 650. [W3C contrast criteria](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)

- Header language buttons use visible PT/EN, names PT — Português and EN — English, matching language attributes, and mutually exclusive pressed states. Footer buttons expose the visible full language names. The document updates between pt-BR and en. [W3C label-in-name criteria](https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html)
- Skip link, landmarks, localized labels, focus-visible outline 3px with 4px offset by default, sticky-header scroll offset, and programmatically focusable route headings and hash targets are implemented. Chapter menu uses a disclosure button, aria-expanded, controlled inert content, Escape and outside-pointer dismissal. It uses link semantics and aria-current; it does not require a composite keyboard navigation model.
- Radio groups use fieldset/legend and labeled native controls. Feedback provides text, a decorative icon and color, with atomic status output. Calculator validation uses aria-invalid/error association; results are polite. Checklist, reading, and practice progress use native progress with labels.
- Chapter VI retains explicit table roles, scope, IDs and headers references after mobile row restacking. Mobile repetition is hidden from assistive technology. Other editorial tables use their own markup. Native details/summary handle FAQ and other disclosures.
- Illustration alternative text is context supplied. Decorative children use empty alt or aria-hidden. The hero container exposes one image label independent of canvas availability. Browser preference governs reduced-motion behavior.

Manual checks pending include screen-reader announcement ordering, voice activation, zoom and reflow, and heading order flagged in the broader QA 20 audit. This evidence covers selected behaviors and does not establish WCAG conformance.
