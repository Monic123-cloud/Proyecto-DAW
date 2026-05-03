"use client";
import { useGoogleMaps } from "../components/providers/GoogleMapsProvider";
import { useState, useRef, useEffect } from "react";
import { Autocomplete } from "@react-google-maps/api";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { ENDPOINTS } from "../app/config";
import { validarDocumentoCompleto, validarCP } from "../app/utils";
import { authService } from "../services/authService";

interface FormState {
  nombre_comercio: string;
  cif_nif: string;
  grupo: string;
  categoria: string;
  subcategoria: string;
  categoria_libre: string;
  subcategoria_libre: string;
  direccion: string;
  numero: string;
  municipio: string;
  provincia: string;
  cp: string;
  telefono: string;
  correo: string;
  latitud: number;
  longitud: number;
}

const GOOGLE_MAPS_LIBRARIES: ("marker" | "places" | "geometry")[] = [
  "marker",
  "places",
  "geometry",
];

export const ESTRUCTURA: Record<string, Record<string, string[] | null>> = {
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

  const [vista, setVista] = useState("seleccion");
  const [editId, setEditId] = useState<number | null>(null);
  const [cifBusqueda, setCifBusqueda] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [formData, setFormData] = useState<FormState>({
    nombre_comercio: "",
    cif_nif: "",
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
    latitud: 0,
    longitud: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      // Si no hay token, ni lo intentamos
      if (!authService.isAuthenticated()) return;

      try {
        const res = await fetch(ENDPOINTS.MI_LOCAL, {
          headers: authService.getAuthHeaders(),
        });

        if (res.ok) {
          const data = await res.json();
          setFormData(data);
          setEditId(data.id);
          setVista("formulario");
        } else if (res.status === 401) {
          // SI DA 401, LIMPIAMOS Y NOS QUEDAMOS EN LA VISTA DE SELECCIÓN
          console.warn("Sesión expirada o inválida");
          // authService.logout(); // Si tienes este método, úsalo
          setVista("seleccion");
        }
      } catch (err) {
        console.error("Error cargando datos iniciales:", err);
      }
    };
    cargarDatos();
  }, []);

  const buscarMiNegocio = async () => {
    if (!cifBusqueda || !password) return;
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
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
    // El chequeo de components es vital
    if (!place || !place.address_components || !place.geometry) return;

    const coords = place.geometry.location;

    let addressInfo = {
      direccion: place.name || "",
      cp: "",
      municipio: "",
      provincia: "",
    };

    place.address_components.forEach((component: any) => {
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
      cp: addressInfo.cp, // Forzamos a que use lo que diga Google, aunque sea vacío
      municipio: addressInfo.municipio,
      provincia: addressInfo.provincia,
      latitud: coords?.lat() || 0,
      longitud: coords?.lng() || 0,
    }));
  };

  if (loadError) return <Typography p={4}>Error al cargar mapas</Typography>;
  if (!isLoaded)
    return (
      <Box display="flex" justifyContent="center" p={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        {/* VISTA: SELECCIÓN INICIAL */}
        {vista === "seleccion" && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bienvenido
              </Typography>
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

        {/* VISTA: BÚSQUEDA */}
        {vista === "busqueda" && (
          <Card>
            <CardContent>
              <Typography variant="h6">Buscar negocio</Typography>
              <TextField
                fullWidth
                label="CIF/NIF"
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

        {/* VISTA: FORMULARIO (REGISTRO/EDICIÓN) */}
        {vista === "formulario" && (
          <Card>
            <CardContent>
              <Typography variant="h6">
                {editId ? "Editar negocio" : "Nuevo negocio"}
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                {/* Nombre y Documento */}
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
                  label="CIF/NIF"
                  value={formData.cif_nif}
                  error={
                    formData.cif_nif !== "" &&
                    !validarDocumentoCompleto(formData.cif_nif)
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, cif_nif: e.target.value })
                  }
                  sx={{ mt: 2 }}
                />

                {/* Bloque de Actividad (Select Dinámico) */}
                <TextField
                  select
                  fullWidth
                  label="Bloque de Actividad"
                  value={formData.grupo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      grupo: e.target.value,
                      categoria: "",
                      subcategoria: "",
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ native: true }}
                  sx={{ mt: 2 }}
                >
                  <option value=""></option>
                  {Object.keys(ESTRUCTURA).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </TextField>

                {/* Categoría */}
                {formData.grupo && (
                  <TextField
                    select
                    fullWidth
                    label="Categoría"
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoria: e.target.value,
                        subcategoria: "",
                      })
                    }
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ native: true }}
                    sx={{ mt: 2 }}
                  >
                    <option value=""></option>
                    {Object.keys(ESTRUCTURA[formData.grupo] || {}).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </TextField>
                )}

                {/* Subcategoría */}
                {formData.categoria &&
                  Array.isArray(
                    ESTRUCTURA[formData.grupo]?.[formData.categoria],
                  ) && (
                    <TextField
                      select
                      fullWidth
                      label="Especialidad / Detalle"
                      value={formData.subcategoria}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subcategoria: e.target.value,
                        })
                      }
                      SelectProps={{ native: true }}
                      sx={{ mt: 2 }}
                    >
                      <option value="">Selecciona detalle...</option>
                      {(
                        ESTRUCTURA[formData.grupo][
                          formData.categoria
                        ] as string[]
                      ).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </TextField>
                  )}

                {/* Campos Libres para "Otros..." */}
                {(formData.categoria === "Otros..." ||
                  formData.subcategoria === "Otros...") && (
                  <TextField
                    fullWidth
                    label="Especifica tu actividad"
                    color="warning"
                    value={
                      formData.categoria === "Otros..."
                        ? formData.categoria_libre
                        : formData.subcategoria_libre
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [formData.categoria === "Otros..."
                          ? "categoria_libre"
                          : "subcategoria_libre"]: e.target.value,
                      })
                    }
                    sx={{ mt: 2 }}
                  />
                )}

                {/* Dirección y Número */}
                <Box display="flex" gap={2} mt={2} alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Autocomplete
                      onLoad={(ref) => (autocompleteRef.current = ref)}
                      onPlaceChanged={onPlaceChanged}
                    >
                      <TextField
                        fullWidth
                        label="Dirección"
                        value={formData.direccion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            direccion: e.target.value,
                          })
                        }
                      />
                    </Autocomplete>
                  </Box>
                  <TextField
                    sx={{ width: "120px" }}
                    label="Nº/Portal"
                    value={formData.numero}
                    inputProps={{ maxLength: 6 }}
                    onChange={(e) =>
                      setFormData({ ...formData, numero: e.target.value })
                    }
                    required
                  />
                </Box>

                {/* Municipio y CP */}
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
                    onChange={(e) =>
                      setFormData({ ...formData, municipio: e.target.value })
                    }
                  />
                  <TextField
                    fullWidth
                    label="CP"
                    value={formData.cp}
                    error={formData.cp !== "" && !validarCP(formData.cp)}
                    onChange={(e) =>
                      setFormData({ ...formData, cp: e.target.value })
                    }
                  />
                </Box>

                {/* Contacto y Seguridad */}
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  value={formData.correo}
                  onChange={(e) =>
                    setFormData({ ...formData, correo: e.target.value })
                  }
                  sx={{ mt: 2 }}
                />

                <TextField
                  fullWidth
                  label="Teléfono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  sx={{ mt: 2 }}
                />

                <TextField
                  fullWidth
                  type="password"
                  label="Contraseña del negocio"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ mt: 2 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ mt: 4, mb: 2 }}
                >
                  Guardar Datos
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}
