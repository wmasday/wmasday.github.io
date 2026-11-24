import type { Metadata } from "next";
import Link from "next/link";
import { CubeBackground } from "@/components/cube-background";
import { Portrait } from "@/components/portrait";
import { PostList } from "@/components/post-list";
import { getPosts, postSummary } from "@/lib/posts";

export const metadata: Metadata = { alternates: { canonical: "/", types: { "application/atom+xml": "/feed.xml" } } };

export default function Home() {
  const posts = getPosts().slice().sort((a, b) => Number(b.pinned) - Number(a.pinned));
  return (
    <>
      <CubeBackground />
      <div className="shell">
        <section className="home-hero-container" aria-labelledby="home-title">
          <div className="home-hero">
          <div className="hero-copy">
            <h1 id="home-title">Muhammad<br />Hidayat<span>.</span></h1>
            <p className="hero-role">Application Security Engineer</p>
            <p className="hero-description">Breaking complex web applications, engineering resilient backends, and researching verifiable data integrity in malware analysis.</p>
            <div className="actions">
              <Link className="button button-primary" href="/about/">
                Explore my work <span className="button-arrow" aria-hidden="true">→</span>
              </Link>
              <a className="button button-secondary" href="/CV.pdf" target="_blank" rel="noopener noreferrer">
                Hit Me!
              </a>
            </div>
          </div>
          <Portrait eager />
        </div>
      </section>
      <section id="articles-section" className="section-block home-writing" aria-labelledby="writing-heading">
        <div className="section-heading">
          <h2 id="writing-heading">Writing</h2>
          <Link className="text-link" href="/archives/">All articles</Link>
        </div>
        <PostList posts={posts.slice(0, 4).map(postSummary)} heading="h3" />
      </section>
      </div>
    </>
  );
}
