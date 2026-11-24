import { copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const files = [
  ".nojekyll",
  "CNAME",
  "CV.pdf",
  "googlee546bec62c39cfc0.html",
];

await mkdir("public", { recursive: true });
await Promise.all(files.map((file) => copyFile(file, join("public", file))));
