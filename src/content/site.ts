import type { Profile, Project, SkillGroup } from "./types";

export const profile = {
  name: "Nguyễn Trần Gia Huy",
  initials: "GH",
  role: "Software Engineer",
  location: "Vietnam",
  shortName: "Gia Huy",
  tagline: "what I build.",
  intro: "I design and build fast, accessible websites.",
  bio: "Placeholder bio. Replace with a short paragraph about you.",
  email: "you@example.com",
  openToWork: true,
  github: "https://github.com/HuyNguyen2305",
  linkedin: "https://www.linkedin.com/",
} satisfies Profile;

export const skills: SkillGroup[] = [
  {
    name: "Frontend",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "HTML5", icon: "html5" },
      { name: "CSS3", icon: "css3" },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "Node.js", icon: "nodejs" },
      { name: "Express", icon: "expressjs" },
      { name: "Supabase", icon: "supabase" },
    ],
  },
  {
    name: "Data & AI",
    items: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MySQL", icon: "mysql" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "SQLite", icon: "sqlite" },
      { name: "Redis", icon: "redis" },
    ],
  },
  {
    name: "Cloud & Ops",
    items: [
      { name: "Docker", icon: "docker" },
      { name: "AWS", icon: "amazonwebservices" },
      { name: "Google Cloud", icon: "googlecloud" },
      { name: "Cloudflare", icon: "cloudflare", detail: true },
      { name: "Vercel", icon: "vercel" },
      { name: "Render", icon: "render" },
    ],
  },
  {
    name: "Languages",
    items: [
      { name: "JavaScript", icon: "javascript", detail: true },
      { name: "TypeScript", icon: "typescript" },
      { name: "Python", icon: "python" },
      { name: "Go", icon: "golang" },
      { name: "Java", icon: "java" },
    ],
  },
  {
    name: "AI tools",
    items: [
      { name: "Claude", icon: "claude" },
      { name: "GitHub Copilot", icon: "githubcopilot" },
      { name: "ChatGPT", icon: "chatgpt" },
    ],
  },
];

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
