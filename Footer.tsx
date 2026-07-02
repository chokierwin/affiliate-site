import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const legalLinks = [
  { href: "/privacy-policy", label: "Kebijakan Privasi" },
  { href: "/terms-of-service", label: "Syarat & Ketentuan" },
  { href: "/disclaimer-affiliate", label: "Disclaimer Affiliate" },
  { href: "/about-us", label: "Tentang Kami" },
  { href: "/contact", label: "Kontak" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white text-gray-600">
      <div className="max-w-5xl mx-auto px-5 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-orange-500">{siteConfig.name}</p>
          <p className="mt-2 text-sm leading-relaxed">{siteConfig.description}</p>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-3">Halaman</p>
          <ul className="space-y-2 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-orange-500">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/artikel" className="hover:text-orange-500">
                Artikel
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-3">Ikuti Kami</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500"
              >
                Instagram
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-orange-500">
                {siteConfig.contactEmail}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-5 py-4 text-xs text-gray-400 text-center">
          © {year} {siteConfig.name}. Semua hak dilindungi. Sebagai bagian dari Program Affiliate
          Shopee, kami mendapat komisi dari pembelian yang memenuhi syarat.
        </div>
      </div>
    </footer>
  );
}
