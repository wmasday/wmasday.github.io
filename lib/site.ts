export const site = {
  name: "Muhammad Hidayat",
  handle: "wmasday",
  url: "https://nauth.web.id",
  description: "Muhammad Hidayat is an application security engineer and penetration tester based in Tangerang, Indonesia.",
  email: "withmasday@gmail.com",
  github: "https://github.com/wmasday",
  linkedin: "https://www.linkedin.com/in/wmasday/",
};

export const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" })
    .format(new Date(date));

export const postPath = (slug: string) => `/posts/${slug}/`;
