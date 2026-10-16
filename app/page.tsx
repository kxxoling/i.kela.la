import About from "@/components/about";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import GitHubSection from "@/components/github-projects";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import { getPinnedRepos } from "@/lib/github";

export default async function Home() {
  const { repos, source } = await getPinnedRepos();

  return (
    <main className="flex flex-col items-center px-4">
      <Intro
        name={process.env.NAME || ""}
        githubUsername={process.env.GITHUB_USERNAME || ""}
      />
      <SectionDivider />
      <About />
      <Projects />
      <GitHubSection repos={repos} fetchFailed={source === "none"} />
      <Skills />
      <Experience />
      <Contact email={process.env.EMAIL || ""} />
    </main>
  );
}
