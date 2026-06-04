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

async function checkAuth() {
  return (await cookies()).get("admin_token")?.value === "authenticated";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const blogs = await readJSON<BlogPost[]>("blog-posts.json", []);
  const post = blogs.find((b) => b.id === parseInt(id) || b.slug === id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const blogs = await readJSON<BlogPost[]>("blog-posts.json", []);
  const index = blogs.findIndex((b) => b.id === parseInt(id));
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  blogs[index] = {
    ...blogs[index],
    ...body,
    id: blogs[index].id,
    updatedAt: new Date().toISOString(),
  };
  await writeJSON("blog-posts.json", blogs);
  return NextResponse.json(blogs[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const blogs = await readJSON<BlogPost[]>("blog-posts.json", []);
  const filtered = blogs.filter((b) => b.id !== parseInt(id));
  if (filtered.length === blogs.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeJSON("blog-posts.json", filtered);
  return NextResponse.json({ success: true });
}
