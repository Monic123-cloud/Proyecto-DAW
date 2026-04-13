import { CartProvider } from "../components/cart/CartContext";

import "./globals.css";

export const metadata = {
  title: "Close4u",
  description: "Comercio local a un clic",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        
        <CartProvider>{children}</CartProvider>
        
      </body>
    </html>
  );
}