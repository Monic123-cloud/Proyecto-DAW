import React, { useState, useEffect } from "react";
import api from "./AxiosInstance";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface Recomendacion {
  negocio: string;
  razon: string;
}

interface Props {
  codigoPostal: string;
}

const ExpertoMercado: React.FC<Props> = ({ codigoPostal }) => {
  const [analisis, setAnalisis] = useState<Recomendacion[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAnalisis(null);
  }, [codigoPostal]);

  const obtenerAnalisis = async () => {
    if (!codigoPostal || codigoPostal.length !== 5) {
      alert("Por favor, introduce un código postal válido de 5 dígitos.");
      return;
    }

    setLoading(true);
    setAnalisis(null);

    try {
      const response = await api.get(
        `/buscador/experto-mercado/?cp=${codigoPostal}`,
      );
      // Accedemos a response.data (Axios) -> .data (JSON del back) -> .recomendaciones
      const datosExtraidos =
        response.data?.data?.recomendaciones || response.data?.recomendaciones;

      if (datosExtraidos) {
        setAnalisis(datosExtraidos);
      } else {
        console.error("No se encontraron recomendaciones:", response.data);
      }
    } catch (error) {
      console.error("Error al consultar con el experto de Gemini:", error);
      alert("No se ha podido analizar la zona en este momento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Botón con el estilo del Buscador */}
      <Button
        variant="contained"
        fullWidth={false}
        onClick={obtenerAnalisis}
        disabled={loading}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <AutoAwesomeIcon />
          )
        }
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(4px)",
          color: "white",
          textTransform: "none",
          fontWeight: "600",
          borderRadius: "12px",
          px: 3,
          py: 1,
          border: "1px solid rgba(255,255,255,0.3)",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.25)",
            border: "1px solid rgba(255,255,255,0.5)",
          },
          "&.Mui-disabled": {
            color: "rgba(255,255,255,0.5)",
            bgcolor: "rgba(255,255,255,0.05)",
          },
        }}
      >
        {loading ? "Analizando mercado..." : "Consultar experto en zona"}
      </Button>

      {/* Resultados del análisis */}
      {analisis && (
        <Box sx={{ mt: 3, animation: "fadeIn 0.5s ease-in-out" }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "white",
              fontWeight: "bold",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            ✨ Recomendaciones estratégicas para el CP {codigoPostal}
          </Typography>

          <Stack spacing={2}>
            {analisis.map((item, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  borderLeft: "6px solid #D1C4E9", // Color lila para diferenciar
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateX(5px)" },
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="primary"
                  sx={{
                    textTransform: "uppercase",
                    mb: 0.5,
                    letterSpacing: 0.5,
                  }}
                >
                  📍 {item.negocio}
                </Typography>
                <Divider sx={{ my: 1, opacity: 0.1 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {item.razon}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {/* Estilos globales para la animación de entrada */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};

export default ExpertoMercado;
