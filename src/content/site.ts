import type { Profile, Project, SkillGroup } from "./types";

export const profile = {
  name: "Nguyễn Trần Gia Huy",
  initials: "GH",
  role: "Frontend developer",
  location: "Vietnam",
  tagline: "what I build.",
  intro: "I design and build fast, accessible websites.",
  bio: "Placeholder bio. Replace with a short paragraph about you.",
  email: "you@example.com",
  openToWork: true,
  github: "https://github.com/HuyNguyen2305",
  linkedin: "https://www.linkedin.com/",
} satisfies Profile;

export const skills = [] satisfies SkillGroup[] as SkillGroup[];

// Placeholder projects: replace with real ones. An empty array shows "Coming soon" tiles.
export const projects: Project[] = [
  {
    title: "Project one",
    description: "One line about what it does and who it is for.",
    details: "Placeholder write-up. Explain the problem, your role and what you shipped.",
    highlights: ["What you built", "A measurable result", "Something you learned"],
    tech: ["TypeScript", "React"],
  },
  {
    title: "Project two",
    description: "One line about what it does and who it is for.",
    details: "Placeholder write-up. Explain the problem, your role and what you shipped.",
    highlights: ["What you built", "A measurable result", "Something you learned"],
    tech: ["Next.js", "Tailwind"],
  },
  {
    title: "Project three",
    description: "One line about what it does and who it is for.",
    details: "Placeholder write-up. Explain the problem, your role and what you shipped.",
    highlights: ["What you built", "A measurable result", "Something you learned"],
    tech: ["TypeScript", "Playwright"],
  },
];
