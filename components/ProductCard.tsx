import Link from "next/link";

type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="card" style={{ display: "block" }}>
      <div style={{ aspectRatio: "1 / 1", overflow: "hidden", borderBottom: "1px solid var(--line)" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--gold)", margin: 0 }}>
          {product.category}
        </p>
        <h3 style={{ fontSize: 15, margin: "4px 0 8px", lineHeight: 1.3 }}>{product.name}</h3>
        <p style={{ fontWeight: 600, margin: 0 }}>{product.price.toFixed(2)} €</p>
      </div>
    </Link>
  );
}
