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
