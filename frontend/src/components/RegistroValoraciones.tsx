import React, { useState } from "react";
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import api from "./AxiosInstance";

interface Props {
  establecimientoId: number;
  nombreComercio: string;
  onSuccess?: () => void;
}

export default function RegistroValoraciones({
  establecimientoId,
  nombreComercio,
  onSuccess,
}: Props) {
  const [puntuacion, setPuntuacion] = useState<number | null>(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async () => {
    if (!puntuacion) return setError("Debes seleccionar una puntuación");

    setLoading(true);
    setError("");

    try {
      // Axios envía el objeto y el interceptor añade el Bearer Token
      await api.post("/api/buscador/valoraciones/", {
        id_establecimiento: establecimientoId,
        puntuacion: puntuacion,
        comentario: comentario,
      });

      setEnviado(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      // Axios captura errores 400 (ya valoró), 401 (no logueado), etc.
      const mensaje =
        err.response?.data?.non_field_errors?.[0] ||
        "Error al enviar valoración";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  if (enviado)
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        ¡Gracias por valorar a {nombreComercio}!
      </Alert>
    );

  return (
    <Card variant="outlined" sx={{ mt: 2, bgcolor: "#f9f9f9" }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography
          variant="overline"
          display="block"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Valorar Establecimiento
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Rating
            name="puntuacion-comercio"
            value={puntuacion}
            precision={1}
            onChange={(event, newValue) => setPuntuacion(newValue)}
            emptyIcon={
              <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
            }
          />
          {puntuacion !== null && (
            <Box sx={{ ml: 2, fontSize: "0.8rem" }}>{puntuacion} estrellas</Box>
          )}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Escribe tu reseña..."
          variant="outlined"
          size="small"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          sx={{ mb: 2, bgcolor: "white" }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: "0.7rem" }}>
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !puntuacion}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {loading ? "Enviando..." : "Publicar"}
        </Button>
      </CardContent>
    </Card>
  );
}
