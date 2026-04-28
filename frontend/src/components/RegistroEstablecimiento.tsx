"use client";

import { useState, useRef, useEffect } from "react";
import { Autocomplete, } from "@react-google-maps/api";
import { ENDPOINTS } from "../app/config";
import { validarDocumentoCompleto, validarCP } from "../app/utils";
import { authService } from "../services/authService";
import { Box, Container, Typography, Button, Paper, Avatar, Stack, TextField, Divider, MenuItem, Grid, CircularProgress } from "@mui/material";
import { useGoogleMaps } from "./providers/GoogleMapsProvider";



const ESTRUCTURA = {
  "Educación y Cultura": {
    Academia: ["Idiomas", "Refuerzo Escolar", "Música", "Otros..."],
    Colegio: ["Infantil", "Primaria", "ESO", "Bachillerato", "Otros..."],
    Instituto: [
      "Ciclos Formativos",
      "Bachillerato",
      "Educación de Adultos",
      "Otros...",
    ],
    Guardería: null,
    "Papelería / Librería": null,
    Biblioteca: null,
    Ludoteca: null,
    "Otros...": null,
  },
  "Salud y Belleza": {
    Farmacia: null,
    "Clínica Dental": null,
    "Centro de Estética": null,
    Peluquería: null,
    Manicura: null,
    "Gimnasio / Centro Deportivo": [
      "Gym",
      "Yoga",
      "Zumba",
      "Baile",
      "Boxeo",
      "Otros...",
    ],
    Fisioterapia: null,
    Óptica: null,
    Veterinaria: null,
    "Centros Salud": ["Público", "Privado", "Concertado"],
    Hospitales: ["Público", "Privado", "Concertado"],
    "Otros...": null,
  },
  Alimentación: {
    Mercado: null,
    Supermercado: null,
    "Frutería / Verdulería": null,
    Pescadería: null,
    "Carnicería / Charcutería": null,
    "Panadería / Pastelería": null,
    Mercadillo: ["Lunes", "Martes", "Miércoles", "Jueves", "Sábado", "Domingo"],
    "Otros...": null,
  },
  "Hostelería (Ocio)": {
    "Bar / Cafetería": null,
    Restaurante: [
      "Pizzería",
      "Hamburguesería",
      "Comida Española",
      "Mexicano",
      "Sushi",
      "Oriental",
      "Otros...",
    ],
    "Pub / Discoteca": null,
    "Comida para llevar": null,
    Cocktelería: null,
    Eventos: ["Conciertos", "Catas", "Teatro", "Otros..."],
    "Clases cocina": null,
    Vinotecas: null,
    "Otros...": null,
  },
  "Servicios y Tiendas": {
    Ferretería: null,
    "Tienda de Ropa": null,
    Calzado: null,
    "Informática / Telefonía": null,
    "Taller Mecánico": null,
    "Tintorería / Lavandería": null,
    Floristería: null,
    "Otros...": null,
  },
};

