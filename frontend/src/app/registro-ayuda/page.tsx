"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // 1. Importa dynamic
import ThemeRegistry from "@/theme/ThemeRegistry";
import { Typography, Box } from "@mui/material";

// 2. Carga RegistroAyuda de forma dinámica y desactiva el SSR para este componente
const RegistroAyuda = dynamic(() => import("@/components/RegistroAyuda"), {
  ssr: false,
  loading: () => <p>Cargando formulario...</p>,
});

export default function SolicitarAyuda() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ minHeight: "100vh" }} />;
  }

  return (
    <ThemeRegistry>
      <div className="p-10">
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Red de Voluntariado Local
          </Typography>
        </Box>

        {/* 3. Ahora este componente no dará error de 'has-flag' porque no se ejecuta en servidor */}
        <RegistroAyuda />

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            * Buscaremos voluntarios cerca de ti.
          </Typography>
        </Box>
      </div>
    </ThemeRegistry>
  );
}
