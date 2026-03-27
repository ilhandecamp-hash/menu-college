import type { Metadata } from "next";
import "./globals.css";
import { getSettings, colorThemes } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl =
    settings.siteUrl ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://menu-college.vercel.app");

  return {
    title: settings.metaTitle,
    description: settings.metaDescription,
    keywords: settings.metaKeywords,
    authors: [{ name: settings.schoolName }],
    creator: settings.schoolName,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: settings.language === "en" ? "en_US" : "fr_FR",
      url: siteUrl,
      title: settings.metaTitle,
      description: settings.metaDescription,
      siteName: settings.schoolName,
      images: [
        {
          url: settings.ogImageUrl || `${siteUrl}/api/og`,
          width: 1200,
          height: 630,
          alt: settings.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.metaTitle,
      description: settings.metaDescription,
      images: [settings.ogImageUrl || `${siteUrl}/api/og`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Script to prevent dark mode flash (runs before paint)
const darkModeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch(e) {}
  })();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const theme = colorThemes[settings.primaryColor] || colorThemes.warm;

  const cssVars = Object.entries(theme.vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ");

  // JSON-LD structured data for Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.metaTitle,
    description: settings.metaDescription,
    url: settings.siteUrl || "https://menu-college.vercel.app",
    publisher: {
      "@type": "EducationalOrganization",
      name: settings.schoolName,
    },
    inLanguage: settings.language || "fr",
  };

  return (
    <html lang={settings.language || "fr"} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { ${cssVars} }`,
          }}
        />
        <meta name="theme-color" content={theme.vars["--primary"]} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="page-enter">{children}</body>
    </html>
  );
}
