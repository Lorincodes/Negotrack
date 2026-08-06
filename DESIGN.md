---
name: NegoTrack
description: Understand. Improve. Grow.
colors:
  background: "#ffffff"
  surface: "#f7f8fc"
  surface-strong: "#eef8f5"
  surface-hero: "#f6f8fb"
  heading: "#111b3a"
  body: "#536077"
  muted: "#78849a"
  meta: "#59667c"
  dark: "#061525"
  green: "#13c98a"
  green-strong: "#0ba675"
  mint: "#61e6c1"
  teal: "#20bfc8"
  blue: "#4a78ff"
  purple: "#8a5cff"
  amber: "#e39a24"
  border: "#e7eaf0"
  border-strong: "#dbe1ea"
  border-hover: "#c6cedb"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(3rem, 11cqw, 4.6rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.046em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(2.15rem, 4vw, 3.35rem)"
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: "-0.044em"
  title:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    letterSpacing: "-0.028em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  control:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.91rem"
    fontWeight: 600
  label:
    fontFamily: "Sometype Mono, ui-monospace, monospace"
    fontSize: "0.69rem"
    fontWeight: 500
    letterSpacing: "0.02em"
rounded:
  compact: "8px"
  field: "9px"
  control: "10px"
  panel: "16px"
  billboard: "24px"
  pill: "999px"
  circle: "50%"
spacing:
  section-wide: "88px"
  section-medium: "80px"
  section-tablet: "64px"
  section-mobile: "46px"
  gutter-desktop: "32px"
  gutter-tablet: "24px"
  gutter-mobile: "20px"
  gutter-compact: "16px"
components:
  button-primary:
    backgroundColor: "{colors.mint}"
    textColor: "#04271c"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#72eac8"
    textColor: "#04271c"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.heading}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-dark:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.background}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.heading}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
    height: "44px"
  badge-demo:
    textColor: "#087b60"
    typography: "{typography.label}"
  navigation:
    backgroundColor: "rgba(255, 255, 255, 0.94)"
    textColor: "{colors.heading}"
    height: "76px"
  tab-default:
    backgroundColor: "transparent"
    textColor: "{colors.body}"
    rounded: "{rounded.compact}"
    padding: "0 16px"
    height: "38px"
  tab-selected:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.background}"
    rounded: "{rounded.compact}"
    padding: "0 16px"
    height: "38px"
  card-feature:
    backgroundColor: "{colors.background}"
    textColor: "{colors.body}"
    rounded: "{rounded.panel}"
    padding: "21px"
  card-product:
    backgroundColor: "{colors.background}"
    textColor: "{colors.body}"
    rounded: "{rounded.panel}"
---

# Design System: NegoTrack

## Overview

**Creative North Star: "The Daylight Growth Console"**

NegoTrack should feel like a clear working session in daylight: spacious, calm, and immediately useful. Midnight navy gives every decision weight, while mint and teal make improvement visible as an operative signal rather than decoration. Blue, purple, and amber add just enough analytic distinction to make complex business health legible at a glance.

The system is product-led and evidence-forward. Coded consoles, health scores, charts, priorities, and clearly labelled demonstration states carry the story inside soft white canvases with hairline structure. It deliberately rejects the generic centred SaaS hero and decorative AI branding; decisive copy and honest product evidence share the frame instead.

**Key Characteristics:**

- Daylight white space with midnight-navy authority.
- Mint and teal actions supported by blue, purple, and amber analytic signals.
- Manrope for orientation; Inter for reading and controls; Sometype Mono for interface labels.
- Hairline borders, gently rounded canvases, and soft navy-tinted lift.
- Responsive coded-product previews that remain honest about demonstration data.

## Colors

The palette is a restrained daylight neutral system with one operative green family and a small set of analytic accents.

### Primary

- **Action Mint** (`mint`): high-attention calls to action, active progress, and the brightest improvement signal.
- **Growth Green** (`green`): charts, progress fills, active indicators, and positive movement.
- **Strong Growth Green** (`green-strong`): status copy, icons, active navigation, and accessible green text on pale surfaces.
- **Signal Teal** (`teal`): supporting progress transitions and multi-step analytic gradients.

### Secondary

- **Analytic Blue** (`blue`): performance series, comparison markers, and secondary product signals.
- **Comparative Violet** (`purple`): benchmark series, differentiated metrics, and the final stage of multi-signal narratives.

