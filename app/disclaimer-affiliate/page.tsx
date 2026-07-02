import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Disclaimer Affiliate",
  description: `Penjelasan hubungan affiliate ${siteConfig.name} dengan Shopee dan bagaimana kami memperoleh komisi.`,
  alternates: { canonical: "/disclaimer-affiliate" },
};

export default function AffiliateDisclaimerPage() {
  return (
    <main className="max-w-3xl mx-auto px-5 pb-16">
      <Breadcrumb items={[{ label: "Disclaimer Affiliate" }]} />

      <article className="mt-6 space-y-6 text-gray-700 leading-relaxed">
        <h1 className="text-3xl font-bold text-gray-900">Disclaimer Affiliate</h1>
        <p className="text-sm text-gray-400">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Kami Adalah Affiliate Shopee</h2>
          <p>
            {siteConfig.name} adalah peserta Program Affiliate Shopee, sebuah program
            pemasaran affiliate yang memungkinkan kami memperoleh komisi dari transaksi yang
            terjadi melalui tautan yang kami bagikan di situs ini.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Apa Artinya Ini Bagi Kamu</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Sebagian besar tombol &quot;Beli Sekarang&quot; di situs ini mengarah ke tautan
              affiliate Shopee.
            </li>
            <li>
              Jika kamu melakukan pembelian melalui tautan tersebut, kami dapat menerima
              komisi kecil dari Shopee — <strong>tanpa menambah biaya apa pun</strong> untuk
              kamu sebagai pembeli.
            </li>
            <li>
              Harga produk yang tercantum di situs ini sepenuhnya ditentukan oleh Shopee dan
              penjual terkait, bukan oleh kami.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Independensi Rekomendasi</h2>
          <p>
            Meskipun kami memperoleh komisi dari beberapa tautan, produk yang kami tampilkan
            dipilih berdasarkan tren, minat pengunjung, dan penilaian kami sendiri. Status
            affiliate tidak mengubah opini kami terhadap kualitas suatu produk.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Pertanyaan?</h2>
          <p>
            Kalau kamu punya pertanyaan tentang bagaimana kami bekerja sama dengan Shopee,
            silakan hubungi kami di{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="text-orange-500 underline">
              {siteConfig.contactEmail}
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
