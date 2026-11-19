# Personal portfolio plan

**Goal:** a one-page online portfolio to showcase skills and projects, hosted on Vercel.
**Stack:** Next.js (App Router, TypeScript) + Tailwind CSS.

## Step 1: Set up the page sections (current step)
- One page with anchor navigation: Hero, About, Skills, Projects, Contact, plus a footer.
- Skills and Projects start as empty placeholders ("coming soon") and fill in from one data file (e.g. `src/data/site.ts`) holding the `profile`, `skills[]` and `projects[]` arrays.
- Sticky navbar, responsive layout, automatic dark mode.
- Done when `npm run build` passes and every section renders.

## Step 2: Fill in content
- Bio, role, tagline and contact links.
- Skill groups (e.g. Languages, Frameworks, Tools).
- 3 to 6 projects, each with a description, the tech used, repo/live links and an optional screenshot in `/public`.

## Step 3: Push to GitHub and deploy on Vercel
- Create a repo, push, import it on vercel.com. Every later push redeploys automatically.
- Optionally add a custom domain.

## Step 4: Polish (optional)
- SEO metadata and a link preview (Open Graph) image, mobile and Lighthouse checks, resume download.