### Tertiary

- **Caution Amber** (`amber`): pending, review, and caution states; never a primary action color.

### Neutral

- **Daylight White** (`background`): page ground, controls, and primary card surfaces.
- **Cool Canvas** (`surface`): section alternation and quiet inset content.
- **Mint Wash** (`surface-strong`): positive tonal grouping without a border-heavy treatment.
- **Hero Ground** (`surface-hero`): the soft off-white the first viewport sits on, resolving to `background` before the next section so the ambient layers never end on a hard edge. Used once, on the hero only.
- **Midnight Heading** (`heading`): display text, titles, scores, and high-value labels.
- **Slate Body** (`body`): default paragraph and explanatory copy.
- **Muted Slate** (`muted`): supporting metadata and low-emphasis labels at 0.68rem and above.
- **Metadata Slate** (`meta`): the accessible step below Muted Slate. Dense product metadata — recency lines, stage detail, report timestamps — renders below 0.62rem, where `muted` only reaches 3.6:1 on white. `meta` holds 5.8:1 and is the required colour for any metadata set at or under 0.62rem.
- **Deep Midnight** (`dark`): high-contrast product demonstrations, selected controls, and dark actions.
- **Hairline Grey** (`border`): default dividers and card structure.
- **Strong Hairline** (`border-strong`): controls and boundaries that need more definition.
- **Hover Hairline** (`border-hover`): the one step darker than Strong Hairline, used only to acknowledge a pointer on a field or control that already sits on `border-strong` at rest.

**The Operative Mint Rule.** Mint and teal signal action or improvement; blue and purple distinguish analytic series, and amber communicates caution or pending work.

**The Daylight Default Rule.** White and near-white own the page. Deep midnight is reserved for high-contrast demonstrations and selected states, not used as the universal backdrop.

## Typography

**Display Font:** Manrope (with sans-serif fallback)  
**Label Font:** Sometype Mono (with ui-monospace fallback)  
**Body Font:** Inter (with sans-serif fallback)

**Character:** Manrope is open and quietly geometric, and at 700 with tight negative tracking it reads refined rather than bulky. Inter keeps dense business information plain and readable. Sometype Mono gives timestamps and product-preview captions the cadence of real interface chrome. Three families, no more: the trio communicates modern product confidence without drifting into a futuristic AI aesthetic.

### Hierarchy

- **Display** (`typography.display`): hero positioning and the strongest single promise; keep it short and balanced.
- **Headline** (`typography.headline`): section-level orientation and major explanatory transitions.
- **Title** (`typography.title`): cards, forms, modal-scale panels, and product-preview headings.
- **Body** (`typography.body`): explanatory copy; long marketing paragraphs stay within the implemented 580–640px measure.
- **Label** (`typography.label`): demonstration badges, product status, and compact metadata; uppercase is reserved for short signals.

**The Three-Voice Rule.** Manrope carries orientation and emphasis — 700 for hero and section headings, 600 for card-scale headings. Inter carries reading at 400 and navigation, buttons and form controls at 500–600. Sometype Mono 500 is reserved for small interface labels, timestamps and product-preview captions, and never sets a heading or a paragraph.

**Headline measure.** The hero headline is sized in container-query units against its own column, not the viewport: once the hero container stops growing, viewport units keep scaling the type and push the headline onto more lines rather than fewer.

## Layout

The primary container caps at 1240px. Desktop gutters are 32px per side, reducing to 24px at 1120px, 20px at 680px, and 16px at 430px. The default section rhythm is 88px per edge, then 80px at 1120px, 64px at 900px, and 46px at 680px.

The first viewport uses a weighted split grid: decisive copy at 5.4 parts and a coded product console at 6.6 parts, with a 48px gap and a 600px minimum visual column. At 900px the hero, scan, product-story, and comparison layouts become single-column. Dense four- and seven-column product grids progressively collapse; on small screens, feature cards may become horizontal snap-scrolling while controls reflow into full-width rows.

Use 1120px, 900px, 680px, and 430px as the established responsive thresholds. Preserve a usable composition from 375px upward, and reduce information density inside simulated dashboards before shrinking text below legible sizes.

## Elevation & Depth

Depth is a hybrid of hairline borders, tonal layering, and restrained ambient shadows. Most cards remain structurally flat; flagship product canvases, floating controls, and selected states receive navy-tinted lift.

### Shadow Vocabulary

