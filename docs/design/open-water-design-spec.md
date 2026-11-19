# Open Water design spec

Nov 18, 2026 · @Nguyễn Trần Gia Huy

> Source: https://claude.ai/artifact/5hB5aAJAa9JipMTcAMfmGZ (live doc; this is a read-only copy).

## Overview

The portfolio is a dive: one dark page where each section sits a little deeper in the sea, from the bright surface (Hero) to the sea floor (Contact). Teal water light leads, with leaf green and driftwood as small accents.

Rules carried over from your preferences:

- **One mode only.** The site is dark. No light theme, no toggle.
- **Easy on the eyes.** Soft off-white text, never pure white; one bright accent (teal).
- **Square shapes.** No rounded corners anywhere: buttons, cards, chips, photo.
- **Clear sections.** Each section is its own band with a depth label, and the background darkens slightly from one to the next.
- **Texture only where it suits.** The Hero gets moving light and a dot grid, Projects gets faint ripple lines. About, Skills and Contact stay plain.
- **Empty sections look intentional.** Skills and Projects read from `src/data/site.ts`; when empty they show dashed "Coming soon" tiles.

## Color tokens

Seven base colors plus five depth backgrounds. Text contrast on the darkest band stays above 7:1 for body text.

| Token | Hex | Use |
| --- | --- | --- |
| `abyss` | #071C24 | Page background, navbar |
| `reef` | #0D2A33 | Tiles, cards, inputs |
| `foam` | #DCEBEA | Main text (soft, not pure white) |
| `mist` | #8FB3B6 | Secondary text, labels |
| `teal` | #3CC6C0 | The one accent: links, buttons, active nav, focus rings |
| `kelp` | #7FBF7A | Status ("Open to work"), second stop of the headline gradient |
| `driftwood` | #C98B55 | Depth markers, small highlights |
| `depth-0` | #0B2530 | Hero band |
| `depth-1` | #09212A | About band |
| `depth-2` | #081C24 | Skills band |
| `depth-3` | #06171E | Projects band |
| `depth-4` | #041118 | Contact band, footer |

Paste into `src/app/globals.css` (Tailwind 4):

```css
@import "tailwindcss";

@theme {
  --color-abyss: #071c24;
  --color-reef: #0d2a33;
  --color-foam: #dcebea;
  --color-mist: #8fb3b6;
  --color-teal: #3cc6c0;
  --color-kelp: #7fbf7a;
  --color-driftwood: #c98b55;
  --color-depth-0: #0b2530;
  --color-depth-1: #09212a;
  --color-depth-2: #081c24;
  --color-depth-3: #06171e;
  --color-depth-4: #041118;

  --font-display: var(--font-manrope), system-ui, sans-serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;

  /* square shapes only: removes every rounded-* utility */
  --radius-*: initial;
}

html { color-scheme: dark; }
body { @apply bg-abyss text-foam font-sans antialiased; }
```

This gives classes like `bg-reef`, `text-mist`, `border-teal/30` and `font-display`. Borders use `teal` or `mist` at 15 to 30% opacity, never a solid bright line.

## Typography

Manrope for headings, Inter for body text, JetBrains Mono for depth markers and small labels. All three load through `next/font/google`, so there is no layout shift and no external request at runtime.

| Role | Font | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| Hero headline | Manrope | `clamp(2.5rem, 6vw, 4.5rem)` | 800 | Line height 1.02, tracking -0.035em, max 14ch |
| Section title (h2) | Manrope | 2rem | 700 | Tracking -0.02em |
| Card title (h3) | Manrope | 1.125rem | 700 |  |
| Body | Inter | 1rem | 400 | Line height 1.65, max 65ch |
| Small text | Inter | 0.875rem | 400 | Color `mist` |
| Depth marker, labels | JetBrains Mono | 0.75rem | 500 | Uppercase, tracking 0.08em, color `driftwood` |

