// ブログデータを統合管理
import b01 from "../content/blog/b01.json";
import b02 from "../content/blog/b02.json";
import b03 from "../content/blog/b03.json";
import b04 from "../content/blog/b04.json";
import b05 from "../content/blog/b05.json";

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

// ブログデータにslugを追加
export const blogs: Blog[] = [
  { ...b05, slug: "05" } as Blog,
  { ...b04, slug: "04" } as Blog,
  { ...b03, slug: "03" } as Blog,
  { ...b02, slug: "02" } as Blog,
  { ...b01, slug: "01" } as Blog,
];

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
