"use client";

import React, { useState } from "react";
import { authService } from "../services/authService";
import { ENDPOINTS } from "../app/config";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
  Container,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
} from "@mui/material";

const CATEGORIAS_SERVICIOS = {
  Educación: [
    "Clases de Idiomas",
    "Recuperación Escolar",
    "Oposiciones",
    "Música",
  ],
  Cuidados: [
    "Cuidado de niños",
    "Llevar/Recoger del cole",
    "Acompañamiento mayores",
  ],
  Hogar: ["Limpieza del hogar", "Plancha", "Cocina a domicilio"],
  Mascotas: ["Paseador de perros", "Cuidado de mascotas"],
  Reparaciones: [
    "Cerrajero",
    "Fontanería",
    "Electricidad",
    "Pequeñas reparaciones",
  ],
};

const RegistroServicio = () => {
  const [datos, setDatos] = useState({
    categoria: "",
    descripcion: "",
    precio_hora: "",
  });

  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
    >,
  ) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ texto: "Enviando...", tipo: "info" });

    try {
      const response = await fetch(ENDPOINTS.SERVICIOS, {
        method: "POST",
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      const resData = await response.json();

      if (response.ok) {
        setMensaje({
          texto: "¡Servicio publicado con éxito!",
          tipo: "success",
        });
        setDatos({ categoria: "", descripcion: "", precio_hora: "" });
      } else {
        const errorMsg =
          resData.error ||
          (resData && typeof resData === "object"
            ? Object.values(resData)[0]
            : "Error al publicar");

        setMensaje({
          texto: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg,
          tipo: "error",
        });
      }
    } catch (error) {
      setMensaje({
        texto: "Error de conexión con el servidor.",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} mb={5}>
        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              align="center"
              color="primary"
            >
              Publicar Nuevo Servicio
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mb: 4 }}
            >
              Completa los datos para ofrecer tus servicios a la comunidad
            </Typography>

            {mensaje.texto && (
              <Alert severity={mensaje.tipo as any} sx={{ mb: 3 }}>
                {mensaje.texto}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              {/* SELECT DE CATEGORÍAS */}
              <TextField
                select
                fullWidth
                label="Selecciona una categoría"
                name="categoria"
                value={datos.categoria}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              >
                {Object.entries(CATEGORIAS_SERVICIOS).flatMap(
                  ([grupo, opciones]) => [
                    <MenuItem
                      key={`header-${grupo}`}
                      disabled
                      sx={{
                        fontWeight: "bold",
                        opacity: 1,
                        color: "black",
                        bgcolor: "#f5f5f5",
                        "&.Mui-disabled": { opacity: 1 }, // Asegura que se vea bien aunque esté disabled
                      }}
                    >
                      {grupo}
                    </MenuItem>,
                    ...opciones.map((opcion) => (
                      <MenuItem key={opcion} value={opcion} sx={{ pl: 4 }}>
                        {opcion}
                      </MenuItem>
                    )),
                  ],
                )}
              </TextField>
              {/* DESCRIPCIÓN */}
              <TextField
                fullWidth
                label="Descripción detallada"
                name="descripcion"
                multiline
                rows={4}
                value={datos.descripcion}
                onChange={handleChange}
                placeholder="Ej: Ofrezco clases particulares de matemáticas para nivel ESO y Bachillerato..."
                required
                sx={{ mb: 3 }}
              />

              {/* PRECIO */}
              <TextField
                fullWidth
                label="Precio por hora (€)"
                name="precio_hora"
                type="number"
                value={datos.precio_hora}
                onChange={handleChange}
                required
                sx={{ mb: 4 }}
                inputProps={{ min: 0, step: "0.5" }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ py: 1.5, fontWeight: "bold" }}
              >
                {loading ? (
                  <CircularProgress size={26} color="inherit" />
                ) : (
                  "Publicar Servicio"
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default RegistroServicio;
