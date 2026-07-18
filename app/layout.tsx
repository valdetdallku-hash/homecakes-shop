import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Homecakes Dekor | Dekore Torte Personalizuara",
  description:
    "Topper akrilik, pllaka emri, shirita dhe dekore torte të personalizuara. Porosit online, dërgesë e shpejtë.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
