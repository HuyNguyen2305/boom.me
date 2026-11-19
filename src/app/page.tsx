import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { OceanLayer } from "@/components/OceanLayer";
import { Hud } from "@/components/ui/Hud";
import { Nav } from "@/components/ui/Nav";

export default function Page() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-30 focus:bg-teal focus:p-2 focus:text-abyss">
        Skip to content
      </a>
      <OceanLayer />
      <Nav />
      <Hud />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
