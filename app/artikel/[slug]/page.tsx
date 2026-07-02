import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import AdSlot from "@/components/AdSlot";
import { getAllArticlesMeta, getArticleBySlug } from "@/lib/articles";
import { siteConfig } from "@/lib/site-config";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllArticlesMeta().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/artikel/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      images: article.cover ? [article.cover] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    image: article.cover ? [`${siteConfig.url}${article.cover}`] : undefined,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/artikel/${slug}`,
  };

  return (
    <main className="max-w-3xl mx-auto px-5 pb-16">
      <JsonLd data={articleSchema} />
      <Breadcrumb items={[{ label: "Artikel", href: "/artikel" }, { label: article.title }]} />

      <article className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
        <p className="text-sm text-gray-400 mt-2">
          {new Date(article.date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {article.readingTime}
        </p>

        {article.cover && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mt-6">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose-content mt-8 space-y-4 text-gray-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:text-orange-500 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        <div className="mt-10">
          <AdSlot />
        </div>
      </article>
    </main>
  );
}
