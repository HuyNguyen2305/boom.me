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
- [x] pnpm build, typecheck and test all pass

## In progress
- (none)
-

## Next
- [ ] Mobile menu button, section reveal, active nav link (small client bits)
- [ ] Mobile menu, section reveal, active nav link; real projects/skills/bio
- [ ] Confirm look of the sky scene and billboard with the user; check 375px layout
- [ ] Real content in src/content/site.ts, og image, favicon
- [ ] Deploy on Vercel

## Last session
- What changed: first build slice (sections, no ocean yet)
- Open questions: hero headline copy; impeccable findings in docs/design/open-water-dive.html left untouched
