"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="container" style={{ padding: "100px 24px", textAlign: "center" }}>
      <h1 className="display" style={{ fontSize: 30, color: "var(--wine)" }}>
        Faleminderit për porosinë! 🎂
      </h1>
      <p style={{ color: "#6b5f5a", marginTop: 12 }}>
        Pagesa u konfirmua. Do të të kontaktojmë shpejt për detajet e dërgesës.
      </p>
      <Link href="/" className="btn-primary" style={{ display: "inline-block", marginTop: 24 }}>
        Kthehu te dyqani
      </Link>
    </main>
  );
}
