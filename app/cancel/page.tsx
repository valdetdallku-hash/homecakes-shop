import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="container" style={{ padding: "100px 24px", textAlign: "center" }}>
      <h1 className="display" style={{ fontSize: 28 }}>Pagesa u anulua</h1>
      <p style={{ color: "#6b5f5a", marginTop: 12 }}>
        Asnjë pagesë s'u realizua. Shporta jote është ende e ruajtur.
      </p>
      <Link href="/" className="btn-primary" style={{ display: "inline-block", marginTop: 24 }}>
        Kthehu te dyqani
      </Link>
    </main>
  );
}
