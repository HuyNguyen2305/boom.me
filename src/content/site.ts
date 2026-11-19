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

export const projects = [] satisfies Project[] as Project[];
