# Progress

Current state of the portfolio build. Update at the end of every session.

## Done
- [x] Scaffold Next.js 15 + TS strict + Tailwind 4 (pnpm), design tokens + fonts
- [x] Static shell: Nav, Hero, About, Skills, Projects, Contact, Footer (placeholder copy in src/content/site.ts)
- [x] Playwright e2e (tests/e2e/sections.spec.ts): sections render, empty states, no h-scroll at 375/1280
- [x] Ocean v1: canvas fish (tilt, bubbles), scroll-to-depth, Hud depth meter, reduced-motion still frame
- [x] Ocean v3: bright sky scene (sun, clouds, island+palm, hatted fisherman), lower waterline, water darkens by depth, fish starts right, arrow-key control (no buttons), E opens project dialog (placeholder projects)
- [x] Hero moved to the sky: shore + billboard (On Surface, Gia Huy, Software Engineer, controls); old underwater hero removed; depth meter follows the fish
- [x] Pixel art restyled (outlined round fish, flat-shaded palms); short left shore with palms, boat centred, red/white buoy above the fish lane; content widened with a right lane for the fish
- [x] Seamless sprites (bitmap blit), bigger palms (3 on shore), bigger buoy, redrawn fish, content column capped at 84rem with fish lane inside it
- [x] Round moon, night clouds, buoy; background sea life by depth (minnows, tang, lantern fish, jellyfish, shark, whale, octopus, hordes); tilt fixed (head-down when diving); content column shifted 6rem left
- [x] pnpm build, typecheck and test all pass

## In progress
- (none)
-

## Direction (agreed with the user)
Return to the Open Water design spec (docs/design/open-water-design-spec.md, live doc https://claude.ai/artifact/5hB5aAJAa9JipMTcAMfmGZ). The shore, billboard, palms, buoy, island, sun and clouds were dropped as "super weird". Kept on top of the spec: arrow-key steering, E opens a project window, fish starts on the right, hero says "On Surface" with a controls line instead of buttons.

## Next
- [ ] Mobile menu button, section reveal, active nav link (small client bits)
- [ ] Mobile menu, section reveal, active nav link; real projects/skills/bio
- [ ] Confirm look of the sky scene and billboard with the user; check 375px layout
- [ ] Real content in src/content/site.ts, og image, favicon
- [ ] Deploy on Vercel

## Last session
- What changed: first build slice (sections, no ocean yet)
- Open questions: hero headline copy; impeccable findings in docs/design/open-water-dive.html left untouched
