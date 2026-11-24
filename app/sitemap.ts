import type { MetadataRoute } from "next";
import { getPosts, taxonomyEntries, taxonomyPath } from "@/lib/posts";
import { postPath, site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/about/", "/archives/", "/categories/", "/tags/"];
  const taxonomies = (["categories", "tags"] as const)
    .flatMap((type) => taxonomyEntries(type).map(({ name }) => taxonomyPath(type, name)));
  return [
    ...[...pages, ...taxonomies].map((path) => ({ url: site.url + path })),
    ...getPosts().map((post) => ({ url: site.url + postPath(post.slug), lastModified: post.date })),
  ];
}
