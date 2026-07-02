import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: `Kenali lebih dekat ${siteConfig.name}, tim di balik kurasi produk viral Shopee.`,
  alternates: { canonical: "/about-us" },
};

export default function AboutUsPage() {
  return (
    <main className="max-w-3xl mx-auto px-5 pb-16">
      <Breadcrumb items={[{ label: "Tentang Kami" }]} />

      <article className="mt-6 space-y-6 text-gray-700 leading-relaxed">
        <h1 className="text-3xl font-bold text-gray-900">Tentang {siteConfig.name}</h1>

        <p>
          {siteConfig.name} lahir dari kebiasaan scroll Shopee tiap malam dan menemukan
          barang-barang unik yang bikin kami mikir, &quot;wah ini harus dibeli.&quot; Daripada
          rekomendasi itu cuma numpuk di wishlist pribadi, kami memutuskan untuk membagikannya
          ke lebih banyak orang lewat situs ini.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Apa yang Kami Lakukan</h2>
          <p>
            Kami mengurasi produk-produk viral dan sedang hits di Shopee — mulai dari gadget
            unik, perlengkapan rumah, sampai barang lucu yang jarang orang tahu — lalu
            menyajikannya dalam satu halaman yang mudah dijelajahi, lengkap dengan video atau
            preview singkat kalau tersedia.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Bagaimana Kami Memilih Produk</h2>
          <p>
            Pemilihan produk didasarkan pada tren belanja, rating dan ulasan pembeli, serta
            relevansi dengan kebutuhan sehari-hari. Kami adalah bagian dari Program Affiliate
            Shopee — detail lengkapnya ada di halaman{" "}
            <a href="/disclaimer-affiliate" className="text-orange-500 underline">
              Disclaimer Affiliate
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Hubungi Kami</h2>
          <p>
            Ada saran produk atau mau ngobrol soal kerja sama? Mampir ke halaman{" "}
            <a href="/contact" className="text-orange-500 underline">
              Kontak
            </a>{" "}
            kami.
          </p>
        </section>
      </article>
    </main>
  );
}
