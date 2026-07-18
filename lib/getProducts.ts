import fallbackProducts from "@/data/products.json";

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  image: string;
  colors: string[];
  personalizable: boolean;
  description: string;
};

function parseCsv(text: string): string[][] {
  // Simple CSV parser that handles quoted fields with commas.
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field);
        field = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && next === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function rowsToProducts(rows: string[][]): Product[] {
  const [header, ...dataRows] = rows;
  const idx = (name: string) => header.findIndex((h) => h.trim().toLowerCase() === name);

  const iName = idx("emri");
  const iCategory = idx("kategoria");
  const iPrice = idx("cmimi") >= 0 ? idx("cmimi") : idx("çmimi");
  const iColors = idx("ngjyrat");
  const iImage = idx("imazhi");
  const iDescription = idx("perscrimi") >= 0 ? idx("perscrimi") : idx("përshkrimi");

  return dataRows
    .map((r, i) => {
      const name = r[iName]?.trim() || "";
      if (!name) return null;
      return {
        id: i + 1,
        slug: slugify(name) + "-" + (i + 1),
        name,
        category: r[iCategory]?.trim() || "Të Tjera",
        price: parseFloat((r[iPrice] || "0").replace(",", ".")) || 0,
        currency: "EUR",
        image: r[iImage]?.trim() || "/products/placeholder-1.svg",
        colors: (r[iColors] || "Standarde")
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean),
        personalizable: true,
        description: r[iDescription]?.trim() || "",
      } as Product;
    })
    .filter((p): p is Product => p !== null);
}

export async function getProducts(): Promise<Product[]> {
  const sheetUrl = process.env.SHEET_CSV_URL;

  if (!sheetUrl) {
    return fallbackProducts as Product[];
  }

  try {
    const res = await fetch(sheetUrl, { next: { revalidate: 300 } }); // cache 5 min
    if (!res.ok) throw new Error("Sheet fetch failed");
    const text = await res.text();
    const rows = parseCsv(text);
    const products = rowsToProducts(rows);
    return products.length > 0 ? products : (fallbackProducts as Product[]);
  } catch (e) {
    console.error("Duke lexuar produktet nga Google Sheet dështoi, po përdor listën lokale:", e);
    return fallbackProducts as Product[];
  }
}
