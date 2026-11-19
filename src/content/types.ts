export type Link = { label: string; href: string };

export type Profile = {
  name: string;
  initials: string;
  role: string;
  location: string;
  /** Short display name used in the hero headline */
  shortName: string;
  tagline: string;
  intro: string;
  bio: string;
  email: string;
  openToWork: boolean;
  github: string;
  linkedin: string;
};

/** `icon` is a file name in public/skills (without .svg); `detail` keeps its inner shapes (grayscale) instead of one white silhouette */
export type Skill = { name: string; icon: string; detail?: boolean };

export type Project = {
  title: string;
  description: string;
  /** Longer write-up shown in the project window (press E) */
  details: string;
  highlights: string[];
  tech: string[];
  repo?: string;
  live?: string;
  image?: string;
};

export type SkillGroup = { name: string; items: Skill[] };
