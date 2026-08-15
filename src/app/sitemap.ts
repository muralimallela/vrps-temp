import { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/seo";

interface RouteConfig {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

const PUBLIC_ROUTES: RouteConfig[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/about/objectives", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about/vrps-birth", changeFrequency: "monthly", priority: 0.9 },
  { path: "/history", changeFrequency: "monthly", priority: 0.9 },
  { path: "/assembly-siege", changeFrequency: "monthly", priority: 0.8 },
  { path: "/vaddera-culture", changeFrequency: "monthly", priority: 0.8 },
  { path: "/empowerment", changeFrequency: "monthly", priority: 0.8 },
  { path: "/executive-committee", changeFrequency: "weekly", priority: 0.9 },
  { path: "/news-and-items", changeFrequency: "daily", priority: 0.9 },
  { path: "/photo-galleries", changeFrequency: "weekly", priority: 0.9 },
  { path: "/community/members", changeFrequency: "daily", priority: 0.8 },
  { path: "/community/supporters", changeFrequency: "daily", priority: 0.8 },
  { path: "/community/impact", changeFrequency: "weekly", priority: 0.8 },
  { path: "/donations", changeFrequency: "weekly", priority: 0.8 },
  { path: "/membership", changeFrequency: "weekly", priority: 0.9 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.5 },
  { path: "/payment-policy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/data-rights", changeFrequency: "monthly", priority: 0.6 },
];

const LOCALES = ["te", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  PUBLIC_ROUTES.forEach(({ path, changeFrequency, priority }) => {
    LOCALES.forEach((locale) => {
      const url = `${SITE_URL}/${locale}${path}`;
      const teUrl = `${SITE_URL}/te${path}`;
      const enUrl = `${SITE_URL}/en${path}`;

      sitemapEntries.push({
        url,
        lastModified,
        changeFrequency,
        priority: locale === "te" ? priority : Math.max(0.1, priority - 0.05),
        alternates: {
          languages: {
            te: teUrl,
            en: enUrl,
            "x-default": teUrl,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
