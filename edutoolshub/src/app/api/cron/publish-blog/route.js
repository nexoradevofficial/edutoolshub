import axios from "axios";
import { createClient } from "@sanity/client";

/** Vercel Cron schedule: daily at 8:00 AM UTC — configured in vercel.json */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";

const BLOG_PROMPT = `Generate a 1000 -1300 words SEO blog about a random trending free educational tools for teachers and students or educational topic.
Return ONLY valid JSON (no markdown, no extra text):
{
  "title": "SEO optimized title (50-60 chars, no special chars)",
  "slug": "url-friendly-slug-with-hyphens-only",
  "metaDescription": "Meta description (150-160 chars)",
  "keyword": "main keyword phrase",
  "content": "Full blog content with H2 and H3 headings using markdown format"
}`;

const REPAIR_FIELDS_PROMPT = `Fix the blog title and slug. Return ONLY valid JSON (no markdown, no extra text):
{
  "title": "SEO optimized title (50-60 chars, no special chars)",
  "slug": "url-friendly-slug-with-hyphens-only"
}`;

const EDUCATION_TOPICS = [
  "AI-powered study tools for high school students",
  "Free digital whiteboards for remote teaching",
  "Gamification strategies to boost classroom engagement",
  "Open educational resources for STEM teachers",
  "Time management apps every college student needs",
  "Inclusive classroom technology for special education",
  "Building literacy skills with free reading platforms",
  "Collaborative project tools for group assignments",
  "Formative assessment apps for K-12 teachers",
  "Career readiness resources for vocational students",
];

