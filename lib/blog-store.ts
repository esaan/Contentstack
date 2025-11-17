import { randomUUID } from "crypto";
import { BlogPost, UpsertBlogPost } from "./blog-types";

export type SanitizedPayload =
  | { data: UpsertBlogPost; error?: undefined }
  | { data?: undefined; error: string };

export function sanitizePostPayload(payload: Partial<UpsertBlogPost>): SanitizedPayload {
  const requiredFields: Array<keyof UpsertBlogPost> = ["title", "summary", "body"];
  const sanitized: Partial<UpsertBlogPost> = {};

  for (const field of requiredFields) {
    const value = payload[field];
    if (typeof value !== "string" || !value.trim()) {
      return { error: `Field '${field}' is required.` };
    }
    sanitized[field] = value.trim();
  }

  return { data: sanitized as UpsertBlogPost };
}

const blogPosts: BlogPost[] = [
  {
    id: randomUUID(),
    title: "Welcome to the Contentstack blog",
    summary: "This sample post shows how you can manage blog entries directly from this Next.js project.",
    body: "Start editing this post or add new ones using the form below. Everything is stored in-memory for demo purposes so a server restart resets the data.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function listPosts() {
  // Return a copy to avoid accidental external mutation
  return [...blogPosts];
}

export function findPost(id: string) {
  return blogPosts.find((post) => post.id === id);
}

export function createPost(payload: UpsertBlogPost) {
  const timestamp = new Date().toISOString();
  const post: BlogPost = {
    id: randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
    ...payload,
  };
  blogPosts.unshift(post);
  return post;
}

export function updatePost(id: string, payload: UpsertBlogPost) {
  const index = blogPosts.findIndex((post) => post.id === id);

  if (index === -1) {
    return null;
  }

  const updated: BlogPost = {
    ...blogPosts[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  blogPosts[index] = updated;
  return updated;
}

export function removePost(id: string) {
  const index = blogPosts.findIndex((post) => post.id === id);

  if (index === -1) {
    return false;
  }

  blogPosts.splice(index, 1);
  return true;
}

export type { BlogPost, UpsertBlogPost } from "./blog-types";
