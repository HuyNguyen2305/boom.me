const links = ["about", "skills", "works", "contact"];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-teal/15 bg-abyss">
      <nav aria-label="Main" className="column flex h-14 items-center justify-center">
        <ul className="flex gap-6 text-sm sm:gap-12">
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
