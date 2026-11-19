import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { OceanLayer } from "@/components/OceanLayer";
import { Hud } from "@/components/ui/Hud";
import { Nav } from "@/components/ui/Nav";
import { ProjectViewer } from "@/components/ui/ProjectViewer";
import { projects } from "@/content/site";

export default function Page() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-30 focus:bg-teal focus:p-2 focus:text-abyss">
        Skip to content
      </a>
      <OceanLayer />
      <Nav />
      <Hud />
      <ProjectViewer projects={projects} />
      <main id="main">
        {/* 150px sky strip: the engine draws the moon, fisherman and waves here and reads the surface line from it */}
        {/* sky, hero and About fill the first screen exactly, so the Skills layer never peeks out below */}
        <div className="flex min-h-[calc(100svh-3.5rem)] flex-col">
          <div aria-hidden data-surface className="h-[150px] shrink-0 bg-abyss" />
          <Hero />
          <About className="flex-1" />
        </div>
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
