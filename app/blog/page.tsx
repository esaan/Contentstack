import ContentstackPage from "@/components/contentstack-page";
import BlogManager from "@/components/blog-manager";

export default function BlogPage() {
  return (
    <>
      <ContentstackPage url="/blog" />
      <BlogManager />
    </>
  );
}
