// Subset of GitHub linguist colors for the common languages; anything else
// falls back to a neutral gray dot.

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Kotlin: "#A97BFF",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Swift: "#F05138",
  Dart: "#00B4AB",
  "Jupyter Notebook": "#DA5B0B",
  Dockerfile: "#384d54",
  Lua: "#000080",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  R: "#198CE7",
};

export function languageColor(
  language: string | null,
  fallback: string | null = null
): string {
  if (language && LANGUAGE_COLORS[language]) return LANGUAGE_COLORS[language];
  if (fallback) return fallback.startsWith("#") ? fallback : `#${fallback}`;
  return "#8b949e";
}
