"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import GoogleAnalytics from "../components/GoogleAnalytics";
import React from "react";

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cargamos las librerías de Google Maps
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  return (
    <html lang="es">
      <body>
        {/* Google Analytics se carga siempre de fondo */}
        <GoogleAnalytics GA_MEASUREMENT_ID="G-M0FNWZ3F6M" />

        {/* 3. Controlamos la carga de la App según el Mapa */}
        {isLoaded ? (
          children
        ) : (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando librerías de Google...</p>
          </div>
        )}
      </body>
    </html>
  );
}
