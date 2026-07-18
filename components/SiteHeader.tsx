"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function SiteHeader() {
  const { items, setIsOpen } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <header
      style={{
        borderBottom: "1px solid var(--line)",
        position: "sticky",
        top: 0,
        background: "var(--cream)",
        zIndex: 40,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        <Link href="/" className="display" style={{ fontSize: 22, color: "var(--wine)" }}>
          Homecakes Dekor
        </Link>
        <button
          className="btn-ghost"
          onClick={() => setIsOpen(true)}
          aria-label="Hap shportën"
        >
          Shporta ({count})
        </button>
      </div>
    </header>
  );
}
