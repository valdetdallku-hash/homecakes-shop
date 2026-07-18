import { getProducts } from "@/lib/getProducts";
import ProductCard from "@/components/ProductCard";

export const revalidate = 300; // refresh from Google Sheet every 5 minutes

export default async function HomePage() {
  const products = await getProducts();
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <main>
      <section
        style={{
          borderBottom: "1px solid var(--line)",
          padding: "64px 0 48px",
          background:
            "linear-gradient(180deg, var(--blush) 0%, var(--cream) 100%)",
        }}
      >
        <div className="container">
          <p style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 12, color: "var(--wine)" }}>
            Dekore torte, të bëra për momentin tënd
          </p>
          <h1 className="display" style={{ fontSize: "clamp(32px, 5vw, 52px)", maxWidth: 680, margin: "12px 0 16px" }}>
            Topper, pllaka emri &amp; dekore personalizuara
          </h1>
          <p style={{ maxWidth: 520, color: "#6b5f5a", fontSize: 15 }}>
            Çdo porosi personalizohet me tekstin, ngjyrën dhe rastin tënd — dërguar gati për tortën e ëndrrave.
          </p>
        </div>
      </section>

      <div className="container" style={{ padding: "48px 24px 80px" }}>
        {categories.map((cat) => {
          const items = products.filter((p) => p.category === cat);
          return (
            <div key={cat} style={{ marginBottom: 56 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 22 }}>{cat}</h2>
                <span style={{ fontSize: 13, color: "#8a7d77" }}>{items.length} dizajne</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 20,
                }}
              >
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
