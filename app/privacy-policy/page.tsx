import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: `Bagaimana ${siteConfig.name} mengumpulkan, menggunakan, dan melindungi data pengunjung situs.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-5 pb-16">
      <Breadcrumb items={[{ label: "Kebijakan Privasi" }]} />

      <article className="mt-6 space-y-6 text-gray-700 leading-relaxed">
        <h1 className="text-3xl font-bold text-gray-900">Kebijakan Privasi</h1>
        <p className="text-sm text-gray-400">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</p>

        <p>
          {siteConfig.name} (&quot;kami&quot;) menghargai privasi pengunjung situs
          ({siteConfig.url}). Kebijakan Privasi ini menjelaskan informasi apa saja yang kami
          kumpulkan, bagaimana kami menggunakannya, dan pilihan yang kamu miliki.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">1. Informasi yang Kami Kumpulkan</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Data penggunaan non-pribadi seperti halaman yang dikunjungi, durasi kunjungan, dan jenis perangkat, melalui alat analitik standar.</li>
            <li>Cookie dari pihak ketiga (misalnya jaringan iklan dan platform affiliate) untuk keperluan personalisasi dan pengukuran performa.</li>
            <li>Informasi yang kamu berikan secara sukarela, misalnya saat menghubungi kami melalui formulir kontak atau email.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">2. Bagaimana Kami Menggunakan Informasi</h2>
          <p>
            Informasi yang dikumpulkan digunakan untuk meningkatkan kualitas konten, memahami
            preferensi pengunjung, menampilkan rekomendasi produk yang relevan, dan mengelola
            komunikasi jika kamu menghubungi kami.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">3. Cookie & Pihak Ketiga</h2>
          <p>
            Situs ini dapat menampilkan iklan dari jaringan pihak ketiga (misalnya Adsterra) dan
            tautan affiliate ke Shopee. Pihak ketiga tersebut dapat menempatkan cookie di
            perangkatmu sesuai kebijakan privasi masing-masing. Kami tidak mengendalikan praktik
            privasi pihak ketiga dan menyarankan kamu membaca kebijakan privasi mereka secara
            terpisah.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">4. Keamanan Data</h2>
          <p>
            Kami berupaya menjaga keamanan data yang kami proses, namun tidak ada metode
            transmisi atau penyimpanan data di internet yang 100% aman.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">5. Perubahan Kebijakan</h2>
          <p>
            Kebijakan Privasi ini dapat diperbarui sewaktu-waktu. Perubahan akan dipublikasikan
            di halaman ini beserta tanggal pembaruan terbaru.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">6. Hubungi Kami</h2>
          <p>
            Jika kamu memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di{" "}
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
