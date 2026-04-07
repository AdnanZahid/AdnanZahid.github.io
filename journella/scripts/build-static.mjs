import { promises as fs } from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";

const rootDir = process.cwd();
const GENERATED_NOTICE = "<!-- Generated file: edit src/... and run npm run build -->";
const APP_STORE_URL = "https://apps.apple.com/app/journella-daily-planner/id6761329619";
const BLOG_DIRECTORY = "src/blog";
const BLOG_FILE_PATTERN = /^Blog-(\d{4})-(\d{2})-(\d{2})\.md$/;
const BLOG_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC"
});
const markdown = new MarkdownIt({
  html: false,
  linkify: true
});

const pages = [
  {
    output: "index.html",
    source: "src/pages/index.html",
    title: "Journella",
    description: "Journella — your day at a glance. Notes, tasks, calendar, search, and AI support in one warm, focused app.",
    bodyClass: "page page-home",
    activeNav: "home"
  },
  {
    output: "blog.html",
    source: "src/pages/blog.html",
    title: "Journella Blog",
    description: "Product updates, planning notes, and thoughtful ideas from Journella.",
    bodyClass: "page page-blog",
    activeNav: "blog"
  },
  {
    output: "support.html",
    source: "src/pages/support.html",
    title: "Journella Support",
    description: "Support page for Journella.",
    bodyClass: "page page-support",
    activeNav: "support"
  },
  {
    output: "privacy-policy.html",
    source: "src/pages/privacy-policy.html",
    title: "Journella Privacy Policy",
    description: "Privacy Policy for Journella.",
    bodyClass: "page page-privacy",
    activeNav: "privacy"
  }
];

async function readProjectFile(relativePath) {
  return fs.readFile(path.join(rootDir, relativePath), "utf8");
}

function renderTemplate(template, replacements) {
  return Object.entries(replacements).reduce((content, [key, value]) => {
    return content.replaceAll(`{{${key}}}`, value);
  }, template);
}

function currentAttr(target, activeNav) {
  return target === activeNav ? ' aria-current="page"' : "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatBlogDate(date) {
  return BLOG_DATE_FORMATTER.format(date);
}

function buildFallbackTitle(formattedDate) {
  return `Journella update for ${formattedDate}`;
}

function isValidBlogDate(date, year, month, day) {
  return Number.isFinite(date.getTime())
    && date.getUTCFullYear() === Number(year)
    && date.getUTCMonth() === Number(month) - 1
    && date.getUTCDate() === Number(day);
}

function extractInlineText(tokens = []) {
  const text = tokens.map((token) => {
    if (token.type === "text" || token.type === "code_inline") {
      return token.content;
    }

    if (token.type === "softbreak" || token.type === "hardbreak") {
      return " ";
    }

    if (token.children?.length) {
      return extractInlineText(token.children);
    }

    if (token.type === "image") {
      return token.content;
    }

    return "";
  }).join("");

  return text.replace(/\s+/g, " ").trim();
}

function extractPostTitleAndTokens(tokens, fallbackTitle) {
  const bodyTokens = [...tokens];

  for (let index = 0; index < bodyTokens.length - 2; index += 1) {
    const openToken = bodyTokens[index];
    const inlineToken = bodyTokens[index + 1];
    const closeToken = bodyTokens[index + 2];

    if (
      openToken?.type === "heading_open"
      && openToken.tag === "h1"
      && inlineToken?.type === "inline"
      && closeToken?.type === "heading_close"
      && closeToken.tag === "h1"
    ) {
      const extractedTitle = extractInlineText(inlineToken.children);
      bodyTokens.splice(index, 3);

      return {
        title: extractedTitle || fallbackTitle,
        bodyTokens
      };
    }
  }

  return {
    title: fallbackTitle,
    bodyTokens
  };
}

function renderShareTrigger(post) {
  const safeTitle = escapeHtml(post.title);

  return `
          <button
            class="permalink share-trigger"
            type="button"
            data-share-trigger
            data-post-anchor="${post.anchor}"
            data-post-title="${safeTitle}"
            aria-controls="share-dialog"
            aria-haspopup="dialog"
            aria-label="Share ${safeTitle}"
          >
            Share
          </button>`;
}

