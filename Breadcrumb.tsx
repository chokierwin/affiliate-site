import Link from "next/link";
import JsonLd from "./JsonLd";
import { siteConfig } from "@/lib/site-config";

export type Crumb = {
  label: string;
  href?: string; // omit href on the last (current) item
};

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const withHome: Crumb[] = [{ label: "Beranda", href: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: withHome.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${siteConfig.url}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-5 pt-4 text-sm text-gray-500">
      <JsonLd data={schema} />
      <ol className="flex flex-wrap items-center gap-1">
        {withHome.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && <span className="text-gray-300">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-orange-500">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-gray-700 font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
