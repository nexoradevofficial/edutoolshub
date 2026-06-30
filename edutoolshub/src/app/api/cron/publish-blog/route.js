import axios from "axios";
import { createClient } from "@sanity/client";

/** Vercel Cron schedule: daily at 8:00 AM UTC — configured in vercel.json */
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";

const BLOG_ARTICLE_REQUIREMENTS = `
Write a high-quality, SEO-optimized article relevant to 2026 search trends.

Requirements:
- Include the primary keyword and related keywords naturally throughout the article.
- Start with an engaging introduction that uses the primary keyword in the first paragraph.
- Use proper heading structure (H2 and H3 only — do not include an H1).
- Include features, benefits, pros and cons (when relevant), a comparison table (when relevant), FAQ, and a conclusion with a call-to-action.
- Maintain keyword density of approximately 1-2%.
- Write in a human, conversational, and informative style.
- Optimize for Google's Helpful Content and E-E-A-T guidelines.
- Include practical examples and actionable tips.
- Keep the article evergreen and suitable for ranking on Google in 2026.`;

const BLOG_METADATA_PROMPT = `
Generate SEO metadata for a blog article about a trending topic related to:
Free educational tools for teachers, free educational tools for students, AI tools for education,
online learning platforms, classroom technology, study productivity tools, EdTech trends in 2026,
or digital teaching and learning resources.

Return ONLY valid JSON (no markdown, no extra text):
{
  "title": "SEO optimized title (50-60 chars, no special chars)",
  "slug": "url-friendly-slug-with-hyphens-only",
  "metaDescription": "Meta description (150-160 chars)",
  "primaryKeyword": "main keyword phrase",
  "excerpt": "Excerpt (150-160 chars)",
  "featuredImagePrompt": "Short Unsplash search query for a relevant image"
}

Do NOT include the article body in this response.`;

const BLOG_CONTENT_PROMPT = `${BLOG_ARTICLE_REQUIREMENTS}

Return ONLY valid JSON (no markdown fences, no extra text):
{
  "content": "Full blog article in markdown with ## H2 and ### H3 headings"
}

Rules:
- Use the key "content" only (never "article" or "body").
- Use markdown only: ## headings, ### subheadings, - bullet lists, 1. numbered lists.
- Do NOT use HTML tags such as <p>, <h2>, <ul>, <table>, or <a>.
- Escape quotes and newlines inside the content string so the JSON is valid.`;

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
  "Top 20 online study Tools Every Student Should Use in 2026",
  "Top Tools for Research Papers and Assignments",
  "The Best Tutors and Personalized Learning Platforms",
  "Top Chrome Extensions Every Student Should Install in 2026",
  "Best Free Online Teaching Tools for Virtual Classrooms",
  "How Teachers Can Use online tools to Create Lesson Plans",
  "How AI is Transforming Education in 2026",
  "ChatGPT vs Google Gemini for Students: Which One is Better in 2026?",
  "Can AI Replace Traditional Learning Methods",
  "How to Use AI Responsibly in Education",
  "educational technology trends 2026",
  "Best Homework Helper Websites",
  "Future of Online Education in 2026",
];

