import type { MetadataRoute } from "next";
import { getPosts, taxonomyEntries, taxonomyPath } from "@/lib/posts";
import { postPath, site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${site.url}/about/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site.url}/archives/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${site.url}/categories/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${site.url}/tags/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const taxonomyPages: MetadataRoute.Sitemap = (["categories", "tags"] as const)
    .flatMap((type) => taxonomyEntries(type).map(({ name }) => ({
      url: `${site.url}${taxonomyPath(type, name)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })));

  const postPages: MetadataRoute.Sitemap = getPosts().map((post) => ({
    url: `${site.url}${postPath(post.slug)}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...taxonomyPages, ...postPages];
}
