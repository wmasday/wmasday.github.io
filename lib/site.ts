export const site = {
  name: "Muhammad Hidayat",
  handle: "wmasday",
  url: "https://nauth.web.id",
  description: "Muhammad Hidayat (wmasday) — Application Security Engineer and penetration tester specializing in offensive web exploitation, resilient backend architecture, and verifiable malware telemetry.",
  email: "withmasday@gmail.com",
  github: "https://github.com/wmasday",
  linkedin: "https://www.linkedin.com/in/wmasday/",
};

export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })
    .format(new Date(date));

export const postPath = (slug: string) => `/posts/${slug}/`;
