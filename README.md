# EduToolsHub

Free, smart tools for students and teachers — GPA calculator, attendance sheets,
and more — paired with a Sanity-powered blog for SEO and content marketing.

Built with **Next.js 16 (App Router) + React 19 + Tailwind CSS 4**.

## Project layout

```
edutoolshub/          ← repo root: Next.js frontend (you are here)
└── studio/           ← Sanity Studio (CMS) — runs independently on :3333
```

Content is authored in `studio/` and consumed by the Next.js app via the Sanity Content Lake.

## Local setup

```bash
npm install
copy .env.example .env.local
# Fill in NEXT_PUBLIC_* and server-only vars (see .env.example)
npm run dev    # http://localhost:3000
```

Studio (optional, for authoring):

```bash
cd studio && npm run dev   # http://localhost:3333
```

## NPM scripts

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build → `.next/` |
| `npm run start` | Serve production build locally |
| `npm run seed:universities` | Seed Supabase universities table |
| `npm run lint` | ESLint |

## Architecture

- **Routing:** `src/app/` (App Router) — file-based routes
- **Page UI:** `src/views/` — tool/marketing page components imported by routes
- **Blog:** Server Components fetch Sanity data; ISR `revalidate: 120`
- **Universities:** SSG via `generateStaticParams` + ISR `revalidate: 86400`
- **SEO:** Next.js `metadata` API + `src/app/sitemap.js` + `src/app/robots.js`
- **API:** `src/app/api/posts`, `src/app/api/admin/refresh-universities`

## Environment variables

See `.env.example`. Client vars must use the `NEXT_PUBLIC_` prefix:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` / `CRON_SECRET` (server only)

## Deploying (Vercel)

- **Framework:** Next.js
- **Root directory:** leave empty (repo root)
- **Build command:** `npm run build` (or leave blank)
- **Output directory:** leave empty
- Set env vars in Vercel dashboard (see `.env.example`)
- `vercel.json` only defines the monthly universities refresh cron

### Sanity CORS (production domain)

```bash
cd studio
npx sanity cors add https://edutoolshub.com --no-credentials
npx sanity cors add https://www.edutoolshub.com --no-credentials
npx sanity cors add "https://*.vercel.app" --no-credentials
```

## Folder map

```
src/
├── app/                    ← routes, layouts, API, sitemap
├── views/                  ← page-level components (tools, about, etc.)
├── components/             ← shared UI
├── lib/                    ← server helpers (sanity, supabase, metadata)
├── sanity/                 ← client, queries, portable text
├── services/               ← GPA, universities logic
└── data/                   ← tools catalog, SEO copy
```
