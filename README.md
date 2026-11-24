# wmasday.github.io

Personal cybersecurity portfolio, technical research, and write-ups by **Muhammad Hidayat**, statically exported and deployed to GitHub Pages at [nauth.web.id](https://nauth.web.id).

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, static HTML export)
- **Library**: React 19 & TypeScript
- **Styling**: Modern dark obsidian theme with responsive subpixel typography
- **Interactive Visuals**:
  - 3D Isometric Compound Wireframe with 3-Pass chromatic dispersion (RGB split glitch)
  - Floating Monochrome ASCII Glitch Matrix Portrait (BiRefNet segmentation)
- **Deployment**: GitHub Pages with custom domain (`nauth.web.id`) via GitHub Actions

---

## Local Development

Requires Node.js `>=22`.

```sh
# Install dependencies
npm ci

# Start development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Build & Verification

```sh
# Build static site export (outputs to out/)
npm run build

# Run local link and integrity check
npm run check
```

---

## Repository Structure

```text
├── app/                  # Next.js App Router pages and global layouts
├── components/           # Reusable UI & canvas graphics components
├── content/
│   ├── posts/            # Markdown blog articles with YAML front matter
│   └── profile.json      # Structured profile bio, experience, and research data
├── lib/                  # Markdown parsing and site configuration utilities
├── public/               # Static assets, icons, and illustrations
├── scripts/              # Prebuild staging and export verification scripts
├── CNAME                 # Custom domain configuration (nauth.web.id)
├── CV.pdf                # Personal resume PDF
├── next.config.ts        # Next.js export and build configuration
└── tsconfig.json         # TypeScript configuration
```

---

## Deployment to GitHub Pages

The website deploys automatically on every push to `main` via GitHub Actions (`.github/workflows/pages-deploy.yml`).

1. `npm run build` compiles the entire site to static HTML/CSS/JS in `out/`.
2. `scripts/prepare-public.mjs` stages `CNAME`, `.nojekyll`, and `CV.pdf`.
3. `scripts/check-export.mjs` verifies all routes, local anchors, and asset references.
4. GitHub Pages deploys the bundle directly to [nauth.web.id](https://nauth.web.id).
