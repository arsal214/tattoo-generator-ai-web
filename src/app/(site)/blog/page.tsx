import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { Breadcrumbs } from "@/components/marketing/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { listPosts } from "@/lib/blog/queries";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";

export const revalidate = 1800;

export const metadata: Metadata = buildMetadata({
  title: "Tattoo Ideas, Lettering & Placement Guides",
  description: "Practical tattoo guides: design ideas, lettering and font advice, placement planning and style explainers to help you prepare for a tattoo consultation.",
  path: "/blog",
});

// ponytail: single page (all posts). Add /blog/page/[n] routes once the archive outgrows ~50 posts.
export default async function BlogPage() {
  const { items } = await listPosts({ limit: 50 });
  return (
    <main className="container-x py-10 sm:py-14">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog" }]} />
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">Tattoo ideas, lettering and placement guides</h1>
      <p className="mb-8 mt-4 max-w-2xl text-lg text-muted">Straight-talking articles to help you decide what to get, where to put it and how to brief your artist.</p>
      <BlogIndex posts={items} />
    </main>
  );
}