const PLACEHOLDER_VALUES = new Set(["---", "--", "-", "…", "..."]);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isAuthorized(request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const headerSecret = request.headers.get("x-cron-secret");
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret");

  if (cronSecret) {
    return bearer === cronSecret || headerSecret === cronSecret || querySecret === cronSecret;
  }

  return process.env.ALLOW_OPEN_ADMIN_REFRESH === "true";
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSanityWriteClient() {
  const projectId =
    process.env.SANITY_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_STUDIO_PROJECT_ID;

  const dataset =
    process.env.SANITY_DATASET ||
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_STUDIO_DATASET ||
    "production";

  if (!projectId) {
    throw new Error("Missing required environment variable: SANITY_PROJECT_ID");
  }

  return createClient({
    projectId,
    dataset,
    token: requireEnv("SANITY_TOKEN"),
    apiVersion: "2025-01-01",
    useCdn: false,
  });
}

function generateKey() {
  return Math.random().toString(36).slice(2, 12);
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function truncate(text, maxLength) {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 3).trim()}...`;
}

function isPlaceholderValue(value) {
  if (typeof value !== "string") return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (PLACEHOLDER_VALUES.has(trimmed)) return true;
  if (/^[-–—_\s.]+$/.test(trimmed)) return true;
  return false;
}

function isValidTitle(title) {
  if (isPlaceholderValue(title)) return false;
  const length = title.trim().length;
  return length >= 10 && length <= 100;
}

function isValidSlug(slug) {
  if (isPlaceholderValue(slug)) return false;
  const normalized = slug.trim().toLowerCase();
  return normalized.length >= 3 && normalized.length <= 96 && SLUG_PATTERN.test(normalized);
}

function sanitizeTitle(title) {
  return title
    .replace(/[^\w\s:,-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractJsonFromResponse(rawContent) {
  const trimmed = rawContent.trim();

  try {
    return JSON.parse(trimmed);
  } catch (directError) {
    const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fencedMatch) {
      return JSON.parse(fencedMatch[1].trim());
    }

    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }

    throw directError;
  }
}

function extractTitleFromContent(content) {
  if (typeof content !== "string") return "";

  const h2Match = content.match(/^##\s+(.+)$/m);
  if (h2Match?.[1]) return h2Match[1].trim();

  const h3Match = content.match(/^###\s+(.+)$/m);
  if (h3Match?.[1]) return h3Match[1].trim();

  const firstLine = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#"));

  return firstLine || "";
}

async function axiosWithRetry(config, label, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await axios(config);
    } catch (err) {
      const status = err.response?.status;
      const retryAfterHeader = err.response?.headers?.["retry-after"];
      const isRateLimited = status === 429;
      const isRetryable = isRateLimited || status >= 500;

      console.error(`[publish-blog] ${label} failed (attempt ${attempt + 1}/${maxRetries + 1}):`, {
        status,
        message: err.message,
        retryAfter: retryAfterHeader ?? null,
      });

      if (!isRetryable || attempt === maxRetries) {
        throw err;
      }

      const retryAfterMs = retryAfterHeader
        ? Number.parseInt(retryAfterHeader, 10) * 1000
        : Math.min(2 ** attempt * 1000, 8000);

      await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
    }
  }
}

function pickDailyTopic() {
  const dayIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  return EDUCATION_TOPICS[dayIndex % EDUCATION_TOPICS.length];
}

async function callMistral(messages, label) {
  const apiKey = requireEnv("MISTRAL_API_KEY");

  const response = await axiosWithRetry(
    {
      method: "POST",
      url: MISTRAL_API_URL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      data: {
        model: "mistral-tiny",
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      },
      timeout: 45000,
    },
    label
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Mistral API returned an empty or invalid response.");
  }

  return content;
}

async function repairTitleAndSlug({ title, slug, keyword, content }) {
  const repairContext = [
    `Current title: ${title || "(missing)"}`,
    `Current slug: ${slug || "(missing)"}`,
    `Keyword: ${keyword || "(missing)"}`,
    `Content excerpt: ${typeof content === "string" ? content.slice(0, 600) : "(missing)"}`,
  ].join("\n");

  try {
    const raw = await callMistral(
      [
        {
          role: "user",
          content: `${REPAIR_FIELDS_PROMPT}\n\n${repairContext}`,
        },
      ],
      "Mistral field repair"
    );

    const repaired = extractJsonFromResponse(raw);
    return {
      title: typeof repaired.title === "string" ? repaired.title.trim() : title,
      slug: typeof repaired.slug === "string" ? repaired.slug.trim().toLowerCase() : slug,
    };
  } catch (err) {
    console.error("[publish-blog] Failed to repair title/slug via Mistral:", err.message);
    return { title, slug };
  }
}

function applyFieldFallbacks(parsed) {
  let title = typeof parsed.title === "string" ? sanitizeTitle(parsed.title) : "";
  let slug = typeof parsed.slug === "string" ? parsed.slug.trim().toLowerCase() : "";
  const keyword = typeof parsed.keyword === "string" ? parsed.keyword.trim() : "";
  const content = typeof parsed.content === "string" ? parsed.content.trim() : "";

  if (!isValidTitle(title)) {
    const fromContent = sanitizeTitle(extractTitleFromContent(content));
    if (isValidTitle(fromContent)) {
      title = fromContent;
    } else if (keyword) {
      title = sanitizeTitle(`${keyword}: A Complete Guide for Teachers and Students`);
    } else {
      title = "Free Educational Tools Guide for Teachers and Students";
    }
  }

  title = truncate(title, 100);

  if (!isValidSlug(slug)) {
    slug = slugify(title);
  }

  if (!isValidSlug(slug) && keyword) {
    slug = slugify(keyword);
  }

  if (!isValidSlug(slug)) {
    slug = slugify("free-educational-tools-guide");
  }

  return { title, slug, keyword, content };
}

async function validateAndRepairBlogContent(parsed) {
  const metaDescription =
    typeof parsed.metaDescription === "string"
      ? truncate(parsed.metaDescription.trim(), 160)
      : "";
  const keyword = typeof parsed.keyword === "string" ? parsed.keyword.trim() : "";
  const content = typeof parsed.content === "string" ? parsed.content.trim() : "";

  if (!content) {
    throw new Error("Mistral JSON response is missing blog content.");
  }

  let { title, slug } = applyFieldFallbacks(parsed);

  if (!isValidTitle(title) || !isValidSlug(slug)) {
    const repaired = await repairTitleAndSlug({ title, slug, keyword, content });
    title = typeof repaired.title === "string" ? sanitizeTitle(repaired.title) : title;
    slug = typeof repaired.slug === "string" ? repaired.slug.trim().toLowerCase() : slug;
    ({ title, slug } = applyFieldFallbacks({ title, slug, keyword, content }));
  }

  if (!isValidTitle(title) || !isValidSlug(slug)) {
    throw new Error("Unable to produce a valid title and slug for blog publishing.");
  }

  const body = markdownToPortableText(content);
  if (body.length === 0) {
    throw new Error("Could not convert blog content to Portable Text blocks.");
  }

  const resolvedMeta = metaDescription || truncate(extractTitleFromContent(content) || title, 160);
  const excerptSource = resolvedMeta || title;
  const excerpt = truncate(excerptSource, 200);
  const normalizedExcerpt =
    excerpt.length >= 40 ? excerpt : truncate(`${title}. ${resolvedMeta}`, 200);

  return {
    title: truncate(title, 100),
    slug,
    metaDescription: resolvedMeta,
    keyword,
    excerpt: normalizedExcerpt,
    body,
  };
}

function parseMistralJson(rawContent) {
  try {
    const parsed = extractJsonFromResponse(rawContent);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Mistral JSON response must be an object.");
    }
    return parsed;
  } catch (err) {
    console.error("[publish-blog] JSON parse error:", err.message);
    console.error("[publish-blog] Raw Mistral response preview:", rawContent.slice(0, 500));
    throw err;
  }
}

async function generateBlogContent() {
  const topic = pickDailyTopic();
  let lastParseError;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const rawContent = await callMistral(
        [
          {
            role: "user",
            content:
              attempt === 0
                ? `${BLOG_PROMPT}\n\nToday's focus topic: ${topic}`
                : `${BLOG_PROMPT}\n\nIMPORTANT: Your previous response was not valid JSON. Return ONLY the JSON object with no markdown fences or commentary.\n\nToday's focus topic: ${topic}`,
          },
        ],
        attempt === 0 ? "Mistral API" : "Mistral API retry"
      );

      const parsed = parseMistralJson(rawContent);
      return await validateAndRepairBlogContent(parsed);
    } catch (err) {
      const isParseError =
        err instanceof SyntaxError ||
        err.name === "SyntaxError" ||
        err.message.includes("JSON") ||
        err.message.includes("valid JSON");

      if (isParseError && attempt === 0) {
        lastParseError = err;
        console.error("[publish-blog] Retrying Mistral call after JSON parse failure.");
        continue;
      }

      throw err;
    }
  }

  throw new Error(
    `Failed to parse Mistral JSON after retry: ${lastParseError?.message || "Unknown parse error"}`
  );
}

