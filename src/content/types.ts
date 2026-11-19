export type Link = { label: string; href: string };

export type Profile = {
  name: string;
  initials: string;
  role: string;
  location: string;
  tagline: string;
  intro: string;
  bio: string;
  email: string;
  openToWork: boolean;
  github: string;
  linkedin: string;
};

export type SkillGroup = { name: string; items: string[] };

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
