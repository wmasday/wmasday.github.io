import Link from "next/link";
import { ChevronRight, Pin } from "lucide-react";
import type { PostSummary } from "@/lib/posts";
import { dateLabel, postPath } from "@/lib/site";

export function PostList({ posts, heading: Heading = "h2" }: { posts: PostSummary[]; heading?: "h2" | "h3" }) {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link className="post-row" href={postPath(post.slug)}>
            <time dateTime={post.date}>{dateLabel(post.date)}</time>
            <div className="post-row-copy">
              <Heading>{post.title}</Heading>
              <p>{post.categories.join(" · ")}{post.categories.length > 0 && " / "}{post.minutes} min read</p>
            </div>
            <span className="post-row-end">
              {post.pinned && <Pin size={15} aria-label="Pinned" />}
              <ChevronRight size={17} aria-hidden="true" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
