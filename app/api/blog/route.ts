import { NextResponse } from "next/server";
import { createPost, listPosts, sanitizePostPayload } from "@/lib/blog-store";
import type { UpsertBlogPost } from "@/lib/blog-types";

export async function GET() {
  return NextResponse.json({ posts: listPosts() });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<UpsertBlogPost>;
    const { data, error } = sanitizePostPayload(body);

    if (error || !data) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const post = createPost(data);
    return NextResponse.json(post, { status: 201 });
  } catch (cause) {
    console.error("Failed to create blog post", cause);
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
