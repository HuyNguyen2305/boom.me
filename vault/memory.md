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
