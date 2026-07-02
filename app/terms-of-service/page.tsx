import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: `Syarat dan ketentuan penggunaan situs ${siteConfig.name}.`,
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-5 pb-16">
      <Breadcrumb items={[{ label: "Syarat & Ketentuan" }]} />

      <article className="mt-6 space-y-6 text-gray-700 leading-relaxed">
        <h1 className="text-3xl font-bold text-gray-900">Syarat &amp; Ketentuan</h1>
        <p className="text-sm text-gray-400">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</p>

        <p>
          Dengan mengakses dan menggunakan {siteConfig.url}, kamu dianggap menyetujui
          Syarat &amp; Ketentuan berikut. Jika tidak setuju, mohon untuk tidak menggunakan
          situs ini.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">1. Sifat Konten</h2>
          <p>
            {siteConfig.name} menyediakan kurasi dan rekomendasi produk yang tersedia di
            platform Shopee untuk tujuan informasi dan hiburan. Konten yang ditampilkan
            (termasuk judul, harga, dan gambar produk) diambil dari sumber data yang kami
            kelola dan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">2. Tautan Affiliate</h2>
          <p>
            Sebagian besar tautan &quot;Beli Sekarang&quot; di situs ini adalah tautan affiliate.
            Kami dapat memperoleh komisi dari pembelian yang kamu lakukan melalui tautan
            tersebut, tanpa biaya tambahan bagi kamu. Lihat halaman{" "}
            <a href="/disclaimer-affiliate" className="text-orange-500 underline">
              Disclaimer Affiliate
            </a>{" "}
            untuk detail lebih lanjut.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">3. Akurasi Informasi</h2>
          <p>
            Kami berusaha menampilkan informasi harga dan ketersediaan produk seakurat
            mungkin, namun tidak dapat menjamin bahwa seluruh informasi selalu terkini karena
            harga dan stok ditentukan oleh penjual/marketplace pihak ketiga. Selalu periksa
            detail final di halaman produk Shopee sebelum melakukan pembelian.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">4. Batasan Tanggung Jawab</h2>
          <p>
            {siteConfig.name} tidak bertanggung jawab atas transaksi, pengiriman, kualitas
            produk, atau layanan purna jual yang dilakukan melalui platform Shopee. Segala
            transaksi tunduk pada Syarat &amp; Ketentuan Shopee.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">5. Hak Kekayaan Intelektual</h2>
          <p>
            Desain, tata letak, dan konten orisinal (termasuk artikel) di situs ini adalah
            milik {siteConfig.name}. Gambar dan merek produk tetap menjadi hak masing-masing
            pemiliknya.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">6. Perubahan Ketentuan</h2>
          <p>
            Kami dapat memperbarui Syarat &amp; Ketentuan ini sewaktu-waktu. Penggunaan situs
            secara berkelanjutan setelah perubahan dianggap sebagai persetujuan atas ketentuan
            terbaru.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">7. Kontak</h2>
          <p>
            Pertanyaan seputar Syarat &amp; Ketentuan dapat dikirim ke{" "}
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
