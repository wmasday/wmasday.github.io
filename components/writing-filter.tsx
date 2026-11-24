"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { PostSummary } from "@/lib/posts";
import { PostList } from "./post-list";

export function WritingFilter({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = posts.filter((post) => {
    const haystack = [post.title, post.excerpt, ...post.categories, ...post.tags].join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });

  return (
    <div>
      <label className="search-field">
        <Search size={18} aria-hidden="true" />
        <span className="visually-hidden">Search articles</span>
        <input type="search" placeholder="Search articles" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p className="visually-hidden" role="status">{matches.length} {matches.length === 1 ? "article" : "articles"} found</p>
      {matches.length > 0 ? <PostList posts={matches} /> : <p className="empty-results muted">No articles match your search.</p>}
    </div>
  );
}