function textToBlock(text, style = "normal") {
  return {
    _type: "block",
    _key: generateKey(),
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: generateKey(),
        text,
        marks: [],
      },
    ],
  };
}

function markdownToPortableText(markdown) {
  const blocks = [];
  const paragraphs = markdown.split(/\n{2,}/);

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    const lines = trimmed.split("\n").map((line) => line.trim()).filter(Boolean);

    for (const line of lines) {
      if (/^###\s+/.test(line)) {
        blocks.push(textToBlock(line.replace(/^###\s+/, ""), "h3"));
      } else if (/^##\s+/.test(line)) {
        blocks.push(textToBlock(line.replace(/^##\s+/, ""), "h2"));
      } else if (/^#\s+/.test(line)) {
        blocks.push(textToBlock(line.replace(/^#\s+/, ""), "h1"));
      } else {
        blocks.push(textToBlock(line, "normal"));
      }
    }
  }

  return blocks;
}

async function fetchUnsplashImage() {
  const accessKey = requireEnv("UNSPLASH_ACCESS_KEY");

  const response = await axiosWithRetry(
    {
      method: "GET",
      url: UNSPLASH_API_URL,
      params: {
        query: "education",
        count: 1,
      },
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      timeout: 15000,
    },
    "Unsplash API"
  );

  const photo = Array.isArray(response.data) ? response.data[0] : response.data;

  if (!photo?.urls?.regular) {
    throw new Error("Unsplash API returned an invalid photo payload.");
  }

  return {
    imageUrl: photo.urls.regular,
    photographer: photo.user?.name || "Unsplash Contributor",
    portfolioUrl: photo.user?.portfolio_url || photo.links?.html || "",
    photoPageUrl: photo.links?.html || "",
  };
}

async function uploadImageToSanity(client, imageUrl, altText) {
  const imageResponse = await axiosWithRetry(
    {
      method: "GET",
      url: imageUrl,
      responseType: "arraybuffer",
      timeout: 30000,
    },
    "Unsplash image download"
  );

  const buffer = Buffer.from(imageResponse.data);
  const contentType = imageResponse.headers["content-type"] || "image/jpeg";

  const asset = await client.assets.upload("image", buffer, {
    filename: `blog-${Date.now()}.jpg`,
    contentType,
  });

  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
    alt: altText,
    caption: altText,
  };
}

async function publishToSanity(blogContent, unsplashImage) {
  if (!isValidTitle(blogContent.title) || !isValidSlug(blogContent.slug)) {
    throw new Error("Refusing to publish post with invalid title or slug.");
  }

  const client = getSanityWriteClient();
  const mainImage = await uploadImageToSanity(
    client,
    unsplashImage.imageUrl,
    `Education illustration by ${unsplashImage.photographer}`
  );

  const document = {
    _type: "post",
    title: blogContent.title,
    slug: {
      _type: "slug",
      current: blogContent.slug,
    },
    excerpt: blogContent.excerpt,
    metaDescription: blogContent.metaDescription,
    seoTitle: truncate(blogContent.title, 60),
    body: blogContent.body,
    mainImage,
    publishedAt: new Date().toISOString(),
  };

  const created = await client.create(document);
  return created;
}

async function runPublishJob() {
  const blogContent = await generateBlogContent();
  const unsplashImage = await fetchUnsplashImage();
  const post = await publishToSanity(blogContent, unsplashImage);

  return {
    success: true,
    postId: post._id,
    title: post.title,
    slug: blogContent.slug,
    photographer: unsplashImage.photographer,
    photoPageUrl: unsplashImage.photoPageUrl,
  };
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runPublishJob();
    console.info("[publish-blog] Published post:", result.postId, result.title);
    return Response.json(result);
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    console.error("[publish-blog] Job failed:", errorMessage, err.response?.data ?? "");
    return Response.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(request) {
  return GET(request);
}