- **Ambient Small** (`0 8px 24px rgba(26, 39, 71, 0.06)`): light lift for trust rails, icon tiles, and quiet secondary controls.
- **Ambient Medium** (`0 22px 60px rgba(26, 39, 71, 0.1)`): larger comparison and content stages.
- **Product Hero** (`0 34px 90px rgba(40, 57, 91, 0.14)`): flagship coded product frames only.
- **Primary Action Rest** (`0 9px 24px rgba(19, 201, 138, 0.2)`): mint action at rest.
- **Primary Action Hover** (`0 13px 30px rgba(19, 201, 138, 0.28)`): mint action while hovered.
- **Dark Action** (`0 12px 28px rgba(6, 21, 37, 0.18)`): deep-midnight form actions.

**The Soft Canvas Rule.** Hairlines and tonal fills do the everyday structural work. Reserve strong shadows for product evidence, selected state, or a direct response to interaction.

## Shapes

The form language is gently technical rather than pill-heavy. Feature and product canvases use the panel radius; buttons and most interactive controls use the control radius; form fields use the slightly tighter field radius. The launch billboard uses the larger billboard radius, while pills are limited to compact metadata and circles to icons, scores, and signal dots.

Cards and coded frames use 1px hairlines and clip their internal chrome or preview artwork. Avoid mixing square and highly rounded corners within one component: inherit the outer radius, then step down to compact corners for nested controls.

## Components

### Buttons

- **Shape:** gently rounded controls (`rounded.control`) with a 48px minimum height, 20px inline padding, 10px icon gap, and 17px icons. The small variant uses a 40px minimum height and 16px inline padding.
- **Primary:** action-mint fill with deep green ink (`button-primary`); hover lifts 2px, brightens the mint (`button-primary-hover`), and strengthens its green ambient shadow.
- **Secondary:** daylight-white fill, strong hairline border, midnight text, and a small pale-mint circular icon holder (`button-secondary`).
- **Dark:** deep-midnight fill and white text (`button-dark`); used for decisive actions inside light forms.
- **Focus / Disabled:** the global focus indicator is a 3px translucent analytic-blue outline with a 3px offset. Disabled controls use 0.62 opacity and never translate.

### Chips

- **Demo Badge:** a transparent, uppercase label using `typography.label`, strong green text, a 6px green dot, and a 4px translucent green signal ring.
- **Metadata Pills:** fully rounded (`rounded.pill`) and used only for compact status or categorisation, never for standard buttons.

### Cards / Containers

- **Corner Style:** feature cards and product canvases use `rounded.panel`; the launch billboard uses `rounded.billboard`.
- **Background:** daylight white over cool or mint-washed section canvases.
- **Shadow Strategy:** cards default to a hairline border; use Ambient Small selectively and Product Hero only for flagship product frames.
- **Internal Padding:** feature-card copy uses 21px; workflow cards use 21px; larger story canvases use 34–54px according to content density.

### Inputs / Fields

- **Style:** 44px minimum height, 10px by 12px padding, strong hairline border, daylight-white fill, midnight text, and `rounded.field` corners.
- **Focus:** the field border shifts to `#73cdb5` with `0 0 0 3px rgba(19, 201, 138, 0.1)`.
- **Error / Disabled:** invalid fields use `#d26f65`; error copy uses `#ad3e35`. Keep the label and message associated in the same field stack.

### Navigation

- **Desktop:** a fixed 76px daylight-white bar with 94% opacity, a hairline divider, and 14px backdrop blur. It compacts to 64px after scroll; links use 0.84rem Inter at weight 650 and reveal a 2px growth-green underline on hover.
- **Mobile:** at 900px and below, replace the desktop links with a 44px menu control and a right-side drawer up to 420px wide. The drawer traps focus, closes with Escape, and preserves the language switch and primary action.

### Tabs / Selectors

- **Default:** transparent surface, slate text, compact corners, and a visible surrounding track (`tab-default`).
- **Selected:** deep-midnight fill, white text, and a small ambient shadow (`tab-selected`). Keep selection encoded with `aria-selected` or `aria-pressed`.

### Product Frame

The signature coded-product canvas uses `card-product`, a 1px cool hairline, Product Hero shadow, and a 34px pale browser chrome. Three 6px status dots, a centred address lozenge, and an explicit preview label make the demonstration legible as product evidence rather than an illustration.

## Motion

