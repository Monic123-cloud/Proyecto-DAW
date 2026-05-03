"use client";
import React, { useState } from "react";
import { 
  TextField, Button, Card, CardContent, Typography, Grid, 
  Alert, CircularProgress, Snackbar, Box , Container
} from "@mui/material";
import AxiosInstance from "./AxiosInstance"; // Importamos tu instancia de Axios
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

export default function RegistroAyuda() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  // Estado inicial con los campos del modelo SolicitudAyuda
  const [formData, setFormData] = useState({
    nombre_completo: "",
    telefono: "",
    email: "",
    cp: "",
    fecha_nacimiento: "",
    descripcion: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ texto: "", tipo: "" });

    try {
      // POST a la URL de Django que configuramos en urls.py
      await AxiosInstance.post("/solicitudes-ayuda/", formData); 
      setMensaje({
        texto: "¡Solicitud enviada con éxito!",
        tipo: "success"
      });
      // Limpiar formulario tras el éxito
      setFormData({
        nombre_completo: "",
        telefono: "",
        email: "",
        cp: "",
        fecha_nacimiento: "",
        descripcion: "",
      });
    } catch (err: any) {
      setMensaje({
        texto: "No se pudo enviar la solicitud. Revisa la conexión con el servidor.",
        tipo: "error"
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
            {/* TÍTULO Y SUBTÍTULO CONSISTENTE */}
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              align="center"
              color="primary"
            >
              Solicitar Ayuda
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              sx={{ mb: 4 }}
            >
              Cuéntanos qué necesitas y te conectaremos con voluntarios de tu zona
            </Typography>

            {/* ALERTAS DE ESTADO */}
            {mensaje.texto && (
              <Alert severity={mensaje.tipo as any} sx={{ mb: 3 }}>
                {mensaje.texto}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nombre Completo"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />

              <Box display="flex" gap={2} mb={2} flexDirection={{ xs: "column", sm: "row" }}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Box>

              <Box display="flex" gap={2} mb={2} flexDirection={{ xs: "column", sm: "row" }}>
                <TextField
                  fullWidth
                  label="Código Postal"
                  name="cp"
                  value={formData.cp}
                  onChange={handleChange}
                  required
                  inputProps={{ maxLength: 5 }}
                  helperText="Para matching local"
                />
                <TextField
                  fullWidth
                  label="Fecha de Nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  required
                />
              </Box>

              <TextField
                fullWidth
                label="¿En qué podemos ayudarte?"
                name="descripcion"
                multiline
                rows={4}
                value={formData.descripcion}
                onChange={handleChange}
                required
                placeholder="Describe brevemente tu situación..."
                sx={{ mb: 4 }}
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
                  "Enviar Solicitud "
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}