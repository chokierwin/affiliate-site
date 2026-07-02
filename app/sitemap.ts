import type { MetadataRoute } from "next";
import { getAllArticlesMeta } from "@/lib/articles";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/artikel`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/about-us`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteConfig.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/terms-of-service`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/disclaimer-affiliate`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const articlePages: MetadataRoute.Sitemap = getAllArticlesMeta().map((article) => ({
    url: `${siteConfig.url}/artikel/${article.slug}`,
    lastModified: article.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...articlePages];
}
