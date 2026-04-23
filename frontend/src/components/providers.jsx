"use client";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { CartProvider } from "./cart/CartContext";
import AuthProvider from "../components/context/AuthContext";

export default function Providers({ children }) {
  return (
    <ThemeRegistry>
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  </ThemeRegistry>
  );
}