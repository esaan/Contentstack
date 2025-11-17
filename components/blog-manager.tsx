"use client";

import { useCallback, useEffect, useState, FormEvent, ChangeEvent } from "react";
import type { BlogPost } from "@/lib/blog-types";

type FormState = {
  id?: string;
  title: string;
  summary: string;
  body: string;
};

const emptyForm: FormState = {
  title: "",
  summary: "",
  body: "",
};

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/blog", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load posts");
      }
      const data = await response.json();
      setPosts(data?.posts ?? []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load posts.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title: form.title,
      summary: form.summary,
      body: form.body,
    };

    try {
      const isEditing = Boolean(form.id);
      const url = isEditing ? `/api/blog/${form.id}` : "/api/blog";
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to save the post.");
      }

      setPosts((prev) =>
        isEditing
          ? prev.map((post) => (post.id === data.id ? data : post))
          : [data, ...prev]
      );

      setSuccess(isEditing ? "Post updated." : "Post created.");
      setForm(emptyForm);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save the post.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (post: BlogPost) => {
    setForm({
      id: post.id,
      title: post.title,
      summary: post.summary,
      body: post.body,
    });
    window?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || "Unable to delete the post.");
      }
      setPosts((prev) => prev.filter((post) => post.id !== id));
      setSuccess("Post deleted.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to delete the post.";
      setError(message);
    }
  };

  const isEditing = Boolean(form.id);

  return (
    <section className="max-w-(--breakpoint-md) mx-auto p-4 space-y-6">
      <div className="bg-white rounded border border-slate-200 p-4 shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">
          {isEditing ? "Edit post" : "Create a new post"}
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Posts are stored in-memory for demo purposes. Restarting the dev
          server resets the data.
        </p>

        {error ? <p className="text-red-600 mb-3">{error}</p> : null}
        {success ? <p className="text-green-600 mb-3">{success}</p> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 px-3 py-2"
              placeholder="Example: Launching our new feature"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="summary">
              Summary
            </label>
            <input
              id="summary"
              name="summary"
              value={form.summary}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 px-3 py-2"
              placeholder="Write a short overview"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="body">
              Body
            </label>
            <textarea
              id="body"
              name="body"
              value={form.body}
              onChange={handleChange}
              className="w-full rounded border border-slate-300 px-3 py-2 min-h-[10rem]"
              placeholder="Long form content..."
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : isEditing ? "Update post" : "Create post"}
            </button>
            {isEditing ? (
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded border border-slate-300 px-4 py-2 text-slate-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Published posts</h3>
          <button
            onClick={fetchPosts}
            className="text-sm text-slate-600 underline"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        {posts.length === 0 && !loading ? (
          <p className="text-slate-500">No posts yet. Create your first one!</p>
        ) : null}
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className="bg-white border border-slate-200 rounded p-4 shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h4 className="text-lg font-semibold">{post.title}</h4>
                  <p className="text-xs text-slate-500">
                    Updated {new Date(post.updatedAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-slate-600">{post.summary}</p>
                <p className="text-sm text-slate-500 whitespace-pre-line">
                  {post.body}
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    className="text-sm text-blue-600"
                    onClick={() => startEditing(post)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-600"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
