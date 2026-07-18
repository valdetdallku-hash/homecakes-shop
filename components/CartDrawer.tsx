"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CartDrawer() {
  const { items, removeItem, updateQty, total, isOpen, setIsOpen } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Diçka shkoi gabim. Provo përsëri.");
      }
    } catch (e) {
      setError("Nuk u lidh me serverin e pagesës.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(43,35,32,0.35)",
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="card"
        style={{
          width: "min(420px, 100%)",
          height: "100%",
          padding: 24,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 20, margin: 0 }}>Shporta jote</h2>
          <button className="btn-ghost" onClick={() => setIsOpen(false)}>
            Mbyll
          </button>
        </div>

        {items.length === 0 && (
          <p style={{ marginTop: 32, color: "#6b5f5a" }}>
            Shporta është bosh. Shto një dekor për ta filluar porosinë.
          </p>
        )}

        <div style={{ marginTop: 20, flex: 1 }}>
          {items.map((item) => (
            <div
              key={item.key}
              style={{
                borderBottom: "1px solid var(--line)",
                paddingBottom: 14,
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: 14 }}>{item.name}</strong>
                <button
                  onClick={() => removeItem(item.key)}
                  style={{ background: "none", border: "none", color: "#a33", fontSize: 13 }}
                >
                  Fshi
                </button>
              </div>
              <p style={{ fontSize: 13, color: "#6b5f5a", margin: "4px 0" }}>
                Ngjyrë: {item.color}
                {item.personalizedText && <> · Tekst: "{item.personalizedText}"</>}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => updateQty(item.key, parseInt(e.target.value) || 1)}
                  style={{ width: 56, padding: 4 }}
                />
                <span>{(item.price * item.qty).toFixed(2)} €</span>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              <span>Totali</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            {error && <p style={{ color: "#a33", fontSize: 13 }}>{error}</p>}
            <button
              className="btn-primary"
              style={{ width: "100%" }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Duke lidhur me Stripe…" : "Vazhdo te Pagesa"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
