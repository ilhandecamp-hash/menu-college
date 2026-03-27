import { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";

export default function sitemap(): MetadataRoute.Sitemap {
  const settings = getSettings();
  const baseUrl = settings.siteUrl || "https://menu-college.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
