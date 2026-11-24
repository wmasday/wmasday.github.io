import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Application Security Engineer`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Muhammad Hidayat",
    "wmasday",
    "Application Security Engineer",
    "Penetration Tester",
    "Cybersecurity",
    "Offensive Security",
    "Web Exploitation",
    "CTF",
    "Malware Analysis",
    "Blockchain Data Integrity",
    "Smart Contract Security",
    "Indonesia",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: {
    canonical: "/",
    types: { "application/atom+xml": "/feed.xml" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Application Security Engineer`,
    description: site.description,
    images: [
      {
        url: "/assets/img/muhammad-square.jpg",
        width: 600,
        height: 600,
        alt: `${site.name} — Application Security Engineer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Application Security Engineer`,
    description: site.description,
    images: ["/assets/img/muhammad-square.jpg"],
    creator: `@${site.handle}`,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "e546bec62c39cfc0",
  },
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#080a0d" };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}/#person`,
      name: site.name,
      alternateName: site.handle,
      url: site.url,
      image: `${site.url}/assets/img/muhammad-square.jpg`,
      jobTitle: "Application Security Engineer",
      worksFor: {
        "@type": "Organization",
        name: "MPN Indonesia",
      },
      sameAs: [
        site.github,
        site.linkedin,
      ],
      knowsAbout: [
        "Web Application Security",
        "Penetration Testing",
        "Malware Analysis",
        "Blockchain Data Integrity",
        "Smart Contract Security",
        "Backend Architecture",
      ],
      description: site.description,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: {
        "@id": `${site.url}/#person`,
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