const PLACEHOLDER_VALUES = new Set(["---", "--", "-", "…", "..."]);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isAuthorized(request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authHeader = request.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const headerSecret = request.headers.get("x-cron-secret")?.trim();
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get("secret")?.trim();
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";

  if (cronSecret) {
    const authorized =
      bearer === cronSecret || headerSecret === cronSecret || querySecret === cronSecret;
    if (!authorized && isVercelCron) {
      console.error("[publish-blog] Vercel cron invoked but CRON_SECRET did not match.");
    }
    return authorized;
  }

  if (isVercelCron) {
    console.error(
      "[publish-blog] Vercel cron invoked but CRON_SECRET is not set in this environment."
    );
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

function getPrimaryKeyword(parsed) {
  if (typeof parsed.primaryKeyword === "string" && parsed.primaryKeyword.trim()) {
    return parsed.primaryKeyword.trim();
  }
  if (typeof parsed.keyword === "string" && parsed.keyword.trim()) {
    return parsed.keyword.trim();
  }
  return "";
}

function resolveExcerpt(parsed, title, resolvedMeta) {
  const fromAi = typeof parsed.excerpt === "string" ? parsed.excerpt.trim() : "";
  if (fromAi.length >= 40 && fromAi.length <= 200) {
    return truncate(fromAi, 200);
  }

  const excerptSource = resolvedMeta || title;
  const excerpt = truncate(excerptSource, 200);
  return excerpt.length >= 40 ? excerpt : truncate(`${title}. ${resolvedMeta}`, 200);
}

function getImageSearchQuery(parsed, keyword) {
  const fromPrompt =
    typeof parsed.featuredImagePrompt === "string" ? parsed.featuredImagePrompt.trim() : "";
  if (fromPrompt && !isPlaceholderValue(fromPrompt)) {
    return truncate(fromPrompt, 100);
  }
  if (keyword) {
    return truncate(keyword, 100);
  }
  return "education classroom";
}

async function callMistral(messages, label, options = {}) {
  const { maxTokens = 4096, timeout = 45000 } = options;
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
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
      },
      timeout,
    },
    label
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Mistral API returned an empty or invalid response.");
  }

  if (response.data?.choices?.[0]?.finish_reason === "length") {
    console.warn(`[publish-blog] ${label} response was truncated (finish_reason=length).`);
  }

  return content;
}

async function callMistralJson(messages, label, options = {}) {
  let lastParseError;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const rawContent = await callMistral(
        messages,
        attempt === 0 ? label : `${label} retry`,
        options
      );
      return parseMistralJson(rawContent);
    } catch (err) {
      const isParseError =
        err instanceof SyntaxError ||
        err.name === "SyntaxError" ||
        err.message.includes("JSON") ||
        err.message.includes("valid JSON");

      if (isParseError && attempt === 0) {
        lastParseError = err;
        console.error(`[publish-blog] Retrying ${label} after JSON parse failure.`);
        messages = [
          {
            role: "user",
            content: `${messages[0].content}\n\nIMPORTANT: Your previous response was not valid JSON. Return ONLY a complete JSON object with properly escaped string values.`,
          },
        ];
        continue;
      }

      throw err;
    }
  }

  throw new Error(
    `Failed to parse ${label} JSON after retry: ${lastParseError?.message || "Unknown parse error"}`
  );
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
      "Mistral field repair",
      { maxTokens: 512, timeout: 30000 }
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
  const keyword = getPrimaryKeyword(parsed);
  const content = extractArticleBody(parsed);

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
  const keyword = getPrimaryKeyword(parsed);
  const content = extractArticleBody(parsed);

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

  const body = articleTextToPortableText(content);
  if (body.length === 0) {
    throw new Error("Could not convert blog content to Portable Text blocks.");
  }

  const resolvedMeta = metaDescription || truncate(extractTitleFromContent(content) || title, 160);
  const normalizedExcerpt = resolveExcerpt(parsed, title, resolvedMeta);

  return {
    title: truncate(title, 100),
    slug,
    metaDescription: resolvedMeta,
    keyword,
    excerpt: normalizedExcerpt,
    body,
    imageSearchQuery: getImageSearchQuery(parsed, keyword),
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

  const metadata = await callMistralJson(
    [
      {
        role: "user",
        content: `${BLOG_METADATA_PROMPT}\n\nToday's focus topic: ${topic}`,
      },
    ],
    "Mistral metadata",
    { maxTokens: 1024, timeout: 30000 }
  );

  const title = typeof metadata.title === "string" ? metadata.title : topic;
  const primaryKeyword =
    typeof metadata.primaryKeyword === "string" ? metadata.primaryKeyword : topic;

  const contentResult = await callMistralJson(
    [
      {
        role: "user",
        content: `${BLOG_CONTENT_PROMPT}

Today's focus topic: ${topic}
Title: ${title}
Primary keyword: ${primaryKeyword}
Target length: 1000-1200 words.`,
      },
    ],
    "Mistral content",
    { maxTokens: 8192, timeout: 120000 }
  );

  const content = extractArticleBody(contentResult);

  if (!content) {
    throw new Error("Mistral content response is missing the article body.");
  }

  return validateAndRepairBlogContent({ ...metadata, content });
}

