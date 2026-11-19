# Progress

Current state of the portfolio build. Update at the end of every session.

## Done
- [x] Scaffold Next.js 15 + TS strict + Tailwind 4 (pnpm), design tokens + fonts
- [x] Static shell: Nav, Hero, About, Skills, Projects, Contact, Footer (placeholder copy in src/content/site.ts)
- [x] Playwright e2e (tests/e2e/sections.spec.ts): sections render, empty states, no h-scroll at 375/1280
- [x] Ocean v1: canvas fish (tilt, bubbles), scroll-to-depth, Hud depth meter, reduced-motion still frame
- [x] Ocean v2: boat+moon+waves sky strip, seafloor with kelp, background schools by depth, helm mode (WASD, Esc) + HelmButton
- [x] pnpm build, typecheck and test all pass

## In progress
- (none)
-

## Next
- [ ] Mobile menu button, section reveal, active nav link (small client bits)
- [ ] Gauge stops as links (J/K jump), mobile menu, section reveal, active nav link
- [ ] Eyeball ocean visuals (boat, floor, helm) in browser; fish may overlap text at 640-1100px
- [ ] Real content in src/content/site.ts, og image, favicon
- [ ] Deploy on Vercel

## Last session
- What changed: first build slice (sections, no ocean yet)
- Open questions: hero headline copy; impeccable findings in docs/design/open-water-dive.html left untouched
