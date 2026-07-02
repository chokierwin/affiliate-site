import Papa from "papaparse";

export type Product = {
  title: string;
  price: string;
  rating?: string;
  badge?: string;
  image: string;
  video?: string;
  link: string;
};

const PRODUCTS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSNpqVGxJw_DXtWB3NtTJF7UDFVucUwtexxvdsORjDCu-a4JbqxYSZNYem7HVdQtydHze0TwphhzG2o/pub?output=csv";

/**
 * Fetches and parses the product sheet on the server. Runs at request/build
 * time so the initial HTML already contains real product data (good for SEO,
 * Core Web Vitals, and crawlers that don't execute client JS).
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(PRODUCTS_CSV_URL, {
      // Revalidate periodically instead of on every request, since the sheet
      // doesn't change every second.
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const csvText = await res.text();
    const parsed = Papa.parse<Product>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    return (parsed.data || []).filter((p) => p.title && p.link);
  } catch {
    return [];
  }
}
