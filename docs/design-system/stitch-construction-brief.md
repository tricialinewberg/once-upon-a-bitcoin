# Stitch construction brief

Reconstruct Once Upon a Bitcoin from approved production baseline [b7d9835](https://github.com/tricialinewberg/once-upon-a-bitcoin/commit/b7d9835372ec7275dcd2b3b4273ff65b8476650f). Designer Trícia Linewberg. The target is an editable Figma foundation assembled in modules from the production implementation. Production appearance and behavior decide conflicts.

## Import and generation workflow

1. Start a Stitch project for this reconstruction. Bring in [DESIGN.md](DESIGN.md) as design context using the DESIGN.md import available in your Stitch workspace. Keep the specification intact.
2. Provide the [construction modules](stitch-briefs/README.md) one at a time. Attach only that module’s PNGs from the [reference pack](references/README.md). If the interface does not resolve repository references, attach the relevant source Markdown or paste the specified excerpts with the prompt. A GitHub link alone may not supply its contents to the generation context.
3. Compare generated assets at 390 and 1440 CSS-pixel reference widths before proceeding. Correct role contrast, font metrics, spacing, wrapping and alignment drift. Use the site, computed samples and source values when zoom or screenshot crop changes the apparent dimensions. Keep a reviewed checkpoint for each module.
4. Use the Figma transfer/export action available in your workspace. If it is unavailable, use the approved reference frames and measurements to reconstruct editable components in Figma. Confirm editing and fidelity after transfer. Treat exported code or a composite screenshot as reference evidence.
5. In Figma, complete native variables, styles, accessible state documentation and reusable sets only after the export has been inspected. Assemble screen examples from verified components after the foundations and activities are approved.

## Reconstruction requirements

- Preserve live typography, copy hierarchy, approved brand, colors, art and presentation. Keep text editable with loaded Manrope Variable and Inter Variable. Use actual subsetting and fallback semantics as documented. Do not rasterize words or trace letters from screenshots.
- Separate component frames into meaningful names such as `Chapter Index / Row`, `Numeral`, `Label Stack`, `Title`, `Description`, and `Arrow`. Keep the component container, divider, icon, states and relevant context distinguishable. Remove unnamed wrappers only after checking layout.
- Use nested Auto Layout. Root frame and section width fill the parent with contextual max measures. Text blocks fill available width and hug natural height. Set short labels and icon groups to Hug Contents where sensible. Keep documented fixed dimensions for icons, progress rail, line strokes and reserved image proportions. Use minimum sizes where code specifies a minimum. Avoid stretching a constrained button or illustration simply to fill a frame.
- Index rows use fixed numeral and arrow columns, a filling title/description stack, contextual insets and top rules. Header uses fixed logo artwork width per reference, then a content-fitting right group. Mobile menus keep their existing utility placement and scroll bounds. Navigation footer is content-driven. Preserve native table structure in handoff annotations even when the mobile design is shown as stacked rows.
- Derive reusable candidates from [the component inventory](component-inventory.md). Use variants only for implemented states. Use separate layouts for actual responsive transforms and separate contexts for light, Chapter II, history and footer. Preserve empty, invalid, selected, and complete states only where they exist. Annotate mode/locale input and real data bounds.
- Keep the approved project images as separate media layers. Use screenshots as locked references outside the editable output. Keep book/coin and network assets as approved stills with documented motion behavior. A static transfer into Figma represents a selected state, with runtime motion specified separately.

## Verify or complete in Figma

| Verify | If incomplete after transfer |
|---|---|
| Text, vectors, media and background layers are independently editable | Rebuild flattened controls and keep approved artwork separate. Confirm exact rendered type, line breaks and bilingual labels. |
| Auto Layout nesting, gap, padding, alignment and sizing follow both reference widths | Reassign Hug/Fill/Fixed and min/max settings. Test intermediate frames and both locales. |
| Variables, aliases and contextual scoping are native | Create or bind native variables using [tokens.json](tokens.json) and [figma-mapping.md](figma-mapping.md). Keep separate roles when hex values match. Keep site-specific dark contexts distinct. |
| Component sets, properties, instances, text and effect styles actually exist | Build and bind them manually where justified. Check focus, selected, hover, pressed, disabled and feedback against the implementation. |
| Developer-facing specs are complete | Add semantics, data rules, breakpoints, timing and preferences using [handoff mapping](handoff-mapping.md), [motion](motion.md), and [accessibility](accessibility.md). |

For the Chapter I history selector, use the live capture and the active code. The prior inventory describes five milestones and endpoint arrows. The current implementation directly selects nine years from `src/chapter-history.ts` in `src/ChapterOne.tsx`, with a five-column mobile grid and no endpoint buttons.

Native Figma setup and artifact creation are future work. See [open validation and runtime limitations](known-limitations.md). Review [Google’s DESIGN.md announcement](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/) and [official schema](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md).
