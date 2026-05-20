import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RacunBelanjaShopee - Produk Viral Shopee",
  description: "Kumpulan produk viral Shopee pilihan terbaik harga murah.",
  keywords: "shopee, produk viral, belanja murah, affiliate shopee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-G82DW1MPYF"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-G82DW1MPYF');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}