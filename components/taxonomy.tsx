import Link from "next/link";
import { notFound } from "next/navigation";
import { PostList } from "@/components/post-list";
import { postSummary, taxonomyEntries, taxonomyPath, type Taxonomy } from "@/lib/posts";

export function TaxonomyIndex({ type }: { type: Taxonomy }) {
  const title = type === "tags" ? "Tags" : "Categories";

  return (
    <div className="shell inner-page">
      <header className="page-heading">
        <Link href="/archives/" className="text-link">Writing</Link>
        <h1>{title}</h1>
      </header>
      <ul className="index-list">
        {taxonomyEntries(type).map(({ slug, name, posts }) => (
          <li key={slug}><Link href={taxonomyPath(type, name)}><span>{name}</span><span className="muted">{posts.length} {posts.length === 1 ? "article" : "articles"}</span></Link></li>
        ))}
      </ul>
    </div>
  );
}

export function TaxonomyPage({ type, slug }: { type: Taxonomy; slug: string }) {
  const entry = taxonomyEntries(type).find((item) => item.slug === slug);
  if (!entry) notFound();

  return (
    <div className="shell inner-page">
      <header className="page-heading">
        <Link href={`/${type}/`} className="text-link">{type === "tags" ? "Tags" : "Categories"}</Link>
        <h1>{entry.name}</h1>
      </header>
      <PostList posts={entry.posts.map(postSummary)} />
    </div>
  );
}