Motion explains product state. It is never decoration, and it never asks the visitor to wait.

**Easing tokens:** `--ease-out` `cubic-bezier(0.16, 1, 0.3, 1)` for arrivals, `--ease-exit` `cubic-bezier(0.4, 0, 1, 1)` for departures, `--ease-drift` `cubic-bezier(0.45, 0, 0.55, 1)` for ambient loops only.

**Durations:** 100–150ms immediate feedback, 150–300ms routine state change, 300–500ms layout or view transition, 500–800ms for the one authored entrance. Ambient loops run 16s or slower.

### The Resolve

The hero console carries the single authored sequence on the site, played once when it enters view and never repeated: four metrics settle, their values count up, micro-bars fill, the trend lines draw, and the top recommendation arrives last with one mint sweep. The recommendation arriving last *is* the product thesis — scattered signals resolve into one instruction. Nothing else on the page is allowed a sequence longer than 600ms.

Its two echoes are shorter, user-replayable, and choreographed differently: the scan demonstration (signals gathered, then a result) and the competitor overtake (movement, then a plain-English cause).

### Ambient depth

Continuous ambient motion exists in exactly three regions and nowhere else: the hero, the dark scan section, and the launch billboard. Each is bounded by hairline alphas, driven only by `transform` and `opacity`, and suspended by an `IntersectionObserver` (`.is-ambient`) whenever the region leaves the viewport or the tab is hidden.

- **Hero:** a drifting mint orb and a drifting teal orb, a static violet orb, a faint 44px plotted field confined to the right of the headline column, and two floating insight chips anchored to opposite outer corners of the console.
- **Scan section:** the existing radial glow breathing on opacity alone, and two travelling teal and blue signal strokes that mirror the product's own stage gradient.
- **Billboard:** one slow white light drift and a static grain overlay.

Purple never drifts as ambience — it is an analytic-series colour. Blue appears in ambient motion only where it mirrors a real product gradient. Rising particles, sweeping shine beams, and pulsing indicators are forbidden: they read as crypto or gaming chrome and encode nothing.

### Scroll-entry vocabulary

Five distinct grammars, mapped so no section reuses its neighbour's: fade-and-rise (`.reveal--soft`), small stagger (`.reveal--rail`), side reveal for split rows (`.reveal--left` / `.reveal--right`, alternating direction down the story rows), line and chart drawing (health, workflow), and panel crossfade (monitored areas, business types).

Every reveal keyframe starts at `opacity: 0.35` or higher, never `0`, and the element's un-animated CSS is always its final state. Copy is legible on the first painted frame whether or not scripting runs.

### Feedback

A 2px lift, a hairline stepping to a strong hairline, a 3px arrow nudge, and one non-looping sweep on the mint action. Every hover state also fires on `:focus-visible`. Nothing on this page bounces, wobbles, pulses, follows the cursor magnetically, or scales past 1.02. The only loops tied to an interactive surface are the scan progress sheen and the spinner, both of which indicate work genuinely in progress.

### Reduced motion

`prefers-reduced-motion: reduce` removes the grid field, signal strokes, billboard drift, and every sweep outright; freezes the orbs, chips and glow at a settled state; and shows every score, bar, chart and explanation at its finished value on the first paint. The pointer tilt is never attached, timed sequences resolve instantly, and the scan demonstration jumps straight to its result. CSS and `useReducedMotion()` must agree — CSS alone cannot stop a timer chain, an observer callback, or a pointer listener.

## Do's and Don'ts

### Do:

- **Do** use mint and teal for action and improvement, blue and purple for distinct analytic series, and amber for caution or pending work.
- **Do** lead with decisive copy and a coded product preview when a marketing surface must explain value quickly.
- **Do** label synthetic interfaces and demonstration data explicitly.
- **Do** preserve 48px primary controls, 44px fields, visible focus, and the established responsive reductions.
- **Do** use hairline structure first and reserve the strongest lift for flagship product evidence.

### Don't:

- **Don't** fall back to a generic centred SaaS hero when product evidence can share the first viewport.
- **Don't** add decorative AI motifs, generic glow fields, or futuristic chrome that does not communicate a product state.
- **Don't** redraw or invent the production logo; keep the text placeholder until the approved asset exists.
- **Don't** flood the page with deep-midnight surfaces or use every accent on every component.
- **Don't** present demonstration metrics as live, customer-derived, or operational evidence.
