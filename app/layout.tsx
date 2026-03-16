"use client";
import { useJsApiLoader } from "@react-google-maps/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries, // Aquí cargamos todo de una vez
  });

  return (
    <html lang="es">
      <body>
        {/* Si Google no ha cargado, podemos mostrar un mensaje o esperar */}
        {isLoaded ? (
          children
        ) : (
          <div className="p-5 text-center">Cargando librerías de Google...</div>
        )}
      </body>
    </html>
  );
}
