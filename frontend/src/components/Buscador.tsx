"use client"; //Indica que este componente se ejecuta en el navegador (necesario para usar hooks y eventos)

import { useState } from "react"; // Para manejar el estado de los comercios, el código postal y la carga
import { ENDPOINTS } from "../app/config";
import Mapa from "./Mapa";

//define qué debe tener Comercio
interface Comercio {
  id_establecimiento: string | number;
  nombre_comercio: string;
  direccion: string;
  cp: string;
  latitud: number;
  longitud: number;
}
//componente funcional exportado que permite encapsular la lógica de búsqueda, geolocalización y renderizado
export default function Buscador() {
  const [comercios, setComercios] = useState<Comercio[]>([]);
  const [loading, setLoading] = useState(false); // Para mostrar "Cargando..." mientras se obtiene la respuesta
  const [cp, setCp] = useState("");

  // Función para buscar comercios por código postal o por ubicación actual.Asíncrona para que la web no se congele mientras espera la respuesta
  const buscarComercios = async () => {
    if (!cp.trim()) return;
    setLoading(true); // Activa el estado de carga para mostrar feedback al usuario
    // Realiza la petición al backend con el código postal como parámetro
    try {
      const url = `${ENDPOINTS.BUSCADOR}?cp=${cp}`; // Construye la URL con el código postal
      const response = await fetch(url); //envía la petición HTTP al backend y espera la respuesta

      if (!response.ok) throw new Error("Error en la respuesta");

      const data = await response.json(); // 'data' recibe el JSON convertido en un Array de objetos
      setComercios(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
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
          const url = `http://localhost:8000/api/buscador/buscar/?lat=${latitude}&lng=${longitude}`;
          const response = await fetch(url);
          const data = await response.json();
          setComercios(data);
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

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Panel Superior: BUSCADOR Y MAPA */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          🔍 Explorador de Comercios
        </h2>

        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={obtenerUbicacionActual}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 text-2xl px-5 rounded-2xl transition-all border border-gray-200 disabled:opacity-50"
            title="Usar mi ubicación actual"
          >
            {" "}
            📍{" "}
          </button>
          <input
            type="text"
            placeholder="Código Postal (ej: 28042)..."
            className="border-2 border-gray-100 p-4 rounded-2xl flex-1 focus:border-blue-500 outline-none transition-all text-black"
            value={cp}
            onChange={(e) => setCp(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscarComercios()}
          />
          <button
            onClick={buscarComercios}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl transition-all disabled:bg-blue-300"
          >
            {loading ? "..." : "Buscar"}
          </button>

        </div>

        {/* Mapa */}
        <div className="flex-1 min-h-0">
          <Mapa puntos={comercios} />
        </div>
      </div>

      {/* Listado de Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comercios.length > 0
          ? comercios.map((c) => (
              <div
                key={c.id_establecimiento}
                className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-blue-900 text-lg mb-1">
                  {c.nombre_comercio}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{c.direccion}</p>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                  CP: {c.cp}
                </span>
              </div>
            ))
          : !loading && (
              <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                Ingresa un código postal para ver resultados
              </div>
            )}
      </div>
    </div>
  );
}