function renderBlogPost(post) {
  const safeTitle = escapeHtml(post.title);
  const safeDate = escapeHtml(post.formattedDate);

  return `
      <article class="blog-post" id="${post.anchor}" aria-labelledby="${post.anchor}-title">
        <div class="blog-post-header">
          <div>
            <p class="blog-post-date">
              <time datetime="${post.isoDate}">${safeDate}</time>
            </p>
            <h2 class="blog-post-title" id="${post.anchor}-title">${safeTitle}</h2>
          </div>
          <div class="blog-post-actions">
            <a
              class="permalink"
              href="#${post.anchor}"
              aria-label="Open permalink for ${safeTitle}"
            >
              Permalink
            </a>
${renderShareTrigger(post)}
          </div>
        </div>

        <div class="blog-richtext">
${post.bodyHtml}
        </div>
      </article>`;
}

function renderBlogPosts(posts) {
  if (posts.length === 0) {
    return `
      <section class="blog-empty" aria-live="polite">
        <span class="eyebrow">No posts yet</span>
        <h2>The blog is ready when the first update is.</h2>
        <p class="lead">
          New product notes, thoughtful updates, and planning ideas will appear here as soon as they are published.
        </p>
      </section>`;
  }

  return posts.map(renderBlogPost).join("\n");
}

async function loadBlogPosts() {
  const blogDirectoryPath = path.join(rootDir, BLOG_DIRECTORY);
  let entries;

  try {
    entries = await fs.readdir(blogDirectoryPath, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const posts = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const match = entry.name.match(BLOG_FILE_PATTERN);

    if (!match) {
      console.warn(`[blog] Skipping "${entry.name}": expected Blog-YYYY-MM-DD.md.`);
      continue;
    }

    const [, year, month, day] = match;
    const isoDate = `${year}-${month}-${day}`;
    const publishedAt = new Date(`${isoDate}T00:00:00.000Z`);

    if (!isValidBlogDate(publishedAt, year, month, day)) {
      console.warn(`[blog] Skipping "${entry.name}": invalid calendar date in filename.`);
      continue;
    }

    const source = await readProjectFile(path.join(BLOG_DIRECTORY, entry.name));
    const formattedDate = formatBlogDate(publishedAt);
    const fallbackTitle = buildFallbackTitle(formattedDate);
    const tokens = markdown.parse(source, {});
    const { title, bodyTokens } = extractPostTitleAndTokens(tokens, fallbackTitle);
    const bodyHtml = markdown.renderer.render(bodyTokens, markdown.options, {}).trim();

    posts.push({
      anchor: `post-${isoDate}`,
      bodyHtml,
      formattedDate,
      isoDate,
      publishedAt,
      title
    });
  }

  posts.sort((left, right) => right.publishedAt.getTime() - left.publishedAt.getTime());

  return posts;
}

async function build() {
  const [baseTemplate, headerTemplate, footerTemplate, blogPosts] = await Promise.all([
    readProjectFile("src/layout/base.html"),
    readProjectFile("src/partials/header.html"),
    readProjectFile("src/partials/footer.html"),
    loadBlogPosts()
  ]);

  for (const page of pages) {
    const mainContentTemplate = (await readProjectFile(page.source)).trim();
    const sharedTokens = {
      APP_STORE_URL,
      NAV_BLOG_CURRENT: currentAttr("blog", page.activeNav),
      NAV_HOME_CURRENT: currentAttr("home", page.activeNav),
      NAV_PRIVACY_CURRENT: currentAttr("privacy", page.activeNav),
      NAV_SUPPORT_CURRENT: currentAttr("support", page.activeNav)
    };
    const pageTokens = page.output === "blog.html"
      ? { BLOG_POSTS: renderBlogPosts(blogPosts) }
      : {};
    const mainContent = renderTemplate(mainContentTemplate, pageTokens);

    const header = renderTemplate(headerTemplate, sharedTokens);
    const footer = renderTemplate(footerTemplate, sharedTokens);
    const html = renderTemplate(baseTemplate, {
      TITLE: page.title,
      DESCRIPTION: page.description,
      BODY_CLASS: page.bodyClass,
      HEADER: header,
      MAIN_CONTENT: mainContent,
      FOOTER: footer
    }).trim();

    const output = `${GENERATED_NOTICE}\n${html}\n`;
    await fs.writeFile(path.join(rootDir, page.output), output, "utf8");
  }
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
