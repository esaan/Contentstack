import { NextResponse } from "next/server";
import {
  findPost,
  removePost,
  sanitizePostPayload,
  updatePost,
} from "@/lib/blog-store";
import type { UpsertBlogPost } from "@/lib/blog-types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const post = findPost(id);

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(request: Request, context: RouteContext) {
  return updateHandler(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return updateHandler(request, context);
}

export async function DELETE(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = removePost(id);

  if (!deleted) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

async function updateHandler(request: Request, context: RouteContext) {
  try {
    const body = (await request.json()) as Partial<UpsertBlogPost>;
    const { data, error } = sanitizePostPayload(body);

    if (error || !data) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const { id } = await context.params;
    const updated = updatePost(id, data);

    if (!updated) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (cause) {
    console.error("Failed to update blog post", cause);
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
