import axios from "axios";
import { createClient } from "@sanity/client";

/** Vercel Cron schedule: daily at 8:00 AM UTC — configured in vercel.json */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";

const BLOG_PROMPT = `Generate a 1000 to 1300-word SEO-optimized blog post about a random trending education topic including educational free tools for students and teachers (choose different topics daily). Include: H1 title, H2 and H3 subheadings, meta description (150 chars), keyword focus. Format the response as clean paragraphs suitable for blog content.

Structure your response EXACTLY like this:
TITLE: [H1 title here]
META_DESCRIPTION: [meta description, max 150 characters]
KEYWORDS: [comma-separated focus keywords]

Then write the blog body using markdown headings (## for H2, ### for H3) and plain paragraphs. Do not repeat the title or meta description in the body.`;

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
    .slice(0, 96);
}

function truncate(text, maxLength) {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 3).trim()}...`;
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

async function generateBlogContent() {
  const apiKey = requireEnv("MISTRAL_API_KEY");
  const topic = pickDailyTopic();

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
        messages: [
          {
            role: "user",
            content: `${BLOG_PROMPT}\n\nToday's focus topic: ${topic}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      timeout: 45000,
    },
    "Mistral API"
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Mistral API returned an empty or invalid response.");
  }

  return parseBlogContent(content);
}

function parseBlogContent(rawContent) {
  const lines = rawContent
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let title = "";
  let metaDescription = "";
  let keywords = "";
  const bodyLines = [];

  for (const line of lines) {
    const titleMatch = line.match(/^TITLE:\s*(.+)$/i);
    const metaMatch = line.match(/^META_DESCRIPTION:\s*(.+)$/i);
    const keywordsMatch = line.match(/^KEYWORDS:\s*(.+)$/i);

    if (titleMatch) {
      title = titleMatch[1].trim();
      continue;
    }
    if (metaMatch) {
      metaDescription = truncate(metaMatch[1].trim(), 160);
      continue;
    }
    if (keywordsMatch) {
      keywords = keywordsMatch[1].trim();
      continue;
    }

    bodyLines.push(line);
  }

  if (!title) {
    const headingLine = bodyLines.find((line) => /^#\s+/.test(line));
    if (headingLine) {
      title = headingLine.replace(/^#+\s*/, "").trim();
    } else if (bodyLines.length > 0) {
      title = bodyLines.shift().replace(/^#+\s*/, "").trim();
    }
  }

  if (!title) {
    throw new Error("Could not extract blog title from Mistral response.");
  }

  if (!metaDescription) {
    const firstParagraph = bodyLines.find(
      (line) => !line.startsWith("#") && line.length > 40
    );
    metaDescription = truncate(firstParagraph || title, 160);
  }

  const body = markdownToPortableText(bodyLines.join("\n"));

  if (body.length === 0) {
    throw new Error("Could not extract blog body from Mistral response.");
  }

  const excerpt = truncate(metaDescription, 200);
  const normalizedExcerpt =
    excerpt.length >= 40 ? excerpt : truncate(`${title}. ${metaDescription}`, 200);

  return {
    title: truncate(title, 120),
    metaDescription,
    keywords,
    excerpt: normalizedExcerpt,
    body,
    slug: slugify(title),
  };
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
