import { profile } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-depth-4 px-4 py-6 text-center font-mono text-xs text-mist">
      © 2026 {profile.name} · Built with Next.js
    </footer>
  );
}
