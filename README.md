# Portfolio

Personal portfolio website built with Next.js (App Router), TypeScript and
Tailwind CSS.

## Getting started

```bash
pnpm install
pnpm dev
```

Requires Node.js >= 24. The pnpm version is pinned in `package.json`
(`packageManager` field).

## Configuration

Copy `.env.example` to `.env.local` and fill in the values. All personal
information (name, email, GitHub username) and integrations (Search Console
verification, analytics via `HEAD_TAGS`, IndexNow, GitHub API token) are
environment-driven — nothing is hardcoded in the code.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — production build
- `pnpm lint` — ESLint

## Deployment

Push to the default branch; Vercel builds and deploys automatically.
