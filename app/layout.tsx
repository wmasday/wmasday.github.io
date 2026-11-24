import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Application Security Engineer`, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { types: { "application/atom+xml": "/feed.xml" } },
  openGraph: { type: "website", siteName: site.handle, images: "/assets/img/muhammad-square.jpg" },
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#080a0d" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
