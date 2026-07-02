import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import AdSlot from "@/components/AdSlot";
import JsonLd from "@/components/JsonLd";
import { getProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `${siteConfig.name} — Produk Viral Shopee Pilihan`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function Home() {
  const products = await getProducts();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        image: product.image,
        url: product.link,
        ...(product.price
          ? {
              offers: {
                "@type": "Offer",
                priceCurrency: "IDR",
                price: product.price.replace(/[^0-9]/g, "") || undefined,
                availability: "https://schema.org/InStock",
                url: product.link,
              },
            }
          : {}),
      },
    })),
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {products.length > 0 && <JsonLd data={itemListSchema} />}

      <nav className="bg-orange-500 text-white p-4 text-center text-2xl font-bold shadow">
        {siteConfig.name} 🔥
      </nav>

      <ProductGrid initialProducts={products} />

      <div className="pb-10">
        <AdSlot />
      </div>
    </main>
  );
}
