import type { Metadata } from "next";
import { getPinnedRepos, getRepoLists, githubProfileUrl } from "@/lib/github";
import { RepoCardGrid } from "@/components/github-projects";
import RepoList from "@/components/repo-list";
import SectionHeading from "@/components/section-heading";

// Re-render at most once per hour in the background (ISR). The page is always
// prerendered with fresh data at build time, i.e. on every deployment.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const NAME = process.env.NAME || "";
  const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "";
  const byline = [NAME, GITHUB_USERNAME ? `(${GITHUB_USERNAME})` : ""]
    .filter(Boolean)
    .join(" ");

  const [{ repos: pinned }, { byRecent }] = await Promise.all([
    getPinnedRepos(),
    getRepoLists(),
  ]);
  const names = [...(pinned.length > 0 ? pinned : byRecent)]
    .slice(0, 5)
    .map((repo) => repo.name)
    .join(", ");
  const suffix =
    "on GitHub — recently updated and most starred repositories.";

  return {
    title: "GitHub Projects",
    description: names
      ? `Open source projects${byline ? ` by ${byline}` : ""}: ${names} and more ${suffix}`
      : `Open source projects${byline ? ` by ${byline}` : ""} ${suffix}`,
    alternates: { canonical: "/projects" },
    openGraph: {
      title: NAME ? `GitHub Projects | ${NAME}` : "GitHub Projects",
      description: `Open source projects${
        byline ? ` by ${byline}` : ""
      } ${suffix}`,
      url: "/projects",
    },
  };
}

export default async function ProjectsPage() {
  const [{ repos: pinned }, { byRecent, byStars, ok }] = await Promise.all([
    getPinnedRepos(),
    getRepoLists(),
  ]);
  const reposUrl = githubProfileUrl("?tab=repositories");

  return (
    <main className="flex flex-col items-center px-4">
      <section className="mb-28 w-full max-w-[53rem]">
        <SectionHeading>GitHub projects</SectionHeading>

        {pinned.length > 0 && (
          <>
            <h3 className="mb-4 mt-2 text-xl font-medium text-center">Pinned</h3>
            <RepoCardGrid repos={pinned} />
          </>
        )}

        {byRecent.length > 0 && (
          <>
            <h3 className="mb-4 mt-16 text-xl font-medium text-center">
              Recently updated
            </h3>
            <RepoList repos={byRecent} />
          </>
        )}

        {byStars.length > 0 && (
          <>
            <h3 className="mb-4 mt-16 text-xl font-medium text-center">
              Most starred
            </h3>
            <RepoList repos={byStars} />
          </>
        )}

        {pinned.length === 0 && byRecent.length === 0 && (
          <p className="text-center text-gray-700 dark:text-white/70">
            {ok ? "No repositories found. " : "Something went wrong while loading the repositories. "}
            You can find all of my work on GitHub.
          </p>
        )}

        {reposUrl && (
          <p className="mt-10 text-center">
            <a
              href={reposUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline text-gray-700 dark:text-white/70 hover:text-gray-950 dark:hover:text-white transition"
            >
              See all repositories on GitHub →
            </a>
          </p>
        )}
      </section>
    </main>
  );
}
