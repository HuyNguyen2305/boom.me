import { profile } from "@/content/site";

const links = ["about", "skills", "projects", "contact"];

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-teal/15 bg-abyss/80 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex h-14 w-full max-w-site items-center justify-between px-4 sm:px-6 lg:pr-48 lg:pl-12">
        <a href="#top" className="font-display font-extrabold text-teal">{profile.initials}</a>
        <ul className="flex gap-4 text-sm sm:gap-6">
          {links.map((l) => (
            <li key={l}>
              <a href={`#${l}`} className="capitalize text-mist hover:text-teal">{l}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
