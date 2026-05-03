"use client";
import React from "react";
import RegistroAyuda from "@/components/RegistroAyuda";
import ThemeRegistry from "@/theme/ThemeRegistry"; // Asegúrate de que la ruta sea correcta
import { Typography, Box } from "@mui/material";

export default function PaginaSolicitarAyuda() {
  return (
    <ThemeRegistry>
      <div className="p-10">
        {/* Cabecera de la página */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Red de Voluntariado Local
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Si necesitas ayuda para tareas cotidianas, nuestra comunidad está
            aquí para apoyarte.
          </Typography>
        </Box>

        {/* Formulario de Registro de Ayuda */}
        <RegistroAyuda />

        {/* Nota al pie opcional */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            * Buscaremos voluntarios cerca de ti.
          </Typography>
        </Box>
      </div>
    </ThemeRegistry>
  );
}
