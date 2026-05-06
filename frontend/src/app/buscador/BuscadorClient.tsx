"use client";

import { useState } from "react";
import Buscador from "../../components/Buscador";
import { Box } from "@mui/material";

export default function BuscadorClient() {
  const [esMiniatura, setEsMiniatura] = useState(false);

  return (
    <Box
      component="div"
      className="page page-home"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Buscador esMiniatura={esMiniatura} setEsMiniatura={setEsMiniatura} />
    </Box>
  );
}
