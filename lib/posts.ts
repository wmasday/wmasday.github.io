import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { slug as slugify } from "github-slugger";

export type Post = {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  pinned: boolean;
  body: string;
  excerpt: string;
  minutes: number;
  image?: { path: string; alt: string };
};

export type PostSummary = Omit<Post, "body">;
export type Taxonomy = "categories" | "tags";

const postsDirectory = join(process.cwd(), "content", "posts");
const postFilename = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;

export const getPosts = cache((): Post[] => readdirSync(postsDirectory)
  .filter((filename) => postFilename.test(filename))
  .map((filename) => {
    const [, day, slug] = filename.match(postFilename)!;
    const { data, content } = matter(readFileSync(join(postsDirectory, filename), "utf8"));
    // Accept the timezone format used in the existing Jekyll front matter.
    const rawDate = String(data.date ?? day).replace(/ (?=\d{2}:)/, "T").replace(/ ([+-]\d{2})(\d{2})$/, "$1:$2");
    const date = data.date instanceof Date ? data.date : new Date(rawDate);
    if (typeof data.title !== "string" || !Number.isFinite(date.getTime())) {
      throw new Error(`Invalid title or date in ${filename}`);
    }
    const body = content.replace(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*relative_url\s*\}\}/g, "$1").trim();
    const excerpt = body.split(/\n\s*\n/)[0].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "");
    return {
      slug,
      title: data.title,
      date: date.toISOString(),
      categories: data.categories ?? [],
      tags: data.tags ?? [],
      pinned: Boolean(data.pin),
      body,
      excerpt: data.description ?? excerpt,
      minutes: Math.max(1, Math.ceil(body.split(/\s+/).length / 220)),
      image: data.image,
    };
  })
  .sort((first, second) => second.date.localeCompare(first.date)));

export const postSummary = ({ body: _body, ...summary }: Post): PostSummary => summary;
export const taxonomySlug = (name: string) => slugify(name);
export const taxonomyPath = (type: Taxonomy, name: string) => `/${type}/${taxonomySlug(name)}/`;

export function taxonomyEntries(type: Taxonomy) {
  const entries = new Map<string, { slug: string; name: string; posts: Post[] }>();
  for (const post of getPosts()) {
    for (const name of post[type]) {
      const slug = taxonomySlug(name);
      const entry = entries.get(slug) ?? { slug, name, posts: [] };
      if (!entry.posts.includes(post)) entry.posts.push(post);
      entries.set(slug, entry);
    }
  }
  return Array.from(entries.values()).sort((a, b) => a.name.localeCompare(b.name));
}
