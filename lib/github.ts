// Fetches the pinned repositories of a GitHub profile.
//
// Primary source: the official GraphQL API (needs GITHUB_TOKEN, see .env.example).
// Fallback: the public profile HTML, which contains the pinned list and can be
// parsed without authentication (one request per build, well within limits).

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "";

// Profile URL helper — null when no username is configured, so UI links can
// degrade to plain text instead of pointing at github.com's root.
export function githubProfileUrl(path = ""): string | null {
  if (!GITHUB_USERNAME) return null;
  return `https://github.com/${GITHUB_USERNAME}${path}`;
}
const FETCH_REVALIDATE_SECONDS = 3600;
const FETCH_TIMEOUT_MS = 15000;

export type PinnedRepo = {
  name: string;
  owner: string;
  url: string;
  description: string | null;
  language: string | null;
  languageColor: string | null;
  starsLabel: string;
  forksLabel: string;
  topics: string[];
};

export type PinnedReposResult = {
  repos: PinnedRepo[];
  /** How the data was fetched, shown in the page footer for transparency. */
  source: "graphql" | "html" | "none";
};

export type RepoSummary = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  starsLabel: string;
  /** "YYYY-MM" of the last push */
  pushedAt: string;
};

export type RepoListsResult = {
  byRecent: RepoSummary[];
  byStars: RepoSummary[];
  ok: boolean;
};

const fetchOptions: RequestInit = {
  next: { revalidate: FETCH_REVALIDATE_SECONDS },
  signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  headers: { "User-Agent": "portfolio-site" },
};

function formatCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(n);
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

type GraphQLRepositoryNode = {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
};

type GraphQLResponse = {
  data?: {
    user?: {
      pinnedItems?: {
        nodes?: GraphQLRepositoryNode[];
      };
    };
  };
  errors?: unknown;
};

async function fetchFromGraphQL(): Promise<PinnedRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  const query = `
    query PinnedRepos($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage { name color }
              repositoryTopics(first: 6) { nodes { topic { name } } }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    ...fetchOptions,
    method: "POST",
    headers: {
      ...fetchOptions.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL API responded with ${response.status}`);
  }

  const json: GraphQLResponse = await response.json();
  if (json.errors) {
    throw new Error(`GitHub GraphQL API errors: ${JSON.stringify(json.errors)}`);
  }

  const nodes = json?.data?.user?.pinnedItems?.nodes ?? [];

  return nodes.map((node) => ({
    name: node.name,
    owner: GITHUB_USERNAME,
    url: node.url,
    description: node.description,
    language: node.primaryLanguage?.name ?? null,
    languageColor: node.primaryLanguage?.color ?? null,
    starsLabel: formatCount(node.stargazerCount ?? 0),
    forksLabel: formatCount(node.forkCount ?? 0),
    topics: (node.repositoryTopics?.nodes ?? []).map((t) => t.topic.name),
  }));
}

function parseProfileHtml(html: string): PinnedRepo[] {
  const listMatch = html.match(
    /<ol[^>]*class="[^"]*pinned-items-reorder-list[^"]*"[^>]*>([\s\S]*?)<\/ol>/
  );
  if (!listMatch) return [];

  const items = listMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/g) ?? [];
  const repos: PinnedRepo[] = [];

  for (const item of items) {
    const repoMatch = item.match(
      /<a[^>]*href="\/([^"/]+)\/([^"/]+)"[^>]*>\s*<span class="repo">([\s\S]*?)<\/span>/
    );
    if (!repoMatch) continue;

    const description = item.match(
      /<(?:p|span)[^>]*class="[^"]*pinned-item-desc[^"]*"[^>]*>([\s\S]*?)<\/(?:p|span)>/
    );
    const language = item.match(
      /itemprop="programmingLanguage">([^<]+)</
    );
    const languageColor = item.match(
      /repo-language-color[^>]*style="[^"]*(?:background-)?color:\s*([^;">]+)/
    );
    const stars = item.match(
      /href="[^"]*\/stargazers"[^>]*>[\s\S]*?aria-label="stars"[\s\S]*?<\/svg>\s*([^<]+?)\s*</
    );
    const forks = item.match(
      /href="[^"]*\/forks"[^>]*>[\s\S]*?aria-label="forks"[\s\S]*?<\/svg>\s*([^<]+?)\s*</
    );

    repos.push({
      owner: repoMatch[1],
      name: decodeEntities(repoMatch[3]),
      url: `https://github.com/${repoMatch[1]}/${repoMatch[2]}`,
      description: description ? decodeEntities(description[1]) : null,
      language: language ? decodeEntities(language[1]) : null,
      languageColor: languageColor ? languageColor[1].trim() : null,
      starsLabel: stars ? decodeEntities(stars[1]) : "0",
      forksLabel: forks ? decodeEntities(forks[1]) : "0",
      topics: [],
    });
  }

  return repos;
}

async function fetchFromProfileHtml(): Promise<PinnedRepo[]> {
  const response = await fetch(
    `https://github.com/${GITHUB_USERNAME}`,
    fetchOptions
  );
  if (!response.ok) {
    throw new Error(`GitHub profile page responded with ${response.status}`);
  }
  return parseProfileHtml(await response.text());
}

export async function getPinnedRepos(): Promise<PinnedReposResult> {
  if (!GITHUB_USERNAME) {
    return { repos: [], source: "none" };
  }
  if (process.env.GITHUB_TOKEN) {
    try {
      const repos = await fetchFromGraphQL();
      if (repos.length > 0) return { repos, source: "graphql" };
    } catch (error) {
      console.warn("[github] GraphQL fetch failed, falling back to profile HTML:", error);
    }
  }

  try {
    const repos = await fetchFromProfileHtml();
    if (repos.length > 0) return { repos, source: "html" };
  } catch (error) {
    console.warn("[github] profile HTML fetch failed:", error);
  }

  return { repos: [], source: "none" };
}

type RestRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
};

function toSummary(repo: RestRepo): RepoSummary {
  return {
    name: repo.name,
    url: repo.html_url,
    description: repo.description,
    language: repo.language,
    starsLabel: formatCount(repo.stargazers_count ?? 0),
    pushedAt: repo.pushed_at.slice(0, 7),
  };
}

// All non-fork, non-archived repositories via the public REST (v3) API,
// returned as "recently updated" and "most starred" lists for the projects
// page. Reliable with GITHUB_TOKEN; unauthenticated works but is rate
// limited (60 req/h per IP).
async function fetchRepos(): Promise<RestRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100&type=owner`,
    {
      ...fetchOptions,
      headers: {
        ...(fetchOptions.headers ?? {}),
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub REST API responded with ${response.status}`);
  }

  const data = (await response.json()) as RestRepo[];

  return data.filter(
    (repo) => !repo.fork && !repo.archived && repo.name !== GITHUB_USERNAME
  );
}

export async function getRepoLists(): Promise<RepoListsResult> {
  if (!GITHUB_USERNAME) {
    return { byRecent: [], byStars: [], ok: false };
  }
  try {
    const repos = await fetchRepos();
    const byRecent = [...repos]
      .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
      .slice(0, 50)
      .map(toSummary);
    const byStars = [...repos]
      .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
      .slice(0, 30)
      .map(toSummary);
    return { byRecent, byStars, ok: true };
  } catch (error) {
    console.warn("[github] repo lists fetch failed:", error);
    return { byRecent: [], byStars: [], ok: false };
  }
}

export { GITHUB_USERNAME };
