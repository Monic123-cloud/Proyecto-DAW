"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");

    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const aceptar = () => {
    localStorage.setItem("cookiesAccepted", "accepted");
    setVisible(false);
  };

  const rechazar = () => {
    localStorage.setItem("cookiesAccepted", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        width: {
          xs: "95%",
          md: "70%",
        },
        zIndex: 9999,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          backgroundColor: "#b8a1f7",
          color: "white",
          borderRadius: 3,
          p: 5,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
        >
          Utilizamos cookies
        </Typography>

        <Typography
          sx={{
            color: "#121212",
            lineHeight: 1.8,
            mb: 4,
          }}
        >
          Usamos cookies y otras técnicas de rastreo para
          mejorar tu experiencia de navegación en nuestra web,
          mostrar contenido personalizado y analizar el tráfico.

          {" "}Consulta nuestra{" "}

          <Link
            href="/legal"
            style={{
              color: "#dff3ec",
              textDecoration: "none",
            }}
          >
            Política de Privacidad y Términos de uso.
          </Link>
        </Typography>

        <Box
          display="flex"
          gap={2}
          flexWrap="wrap"
        >
          <Button
            variant="contained"
            onClick={aceptar}
            sx={{
              backgroundColor: "white",
              color: "black",
              px: 4,

              "&:hover": {
                backgroundColor: "#10b981",
              },
            }}
          >
            Aceptar
          </Button>

          <Button
            variant="outlined"
            onClick={rechazar}
            sx={{
              borderColor: "#777",
              color: "white",
              px: 4,

              "&:hover": {
                borderColor: "red",
                color:"red"
              },
            }}
          >
            Rechazar
          </Button>

         
          
        </Box>
      </Paper>
    </Box>
  );
}