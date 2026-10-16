import type { MetadataRoute } from "next";
import { getPinnedRepos, getRepoLists } from "@/lib/github";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://i.kela.la";

  const [{ repos: pinned }, { byRecent, byStars }] = await Promise.all([
    getPinnedRepos(),
    getRepoLists(),
  ]);
  const repoNames = [
    ...new Set([
      ...pinned.map((repo) => repo.name),
      ...byRecent.map((repo) => repo.name),
      ...byStars.map((repo) => repo.name),
    ]),
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
    },
    // /go/<repo> entries 301 to GitHub; search consoles will report them as
    // redirects, which is expected — the signals consolidate to the targets.
    ...repoNames.map((name) => ({
      url: `${baseUrl}/go/${name}`,
      lastModified: new Date(),
    })),
  ];
}
