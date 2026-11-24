"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail, Rss } from "lucide-react";
import { site } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/archives/", label: "Writing" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isWriting = /^\/(archives|posts|categories|tags)(\/|$)/.test(pathname);
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClass = `site-header ${isHome ? (scrolled ? "header-scrolled" : "header-transparent") : "header-scrolled"}`;

  return (
    <header className={headerClass}>
      <div className="shell header-inner">
        <Link className="wordmark" href="/" aria-label="Wmasday home">
          <span>wmasday<span className="wordmark-dot">.</span></span>
        </Link>
        <nav aria-label="Main navigation" className="main-nav">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={href === pathname || (label === "Writing" && isWriting) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <p>
          {site.name}
          <span className="footer-separator" aria-hidden="true"> / </span>
          <span className="footer-handle">wmasday</span>
        </p>
        <nav aria-label="Contact and feeds">
          <a href={site.github} aria-label="GitHub"><Github size={18} /></a>
          <a href={site.linkedin} aria-label="LinkedIn"><Linkedin size={18} /></a>
          <a href={`mailto:${site.email}`} aria-label="Email"><Mail size={18} /></a>
          <a href="/feed.xml" aria-label="RSS feed"><Rss size={18} /></a>
        </nav>
      </div>
    </footer>
  );
}
