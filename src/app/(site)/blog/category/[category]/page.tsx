import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { Breadcrumbs } from "@/components/marketing/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { listPosts } from "@/lib/blog/queries";
import { BLOG_CATEGORIES } from "@/lib/config/blog";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";

export const revalidate = 1800;
export const dynamicParams = false;
export const generateStaticParams = () => BLOG_CATEGORIES.map((c) => ({ category: c.slug }));

const find = (slug: string) => BLOG_CATEGORIES.find((c) => c.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const cat = find((await params).category);
  if (!cat) return {};
  return buildMetadata({
    title: `Tattoo ${cat.name}: Articles & Guides`,
    description: `${cat.description} Browse our ${cat.name.toLowerCase()} articles for practical, artist-ready tattoo planning advice.`,
    path: `/blog/category/${cat.slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const cat = find((await params).category);
  if (!cat) notFound();
  const { items } = await listPosts({ category: cat.slug, limit: 50 });
  return (
    <main className="container-x py-10 sm:py-14">
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: cat.name, path: `/blog/category/${cat.slug}` },
        ])}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: cat.name }]} />
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">Tattoo {cat.name.toLowerCase()}: articles and guides</h1>
      <p className="mb-8 mt-4 max-w-2xl text-lg text-muted">{cat.description}</p>
      <BlogIndex posts={items} active={cat.slug} />
    </main>
  );
}
