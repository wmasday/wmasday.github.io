import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { load } from "cheerio";

const output = resolve("out");
const origin = "https://nauth.web.id";
const read = (file) => readFileSync(join(output, file));
const required = [
  "index.html", "about/index.html", "archives/index.html",
  "categories/index.html", "tags/index.html", "404.html", "feed.xml",
  "sitemap.xml", "robots.txt", ".nojekyll", "CNAME", "sw.min.js", "CV.pdf",
  "googlee546bec62c39cfc0.html", "site.webmanifest", "favicon.ico", "favicon.svg",
  "icon-48.png", "icon-96.png", "icon-192.png", "icon-512.png", "apple-touch-icon.png",
];

for (const file of required) assert.ok(existsSync(join(output, file)), `Missing export: ${file}`);
for (const filename of readdirSync(join("content", "posts"))) {
  const post = /^\d{4}-\d{2}-\d{2}-(.+)\.md$/.exec(filename);
  if (post) assert.ok(existsSync(join(output, "posts", post[1], "index.html")), `Missing post: ${filename}`);
}
assert.deepEqual(read("CV.pdf"), readFileSync("CV.pdf"), "Export must contain the original CV.pdf");
assert.deepEqual(read("CNAME"), readFileSync("CNAME"), "Export must preserve the configured CNAME");
assert.deepEqual(read("googlee546bec62c39cfc0.html"), readFileSync("googlee546bec62c39cfc0.html"), "Export must contain the Google Search Console verification file");
assert.ok(!existsSync(join(output, "CV.md")), "Source CV.md should stay outside the public export");

const pages = new Map();
for (const file of readdirSync(output, { recursive: true })) {
  if (!file.endsWith(".html") || file.startsWith("_") || file.includes(`${sep}_`)) continue;
  const path = join(output, file);
  pages.set(path, load(readFileSync(path, "utf8")));
}

let checkedLinks = 0;
const problems = [];
for (const [file, $] of pages) {
  const path = "/" + relative(output, file).split(sep).join("/").replace(/(^|\/)index\.html$/, "$1");
  $("a[href], link[href], script[src], img[src]").each((_, element) => {
    const href = $(element).attr("href") ?? $(element).attr("src");
    const url = new URL(href, origin + path);
    if (url.origin !== origin) return;

    const target = join(output, decodeURIComponent(url.pathname));
    const exists = existsSync(target);
    const entry = exists && statSync(target).isDirectory() ? join(target, "index.html") : target;
    if (!existsSync(entry)) {
      problems.push(`${path} links to missing ${href}`);
    } else if (url.hash && pages.has(entry)) {
      const targetPage = pages.get(entry);
      const id = decodeURIComponent(url.hash.slice(1));
      if (!targetPage("[id]").toArray().some((node) => targetPage(node).attr("id") === id)) {
        problems.push(`${path} links to missing anchor ${href}`);
      }
    }
    checkedLinks++;
  });
}

assert.equal(problems.length, 0, problems.join("\n"));
console.log(`Checked ${pages.size} HTML pages, ${checkedLinks} local references, and the exported PDF and CNAME.`);
