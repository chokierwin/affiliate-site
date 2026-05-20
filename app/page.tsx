"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

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

  return (
    <main className="min-h-screen bg-gray-100">
      <nav className="bg-orange-500 text-white p-4 text-center text-2xl font-bold shadow">
        RacunBelanja.id26 🔥
      </nav>
      <div className="p-5">
        <h1 className="text-3xl font-bold text-center text-orange-500">
          Produk Viral Shopee
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Website affiliate auto update dari Google Sheets 🚀
        </p>
      </div>
      <div className="p-5 grid md:grid-cols-2 gap-5">
        {products.map((product, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-4 relative">
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              {product.badge}
            </span>
            <img src={product.image} alt={product.title} className="rounded-xl mb-4 w-full" />
            <h2 className="text-xl font-bold">{product.title}</h2>
            <p className="text-2xl font-bold text-orange-500 mt-2">{product.price}</p>
            <p className="text-yellow-500 mt-2">{product.rating}</p>
            
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block text-center bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl"
            >
              🛒 Beli Sekarang
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}