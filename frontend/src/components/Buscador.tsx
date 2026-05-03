"use client"; //Indica que este componente se ejecuta en el navegador (necesario para usar hooks y eventos)

import { useState, useEffect } from "react"; // Para manejar el estado de los comercios, el código postal y la carga
import { ENDPOINTS } from "../app/config";
import Mapa from "./Mapa";
import ExpertoMercado from "./ExpertoMercado";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardActions,
  Rating,
  Chip,
  Box,
  Button,
  Paper,
  Grid,
  TextField,
  Typography,
  Modal,
  MenuItem,
  IconButton,
  CircularProgress,
  Container,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import StarIcon from "@mui/icons-material/Star";
import { ESTRUCTURA } from "./RegistroEstablecimiento";

//define qué debe tener Comercio
interface Comercio {
  id_establecimiento: string | number;
  nombre_comercio: string;
  direccion: string;
  cp: string;
  latitud: number;
  longitud: number;
  promedio_valoraciones?: number;
  numero_valoraciones?: number;
}

interface Servicio {
  id_servicio: number;
  categoria: string;
  latitud: number;
  longitud: number;
  nombre_profesional: string;
  precio_hora: string;
}

interface BuscadorProps {
  esMiniatura?: boolean;
  setEsMiniatura: (val: boolean) => void;
  resultadosIniciales?: any[];
  onResultadosChange?: (data: any[]) => void;
}

