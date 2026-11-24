import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { Markdown } from "@/components/markdown";
import { getPosts, taxonomyPath } from "@/lib/posts";
import { dateLabel, postPath, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPosts().find((item) => item.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: postPath(post.slug) },
    openGraph: {
      title: post.title, description: post.excerpt, type: "article", url: postPath(post.slug),
      publishedTime: post.date, authors: [site.name], tags: post.tags,
      images: post.image ? [{ url: post.image.path, alt: post.image.alt }] : undefined,
    },
  };
}

function getHeadings(markdown: string) {
  const headings: { id: string; title: string; depth: number }[] = [];
  const slugger = new GithubSlugger();
  visit(unified().use(remarkParse).parse(markdown), "heading", (heading) => {
    const title = toString(heading, { includeImageAlt: false });
    const id = slugger.slug(title);
    if (heading.depth === 2 || heading.depth === 3) headings.push({ title, depth: heading.depth, id });
  });
  return headings;
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const posts = getPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  const headings = getHeadings(post.body);
  const related = posts.filter((item) => item.slug !== slug).slice(0, 2);

  return (
    <div className="shell inner-page">
      <article className="article">
        <header className="article-heading">
          <Link className="text-link" href="/archives/">All writing</Link>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <time dateTime={post.date}>{dateLabel(post.date)}</time>
            <span>{post.minutes} min read</span>
            {post.categories.map((category) => <Link href={taxonomyPath("categories", category)} key={category}>{category}</Link>)}
          </div>
        </header>
        {post.image && (
          <figure className="article-cover">
            <img src={post.image.path} alt={post.image.alt} />
          </figure>
        )}
        <div className={`reading-layout article-layout${headings.length ? "" : " no-contents"}`}>
          {headings.length > 0 && (
            <nav className="contents" aria-label="Article contents">
              <p>On this page</p>
              <ul>{headings.map(({ id, title, depth }) => <li className={depth === 3 ? "toc-child" : undefined} key={id}><a href={`#${id}`}>{title}</a></li>)}</ul>
            </nav>
          )}
          <div>
            <div className="prose"><Markdown>{post.body}</Markdown></div>
            {post.tags.length > 0 && (
              <ul className="tags article-tags" aria-label="Article tags">
                {post.tags.map((tag) => <li key={tag}><Link href={taxonomyPath("tags", tag)}>{tag}</Link></li>)}
              </ul>
            )}
          </div>
        </div>
      </article>
      {related.length > 0 && <section className="more-writing"><h2>More writing</h2>{related.map((item) => <Link className="text-link" href={postPath(item.slug)} key={item.slug}>{item.title}</Link>)}</section>}
    </div>
  );
}
