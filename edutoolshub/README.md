# EduToolsHub

Free, smart tools for students and teachers — GPA calculator, attendance sheets,
and more — paired with a Sanity-powered blog for SEO and content marketing.

Built with **React 19 + Vite 8 + Tailwind CSS 4 + React Router DOM 7**.

## Project layout

This repo is part of a two-folder setup:

```
NEXORA DEV/edutoolshub/
├── edutoolshub/      ← this folder: the Vite frontend (you are here)
└── studio/           ← Sanity Studio (CMS) — runs independently on :3333
```

Content is authored in `studio/` and consumed at runtime by `edutoolshub/` via
the Sanity Content Lake.

## Local setup

```bash
# 1. Install deps
npm install

# 2. Configure environment
copy .env.example .env.local
# Edit .env.local and paste your Sanity projectId + dataset.
# (See ../studio/README.md to create a Sanity project first.)

# 3. Start the dev server
npm run dev    # http://localhost:5173
```

You'll also need to be running the Studio in a second terminal if you want
to author content:

```bash
cd ../studio && npm run dev   # http://localhost:3333
```

## NPM scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Plain Vite build → `dist/` (fast; for previewing only) |
| `npm run build:prerender` | **Production build**: Vite build + headless Chromium prerender of every static and blog route + sitemap.xml + robots.txt + SPA fallback config |
| `npm run prerender` | Re-runs only the prerender step (assumes `dist/` already exists) |
| `npm run preview` | Local preview of the built `dist/` folder |
| `npm run lint` | ESLint over the whole repo |

## Architecture

### Routing

- `/` — landing page (Hero + Tools + How It Works + Why Use + Latest Insights slider)
- `/tools` — full tools catalogue
- `/tools/gpa-calculator` — GPA tool
- `/tools/attendance-sheet` — Attendance generator
- `/blog` — blog index (lists all published Sanity posts)
- `/blog/:slug` — single blog post (Portable Text + dynamic SEO + JSON-LD)

### Blog data flow

```
Sanity Studio (../studio/)
        ↓
Sanity Content Lake
        ↓
@sanity/client (src/sanity/client.js)
        ↓
GROQ queries (src/sanity/queries.js)
        ↓
useSanityQuery hook (src/sanity/useSanityQuery.js)
        ↓
React components (BlogCard, BlogPost, LatestInsights)
```

### SEO strategy

This is a single-page app, but every blog page still needs to be indexable
and shareable on social platforms.

- **Dynamic `<head>` tags** via `react-helmet-async` (`<HelmetProvider>` in
  `src/main.jsx`) — every page sets its own `<title>`, description, canonical,
  full OpenGraph and Twitter Card tags, and JSON-LD structured data.
- **Build-time prerendering** (`scripts/prerender.mjs`) — Chromium renders
  every route and saves the captured HTML to `dist/<route>/index.html`. This
  guarantees crawlers that don't run JavaScript (Twitter, Facebook,
  LinkedIn, Slack) see the correct meta tags in the initial response.
- **Sitemap + robots.txt** are generated automatically by the prerender
  script using the live list of published blog slugs.
- **JSON-LD `BlogPosting`** is emitted on every article — gives Google
  eligibility for rich search results.

## Deploying

After `npm run build:prerender`, the `dist/` folder is fully static and can
be deployed to any host. The script also generates:

- `dist/sitemap.xml` — listed in `robots.txt`; submit it to Search Console
- `dist/robots.txt` — points to the sitemap
- `dist/_redirects` — SPA fallback for **Netlify** and **Cloudflare Pages**
- `vercel.json` (root) — equivalent SPA fallback for **Vercel**

### Vercel

```bash
vercel --prod
# Build command: npm run build:prerender
# Output dir:    dist
```

You also need to set `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` as
Vercel project env vars. **Blog posts load from Sanity at runtime** — you do
not need to redeploy when publishing a new article. The dynamic `/api/sitemap`
handler keeps `sitemap.xml` up to date automatically.

### Netlify / Cloudflare Pages

```
Build command: npm run build:prerender
Publish dir:   dist
```

### Adding new origins to Sanity CORS

After deploying, Sanity will reject requests from your production domain
until you whitelist it:

```bash
cd ../studio
npx sanity cors add https://edutoolshub.com --no-credentials
npx sanity cors add https://www.edutoolshub.com --no-credentials
# Vercel preview URLs:
npx sanity cors add "https://*.vercel.app" --no-credentials
```

## Folder map

```
src/
├── components/
│   ├── blog/
│   │   ├── BlogCard.jsx              ← grid card for /blog
│   │   ├── BlogCardSkeleton.jsx
│   │   └── InsightSlide.jsx          ← cinematic slide for homepage carousel
│   ├── icons/ToolIcons.jsx
│   ├── ui/Button.jsx
│   ├── Hero.jsx
│   ├── HowItWorks.jsx
│   ├── LatestInsights.jsx            ← Embla carousel section
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ToolCard.jsx
│   ├── ToolsSection.jsx
│   ├── WhyUse.jsx
│   └── tools/                        ← GPA, Attendance, etc.
├── data/tools.js
├── layouts/
│   ├── MainLayout.jsx
│   └── ToolPageLayout.jsx
├── pages/
│   ├── Home.jsx
│   ├── Tools.jsx
│   ├── Blog.jsx
│   ├── BlogPost.jsx                  ← /blog/:slug
│   ├── GpaCalculatorPage.jsx
│   └── AttendancePage.jsx
├── sanity/
│   ├── client.js
│   ├── image.js                      ← @sanity/image-url helper
│   ├── queries.js                    ← all GROQ queries
│   ├── useSanityQuery.js             ← fetch hook
│   ├── portableTextComponents.jsx    ← typography for article body
│   └── readingTime.js                ← reading-time estimator
├── services/                         ← non-blog domain logic
├── utils/
├── App.jsx
├── main.jsx                          ← wraps App in <HelmetProvider>
└── index.css                         ← Tailwind 4 @theme tokens

scripts/
└── prerender.mjs                     ← Vite preview + puppeteer + sitemap
```
