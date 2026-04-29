"use client"; //Indica que este componente se ejecuta en el navegador
import { useGoogleMaps } from "../components/providers/GoogleMapsProvider";
import { GoogleMap, useJsApiLoader, InfoWindowF } from "@react-google-maps/api";
import { useMemo, useEffect, useState } from "react";

const LIBRARIES: (
  | "marker"
  | "places"
  | "drawing"
  | "geometry"
  | "visualization"
)[] = ["marker", "places", "geometry"];
const CONTAINER_STYLE = { width: "100%", height: "400px" };
const defaultCenter = { lat: 40.4167, lng: -3.7037 };

interface ResultadoBusqueda {
  id_establecimiento: string | number;
  nombre_comercio: string;
  direccion: string;
  latitud: number;
  longitud: number;
  tipo: "comercio_propio" | "servicio_propio" | "google"; // Esto es clave
  promedio_valoraciones?: number;
  numero_valoraciones?: number;
  categoria?: string;
  nombre_profesional?: string;
}

function MarcadorInteligente({ map, p, onClick }: any) {
  useEffect(() => {
    if (!map || !window.google?.maps?.marker) return;

    let colorPin;
    if (p.tipo === "servicio_propio") {
      colorPin = "#22c55e"; // Verde
    } else if (p.tipo === "comercio_propio") {
      colorPin = "#4285F4"; // Azul
    } else {
      colorPin = "#EA4335"; // Rojo
    }

    const pinElement = new window.google.maps.marker.PinElement({
      background: colorPin,
      borderColor: "white",
      glyphColor: "white",
    });

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position: {
        lat: Number(p.latitud),
        lng: Number(p.longitud),
      },
      title: p.nombre_comercio,
      content: pinElement.element,
    });

    const listener = marker.addListener("click", onClick);

    return () => {
      if (listener) google.maps.event.removeListener(listener);
      marker.map = null;
    };
  }, [map, p, onClick]);

  return null;
}

export default function Mapa({ puntos = [] }: { puntos: ResultadoBusqueda[] }) {
  const { isLoaded, loadError } = useGoogleMaps();

  if (loadError) return <div>Error al cargar mapas</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selected, setSelected] = useState<any | null>(null);

  // Calculamos el centro
  const center = useMemo(() => {
    if (puntos && puntos.length > 0) {
      return {
        lat: Number(puntos[0].latitud),
        lng: Number(puntos[0].longitud),
      };
    }

    return defaultCenter;
  }, [puntos]);

  // Ajuste automático de zoom
  useEffect(() => {
    if (map && puntos.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      let hayDatos = false;

      puntos.forEach((p) => {
        bounds.extend({ lat: Number(p.latitud), lng: Number(p.longitud) });
        hayDatos = true;
      });

      if (hayDatos) {
        map.fitBounds(bounds);
      }
    }
  }, [map, puntos]);

  if (!isLoaded)
    return (
      <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 text-sm">
        Cargando mapa...
      </div>
    );
  console.log(
    "Comprobando Map ID:",
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
  );
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <GoogleMap
        mapContainerStyle={CONTAINER_STYLE}
        center={center}
        zoom={14}
        onLoad={(m) => setMap(m)}
        onClick={() => setSelected(null)}
        options={{
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* Marcadores de Comercios */}
        {Array.isArray(puntos) &&
          puntos.map((p) => (
            <MarcadorInteligente
              key={p.id_establecimiento}
              map={map} // Le pasamos el mapa
              p={p}
              onClick={() => setSelected(p)}
            />
          ))}

        {/* Ventana de información */}
        {selected && (
          <InfoWindowF
            position={{
              lat: Number(selected.latitud || selected.lat),
              lng: Number(selected.longitud || selected.lng),
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="p-2 text-black max-w-[200px]">
              <h4 className="font-bold text-blue-700 text-sm mb-1">
                {selected.nombre_comercio || selected.categoria}
              </h4>

              {selected.promedio_valoraciones !== undefined && (
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-yellow-500 text-xs">
                    {"★".repeat(Math.floor(selected.promedio_valoraciones))}
                    {"☆".repeat(5 - Math.floor(selected.promedio_valoraciones))}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    ({selected.promedio_valoraciones})
                  </span>
                </div>
              )}

              <p className="text-xs text-gray-600 leading-tight">
                {selected.direccion || `Pro: ${selected.nombre_profesional}`}
              </p>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}