import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJSON, writeJSON } from "@/lib/admin/storage";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

function checkAuth() {
  return cookies().then((c) => c.get("admin_token")?.value === "authenticated");
}

export async function GET() {
  const blogs = readJSON<BlogPost[]>("blog-posts.json", []);
  return NextResponse.json(blogs);
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const blogs = readJSON<BlogPost[]>("blog-posts.json", []);
  const maxId = blogs.reduce((max, b) => Math.max(max, b.id), 0);
  const now = new Date().toISOString();

  const newPost: BlogPost = {
    id: maxId + 1,
    title: body.title || "Untitled",
    excerpt: body.excerpt || "",
    content: body.content || "",
    category: body.category || "General",
    author: body.author || "TaxEase Team",
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    readTime: body.readTime || `${Math.ceil((body.content?.length || 0) / 1000)} min read`,
    image: body.image || "/uploads/default-blog.svg",
    slug: body.slug || `post-${maxId + 1}`,
    published: body.published !== false,
    createdAt: now,
    updatedAt: now,
  };

  blogs.push(newPost);
  writeJSON("blog-posts.json", blogs);
  return NextResponse.json(newPost, { status: 201 });
}
