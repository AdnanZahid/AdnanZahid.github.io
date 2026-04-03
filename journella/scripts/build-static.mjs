import { promises as fs } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const GENERATED_NOTICE = "<!-- Generated file: edit src/... and run npm run build -->";
const APP_STORE_URL = "APP_STORE_URL_HERE";

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

async function build() {
  const [baseTemplate, headerTemplate, footerTemplate] = await Promise.all([
    readProjectFile("src/layout/base.html"),
    readProjectFile("src/partials/header.html"),
    readProjectFile("src/partials/footer.html")
  ]);

  for (const page of pages) {
    const mainContent = (await readProjectFile(page.source)).trim();
    const sharedTokens = {
      APP_STORE_URL,
      NAV_HOME_CURRENT: currentAttr("home", page.activeNav),
      NAV_SUPPORT_CURRENT: currentAttr("support", page.activeNav),
      NAV_PRIVACY_CURRENT: currentAttr("privacy", page.activeNav)
    };

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
