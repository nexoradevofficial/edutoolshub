import { SLUG_MATCH_FILTER, SLUG_NORMALIZE_GROQ } from "./normalizeSlug.js";

const POST_CARD_PROJECTION = `
  _id,
  title,
  "slug": ${SLUG_NORMALIZE_GROQ},
  mainImage{
    ...,
    asset->{
      _id,
      url,
      metadata{ lqip, dimensions }
    },
    alt
  },
  excerpt,
  publishedAt
`;

const POST_FULL_PROJECTION = `
  _id,
  title,
  "slug": ${SLUG_NORMALIZE_GROQ},
  mainImage{
    ...,
    asset->{
      _id,
      url,
      metadata{ lqip, dimensions }
    },
    alt,
    caption
  },
  excerpt,
  body[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        _id,
        url,
        metadata{ lqip, dimensions }
      }
    },
    markDefs[]{ ... }
  },
  publishedAt,
  seoTitle,
  metaDescription
`;

export const recentPostsQuery = `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc)[0...5]{${POST_CARD_PROJECTION}}`;

export const allPostsQuery = `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc){${POST_CARD_PROJECTION}}`;

export const postBySlugQuery = `*[_type == "post" && ${SLUG_MATCH_FILTER} && defined(publishedAt) && publishedAt <= now()][0]{${POST_FULL_PROJECTION}}`;

export const allPostSlugsQuery = `*[_type == "post" && defined(slug.current)]{"slug": ${SLUG_NORMALIZE_GROQ}}.slug`;