const ARTICLE_BODY_KEYS = ["content", "article", "body", "text"];

function extractArticleBody(value) {
  if (typeof value === "string") {
    return normalizeArticleText(value);
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  for (const key of ARTICLE_BODY_KEYS) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return normalizeArticleText(candidate);
    }
  }

  return "";
}

function normalizeArticleText(text) {
  const trimmed = text.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      const nested = extractArticleBody(parsed);
      if (nested) return nested;
    } catch {
      // Fall through — may be markdown that starts with "{" or truncated JSON.
    }
  }

  return trimmed;
}

function isHtmlContent(text) {
  return /<\/?[a-z][\s\S]*?>/i.test(text);
}

function stripHtmlTags(text) {
  return text.replace(/<[^>]+>/g, "").trim();
}

function inlineHtmlToMarkdown(text) {
  return text
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, "*$1*")
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .trim();
}

function htmlToMarkdown(html) {
  let source = html.trim();

  source = source.replace(/<table[\s\S]*?<\/table>/gi, (tableHtml) => {
    const rows = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    const lines = rows.map((row) => {
      const cells = row.match(/<t[hd][\s\S]*?<\/t[hd]>/gi) || [];
      return cells.map((cell) => inlineHtmlToMarkdown(cell)).join(" | ");
    });
    return `\n\n${lines.join("\n")}\n\n`;
  });

  source = source.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, inner) => {
    return `\n\n## ${inlineHtmlToMarkdown(inner)}\n\n`;
  });
  source = source.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, inner) => {
    return `\n\n### ${inlineHtmlToMarkdown(inner)}\n\n`;
  });
  source = source.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, inner) => {
    return `\n\n### ${inlineHtmlToMarkdown(inner)}\n\n`;
  });
  source = source.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => {
    return `\n\n${inlineHtmlToMarkdown(inner)}\n\n`;
  });
  source = source.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => {
    return `\n- ${inlineHtmlToMarkdown(inner)}`;
  });

  return inlineHtmlToMarkdown(source);
}

function articleTextToPortableText(text) {
  const normalized = normalizeArticleText(text);
  if (!normalized) return [];

  const markdown = isHtmlContent(normalized) ? htmlToMarkdown(normalized) : normalized;
  return markdownToPortableText(markdown);
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

async function fetchUnsplashImage(query = "education classroom") {
  const accessKey = requireEnv("UNSPLASH_ACCESS_KEY");
  const searchQuery = query?.trim() || "education classroom";

  const response = await axiosWithRetry(
    {
      method: "GET",
      url: UNSPLASH_API_URL,
      params: {
        query: searchQuery,
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
  const unsplashImage = await fetchUnsplashImage(blogContent.imageSearchQuery);
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
    console.warn("[publish-blog] Unauthorized cron request.");
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date().toISOString();
  console.info("[publish-blog] Cron job started at", startedAt);

  try {
    const result = await runPublishJob();
    console.info("[publish-blog] Published post:", result.postId, result.title, "startedAt:", startedAt);
    return Response.json({ ...result, startedAt });
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || "Unknown error";
    console.error("[publish-blog] Job failed:", errorMessage, "startedAt:", startedAt, err.response?.data ?? "");
    return Response.json({ success: false, error: errorMessage, startedAt }, { status: 500 });
  }
}

export async function POST(request) {
  return GET(request);
}