//componente funcional exportado que permite encapsular la lógica de búsqueda, geolocalización y renderizado
export default function Buscador({
  esMiniatura = false,
  setEsMiniatura,
  resultadosIniciales = [],
  onResultadosChange,
}: BuscadorProps) {
  const [resultados, setResultados] = useState<any[]>(resultadosIniciales);
  const [loading, setLoading] = useState(false); // Para mostrar "Cargando..." mientras se obtiene la respuesta
  const [cp, setCp] = useState("");
  const [valorando, setValorando] = useState<any | null>(null);
  const [puntuacionNueva, setPuntuacionNueva] = useState(5);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [radioDistancia, setRadioDistancia] = useState(5);

  //cargar resultados iniciales
  useEffect(() => {
    if (resultadosIniciales && resultadosIniciales.length > 0) {
      setResultados(resultadosIniciales);

      // Buscamos el CP en el primer resultado que lo tenga
      if (cp.length !== 5) {
        const conCP = resultadosIniciales.find((r: any) => r.cp);

        if (conCP && conCP.cp) {
          const valorCP = conCP.cp.toString().trim();

          if (valorCP.length === 5) {
            setCp(valorCP);
          }
        }
      }
    }
  }, [resultadosIniciales, cp.length]);

  // para leer CP de la url
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cpUrl = params.get("cp");

    // Si hay un CP en la URL y el actual está vacío, lo ponemos
    if (cpUrl && cpUrl.length === 5 && !cp) {
      setCp(cpUrl);
    }
  }, []);

  // Función para buscar comercios por código postal o por ubicación actual.Asíncrona para que la web no se congele mientras espera la respuesta
  const buscarComercios = async () => {
    if (!cp.trim()) return;

    // Traduce categorías para que Google nos entienda y nos devuelva lo que pedimos.
    const TRADUCTOR_GOOGLE = {
      "Salud y Belleza": "beauty_salon|hair_care|spa|gym",
      Restauración: "restaurant|cafe|bar|bakery",
      Alimentación: "supermarket|grocery_or_supermarket|bakery",
      "Moda y Complementos": "clothing_store|jewelry_store|shoe_store",
      "Hogar y Decoración": "home_goods_store|furniture_store",
      "Ocio y Tiempo Libre": "movie_theater|night_club|park",
      "Servicios Profesionales": "accounting|lawyer|bank",
      Motor: "car_repair|car_dealer",
      Tecnología: "electronics_store|computer_store",
      Mascotas: "pet_store|veterinary_care",
      Educación: "school|university",
    };

    window.history.pushState({}, "", `?cp=${cp}`);
    setLoading(true);

    try {
      // Construimos la URL base
      let url = `${ENDPOINTS.BUSCADOR}?cp=${cp}`;

      // 2. Traducimos la categoría si existe
      if (categoriaSeleccionada) {
        // Enviamos tu categoría original (para tu BD)
        url += `&categoria=${encodeURIComponent(categoriaSeleccionada)}`;

        // Enviamos la traducción (para que Django se la pida a Google)
        const traduccion =
          TRADUCTOR_GOOGLE[
            categoriaSeleccionada as keyof typeof TRADUCTOR_GOOGLE
          ] || categoriaSeleccionada;
        url += `&google_type=${encodeURIComponent(traduccion)}`;
      }

      if (radioDistancia) {
        url += `&radio=${radioDistancia}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      });

      if (!response.ok) throw new Error("Error en la respuesta");

      const data = await response.json();
      setResultados(data);

      if (onResultadosChange) onResultadosChange(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  //Se dispara cuando el usuario hace clic en el botón del pin. Es una función de flecha que engloba toda la lógica de geolocalización.
  const obtenerUbicacionActual = () => {
    if (!navigator.geolocation) {
      // Verifica si el navegador soporta geolocalización
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setLoading(true);
    //Este es el método oficial de HTML5 para pedir la ubicación actual
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        //se ejecutará solo si el usuario acepta dar permiso y el navegador logra encontrar la posición.
        const { latitude, longitude } = position.coords;

        try {
          // usamos 'lat' y 'lng' en la URL
          const url = `${ENDPOINTS.GEOLOCALIZAR}?lat=${latitude}&lng=${longitude}`;
          const response = await fetch(url);
          const data = await response.json();

          setResultados(data); // 'data' es el data_final de Django
          if (onResultadosChange) onResultadosChange(data);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        alert("Permiso de ubicación denegado.");
      },
    );
  };
  const enviarValoracion = async () => {
    if (!valorando) return;

    try {
      const url = `${ENDPOINTS.VALORACIONES}`;
      const token = localStorage.getItem("access_token");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${tuToken}`
        },
        body: JSON.stringify({
          puntuacion: puntuacionNueva,
          id_establecimiento: valorando.id_establecimiento || null,
          id_servicio: valorando.id_servicio || null,
        }),
      });

      if (response.ok) {
        alert("¡Valoración enviada con éxito!");
        setValorando(null);
        buscarComercios(); // Refrescamos para ver las nuevas estrellas
      } else {
        alert("Error: Quizás ya valoraste este sitio.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
    >
      {/* 1. SECCIÓN BUSCADOR */}
      <Paper
        elevation={0}
        onClick={(e) => e.stopPropagation()}
        sx={{
          p: esMiniatura ? "8px 4px" : 3,
          borderRadius: 3,
          backgroundColor: "#2DBE8E",
          color: "white",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {!esMiniatura && (
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1.5 }}
          >
            <SearchIcon fontSize="large" color="inherit" /> Buscador de
            Comercios
          </Typography>
        )}

        {/* FILA DE BÚSQUEDA */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* GRUPO IZQUIERDA: Ubicación + TextField */}
          <Box
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            sx={{
              display: "flex",
              gap: 1,
              flexGrow: { xs: 1, md: 2 },
              maxWidth: { md: "400px" },
              alignItems: "center",
              width: { xs: "100%", sm: "60%" },
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                obtenerUbicacionActual();
              }}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                width: 45,
                height: 45,
                flexShrink: 0,
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
            >
              <MyLocationIcon />
            </IconButton>

            <TextField
              size="small"
              fullWidth
              value={cp}
              onChange={(e) => setCp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscarComercios()}
              placeholder="Introduce el Código Postal"
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiInputBase-root": { height: 45, fontSize: "16px" },
              }}
            />
          </Box>

          {/* FILTROS */}
          {!esMiniatura && (
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexGrow: 1,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <TextField
                select
                size="small"
                fullWidth
                label="Actividad"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                sx={{ bgcolor: "white", borderRadius: 2, minWidth: 150 }}
              >
                <MenuItem value="">Todas las categorías</MenuItem>
                {Object.keys(ESTRUCTURA || {}).map((grupo) => (
                  <MenuItem key={grupo} value={grupo}>
                    {grupo}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label="Radio"
                value={radioDistancia}
                onChange={(e) => setRadioDistancia(Number(e.target.value))}
                sx={{ bgcolor: "white", borderRadius: 2, minWidth: 100 }}
              >
                {[5, 10, 20, 50].map((r) => (
                  <MenuItem key={r} value={r}>
                    {r} km
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          <Button
            variant="contained"
            disabled={loading}
            onClick={buscarComercios}
            sx={{
              bgcolor: "#D1C4E9",
              color: "white",
              fontWeight: "bold",
              height: 45,
              px: 4,
              borderRadius: 2,
              minWidth: "fit-content",
              width: { xs: "100%", sm: "auto" },
              "&:hover": { bgcolor: "#B39DDB" },
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "BUSCAR"
            )}
          </Button>
        </Box>

        {!esMiniatura && cp.length === 5 && (
          <Box
            sx={{
              mt: 3,
              pt: 2,
              borderTop: "1px solid rgba(255,255,255,0.2)",
              width: "100%",
            }}
          >
            <ExpertoMercado codigoPostal={cp} />
          </Box>
        )}
      </Paper>
      {/* 2. MAPA */}
      <Paper
        elevation={2}
        onClick={() => esMiniatura && setEsMiniatura?.(false)}
        sx={{
          height: esMiniatura ? 400 : 450,
          borderRadius: 2,
          overflow: "hidden",
          border: "4px solid white",
        }}
      >
        <Mapa puntos={Array.isArray(resultados) ? resultados : []} />
      </Paper>

      {/* 3. RESULTADOS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: esMiniatura ? "1fr" : "1fr 1fr",
            lg: esMiniatura ? "1fr" : "1fr 1fr 1fr",
          },
          gap: 3,
        }}
      >
        {resultados && resultados.length > 0 ? (
          resultados.map((c) => (
            <Card
              key={c.id_establecimiento || c.id_servicio || Math.random()}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 4,
                borderLeft: "6px solid",
                borderColor:
                  c.tipo === "comercio_propio"
                    ? "primary.main"
                    : c.tipo === "servicio_propio"
                      ? "success.main"
                      : "#D1C4E9",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    noWrap
                    sx={{ maxWidth: "75%" }}
                  >
                    {c.nombre_comercio}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 500 }}
                  >
                    {c.categoria || "Sin categoría"}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${c.distancia || 0} km`}
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Rating
                    value={Math.round(c.promedio_valoraciones || 0)}
                    readOnly
                    size="small"
                  />
                  <Typography
                    variant="caption"
                    sx={{ ml: 1, color: "text.secondary" }}
                  >
                    ({c.numero_valoraciones || 0})
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minHeight: "3em" }}
                >
                  {c.direccion ||
                    `Profesional: ${c.nombre_profesional || "No disponible"}`}
                </Typography>
                <Chip
                  label={
                    c.tipo === "comercio_propio"
                      ? "Negocio Local"
                      : c.tipo === "servicio_propio"
                        ? "Servicio"
                        : "Google Maps"
                  }
                  sx={{ mt: 2, fontWeight: "bold" }}
                  size="small"
                  color={
                    c.tipo === "comercio_propio"
                      ? "primary"
                      : c.tipo === "servicio_propio"
                        ? "success"
                        : "default"
                  }
                />
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  fullWidth
                  variant="contained"
                  startIcon={<StarIcon />}
                  onClick={() => setValorando(c)} // <--- Esto es lo que "llena" el estado y abre el modal
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#D1C4E9",
                    color: "white",
                    "&:hover": { bgcolor: "#B39DDB" },
                  }}
                >
                  VALORAR
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Box
            sx={{
              gridColumn: "1 / -1",
              py: 10,
              textAlign: "center",
              opacity: 0.5,
            }}
          >
            <Typography variant="h6">
              {loading
                ? "Buscando establecimientos..."
                : "Sin resultados en esta zona"}
            </Typography>
          </Box>
        )}
      </Box>
      <Modal open={Boolean(valorando)} onClose={() => setValorando(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            borderRadius: 4,
            p: 4,
            boxShadow: 24,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Valorar {valorando?.nombre_comercio}
          </Typography>

          <Rating
            size="large"
            value={puntuacionNueva}
            onChange={(_, newValue) => setPuntuacionNueva(newValue || 5)}
          />

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button fullWidth onClick={() => setValorando(null)}>
              Cancelar
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={enviarValoracion}
              sx={{ bgcolor: "#2DBE8E", "&:hover": { bgcolor: "#24a37a" } }}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
