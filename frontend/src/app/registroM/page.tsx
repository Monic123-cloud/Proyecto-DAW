"use client";

import dynamic from "next/dynamic";

// ✅ Carga el formulario SOLO en cliente (evita SSR + hydration mismatch)
const RegistroEstablecimiento = dynamic(
  () => import("../../components/RegistroEstablecimiento"),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: 24 }}>
        <p style={{ margin: 0 }}>Cargando registro de comercio…</p>
      </div>
    ),
  }
);

export default function PaginaRegistro() {
  return (
    <div style={{ padding: 24 }}>
      <RegistroEstablecimiento />
    </div>
  );
}