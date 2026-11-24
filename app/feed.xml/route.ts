import { getPosts } from "@/lib/posts";
import { postPath, site } from "@/lib/site";

export const dynamic = "force-static";

const xml = (value: string) => value.replace(/[<>&"']/g, (character) => ({
  "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
})[character] ?? character);

export function GET() {
  const posts = getPosts();
  const entries = posts.map((post) => {
    const url = xml(site.url + postPath(post.slug));
    return `<entry>
  <title>${xml(post.title)}</title>
  <link href="${url}"/>
  <id>${url}</id>
  <published>${post.date}</published>
  <updated>${post.date}</updated>
  <summary>${xml(post.excerpt)}</summary>
  ${[...post.categories, ...post.tags].map((name) => `<category term="${xml(name)}"/>`).join("")}
</entry>`;
  });

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${xml(site.name)}</title>
  <id>${site.url}/</id>
  <link href="${site.url}/"/>
  <link href="${site.url}/feed.xml" rel="self"/>
  <updated>${posts[0]?.date ?? "1970-01-01T00:00:00.000Z"}</updated>
  <author><name>${xml(site.name)}</name></author>
  ${entries.join("\n")}
</feed>`, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
