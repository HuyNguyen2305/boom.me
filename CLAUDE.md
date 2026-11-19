## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.


## Project

Portfolio website. Next.js 15 (App Router, React 19) + TypeScript (strict) +
Tailwind 4, pnpm, deployed on Vercel. Fully static: no backend, no CMS, no database,
no API routes. One dark mode only.

Design docs live in `docs/design/` (spec, prototype `open-water-dive.html`, plan).
Architecture doc: https://claude.ai/artifact/BEE6yF7nSVk5C6b26KstAU

## Code hygiene (default)

Use the `ponytail` skills for every code check: `/ponytail-review` for a change,
`/ponytail-audit` for dead-code and dead-file checks. Write the smallest change that
fully works. Report findings; confirm before deleting files.

## Design (always)

Every design task (layout, sprites, motion, copy on the page) uses all five skills, loaded
fresh each time: `emil-design-eng` (motion and polish), `design-taste-frontend`,
`impeccable`, `stageshow` and `ui-ux-pro-max:ui-ux-pro-max`. Then check the result in a real
browser before reporting.

## Memory (Obsidian vault + graphify)

Session start: read `vault/memory.md` and `vault/progress.md`, then query graphify.
Session end: update `vault/progress.md`; add durable facts to `vault/memory.md`.

## Architecture (Next.js + TypeScript + Tailwind 4)

```
next.config.ts            # plain config, no server features
public/
  sprites/                # CC0 sprite sheets (fish, boat, school, floor)
  resume.pdf              # optional
src/
  app/
    layout.tsx            # <html>, fonts via next/font, metadata + Open Graph
    page.tsx              # the one page: 150px sky strip + <OceanLayer/> + <Nav/> + <Hud/> + <ProjectViewer/> + sections
    globals.css           # Tailwind import + @theme color tokens from the design spec
    opengraph-image.png   # link preview image
    icon.png              # favicon
  content/
    site.ts               # profile, skills, projects, contact (only file edited for content)
    types.ts              # Profile, SkillGroup, Project, Link
  components/
    sections/             # Hero, About, Skills, Projects, Contact, Footer, Section (shared wrapper)
    ui/                   # Nav, Hud, ProjectViewer (E opens a project), Kbd, Chip, EmptyState, CopyEmail
    OceanLayer.tsx        # 'use client'; next/dynamic import of Ocean, ssr: false
  ocean/                  # the game: plain TypeScript, no React except Ocean.tsx
    Ocean.tsx             # mounts canvas, starts/stops engine
    engine.ts             # createEngine(canvas, opts): rAF loop, resize, pause on hidden tab
    world.ts              # world state: fish, schools, bubbles, boat, depth
    entities/             # sky (moon, clouds), boat (+ waves), buoy, school (background sea life), seafloor
    input.ts              # arrow-key steering; off while typing or a dialog is open
    scroll.ts             # reads [data-dive-stop] rects, maps scroll to fish target
    sprites.ts            # sheet loading, frame lookup, nearest-neighbor drawing
    events.ts             # tiny event bus: depth (read by the HUD)
  hooks/
    useReducedMotion.ts
tests/
  e2e/                    # Playwright specs, one per visible behavior
  fixtures/               # shared Playwright helpers/test data
playwright.config.ts
docs/design/              # spec, prototype, plan
```

Rules:
- Content lives only in `src/content/site.ts`, typed with `satisfies`. Empty
  `skills`/`projects` arrays render the "Coming soon" `EmptyState`.
- Everything is a server component except `OceanLayer`, `Ocean`, `Hud`, `ProjectViewer` and
  `CopyEmail`. Sections ship no JavaScript; all motion lives in `ocean/`.
- `components/`, `ocean/` and `content/` never import each other's internals; only
  `app/page.tsx` wires them together. Sections never know the game exists: the engine
  finds them via `data-dive-stop`, and the HUD hears depth through `events.ts`.
- Every section uses the shared `Section` wrapper (`<section id data-dive-stop>`,
  depth marker, `<h2>`).
- The page must work fully with the canvas off: canvas is `aria-hidden` and
  `pointer-events: none`; reduced motion draws one still frame and leaves arrow keys to the
  browser; arrow steering never traps focus (off in fields and dialogs).
- Semantic HTML (one `<h1>`, an `<h2>` per section, skip link), alt text, visible
  focus ring, mobile-first in every section.
