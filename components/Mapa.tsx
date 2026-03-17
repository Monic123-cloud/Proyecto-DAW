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
}

export default function Mapa({ puntos }: { puntos: Punto[] }) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selected, setSelected] = useState<Punto | null>(null);

  const center = useMemo(() => {
    if (puntos && puntos.length > 0) {
      return {
        lat: Number(puntos[0].latitud),
        lng: Number(puntos[0].longitud),
      };
    }
    return defaultCenter;
  }, [puntos]);

  useEffect(() => {
    // Solo ejecutamos si el mapa existe y window.google está disponible
    if (map && puntos.length > 1 && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      puntos.forEach((p) =>
        bounds.extend({ lat: Number(p.latitud), lng: Number(p.longitud) }),
      );
      map.fitBounds(bounds);
    }
  }, [map, puntos]);

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

      {selected && (
        <InfoWindowF
          position={{
            lat: Number(selected.latitud),
            lng: Number(selected.longitud),
          }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="p-2 text-black max-w-[200px]">
            <h4 className="font-bold text-blue-700 text-sm mb-1">
              {selected.nombre_comercio}
            </h4>
            <p className="text-xs text-gray-600 leading-tight">
              {selected.direccion}
            </p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
