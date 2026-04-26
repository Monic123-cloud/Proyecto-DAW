"use client";

import * as React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../theme/theme";
import { CartProvider } from "../components/cart/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}