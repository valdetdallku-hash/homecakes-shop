"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/getProducts";

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();

  const [color, setColor] = useState(product.colors[0] || "");
  const [text, setText] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [added, setAdded] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleAddToCart() {
    let photoUrl = "";

    if (photoFile) {
      setUploading(true);
      try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        if (cloudName && uploadPreset) {
          const formData = new FormData();
          formData.append("file", photoFile);
          formData.append("upload_preset", uploadPreset);
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData }
          );
          const data = await res.json();
          photoUrl = data.secure_url || "";
        }
      } catch (e) {
        // Upload failed silently — order still proceeds without photo URL
      } finally {
        setUploading(false);
      }
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      color,
      personalizedText: text,
      photoUrl,
      qty: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          Ngjyra
        </label>
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: "100%", padding: 10, border: "1px solid var(--line)" }}
        >
          {product.colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          Teksti për personalizim (emër, datë, mesazh)
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="p.sh. Elira - 5 Vjeç"
          maxLength={60}
          style={{ width: "100%", padding: 10, border: "1px solid var(--line)" }}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          Foto referencë (opsionale)
        </label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Parapamje"
            style={{ width: 80, height: 80, objectFit: "cover", marginTop: 8, border: "1px solid var(--line)" }}
          />
        )}
      </div>

      <button className="btn-primary" onClick={handleAddToCart} disabled={uploading} style={{ width: "100%" }}>
        {uploading ? "Duke ngarkuar foton…" : added ? "U shtua ✓" : "Shto në Shportë"}
      </button>
    </div>
  );
}
