import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Stripe nuk është konfiguruar ende (mungon STRIPE_SECRET_KEY)." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Shporta është bosh." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: `Ngjyrë: ${item.color}${item.personalizedText ? ` · Tekst: ${item.personalizedText}` : ""}`,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    // Stripe metadata values are capped at 500 chars each — keep per-item notes short.
    const orderNotes = items
      .map(
        (item: any, idx: number) =>
          `${idx + 1}) ${item.name} | ngjyrë:${item.color} | tekst:${item.personalizedText || "-"} | foto:${item.photoUrl || "-"}`
      )
      .join(" || ")
      .slice(0, 490);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      metadata: {
        order_notes: orderNotes,
      },
      shipping_address_collection: {
        allowed_countries: ["XK", "FR", "AL", "DE", "CH", "IT"],
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gabim gjatë krijimit të pagesës." }, { status: 500 });
  }
}
