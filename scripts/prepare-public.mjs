import { copyFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const files = [
  ".nojekyll",
  "CNAME",
  "CV.pdf",
];

await mkdir("public", { recursive: true });
await Promise.all(files.map((file) => copyFile(file, join("public", file))));
