import type { Metadata } from "next";
import Link from "next/link";
import { WritingFilter } from "@/components/writing-filter";
import { getPosts, postSummary } from "@/lib/posts";

export const metadata: Metadata = { title: "Writing", alternates: { canonical: "/archives/" } };

export default function Archives() {
  return (
    <div className="shell inner-page">
      <header className="page-heading">
        <h1>Writing</h1>
        <p>Notes on application security, software engineering, and CTFs.</p>
        <nav className="taxonomy-nav" aria-label="Browse writing">
          <Link href="/categories/" className="button">Categories</Link>
          <Link href="/tags/" className="button">Tags</Link>
        </nav>
      </header>
      <WritingFilter posts={getPosts().map(postSummary)} />
    </div>
  );
}
