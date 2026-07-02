import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kontak",
  description: `Hubungi tim ${siteConfig.name} untuk pertanyaan, kerja sama, atau laporan konten.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-5 pb-16">
      <Breadcrumb items={[{ label: "Kontak" }]} />

      <article className="mt-6 space-y-6 text-gray-700 leading-relaxed">
        <h1 className="text-3xl font-bold text-gray-900">Hubungi Kami</h1>
        <p>
          Punya pertanyaan, masukan, laporan konten, atau mau kerja sama dengan{" "}
          {siteConfig.name}? Kami senang mendengar dari kamu.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="block rounded-2xl border border-orange-200 bg-orange-50 p-5 hover:bg-orange-100 transition"
          >
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-orange-600 mt-1">{siteConfig.contactEmail}</p>
          </a>

          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl border border-orange-200 bg-orange-50 p-5 hover:bg-orange-100 transition"
          >
            <p className="text-sm text-gray-500">Instagram</p>
            <p className="font-semibold text-orange-600 mt-1">@racunbelanjashopee</p>
          </a>

          <a
            href={siteConfig.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl border border-orange-200 bg-orange-50 p-5 hover:bg-orange-100 transition"
          >
            <p className="text-sm text-gray-500">TikTok</p>
            <p className="font-semibold text-orange-600 mt-1">@racunbelanjashopee</p>
          </a>
        </div>

        <p className="text-sm text-gray-400">
          Kami biasanya membalas dalam 1–3 hari kerja.
        </p>
      </article>
    </main>
  );
}
