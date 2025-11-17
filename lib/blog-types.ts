export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type UpsertBlogPost = {
  title: string;
  summary: string;
  body: string;
};
