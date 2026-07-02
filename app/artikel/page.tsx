import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import { getAllArticlesMeta } from "@/lib/articles";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Artikel",
  description: `Tips belanja, review, dan insight seputar produk viral Shopee dari ${siteConfig.name}.`,
  alternates: { canonical: "/artikel" },
};

export default function ArticleListPage() {
  const articles = getAllArticlesMeta();

  return (
    <main className="max-w-5xl mx-auto px-5 pb-16">
      <Breadcrumb items={[{ label: "Artikel" }]} />

      <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Artikel</h1>
      <p className="text-gray-500 mb-8">
        Tips belanja, review jujur, dan insight seputar produk viral Shopee.
      </p>

      {articles.length === 0 ? (
        <p className="text-gray-400">Belum ada artikel.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/artikel/${article.slug}`}
              className="block bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {article.cover && (
                <div className="relative w-full aspect-video">
                  <Image
                    src={article.cover}
                    alt={article.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(article.date).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  · {article.readingTime}
                </p>
                <h2 className="text-lg font-bold text-gray-900">{article.title}</h2>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{article.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
