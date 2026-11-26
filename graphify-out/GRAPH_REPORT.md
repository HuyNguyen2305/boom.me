# Graph Report - boom.me  (2026-11-26)

## Corpus Check
- Corpus is ~28,874 words - fits in a single context window. You may not need a graph.

## Summary
- 300 nodes · 579 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10

## God Nodes (most connected - your core abstractions)
1. `createEngine()` - 21 edges
2. `compilerOptions` - 17 edges
3. `drawSprite()` - 16 edges
4. `drawSeafloor()` - 12 edges
5. `Page()` - 11 edges
6. `frame()` - 11 edges
7. `setter()` - 11 edges
8. `join()` - 11 edges
9. `grid()` - 10 edges
10. `scripts` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Page()` --calls--> `OceanLayer()`  [EXTRACTED]
  src/app/page.tsx → src/components/OceanLayer.tsx
- `Ocean()` --calls--> `createEngine()`  [EXTRACTED]
  src/ocean/Ocean.tsx → src/ocean/engine.ts
- `createEngine()` --calls--> `drawSeafloor()`  [EXTRACTED]
  src/ocean/engine.ts → src/ocean/entities/seafloor.ts
- `frame()` --calls--> `drawSeafloor()`  [EXTRACTED]
  src/ocean/engine.ts → src/ocean/entities/seafloor.ts
- `drawSeafloor()` --calls--> `drawSprite()`  [EXTRACTED]
  src/ocean/entities/seafloor.ts → src/ocean/entities/pixels.ts

## Import Cycles
- None detected.

## Communities (11 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (49): Bubble, createEngine(), frame(), loop(), measure(), resize(), BOAT, COLORS (+41 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (32): Page(), About(), Contact(), Footer(), Hero(), Card(), Item, Projects() (+24 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (47): G, poseidon(), POSEIDON, POSEIDON_PAL, rng(), STATUE_H, STATUE_W, tools() (+39 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (34): compat, config, devDependencies, eslint@^9.39.5, eslint-config-next@^15.5.29, eslint-config-prettier@^10.1.8, @eslint/eslintrc@^3.3.7, @playwright/test@^1.65.1 (+26 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (29): ANGEL, BARRACUDA, bend(), BLUETANG, CLOWN, Creature, diver(), FISH (+21 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (16): config, dependencies, next@^15.5.29, react@^19.3.1, react-dom@^19.3.1, next, react, react-dom (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "Community 7"
Cohesion: 0.22
Nodes (9): scripts, build, dev, format, format:check, lint, start, test (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.32
Nodes (6): diverSpan(), diverX(), drawSignDiver(), PAL, SIGN, SPRITE

### Community 9 - "Community 9"
Cohesion: 0.50
Nodes (3): plugins, printWidth, tailwindStylesheet

## Knowledge Gaps
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 5` to `Community 0`, `Community 1`, `Community 3`?**
  _High betweenness centrality (0.268) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `createEngine()` (e.g. with `loop()` and `measure()`) actually correct?**
  _`createEngine()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07033315705975675 - nodes in this community are weakly interconnected._
- **Why does `next` connect `Community 5` to `Community 3`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09795918367346938 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `Community 7` to `Community 3`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08326530612244898 - nodes in this community are weakly interconnected._