export default function RegistroEstablecimiento() {
  const { isLoaded, loadError } = useGoogleMaps();



  const [vista, setVista] = useState<"seleccion" | "busqueda" | "formulario">(
    "seleccion",
  );
  const [editId, setEditId] = useState<number | null>(null);
  const [cifBusqueda, setCifBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [password, setPassword] = useState("");

  const [formData, setFormData] = useState({
    nombre_comercio: "",
    cif_nif: "",
    tipo_negocio: "Comercio",
    grupo: "",
    categoria: "",
    subcategoria: "",
    categoria_libre: "",
    subcategoria_libre: "",
    direccion: "",
    numero: "",
    municipio: "",
    provincia: "",
    cp: "",
    telefono: "",
    correo: "",
    url_web: "",
    latitud: 0,
    longitud: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      if (!authService.isAuthenticated()) return;

      try {
        const response = await fetch(ENDPOINTS.MI_LOCAL, {
          method: "GET",
          headers: authService.getAuthHeaders(),
        });

        if (response.ok) {
          const datosExistentes = await response.json();
          setFormData(datosExistentes);
          setEditId(datosExistentes.id_establecimiento || datosExistentes.id);
          setVista("formulario");
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };
    cargarDatos();
  }, []);

  const inputClasses = "form-control bg-dark text-white border-secondary";
  const selectClasses = "form-select bg-dark text-white border-secondary";

  const buscarMiNegocio = async () => {
    if (!cifBusqueda || !password)
      return alert("Por favor, introduce CIF y contraseña");
    setLoading(true);
    try {
      const res = await fetch(`${ENDPOINTS.BUSCAR_CIF}${cifBusqueda}/`, {
        method: "POST", // Usamos POST para poder enviar la password de forma segura
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password, // La contraseña viaja protegida
        }),
      });
      const data = await res.json();

      if (res.ok) {
        authService.setToken(data.access);

        const idReal = data.id_establecimiento || data.id;

        const grupoKey = data.grupo as keyof typeof ESTRUCTURA;
        const catExiste =
          ESTRUCTURA[grupoKey] &&
          Object.keys(ESTRUCTURA[grupoKey]).includes(data.categoria);

        setFormData({
          ...data,
          categoria: catExiste
            ? data.categoria
            : data.categoria
              ? "Otros..."
              : "",
          categoria_libre: catExiste ? "" : data.categoria,
        });

        setEditId(idReal);
        setVista("formulario"); // Saltamos al formulario con los datos cargados
      } else {
        alert(data.error || "No se encontró ningún negocio con ese CIF/NIF.");
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarNegocio = async () => {
    if (!window.confirm("¿Estás seguro de que quieres borrar este negocio?"))
      return;

    setLoading(true);
    try {
      const res = await fetch(`${ENDPOINTS.ESTABLECIMIENTOS}${editId}/`, {
        method: "DELETE",
        headers: authService.getAuthHeaders(),
      });
      if (res.ok) {
        alert("Negocio eliminado.");
        authService.logout();
        setEditId(null);
        setVista("seleccion");
        setFormData({
          nombre_comercio: "",
          cif_nif: "",
          tipo_negocio: "Comercio",
          grupo: "",
          categoria: "",
          subcategoria: "",
          categoria_libre: "",
          subcategoria_libre: "",
          direccion: "",
          numero: "",
          municipio: "",
          provincia: "",
          cp: "",
          telefono: "",
          correo: "",
          url_web: "",
          latitud: 0,
          longitud: 0,
        });

        // 4. Volvemos a la pantalla de selección
        setVista("seleccion");
      } else {
        alert("No se pudo eliminar el negocio. Inténtalo de nuevo.");
      }
    } catch (e) {
      alert("Error de conexión al intentar eliminar.");
    } finally {
      setLoading(false);
    }
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.address_components || !place.geometry) return;

    const coords = place.geometry.location;
    let addressInfo = {
      direccion: place.name || "",
      cp: "",
      municipio: "",
      provincia: "",
    };

    place.address_components.forEach((component) => {
      const types = component.types;
      if (types.includes("postal_code")) addressInfo.cp = component.long_name;
      if (types.includes("locality"))
        addressInfo.municipio = component.long_name;
      if (types.includes("administrative_area_level_2"))
        addressInfo.provincia = component.long_name;
    });

    setFormData((prev) => ({
      ...prev,
      direccion: addressInfo.direccion,
      cp: addressInfo.cp,
      municipio: addressInfo.municipio,
      provincia: addressInfo.provincia,
      latitud: coords?.lat() || 0,
      longitud: coords?.lng() || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validación: Si editamos, necesitamos el token
    if (editId && !authService.isAuthenticated()) {
      alert(
        "Sesión expirada o no encontrada. Por favor, busca tu negocio de nuevo.",
      );
      setLoading(false);
      return;
    }

    const datosAEnviar = {
      ...formData,
      password: password,
      categoria:
        formData.categoria === "Otros..."
          ? formData.categoria_libre
          : formData.categoria,
      subcategoria:
        formData.subcategoria === "Otros..."
          ? formData.subcategoria_libre
          : formData.subcategoria,
    };

    if (password) {
      datosAEnviar.password = password;
    } else if (!editId) {
      alert("La contraseña es obligatoria para nuevos registros.");
      setLoading(false);
      return;
    }
    const url = editId
      ? `${ENDPOINTS.ESTABLECIMIENTOS}${editId}/`
      : ENDPOINTS.ESTABLECIMIENTOS;

    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(datosAEnviar),
      });

      if (response.ok) {
        alert(
          editId
            ? "¡Cambios guardados correctamente!"
            : "¡Negocio registrado con éxito!",
        );
        setVista("seleccion"); // Regresa al menú principal
      } else {
        const errorData = await response.json();
        alert(
          `Error: ${errorData.error || "No se pudo procesar la solicitud"}`,
        );
      }
    } catch (error) {
      console.error("Error en el envío:", error);
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };
  if (!isLoaded) return <div>Cargando mapa...</div>;
  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded)
    return (
      <div className="text-white text-center py-5">Cargando buscador...</div>
    );

  return (

    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          py: 5,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          backgroundColor: "#1a3a3a",
          backgroundImage:
            "linear-gradient(rgba(26,58,58,0.8), rgba(26,58,58,0.8))",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* CABECERA */}
        <Box textAlign="center" mb={4}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              bgcolor: "white",
            }}
          >
            {/* aquí puedes poner logo */}
          </Avatar>

          <Typography variant="h5" fontWeight="bold" color="white">
            Gestión de Negocio
          </Typography>
        </Box>

        {/* CONTENIDO */}
        <Box width="100%" maxWidth={450}>

          {/* VISTA SELECCIÓN */}
          {vista === "seleccion" && (
            <Paper
              elevation={4}
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "#1e1e1e",
                border: "1px solid #444",
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" color="white" mb={3}>
                Bienvenido
              </Typography>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  fullWidth
                  onClick={() => {
                    setEditId(null);
                    setVista("formulario");
                  }}
                >
                  NUEVO REGISTRO
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={() => setVista("busqueda")}
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "#ccc",
                    },
                  }}
                >
                  YA ESTOY REGISTRADO
                </Button>
              </Stack>
            </Paper>
          )}
          {vista === "busqueda" && (
            <Paper
              elevation={4}
              sx={{
                p: 4,
                bgcolor: "#1e1e1e",
                border: "1px solid orange",
                borderRadius: 3,
              }}
            >
              <Typography color="warning.main" mb={2}>
                Buscar mi Ficha
              </Typography>

              <Typography color="gray" mb={2}>
                Introduce tu CIF/NIF para editar tus datos
              </Typography>

              <TextField
                fullWidth
                placeholder="B12345678"
                value={cifBusqueda}
                onChange={(e) =>
                  setCifBusqueda(e.target.value.toUpperCase())
                }
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                type="password"
                label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                color="warning"
                fullWidth
                disabled={loading || !cifBusqueda || !password}
                onClick={buscarMiNegocio}
              >
                {loading ? "Buscando..." : "CARGAR DATOS"}
              </Button>

              <Button
                fullWidth
                sx={{ mt: 2, color: "gray" }}
                onClick={() => setVista("seleccion")}
              >
                Volver
              </Button>
            </Paper>
          )}
          {vista === "formulario" && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: "#1e1e1e",
                border: "1px solid #444",
                boxShadow: 3,
              }}
            >
              {/* TÍTULO */}
              <Typography
                variant="h6"
                align="center"
                sx={{ color: "white", mb: 3 }}
              >
                {editId ? "Editar Negocio" : "Nuevo Registro"}
              </Typography>

              {/* TIPO DE NEGOCIO */}
              <Box mb={3}>
                <Typography
                  variant="caption"
                  sx={{ color: "#bbb", fontWeight: "bold" }}
                >
                  TIPO DE NEGOCIO
                </Typography>

                <Stack direction="row" spacing={2} mt={1}>
                  {["Comercio", "Productor Local"].map((t) => (
                    <Button
                      key={t}
                      fullWidth
                      variant={
                        formData.tipo_negocio === t
                          ? "contained"
                          : "outlined"
                      }
                      color={
                        formData.tipo_negocio === t
                          ? "warning"
                          : "inherit"
                      }
                      onClick={() =>
                        setFormData({
                          ...formData,
                          tipo_negocio: t,
                        })
                      }
                      sx={{
                        color:
                          formData.tipo_negocio === t
                            ? "black"
                            : "white",
                        borderColor: "#666",
                      }}
                    >
                      {t}
                    </Button>
                  ))}
                </Stack>
              </Box>


              {/* NOMBRE */}
              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Nombre del Negocio"
                  value={formData.nombre_comercio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre_comercio: e.target.value,
                    })
                  }
                  placeholder="Ej: Cafetería Central"
                  required
                  variant="outlined"
                  sx={{
                    input: { color: "white" },
                    label: { color: "#bbb" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555" },
                    },
                  }}
                />
              </Box>

              {/* CIF / NIF */}
              <Box mb={3}>
                <TextField
                  fullWidth
                  label="CIF / NIF"
                  value={formData.cif_nif}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cif_nif: e.target.value.toUpperCase().trim(),
                    })
                  }
                  placeholder="Ej: 12345678Z o B12345678"
                  required
                  error={
                    !!formData.cif_nif &&
                    !validarDocumentoCompleto(formData.cif_nif)
                  }
                  helperText={
                    formData.cif_nif &&
                      !validarDocumentoCompleto(formData.cif_nif)
                      ? "El número de identificación no es válido"
                      : ""
                  }
                  sx={{
                    input: { color: "white" },
                    label: { color: "#bbb" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555" },
                    },
                  }}
                />
              </Box>

              <Divider sx={{ my: 4, borderColor: "#555" }} />

              {/* BLOQUE DE ACTIVIDAD */}
              <Box mb={3}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#bbb",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  1. Bloque de Actividad
                </Typography>

                <TextField
                  select
                  fullWidth
                  value={formData.grupo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      grupo: e.target.value,
                      categoria: "",
                      subcategoria: "",
                    })
                  }
                  sx={{
                    mt: 1,
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555" },
                    },
                  }}
                >
                  <MenuItem value="">Selecciona bloque...</MenuItem>
                  {Object.keys(ESTRUCTURA).map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* CATEGORÍA */}
              {formData.grupo && (
                <Box mb={3}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#bbb",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    2. Categoría
                  </Typography>

                  <TextField
                    select
                    fullWidth
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoria: e.target.value,
                        subcategoria: "",
                      })
                    }
                    sx={{
                      mt: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#555" },
                      },
                    }}
                  >
                    <MenuItem value="">Selecciona categoría...</MenuItem>
                    {Object.keys(
                      ESTRUCTURA[formData.grupo as keyof typeof ESTRUCTURA] || {}
                    ).map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}

              {/* SUBCATEGORÍA */}
              {formData.categoria &&
                Array.isArray(
                  (ESTRUCTURA[formData.grupo as keyof typeof ESTRUCTURA] as any)?.[
                  formData.categoria
                  ]
                ) && (
                  <Box mb={3}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "warning.main",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      3. Detalle Especialidad
                    </Typography>

                    <TextField
                      select
                      fullWidth
                      value={formData.subcategoria}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subcategoria: e.target.value,
                        })
                      }
                      sx={{
                        mt: 1,
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "orange",
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Selecciona detalle...</MenuItem>
                      {(
                        ESTRUCTURA[
                        formData.grupo as keyof typeof ESTRUCTURA
                        ] as any
                      )[formData.categoria].map((s: string) => (
                        <MenuItem key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                )}
              {/* DIRECCIÓN CON AUTOCOMPLETE */}
              <Box mb={3}>
                <Typography
                  variant="caption"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Busca tu Dirección *
                </Typography>

                <Autocomplete
                  onLoad={(ref) => (autocompleteRef.current = ref)}
                  onPlaceChanged={onPlaceChanged}
                >
                  <TextField
                    fullWidth
                    placeholder="Calle, número..."
                    value={formData.direccion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        direccion: e.target.value,
                      })
                    }
                    sx={{
                      mt: 1,
                      input: { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#555" },
                      },
                    }}
                  />
                </Autocomplete>
              </Box>

              {/* NÚMERO / PORTAL */}
              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Número / Portal"
                  value={formData.numero}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numero: e.target.value,
                    })
                  }
                  placeholder="Ej: 12, 3B o S/N"
                  required
                  sx={{
                    input: { color: "white" },
                    label: { color: "#bbb" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555" },
                    },
                  }}
                />
              </Box>

              {/* MUNICIPIO / CP / PROVINCIA */}
              <Box mb={3}>
                <Stack direction="row" spacing={2} mb={2}>
                  {/* MUNICIPIO */}
                  <Box flex={2}>
                    <TextField
                      fullWidth
                      label="Municipio"
                      value={formData.municipio}
                      slotProps={{
                        input: {
                          readOnly: true,
                        },
                      }}
                      sx={{
                        input: { color: "white" },
                        label: { color: "#bbb" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#555" },
                        },
                      }}
                    />
                  </Box>

                  {/* CP */}
                  <Box flex={1}>
                    <TextField
                      fullWidth
                      label="C.P."
                      value={formData.cp}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cp: e.target.value,
                        })
                      }
                      sx={{
                        input: { color: "white" },
                        label: { color: "#bbb" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#555" },
                        },
                      }}
                    />
                  </Box>
                </Stack>

                {/* PROVINCIA */}
                <TextField
                  fullWidth
                  label="Provincia"
                  value={formData.provincia}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  sx={{
                    input: { color: "white" },
                    label: { color: "#bbb" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555" },
                    },
                  }}
                />
              </Box>
              {/* CONTACTO */}
              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  type="email"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                  required
                  sx={{
                    input: { color: "white" },
                    label: { color: "#bbb" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555" },
                    },
                  }}
                />
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  sx={{
                    input: { color: "white" },
                    label: { color: "#bbb" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555" },
                    },
                  }}
                />
              </Box>

              <Box mb={3}>
                <TextField
                  fullWidth
                  label="Teléfono de contacto"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  placeholder="Ej: 600000000"
                  required
                  sx={{
                    input: { color: "white" },
                    label: { color: "#bbb" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#555" },
                    },
                  }}
                />
              </Box>

              {/* BOTONES */}
              <Box mt={4}>
                <Stack spacing={2}>
                  {/* BOTÓN PRINCIPAL */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    fullWidth
                    disabled={
                      loading ||
                      !validarDocumentoCompleto(formData.cif_nif) ||
                      !validarCP(formData.cp)
                    }
                    sx={{
                      py: 2,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {loading ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={20} color="inherit" />
                        <span>Procesando...</span>
                      </Stack>
                    ) : editId ? (
                      "Guardar Cambios"
                    ) : (
                      "Finalizar Registro"
                    )}
                  </Button>

                  {/* ACCIONES SECUNDARIAS */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {/* ELIMINAR */}
                    {editId && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={eliminarNegocio}
                      >
                        Eliminar
                      </Button>
                    )}

                    {/* CANCELAR */}
                    <Button
                      variant="text"
                      sx={{ color: "#aaa" }}
                      onClick={() => setVista("seleccion")}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}


        </Box>
      </Box>

    </Container>);
}





