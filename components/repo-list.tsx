import { FaStar } from "react-icons/fa";
import { languageColor } from "@/lib/languages";
import type { RepoSummary } from "@/lib/github";

export default function RepoList({ repos }: { repos: RepoSummary[] }) {
  return (
    <ul className="rounded-lg border border-black/5 bg-gray-100 px-5 dark:bg-white/10 dark:border-white/10">
      {repos.map((repo) => (
        <li
          key={repo.url}
          className="border-b border-black/5 last:border-b-0 dark:border-white/10"
        >
          <a
            href={`/go/${repo.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-baseline gap-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium group-hover:underline">
                {repo.name}
              </span>
              {repo.description && (
                <p className="truncate text-sm text-gray-700 dark:text-white/70">
                  {repo.description}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-baseline gap-3 text-xs text-gray-600 dark:text-white/60">
              {repo.language && (
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: languageColor(repo.language) }}
                    aria-hidden="true"
                  />
                  {repo.language}
                </span>
              )}
              <span className="flex items-center gap-1" title="Stars">
                <FaStar aria-label="stars" /> {repo.starsLabel}
              </span>
              <time dateTime={repo.pushedAt}>{repo.pushedAt}</time>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
