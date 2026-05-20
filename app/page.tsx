"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNpqVGxJw_DXtWB3NtTJF7UDFVucUwtexxvdsORjDCu-a4JbqxYSZNYem7HVdQtydHze0TwphhzG2o/pub?output=csv",
      {
        download: true,
        header: true,
        complete: (results) => {
          setProducts(results.data as any[]);
        },
      }
    );
  }, []);

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const getVideoEmbed = (url: string) => {
    if (!url) return null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const id = url.includes("youtu.be")
        ? url.split("youtu.be/")[1]
        : url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const isTikTok = (url: string) => url?.includes("tiktok.com");
  const isMP4 = (url: string) => url?.endsWith(".mp4");

  return (
    <main className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <nav className="bg-orange-500 text-white p-4 text-center text-2xl font-bold shadow">
        RacunBelanja.id26 🔥
      </nav>

      {/* HEADER + SEARCH */}
      <div className="p-5">
        <h1 className="text-3xl font-bold text-center text-orange-500">
          Produk Viral Shopee
        </h1>
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
            {filtered.length} produk ditemukan untuk "{search}"
          </p>
        )}
      </div>

      {/* GRID PRODUK */}
      <div className="p-5 grid md:grid-cols-2 gap-5">
        {filtered.length > 0 ? (
          filtered.map((product, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-4 relative">
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full z-10">
                {product.badge}
              </span>
              <div className="relative cursor-pointer" onClick={() => product.video && setSelected(product)}>
                <img src={product.image} alt={product.title} className="rounded-xl mb-4 w-full" />
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
              <p className="text-yellow-500 mt-2">{product.rating}</p>
              <a href={product.link} target="_blank" rel="noopener noreferrer"
                className="mt-5 block text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl">
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

      {/* POP-UP VIDEO */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg">{selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 text-2xl">✕</button>
            </div>
            {isMP4(selected.video) ? (
              <video controls autoPlay className="w-full rounded-xl">
                <source src={selected.video} type="video/mp4" />
              </video>
            ) : isTikTok(selected.video) ? (
              <div className="text-center p-4">
                <p className="text-gray-500 mb-3">Tonton video TikTok:</p>
                <a href={selected.video} target="_blank" rel="noopener noreferrer"
                  className="bg-black text-white px-6 py-3 rounded-xl inline-block">
                  🎵 Buka di TikTok
                </a>
              </div>
            ) : (
              <iframe src={getVideoEmbed(selected.video) || ""} className="w-full aspect-video rounded-xl"
                allowFullScreen />
            )}
            <a href={selected.link} target="_blank" rel="noopener noreferrer"
              className="mt-4 block text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl">
              🛒 Beli Sekarang
            </a>
          </div>
        </div>
      )}
    </main>
  );
}