In `src/app/layout.tsx`:

```tsx
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";

const manrope = Manrope({ subsets: ["latin", "vietnamese"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-jetbrains" });

// <html lang="en" className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`}>
```

The `vietnamese` subset keeps the diacritics in your name rendering in the same font.

## Shape, texture and spacing

Everything is square, and texture appears in only two sections.

**Shape**

- Corners: 0 everywhere. The `--radius-*: initial` line in the theme enforces it.
- Tiles and cards: `bg-reef/80`, 1px border `border-teal/20`, `backdrop-blur-sm`. Hover: border `teal/50` and a 2px lift.
- Primary button: `bg-teal text-abyss`, 1.5px solid border, padding `px-4 py-2.5`. Secondary: transparent with `border-teal/50 text-teal`.
- Chips (skills, tech tags): mono 0.75rem, `border-mist/30`, padding `px-2 py-0.5`.
- Empty-state tiles: dashed border `border-mist/30`, text "Coming soon" in `mist`.

**Texture** (only these two)

| Section | Texture | CSS |
| --- | --- | --- |
| Hero | Teal dot grid + slow moving light | `radial-gradient(rgb(60 198 192 / .18) 1px, transparent 1.3px)` at 16px, plus 2 to 3 soft teal radial glows on a drifting layer |
| Projects | Faint horizontal ripple lines | `repeating-linear-gradient(0deg, rgb(60 198 192 / .06) 0 1px, transparent 1px 8px)` |

About, Skills and Contact are flat color. Keep texture opacity at these values or lower so text stays easy to read.

**Spacing**

- Content width: `max-w-5xl` (64rem), side padding `px-4 sm:px-6`.
- Section padding: `py-24` on desktop, `py-16` on phones.
- Grid gaps: `gap-4` for tiles, `gap-6` between columns.
- Each section starts with a depth marker line, then the h2, then content, spaced `gap-3` then `gap-8`.

## Sections

Five bands, top to bottom, each a little deeper. The depth marker is a small mono label above each section title.

| Section | Depth marker | Band | Layout | Empty state |
| --- | --- | --- | --- | --- |
| Navbar |  | `abyss/80` + blur, sticky | Logo "GH" left; links About, Skills, Projects, Contact right; active link in `teal` with a 2px square underline |  |
| Hero | 0 m · surface | `depth-0` + dot grid + light | Depth marker, headline with "what I build." in a teal-to-kelp gradient, one-line intro, buttons "Start the dive" (to Projects) and "GitHub" |  |
| About | −10 m | `depth-1`, plain | Two columns: square photo (1:1, border `teal/20`) left; bio and fact chips (location, role, open to work in `kelp`) right | Photo slot shows initials "GH" |
| Skills | −40 m | `depth-2`, plain | One square tile per group (Languages, Frameworks, Tools), 3 columns on desktop, chips inside | 3 dashed tiles, "Coming soon" |
| Projects | −120 m | `depth-3` + ripple lines | Cards with a 16:9 screenshot, title, one-line description, tech chips, Repo and Live links; first card spans 2 columns on desktop | 3 dashed cards, "Coming soon" |
| Contact | −200 m · sea floor | `depth-4`, plain | Large email in Manrope, "Copy email" button, GitHub and LinkedIn links, "Back to surface ↑" link |  |
| Footer |  | `depth-4` | One mono line: © 2026 Nguyễn Trần Gia Huy · Built with Next.js |  |

On phones every grid collapses to one column, the About photo shrinks to 120px above the text, and the navbar links move into a square menu button.

One fixed element sits outside the bands: a **depth meter** in the bottom-right corner (mono, `driftwood`) that shows the depth of the section on screen. Hide it below 640px wide.

## Motion and interactions

Motion is slow and quiet, and all of it turns off when the visitor's system asks for reduced motion.

| What | Behavior | Timing |
| --- | --- | --- |
| Hero light | Glow layer drifts and rotates slightly, back and forth | 14s, ease-in-out, infinite alternate |
| Section reveal | Content fades in and rises 12px the first time it enters the screen; visible by default if JS is off | 400ms, ease-out, once |
| Tile and card hover | Border to `teal/50`, lift 2px | 200ms |
| Depth meter | Updates to the section in view (IntersectionObserver) | Instant |
| Navbar | Active link follows the section in view; smooth scroll on click | Native smooth scroll |
| Copy email | Button text changes to "Copied" for 2s; falls back to selecting the text if the clipboard is blocked | 2s |
| Focus | Every link and button shows a 2px `teal` outline with 2px offset |  |

Reduced motion: wrap the drift, reveal and hover lift in `motion-safe:` classes (or a `@media (prefers-reduced-motion: reduce)` block) so the page is fully static for those visitors.

## The diving fish

The page plays like an ocean game: a pixel fish swims down beside the content as the visitor scrolls, and a depth gauge tracks the dive. Working prototype: [Open Water Dive](https://claude.ai/artifact/WVG61MRXKjNLrFfewWWJ7R) (local copy: `open-water-dive.html` in this folder).

| Part | Behavior |
| --- | --- |
| Fish | 12 × 7 pixel sprite drawn on a 72 × 42 canvas (`image-rendering: pixelated`), teal body, kelp tail. Fixed at 42% of screen height in a 170px lane left of the content. |
| Swimming | Bobs gently and drifts side to side. Tilts head-down when scrolling down and head-up when scrolling up, up to 32°, smoothed. Tail flaps faster while moving. |
| Bubbles | Small square outlines rise from the fish's mouth and fade; more often while moving. Background fish swim slowly behind the content at low opacity: small teal schools near the surface, yellow fish in the middle, and glowing lantern fish in the deep. |
| Depth gauge | Fixed top-right panel: live depth in metres plus five square stops (Surface, About, Skills, Projects, Contact). The current stop fills teal; each stop is a link. |
| Controls | Scroll, click a stop, or press J / K to jump between stops. Swim freely with W A S D: W and S rise and dive (scroll the page), A and D swim left and right across the screen, and the fish turns to face where it swims. |
| Surface and floor | Above the Hero is a 150px sky strip with a pixel moon and a bearded fisherman in a small wooden boat, gently bobbing on the surface. His fishing line drops into the water, and a speech bubble says "Hi! Grab a fish and dive." A moving wave line marks the surface, and the Hero has soft light rays. Contact ends on a pixel sand strip with swaying kelp. |
| Phones | Fish moves to the bottom-right corner, the gauge shows depth only. |
| Reduced motion | Fish stays still and level, no bubbles, no wave or kelp sway. |

In Next.js, build the fish, bubbles and gauge as one client component (`"use client"`) with a single `requestAnimationFrame` loop; the sections stay server-rendered.

## Build checklist

Hand this list to your local Claude session along with the plan. Each item maps to a section above.

- [ ] Paste the `@theme` block into `globals.css` and set up the three fonts in `layout.tsx`
- [ ] Build the sticky navbar and the depth meter
- [ ] Build the Hero band with the dot grid and drifting light layer
- [ ] Build About with the square photo slot and fact chips
- [ ] Build Skills and Projects from `src/data/site.ts`, including the dashed "Coming soon" empty states
- [ ] Add the ripple-line texture to the Projects band
- [ ] Build Contact with copy-email and "Back to surface", plus the footer
- [ ] Add section reveal, hover and focus styles, and check that reduced motion turns them all off
- [ ] Check at 375px and 1280px widths: no horizontal scroll, every grid collapses to one column on phones
- [ ] Run `npm run build` and confirm every section renders

Reference mockup: [Portfolio Design Directions](https://claude.ai/artifact/HYnMFbCdVAQRcanC1z8Fc9), board "Open water".
