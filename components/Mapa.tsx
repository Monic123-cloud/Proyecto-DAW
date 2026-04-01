"use client";
import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { useMemo, useEffect, useState } from "react";

const libraries: ("places" | "geometry")[] = ["places", "geometry"];
const containerStyle = { width: "100%", height: "400px" };
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
  lat: number;
  lng: number;
  nombre_profesional: string;
  precio_hora: string;
}

export default function Mapa({ puntos, servicios = [] }: { puntos: Punto[],servicios?: Servicio[] }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selected, setSelected] = useState<any | null>(null);

  const center = useMemo(() => {
    if (puntos && puntos.length > 0) {
      return {
        lat: Number(puntos[0].latitud),
        lng: Number(puntos[0].longitud),
      };
    }
    if (servicios && servicios.length > 0) { 
      return { lat: Number(servicios[0].lat), lng: Number(servicios[0].lng) };
    }
    return defaultCenter;
  }, [puntos,servicios]);

  useEffect(() => {
    // Solo ejecutamos si el mapa existe y window.google está disponible
    if (map && puntos.length > 1 && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      let hayDatos = false;

      if (puntos && puntos.length > 0) {
        puntos.forEach((p) => {
          bounds.extend({ lat: Number(p.latitud), lng: Number(p.longitud) });
          hayDatos = true;
        });
      }
    if (servicios && servicios.length > 0) {
        servicios.forEach((s) => {
          bounds.extend({ lat: Number(s.lat), lng: Number(s.lng) });
          hayDatos = true;
        });
      }
      if (hayDatos) {
        map.fitBounds(bounds);
      }
    }
  }, [map, puntos, servicios]);

  // Si por algún motivo llegamos aquí sin la API, mostramos un aviso simple
  if (typeof window !== "undefined" && !window.google) {
    return <div>Esperando a Google Maps...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={(m) => setMap(m)}
      onClick={() => setSelected(null)}
      options={{ streetViewControl: false, mapTypeControl: false }}
    >
      {puntos.map((p) => {
        // Comprobamos si el ID es un número (de tu BBDD) o un texto (de Google)
        const esNuestro = typeof p.id_establecimiento === "number";

        return (
          <MarkerF
            key={p.id_establecimiento}
            position={{ lat: Number(p.latitud), lng: Number(p.longitud) }}
            onClick={() => setSelected(p)}
            // Aquí está el truco del color:
            icon={
              esNuestro
                ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // azul
                : "http://maps.google.com/mapfiles/ms/icons/red-dot.png" // rojo
            }
          />
        );
      })}
      {servicios.map((s) => (
        <MarkerF
          key={`ser-${s.id_servicio}`}
          position={{ lat: Number(s.lat), lng: Number(s.lng) }}
          onClick={() => setSelected(s)}
          icon={{
            path: 0, // Círculo
            fillColor: "#22c55e",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
            scale: 7,
          }}
        />
      ))}
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
