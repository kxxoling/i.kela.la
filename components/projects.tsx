"use client";

import SectionHeading from "./section-heading";
import { projectsData } from "@/lib/data";
import Project from "./project";
import { useSectionInView } from "@/lib/hooks";
import Link from "next/link";

export default function Projects() {
  const { ref } = useSectionInView("Projects", 0.5);

  return (
    <section ref={ref} id="projects" className="scroll-mt-28 mb-28">
      <SectionHeading>My projects</SectionHeading>
      <div>
        {projectsData.map((project) => (
          <Project key={project.title} {...project} />
        ))}
      </div>
      <p className="text-center mt-8">
        <Link
          href="/projects"
          className="font-medium underline text-gray-700 dark:text-white/70 hover:text-gray-950 dark:hover:text-white transition"
        >
          See my open source projects on GitHub →
        </Link>
      </p>
    </section>
  );
}
