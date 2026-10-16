"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "./section-heading";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { GoRepo, GoRepoForked } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import type { PinnedRepo } from "@/lib/github";
import { languageColor } from "@/lib/languages";
import { useSectionInView } from "@/lib/hooks";

function formatTopic(topic: string): string {
  return topic.replace(/-/g, " ");
}

function RepoCard({ repo, index }: { repo: PinnedRepo; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="h-full"
    >
      <a
        href={`/go/${repo.name}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col rounded-lg border border-black/5 bg-gray-100 p-5 transition hover:bg-gray-200 hover:-translate-y-1 dark:bg-white/10 dark:border-white/10 dark:hover:bg-white/20"
      >
        <div className="flex items-center gap-2">
          <GoRepo className="shrink-0 text-gray-700 dark:text-white/70" />
          <span className="font-semibold break-all group-hover:underline">
            {repo.name}
          </span>
          <BsBoxArrowUpRight className="ml-auto shrink-0 opacity-0 transition group-hover:opacity-70" />
        </div>

        {repo.description && (
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-white/70 line-clamp-3">
            {repo.description}
          </p>
        )}

        {repo.topics.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-3">
            {repo.topics.map((topic) => (
              <li
                key={topic}
                className="bg-black/[0.7] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full dark:text-white/70"
              >
                {formatTopic(topic)}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-auto pt-4 text-xs text-gray-600 dark:text-white/60">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: languageColor(repo.language, repo.languageColor) }}
                aria-hidden="true"
              />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1" title="Stars">
            <FaStar aria-label="stars" /> {repo.starsLabel}
          </span>
          <span className="flex items-center gap-1" title="Forks">
            <GoRepoForked aria-label="forks" /> {repo.forksLabel}
          </span>
        </div>
      </a>
    </motion.div>
  );
}

export function RepoCardGrid({ repos }: { repos: PinnedRepo[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {repos.map((repo, index) => (
        <RepoCard key={repo.url} repo={repo} index={index} />
      ))}
    </div>
  );
}

// "GitHub" section of the home page: a preview of the pinned repositories,
// with a link to the full /projects page.
export default function GitHubSection({
  repos,
  fetchFailed,
}: {
  repos: PinnedRepo[];
  fetchFailed: boolean;
}) {
  const { ref } = useSectionInView("GitHub", 0.5);

  return (
    <section
      ref={ref}
      id="github"
      className="scroll-mt-28 mb-28 sm:mb-40 w-full max-w-[53rem]"
    >
      <SectionHeading>GitHub</SectionHeading>

      {repos.length > 0 ? (
        <RepoCardGrid repos={repos} />
      ) : (
        <p className="text-center text-gray-700 dark:text-white/70">
          {fetchFailed
            ? "Something went wrong while loading the repositories. "
            : ""}
          You can find all of my work on GitHub.
        </p>
      )}

      <p className="mt-10 text-center">
        <Link
          href="/projects"
          className="font-medium underline text-gray-700 dark:text-white/70 hover:text-gray-950 dark:hover:text-white transition"
        >
          All GitHub projects →
        </Link>
      </p>
    </section>
  );
}
