import { getProducts } from "@/lib/getProducts";
import ProductDetailClient from "@/components/ProductDetailClient";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const products = await getProducts();
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="container" style={{ padding: "48px 24px 80px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div style={{ aspectRatio: "1 / 1", border: "1px solid var(--line)" }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gold)" }}>
            {product.category}
          </p>
          <h1 className="display" style={{ fontSize: 28, margin: "6px 0 10px" }}>
            {product.name}
          </h1>
          <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
            {product.price.toFixed(2)} €
          </p>
          <p style={{ color: "#6b5f5a", fontSize: 14, marginBottom: 28 }}>{product.description}</p>
          <ProductDetailClient product={product} />
        </div>
      </div>
    </main>
  );
}
