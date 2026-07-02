import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import readingTime from "reading-time";

const ARTICLES_DIR = path.join(process.cwd(), "content/artikel");

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  cover?: string;
  readingTime: string;
};

export type Article = ArticleMeta & {
  contentHtml: string;
};

function getSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export function getAllArticlesMeta(): ArticleMeta[] {
  const slugs = getSlugs();

  const articles = slugs.map((slug) => {
    const fullPath = path.join(ARTICLES_DIR, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      cover: data.cover,
      readingTime: readingTime(content).text,
    };
  });

  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fullPath = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    cover: data.cover,
    readingTime: readingTime(content).text,
    contentHtml,
  };
}
