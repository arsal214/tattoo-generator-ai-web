import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { richHtml } from "@/lib/rich";
import { PostCard } from "@/components/blog/PostCard";
import { Breadcrumbs, CtaBand, ToolCard } from "@/components/marketing/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPost, relatedPosts } from "@/lib/blog/queries";
import { BLOG_CATEGORIES } from "@/lib/config/blog";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { getTool } from "@/lib/tools/registry";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;
export const generateStaticParams = () => []; // render on first request, then cache (ISR)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return buildMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    image: post.featuredImage ?? undefined,
    ownOg: true,
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const [related] = await Promise.all([relatedPosts(post.slug, post.category)]);
  const category = BLOG_CATEGORIES.find((c) => c.slug === post.category);
  const tools = (post.tools ?? []).map(getTool).filter((t) => t !== undefined);
  const html = richHtml(post.content); // content is authored by admins/seed only

  return (
    <main>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.metaDescription,
            author: { "@type": "Organization", name: post.author },
            publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
            image: post.featuredImage ? [post.featuredImage] : [absoluteUrl(`/blog/${post.slug}/opengraph-image`)],
          },
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <article className="container-x py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: post.title }]} />
          {category && (
            <Link href={`/blog/category/${category.slug}`} className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {category.name}
            </Link>
          )}
          <h1 className="mt-2 text-4xl font-semibold leading-[1.1] sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-xl leading-relaxed text-muted">{post.excerpt}</p>
          <p className="mt-4 text-sm text-muted">
            By {post.author}
            {post.publishedAt && <> · {formatDate(post.publishedAt)}</>}
            {post.updatedAt > (post.publishedAt ?? 0) && <> · Updated {formatDate(post.updatedAt)}</>}
          </p>
          <div className="prose-tg mt-8" dangerouslySetInnerHTML={{ __html: html }} />

          {tools.length > 0 && (
            <aside className="mt-12 rounded-2xl bg-bone p-5 sm:p-6" aria-labelledby="try">
              <h2 id="try" className="text-xl font-semibold">
                Put it into practice
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {tools.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </aside>
          )}
          <p className="mt-8 text-sm text-muted">This article is general information about tattoo design and planning, not professional advice. Talk to a licensed tattoo artist about what suits you.</p>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-bone/60" aria-labelledby="more">
          <div className="section container-x">
            <h2 id="more" className="mb-6 text-3xl font-semibold">
              Keep reading
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand heading="Bring your idea to life" body="Generate tattoo concepts in any style with 20 free credits, then take your favorites to your artist." primary={{ href: "/signup", label: "Get 20 free credits" }} secondary={{ href: "/tattoo-generator", label: "Try the generator" }} />
    </main>
  );
}
