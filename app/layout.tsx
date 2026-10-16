import Header from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import ActiveSectionContextProvider from "@/context/active-section-context";
import Footer from "@/components/footer";
import ThemeSwitch from "@/components/theme-switch";
import ThemeContextProvider from "@/context/theme-context";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://i.kela.la";

// Personal values come from the environment (see .env.example) so no name,
// email or GitHub username is hardcoded in the repository.
const NAME = process.env.NAME || "";
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "";
const firstName = NAME.split(" ").filter(Boolean)[0] || "";

const pageIdentity = [
  NAME,
  GITHUB_USERNAME ? `(@${GITHUB_USERNAME})` : "",
]
  .filter(Boolean)
  .join(" ");
const pageTitle = pageIdentity
  ? `${pageIdentity} | Personal Portfolio`
  : "Personal Portfolio";
const pageDescription = firstName
  ? `${firstName} is a full-stack developer in 🇨🇳.`
  : "Full-stack developer portfolio.";
const profileUrl = GITHUB_USERNAME
  ? `https://github.com/${GITHUB_USERNAME}`
  : null;

// Arbitrary tags (analytics scripts, extra metas, pixel code, ...) injected
// into <head> at build time from the HEAD_TAGS env var. Unset means not a
// single tag is rendered. Example value:
// <meta name="foo" content="bar"/><script async src="https://..."></script>
const injectedHeadTags = process.env.HEAD_TAGS;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageTitle,
    template: NAME ? `%s | ${NAME}` : "%s | Portfolio",
  },
  description: pageDescription,
  keywords: [
    ...[NAME, GITHUB_USERNAME].filter(Boolean),
    "full-stack developer",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "portfolio",
  ],
  authors: NAME ? [{ name: NAME, url: siteUrl }] : undefined,
  creator: NAME || undefined,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: NAME ? `${NAME}'s Portfolio` : "Portfolio",
    title: pageTitle,
    description: pageDescription,
  },
  twitter: {
    card: "summary",
    title: pageTitle,
    description: pageDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  // Google Search Console HTML-tag verification. Set GOOGLE_SITE_VERIFICATION
  // (the content value of the meta tag) in the Vercel environment variables.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
};

const personJsonLd = NAME && {
  "@context": "https://schema.org",
  "@type": "Person",
  name: NAME,
  alternateName: GITHUB_USERNAME || undefined,
  url: siteUrl,
  sameAs: profileUrl ? [profileUrl] : undefined,
  jobTitle: "Full-Stack Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      {injectedHeadTags && (
        <head dangerouslySetInnerHTML={{ __html: injectedHeadTags }} />
      )}
      <body
        className={`${inter.className} bg-gray-50 text-gray-950 relative pt-28 sm:pt-36 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90`}
      >
        {personJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
          />
        )}
        <div className="bg-[#fbe2e3] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]"></div>
        <div className="bg-[#dbd7fb] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]"></div>

        <ThemeContextProvider>
          <ActiveSectionContextProvider>
            <Header />
            {children}
            <Footer />

            <ThemeSwitch />
          </ActiveSectionContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
