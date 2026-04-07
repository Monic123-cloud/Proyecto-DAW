"use client"; //Indica que este componente se ejecuta en el navegador

import { GoogleMap, useJsApiLoader, InfoWindowF } from "@react-google-maps/api";
import { useMemo, useEffect, useState } from "react";

const LIBRARIES: (
  | "marker"
  | "places"
  | "drawing"
  | "geometry"
  | "visualization"
)[] = ["marker"];
const CONTAINER_STYLE = { width: "100%", height: "400px" };
const defaultCenter = { lat: 40.4167, lng: -3.7037 };

interface Punto {
  id_establecimiento: string | number;
  nombre_comercio: string;
  direccion: string;
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

function MarcadorInteligente({ map, p, onClick, esServicio = false }: any) {
  useEffect(() => {
    if (!map) return;

    // Lógica del ID numérico para el color azul
    const esNuestro = typeof p.id_establecimiento === "number";

    let contenido;

    if (esServicio) {
      // Círculo verde para servicios (como lo tenías antes)
      contenido = document.createElement("div");
      contenido.style.width = "14px";
      contenido.style.height = "14px";
      contenido.style.backgroundColor = "#22c55e";
      contenido.style.borderRadius = "50%";
      contenido.style.border = "2px solid white";
      contenido.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
    } else {
      // Pin oficial: Azul si es BBDD propia azul y si no, rojo
      const pinElement = new window.google.maps.marker.PinElement({
        background: esNuestro ? "#4285F4" : "#EA4335",
        borderColor: "white",
        glyphColor: "white",
      });
      contenido = pinElement.element;
    }

    const marker = new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position: {
        lat: Number(p.latitud || p.lat),
        lng: Number(p.longitud || p.lng),
      },
      title: p.nombre_comercio || p.categoria,
      content: contenido,
    });

    const listener = marker.addListener("click", onClick);

    return () => {
      google.maps.event.removeListener(listener);
      marker.map = null;
    };
  }, [map, p, onClick, esServicio]);

  return null;
}

export default function Mapa({
  puntos = [],
  servicios = [],
}: {
  puntos: Punto[];
  servicios?: Servicio[];
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

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
    if (servicios && servicios.length > 0) {
      return {
        lat: Number(servicios[0].latitud),
        lng: Number(servicios[0].longitud),
      };
    }
    return defaultCenter;
  }, [puntos, servicios]);

  // Ajuste automático de zoom
  useEffect(() => {
    if (map && (puntos.length > 0 || servicios.length > 0)) {
      const bounds = new window.google.maps.LatLngBounds();
      let hayDatos = false;

      puntos.forEach((p) => {
        bounds.extend({ lat: Number(p.latitud), lng: Number(p.longitud) });
        hayDatos = true;
      });

      servicios.forEach((s) => {
        bounds.extend({ lat: Number(s.latitud), lng: Number(s.longitud) });
        hayDatos = true;
      });

      if (hayDatos) {
        map.fitBounds(bounds);
      }
    }
  }, [map, puntos, servicios]);

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
      {/* Marcadores de Servicios (Puntos verdes) */}
      {Array.isArray(servicios) &&
        servicios.map((s) => (
          <MarcadorInteligente
            key={`servicio-${s.id_servicio}`}
            map={map}
            p={s} // Le pasamos el servicio completo
            esServicio={true}
            position={{ lat: Number(s.latitud), lng: Number(s.longitud) }}
            onClick={() => setSelected(s)}
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
  );
}
