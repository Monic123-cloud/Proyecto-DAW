"use client"; //Indica que este componente se ejecuta en el navegador
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { useMemo, useEffect, useState } from "react"; // Para manejar el estado del mapa, el punto seleccionado y la carga del mapa

const containerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "300px"
};
const defaultCenter = { lat: 40.4167, lng: -3.7037 };
////define qué debe tener el Punto
interface Punto {
  id_establecimiento: string | number;
  nombre_comercio: string;
  direccion: string;
  latitud: number;
  longitud: number;
}
//componente funcional exportado que recibe un array de puntos y renderiza el mapa con marcadores e info
export default function Mapa({ puntos }: { puntos: Punto[] }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Estado para saber qué marcador se ha pulsado
  const [selected, setSelected] = useState<Punto | null>(null);
  // Calculamos el centro del mapa usando useMemo para evitar recalcularlo en cada renderizado
  const center = useMemo(() => {
    if (puntos && puntos.length > 0) {
      return {
        lat: Number(puntos[0].latitud),
        lng: Number(puntos[0].longitud),
      };
    }
    return defaultCenter; // Si no hay puntos, centramos en Madrid por defecto
  }, [puntos]);

  // Cada vez que cambian los puntos o el mapa, ajustamos el zoom para que se vean todos los marcadores
  useEffect(() => {
    if (map && puntos.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      puntos.forEach((p) =>
        bounds.extend({ lat: Number(p.latitud), lng: Number(p.longitud) }),
      );
      map.fitBounds(bounds);
    }
  }, [map, puntos]);

  if (!isLoaded)
    return (
      <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
        Cargando mapa...
      </div>
    );

  return (
    <div style={{width:"100%", height:"100%"}}>
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={(m) => setMap(m)}
      onClick={() => setSelected(null)} // Cerrar ventana al pulsar fuera
      options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
    >
      {puntos.map((p) => (
        <MarkerF
          key={p.id_establecimiento}
          position={{ lat: Number(p.latitud), lng: Number(p.longitud) }}
          onClick={() => setSelected(p)} // Al pulsar, lo guardamos en 'selected'
        />
      ))}

      {/* Si hay un punto seleccionado, mostramos la ventanita */}
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
    </div>
  );
}
