"use client";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { CartProvider } from "./cart/CartContext";

export default function Providers({ children }) {
  return (
    <ThemeRegistry>
      <CartProvider>{children}</CartProvider>
    </ThemeRegistry>
  );
}