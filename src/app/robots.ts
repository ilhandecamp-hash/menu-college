import { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";

export default function robots(): MetadataRoute.Robots {
  const settings = getSettings();
  const baseUrl = settings.siteUrl || "https://menu-college.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
