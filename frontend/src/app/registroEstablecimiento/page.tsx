"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ThemeRegistry from "@/theme/ThemeRegistry";

// Cargamos el componente de forma dinámica para evitar errores de objetos del navegador (window/google)
const RegistroEstablecimiento = dynamic(
  () => import("@/components/RegistroEstablecimiento"),
  { ssr: false },
);

export default function RegisterPage() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Evitamos renderizar en el servidor para que el ThemeRegistry y los componentes dinámicos no choquen
  if (!hasMounted) {
    return null;
  }

  return (
    <ThemeRegistry>
      <div className="p-10">
        <RegistroEstablecimiento />
      </div>
    </ThemeRegistry>
  );
}
