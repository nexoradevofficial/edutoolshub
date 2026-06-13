# EduToolsHub Studio

Sanity Studio for managing blog content on **edutoolshub.com**.

This Studio is a separate app from the Next.js frontend — it runs on its own port
(`http://localhost:3333` by default) and writes content to the Sanity Content Lake.
The Next.js app fetches that content at runtime.

## First-time setup (do this once)

```bash
# 1. From this folder, install deps
npm install

# 2. Log in to Sanity (opens a browser tab — sign up or sign in)
npx sanity login

# 3. Attach this Studio to a Sanity project.
#    Pick "Create new project", name it (e.g. "EduToolsHub Blog"),
#    accept the default "production" dataset (public is fine for a blog).
npx sanity init --env

#    The command above writes your projectId/dataset into `.env`.
#    Rename / copy that file to `.env.local` so it is git-ignored:
copy .env .env.local

# 4. Start the Studio
npm run dev
```

You should now see the Studio at `http://localhost:3333`.

Click **Post → Create new** and fill in title, slug (click *Generate*), main
image (drag & drop), excerpt, and body. Hit **Publish**.

## Daily use

```bash
npm run dev      # local Studio at http://localhost:3333
npm run build    # production build (rarely needed)
npm run deploy   # deploys Studio to <project>.sanity.studio so the rest of your team can use it
```

## Where the content goes

Once a post is **published** in this Studio, the Next.js frontend at
`../` (repo root) reads it via `@sanity/client` using the same `projectId`
and `dataset`. Make sure both projects point at the same project — see
`../.env.example`.

## Schema

A single `post` document type lives in `schemas/post.js` with three field
groups:

- **Content** — title, slug, excerpt, body (Portable Text), publishedAt
- **Media** — mainImage (hotspot enabled) with required alt text
- **SEO** — seoTitle (60 char max), metaDescription (160 char max)
