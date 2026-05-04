// frontend/src/app/not-found.tsx
"use client";
import Link from "next/link";

// Esta línea es la que soluciona el error en Vercel/Railway
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1>404 - Página no encontrada</h1>
      <p>Parece que esta ruta no existe.</p>
      <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>
        Volver al inicio
      </Link>
    </div>
  );
}
