"use client";
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useMemo, useEffect, useState } from 'react';

const containerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 40.4167, lng: -3.7037 };

interface Punto {
  id_establecimiento: string | number;
  nombre_comercio: string;
  direccion: string;
  latitud: number;
  longitud: number;
}

export default function Mapa({ puntos }: { puntos: Punto[] }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey:process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  // Estado para saber qué marcador se ha pulsado
  const [selected, setSelected] = useState<Punto | null>(null);

  const center = useMemo(() => {
    if (puntos && puntos.length > 0) {
      return { lat: Number(puntos[0].latitud), lng: Number(puntos[0].longitud) };
    }
    return defaultCenter;
  }, [puntos]);

  useEffect(() => {
    if (map && puntos.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      puntos.forEach(p => bounds.extend({ lat: Number(p.latitud), lng: Number(p.longitud) }));
      map.fitBounds(bounds);
    }
  }, [map, puntos]);

  if (!isLoaded) return <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Cargando mapa...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={(m) => setMap(m)}
      onClick={() => setSelected(null)} // Cerrar ventana al pulsar fuera
      options={{ streetViewControl: false, mapTypeControl: false }}
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
          position={{ lat: Number(selected.latitud), lng: Number(selected.longitud) }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="p-2 text-black max-w-[200px]">
            <h4 className="font-bold text-blue-700 text-sm mb-1">{selected.nombre_comercio}</h4>
            <p className="text-xs text-gray-600 leading-tight">{selected.direccion}</p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}