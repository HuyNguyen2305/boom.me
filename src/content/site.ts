import type { Profile, Project, SkillGroup } from "./types";

export const profile = {
  name: "Nguyễn Trần Gia Huy",
  role: "Software Engineer",
  location: "Vietnam",
  shortName: "Huy Nguyen",
  tagline: "Software Engineer.",
  intro: "I design, build and deploy fast, reliable applications and websites.",
  bio: "Energetic software engineer. I take ideas from first sketches to shipped products.",
  highlights: [
    { label: "Analyse & design", text: "Turning fuzzy needs into clear data models, APIs and system designs." },
    { label: "Build & deploy", text: "Projects taken end to end, live and reliable." },
    { label: "Team or solo", text: "Happy in a team, just as effective alone." },
    { label: "Modern tooling", text: "Comfortable with AI tools and current workflows." },
    { label: "Always learning", text: "Eager to explore what comes next." },
  ],
  email: "huyworkandcontact@gmail.com",
  openToWork: true,
  github: "https://github.com/HuyNguyen2305",
  linkedin: "https://www.linkedin.com/in/huynguyen2305/",
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
    title: "Food ordering and delivery platform",
    description: "A multi-platform food ordering and delivery system, built end to end with a food recommendation model and a shipper allocation model.",
    details:
      "A food ordering and delivery product that runs on every platform: customers order, admins manage the menu and orders, dispatchers watch deliveries and shippers work from their phones. I built all of it myself, backend and frontend on each platform, plus two models: Food Recommendation, which suggests dishes to each customer, and Shipper Allocation, which picks the shipper for each order.",
    highlights: [
      "Sole engineer: the entire system, backend and frontend, on every platform",
      "Client site, admin panel, dispatch dashboard and shipper app, all from scratch",
      "Food Recommendation model: the right dish in front of each customer",
      "Shipper Allocation model: the right shipper for every order",
      "Shipped it end to end, from the database to the shipper's phone",
    ],
    tech: ["Full stack", "Recommendation model", "Allocation model"],
    repo: "https://github.com/HuyNguyen2305/FoodECommerce",
    image: "/work/ecommerce/homepage.webp",
    gallery: [
      { src: "/work/ecommerce/homepage.webp", caption: "Client home page: browse the menu and pick a dish." },
      { src: "/work/ecommerce/recommendation.webp", caption: "Client food recommendation: dishes suggested for each customer." },
      { src: "/work/ecommerce/ordercheckout.webp", caption: "Client checkout: review the cart and place the order." },
      { src: "/work/ecommerce/myorders.webp", caption: "Client my orders: history and live order status." },
      { src: "/work/ecommerce/adminpagefoodlist.webp", caption: "Admin food list: add and edit dishes." },
      { src: "/work/ecommerce/adminpageorder.webp", caption: "Admin orders: manage incoming orders." },
      { src: "/work/ecommerce/dispatchdasboard.webp", caption: "Dispatch dashboard: Shipper Allocation assigns each order to a shipper." },
      { src: "/work/ecommerce/shipperscreen.webp", caption: "Mobile shipper app: the delivery view on a phone." },
    ],
  },
  {
    title: "Project three",
    description: "One line about what it does and who it is for.",
    details: "Placeholder write-up. Explain the problem, your role and what you shipped.",
    highlights: ["What you built", "A measurable result", "Something you learned"],
    tech: ["TypeScript", "Playwright"],
  },
];
