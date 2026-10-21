import { Rich } from "@/components/marketing/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { getContent, md } from "@/lib/content";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const c = await getContent("about");
  return buildMetadata({ title: c.metaTitle, description: c.metaDescription, path: "/about" });
}

export default async function AboutPage() {
  const c = await getContent("about");
  return (
    <main className="py-12 sm:py-16">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <div className="container-x max-w-3xl">
        <h1 className="text-4xl font-semibold sm:text-5xl">{c.heading}</h1>
        <Rich html={c.intro} className="mt-4 text-lg leading-8 text-muted" />
        <div className="prose-tg mt-6" dangerouslySetInnerHTML={{ __html: md(c.body) }} />
      </div>
    </main>
  );
}
