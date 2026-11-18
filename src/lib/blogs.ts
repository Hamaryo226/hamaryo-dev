import { catalog } from "./catalog";

export type BlogContent =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "code"; language: string; code: string }
  | { type: "embed"; platform: "spotify"; url: string }
  | { type: "link"; text: string; url: string };

export type Blog = {
  slug: string;
  thumbnail?: string;
  title: string;
  date: string;
  description: string;
  tags?: string[];
  content: BlogContent[];
};

export const blogs = catalog.blogs;

// slugからブログを取得
export function getBlogBySlug(slug: string): Blog | undefined {
  return blogs.find((blog) => blog.slug === slug);
}

// すべてのブログを取得
export function getAllBlogs(): Blog[] {
  return blogs;
}

// すべてのslugを取得（静的生成用）
export function getAllBlogSlugs(): string[] {
  return blogs.map((blog) => blog.slug);
}
