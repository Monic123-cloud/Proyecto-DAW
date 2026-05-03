"use client";

import { useState } from "react";
import Header from "@/components/header";
import Buscador from "../../components/Buscador";
import ProtectedRoute from "../../components/ProtectedRoutes";
import ThemeRegistry from "@/theme/ThemeRegistry";
// Importamos Box para sustituir al div
import { Box } from "@mui/material";

export default function PaginaBuscador() {
  const [esMiniatura, setEsMiniatura] = useState(false);

  return (
    <ThemeRegistry>
      <ProtectedRoute>
        {/* Sustituimos el div por Box. Usamos 'component="div"' si necesitas mantener la etiqueta en el DOM */}
        <Box
          component="div"
          className="page page-home"
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header />
          <Buscador esMiniatura={esMiniatura} setEsMiniatura={setEsMiniatura} />
        </Box>
      </ProtectedRoute>
    </ThemeRegistry>
  );
}
