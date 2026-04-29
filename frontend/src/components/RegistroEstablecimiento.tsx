"use client";
import { useGoogleMaps } from "../components/providers/GoogleMapsProvider";
import { useState, useRef, useEffect } from "react";
import { Autocomplete, } from "@react-google-maps/api";
import { Box, Container, TextField, Button, Typography, Card, CardContent, CircularProgress, } from "@mui/material";
import { ENDPOINTS } from "../app/config";
import { validarDocumentoCompleto, validarCP } from "../app/utils";
import { authService } from "../services/authService";



export default function RegistroEstablecimiento() {
  const { isLoaded, loadError } = useGoogleMaps();

  if (loadError) return <div>Error al cargar mapas</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  const [vista, setVista] = useState("seleccion");
  const [editId, setEditId] = useState<number | null>(null);
  const [cifBusqueda, setCifBusqueda] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const autocompleteRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    nombre_comercio: "",
    cif_nif: "",
    grupo: "",
    categoria: "",
    direccion: "",
    municipio: "",
    provincia: "",
    cp: "",
    telefono: "",
    correo: "",
    latitud: 0,
    longitud: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      if (!authService.isAuthenticated()) return;

      const res = await fetch(ENDPOINTS.MI_LOCAL, {
        headers: authService.getAuthHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        setFormData(data);
        setEditId(data.id);
        setVista("formulario");
      }
    };

    cargarDatos();
  }, []);

  const buscarMiNegocio = async () => {
    if (!cifBusqueda || !password) return;

    setLoading(true);

    const res = await fetch(`${ENDPOINTS.BUSCAR_CIF}${cifBusqueda}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (res.ok) {
      authService.setToken(data.access);
      setFormData(data);
      setEditId(data.id);
      setVista("formulario");
    }

    setLoading(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const url = editId
      ? `${ENDPOINTS.ESTABLECIMIENTOS}${editId}/`
      : ENDPOINTS.ESTABLECIMIENTOS;

    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        ...authService.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, password }),
    });

    if (res.ok) {
      alert("Guardado correctamente");
      setVista("seleccion");
    }
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place) return;

    const coords = place.geometry.location;

    setFormData((prev) => ({
      ...prev,
      direccion: place.name,
      latitud: coords.lat(),
      longitud: coords.lng(),
    }));
  };

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        {vista === "seleccion" && (
          <Card>
            <CardContent>
              <Typography variant="h6">Bienvenido</Typography>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => setVista("formulario")}
              >
                Nuevo registro
              </Button>

              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => setVista("busqueda")}
              >
                Ya estoy registrado
              </Button>
            </CardContent>
          </Card>
        )}

        {vista === "busqueda" && (
          <Card>
            <CardContent>
              <Typography>Buscar negocio</Typography>

              <TextField
                fullWidth
                label="CIF"
                value={cifBusqueda}
                onChange={(e) => setCifBusqueda(e.target.value)}
                sx={{ mt: 2 }}
              />

              <TextField
                fullWidth
                type="password"
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mt: 2 }}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={buscarMiNegocio}
              >
                {loading ? <CircularProgress size={20} /> : "Buscar"}
              </Button>
            </CardContent>
          </Card>
        )}

        {vista === "formulario" && (
          <Card>
            <CardContent>
              <Typography variant="h6">
                {editId ? "Editar negocio" : "Nuevo negocio"}
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.nombre_comercio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre_comercio: e.target.value,
                    })
                  }
                  sx={{ mt: 2 }}
                />

                <TextField
                  fullWidth
                  label="CIF"
                  value={formData.cif_nif}
                  error={!validarDocumentoCompleto(formData.cif_nif)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cif_nif: e.target.value,
                    })
                  }
                  sx={{ mt: 2 }}
                />

                <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceChanged}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    value={formData.direccion}
                    sx={{ mt: 2 }}
                  />
                </Autocomplete>

                <Box
                  display="flex"
                  gap={2}
                  mt={2}
                  flexDirection={{ xs: "column", sm: "row" }}
                >
                  <TextField
                    fullWidth
                    label="Municipio"
                    value={formData.municipio}
                  />

                  <TextField
                    fullWidth
                    label="CP"
                    value={formData.cp}
                    error={!validarCP(formData.cp)}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Correo"
                  value={formData.correo}
                  sx={{ mt: 2 }}
                />

                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  sx={{ mt: 2 }}
                />

                <TextField
                  fullWidth
                  type="password"
                  label="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mt: 2 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3 }}
                >
                  Guardar
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}