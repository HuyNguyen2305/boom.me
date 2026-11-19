# Memory

Durable facts a new session must know. Keep short; delete what stops being true.

## Decisions
- Frontend only, TypeScript strict, pnpm. Stack: Vite + React.

## Conventions
- Content lives in `src/data`; sections compose components.
- Code checks use the ponytail skills (see CLAUDE.md).

## Gotchas
- `graphify` is not on PATH; run `python -m graphify ...`.
- Installed skills are gitignored; reinstall if missing.
- typescript pinned to 5.x: TS 7 breaks next.config.ts loading. next/font options must be literals (no shared subsets const).
- Design rule (from the user): always use Emil (emil-design-eng), taste (design-taste-frontend), impeccable, stageshow and ui-ux-pro-max for every design task, and look at the result in Chrome.
- Sprites are drawn through `entities/pixels.ts` (pre-rendered bitmap, nearest-neighbour). Never one fillRect per cell: it leaves hairline gaps at fractional device scales.
- The Chrome tool screenshots are scaled (about 0.79); real viewport is ~1920 css px wide.
- The Open Water spec doc is the agreed design. Do not invent big new scene elements (shore, billboard, palms, buoy, bright sky) without asking: the user called that direction "super weird".
- impeccable gradient-text on the hero headline is sanctioned by the spec; the hook can only suppress it per file, which needs the user's approval.
- Pixel size rule (from the user): sprites use 3-4px pixels, never 5-6px. The fish keeps the spec size (72x42) on a finer 24x14 grid at 3px.
- Sea life is world-space per layer (each section band has its own creatures that swim side to side and fade); never tie creatures to the main fish or to scroll-depth fades.
- Controls hint is drawn on the canvas above the fish; DOM keeps an sr-only list. Do not add a bottom-centre E hint.
- next.config devIndicators is false: the user does not want the Next.js dev badge.
- Corals: medium size (12-20 cells at 3px), varied shapes; no mesh fans. The wreck lives on the right of the sea floor (entities/seafloor.ts).
- Pixel-size trial: main fish, shark and whale are drawn at 2px (grids 36x21, 76x40, 105x52); everything else stays 3px. User asked for more detail via smaller pixels; compare before converting the rest.
- Whale and shark art follows the user's pixel references: chunky dark outline, flat shading, pale belly, whale tail curves up into flukes, shark has a fat crescent tail. Preview sprites offline by transpiling school.ts and rendering with PIL (no dev server needed).
- Whale tail (user feedback): the whole rear half of the body bends with the tail like a lever, tip up then tip down; never move only the tip or hinge a separate tail piece. Built by bending a straight source raster along a curved spine (school.ts whale()).
- Whale silhouette (user feedback): one continuous taper from the body into a long slim tail, never a thick stick stuck on an oval. Shark is approved as is.
- Main fish control: arrow up/down move the fish on screen between two limits; the page scrolls only when the fish is at a limit (or the page cannot scroll further). Fish eye has no white.
- Whale design (user sketch): sperm whale. Big blunt box head with rounded corners, flat back to the tail, belly sags under the head then climbs to a thin tail, short paddle flipper, small flukes; head on the left in the sprite. Drawn straight in school.ts whaleSource(), bent by bend().
- Whale has no black outline: shades of blue only (softRim in school.ts). Shark keeps its outline.
- Whale flipper (user feedback): small, well behind the head on the lower belly, pointing down and back, never under the mouth; drawn after the bend so it does not bend with the tail.
