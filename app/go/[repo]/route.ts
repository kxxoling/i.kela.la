import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPinnedRepos, getRepoLists, GITHUB_USERNAME } from "@/lib/github";

// Local, permanently-redirecting URLs for the GitHub repositories
// (e.g. /go/<repo> -> https://github.com/<GITHUB_USERNAME>/<repo>). Google
// consolidates the signals of these URLs into the GitHub destinations (301),
// and they double as stable on-domain project links.

export const revalidate = 3600;

async function knownRepos(): Promise<{ names: Set<string>; fetched: boolean }> {
  const [{ repos: pinned }, { byRecent, byStars, ok }] = await Promise.all([
    getPinnedRepos(),
    getRepoLists(),
  ]);
  return {
    names: new Set([
      ...pinned.map((repo) => repo.name),
      ...byRecent.map((repo) => repo.name),
      ...byStars.map((repo) => repo.name),
    ]),
    // ok === false means the GitHub API fetch failed; fall back to name-shape
    // validation. The redirect target is always github.com/<user>/<repo>, so
    // this can never become an open redirect.
    fetched: pinned.length > 0 || ok,
  };
}

export async function generateStaticParams() {
  const { names } = await knownRepos();
  return [...names].map((repo) => ({ repo }));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ repo: string }> }
) {
  if (!GITHUB_USERNAME) {
    return new NextResponse("Not found", { status: 404 });
  }
  const { repo } = await params;
  const { names, fetched } = await knownRepos();

  if (fetched ? !names.has(repo) : !/^[A-Za-z0-9_.-]+$/.test(repo)) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(
    `https://github.com/${GITHUB_USERNAME}/${repo}`,
    301
  );
}
