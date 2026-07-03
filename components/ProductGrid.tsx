"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { loadSocialBarAd } from "@/components/SocialBarAd";

export default function ProductGrid({ initialProducts }: { initialProducts: Product[] }) {
  const [products] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const getVideoEmbed = (url?: string) => {
    if (!url) return null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]
        : url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const isTikTok = (url?: string) => !!url?.includes("tiktok.com");
  const isMP4 = (url?: string) => !!url?.endsWith(".mp4");

  return (
    <>
      <div className="p-5">
        <h1 className="text-3xl font-bold text-center text-orange-500">Produk Viral Shopee</h1>
        <div className="mt-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="🔍 Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-orange-400 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-orange-500"
          />
        </div>
        {search && (
          <p className="text-center text-gray-400 mt-2 text-sm">
            {filtered.length} produk ditemukan untuk &quot;{search}&quot;
          </p>
        )}
      </div>

      <div className="p-5 grid md:grid-cols-2 gap-5">
        {filtered.length > 0 ? (
          filtered.map((product, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-4 relative">
              {product.badge && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full z-10">
                  {product.badge}
                </span>
              )}
              <div
                className="relative cursor-pointer aspect-video overflow-hidden rounded-xl mb-4 bg-gray-100"
                onClick={() => product.video && setSelected(product)}
              >
                {/* Native <img> with native lazy-loading: product images come from
                    arbitrary external hosts (Google Sheets/Shopee CDN), so next/image
                    optimization isn't practical here without allow-listing every domain. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.title}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                {product.video && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-4">
                      <span className="text-white text-3xl">▶</span>
                    </div>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold">{product.title}</h2>
              <p className="text-2xl font-bold text-orange-500 mt-2">{product.price}</p>
              {product.rating && <p className="text-yellow-500 mt-2">{product.rating}</p>}
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer sponsored"
                onClick={() => loadSocialBarAd()}
                className="mt-5 block text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl"
              >
                🛒 Beli Sekarang
              </a>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-400 py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl">Produk tidak ditemukan</p>
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 text-2xl">
                ✕
              </button>
            </div>
            {isMP4(selected.video) ? (
              <video controls autoPlay className="w-full rounded-xl">
                <source src={selected.video} type="video/mp4" />
              </video>
            ) : isTikTok(selected.video) ? (
              <div className="text-center p-4">
                <p className="text-gray-500 mb-3">Tonton video TikTok:</p>
                <a
                  href={selected.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white px-6 py-3 rounded-xl inline-block"
                >
                  🎵 Buka di TikTok
                </a>
              </div>
            ) : (
              <iframe
                src={getVideoEmbed(selected.video) || ""}
                className="w-full aspect-video rounded-xl"
                allowFullScreen
              />
            )}
            <a
              href={selected.link}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={() => loadSocialBarAd()}
              className="mt-4 block text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl"
            >
              🛒 Beli Sekarang
            </a>
          </div>
        </div>
      )}
    </>
  );
}
