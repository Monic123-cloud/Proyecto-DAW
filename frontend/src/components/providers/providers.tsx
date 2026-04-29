"use client";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { CartProvider } from "../cart/CartContext";
import {GoogleMapsProvider} from "./GoogleMapsProvider"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <ThemeRegistry>
      <CartProvider>
        <GoogleMapsProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            {children}
          </LocalizationProvider>
        </GoogleMapsProvider>
      </CartProvider>
    </ThemeRegistry>
  );
}