"use client";

import React, { useState } from "react";
import { authService } from "../services/authService";
import { ENDPOINTS } from "../app/config";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Alert,
  Paper,
  Avatar,
} from "@mui/material";
import { getAuthHeaders } from "../components/utils/authHeader";

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
        headers: getAuthHeaders(),
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
        const errorMsg = resData.error ||
          (resData && typeof resData === 'object' ? Object.values(resData)[0] : "Error al publicar");

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
  const fieldStyles = {
    mb: 3,
    input: { color: "white" },
    textarea: { color: "white" },
    label: { color: "white" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#6c757d" },
      "&:hover fieldset": { borderColor: "white" },
      "&.Mui-focused fieldset": { borderColor: "#ffc107" },
    },
  };
  return (

    <Box
      sx={{
        py: 5,
        px: 2,
        backgroundColor: "#1a3a3a",
        backgroundImage:
          "linear-gradient(rgba(26, 58, 58, 0.8), rgba(26, 58, 58, 0.8)), url('/formularios.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 450 }}>

        {/* CABECERA */}
        <Box textAlign="center" mb={3}>
          <Avatar
            src="/tu-icono.png"
            sx={{ width: 80, height: 80, margin: "0 auto", mb: 1 }}
          />
          <Typography variant="h6" fontWeight="bold" color="white">
            Ofrecer nuevo servicio
          </Typography>
        </Box>

        <Paper
          elevation={6}
          sx={{
            p: 4,
            backgroundColor: "#1e1e1e",
            borderRadius: 3,
          }}
        >
          <form onSubmit={handleSubmit}>

            {/* MENSAJE */}
            {mensaje.texto && (
              <Alert
                severity={mensaje.tipo === "success" ? "success" : "error"}
                sx={{ mb: 3 }}
              >
                {mensaje.texto}
              </Alert>
            )}

            {/* CATEGORÍA */}
            <TextField
              select
              name="categoria"
              value={datos.categoria}
              onChange={handleChange}
              required
              fullWidth
              label="¿Qué servicio ofreces?"
              sx={fieldStyles}
            >
              <MenuItem value="">Selecciona una opción...</MenuItem>

              {Object.entries(CATEGORIAS_SERVICIOS).map(
                ([grupo, opciones]) => [
                  <MenuItem key={grupo} disabled>
                    <strong>{grupo}</strong>
                  </MenuItem>,
                  ...opciones.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  )),
                ],
              )}
            </TextField>

            {/* DESCRIPCIÓN */}
            <TextField
              name="descripcion"
              value={datos.descripcion}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
              label="Descripción del servicio"
              placeholder="Ej: Clases de inglés para B2..."
              sx={fieldStyles}
            />

            {/* PRECIO */}
            <TextField
              type="number"
              name="precio_hora"
              value={datos.precio_hora}
              onChange={handleChange}
              required
              fullWidth
              label="Precio por hora (€)"
              sx={fieldStyles}
            />

            {/* BOTÓN */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: "bold",
                backgroundColor: "#ffc107",
                color: "#275656",
                "&:hover": {
                  backgroundColor: "#e0a800",
                },
              }}
            >
              {loading ? "Publicando..." : "Publicar mi servicio"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );


};

export default RegistroServicio;
