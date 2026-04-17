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
      <head>
        {/* Cargamos Bootstrap para que el Dashboard tenga forma y tamaño */}
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" 
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-light">
        <CartProvider>{children}</CartProvider>
        
      </body>
    </html>
  );
}