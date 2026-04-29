"use client"; //Indica que este componente se ejecuta en el navegador (necesario para usar hooks y eventos)

import { useState, useEffect } from "react"; // Para manejar el estado de los comercios, el código postal y la carga
import { ENDPOINTS } from "../app/config";
import Mapa from "./Mapa";
import ExpertoMercado from "./ExpertoMercado";

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
  resultadosIniciales?: any[];
  onResultadosChange?: (data: any[]) => void;
}

//componente funcional exportado que permite encapsular la lógica de búsqueda, geolocalización y renderizado
export default function Buscador({
  esMiniatura = false,
  resultadosIniciales = [],
  onResultadosChange,
}: BuscadorProps) {
  const [resultados, setResultados] = useState<any[]>(resultadosIniciales);
  const [loading, setLoading] = useState(false); // Para mostrar "Cargando..." mientras se obtiene la respuesta
  const [cp, setCp] = useState("");
  const [valorando, setValorando] = useState<any | null>(null);
  const [puntuacionNueva, setPuntuacionNueva] = useState(5);

  useEffect(() => {
    if (resultadosIniciales && resultadosIniciales.length > 0) {
      setResultados(resultadosIniciales);

      // Buscamos el CP en el primer resultado que lo tenga
      const conCP = resultadosIniciales.find((r: any) => r.cp);

      if (conCP && conCP.cp) {
        const valorCP = conCP.cp.toString().trim();

        // Si tiene 5 cifras, lo grabamos en el estado local
        // Esto hará que 'cp.length === 5' sea verdadero y aparezca Gemini
        if (valorCP.length === 5) {
          setCp(valorCP);
        }
      }
    }
  }, [resultadosIniciales]);

  // Función para buscar comercios por código postal o por ubicación actual.Asíncrona para que la web no se congele mientras espera la respuesta
  const buscarComercios = async () => {
    if (!cp.trim()) return;
    setLoading(true); // Activa el estado de carga para mostrar feedback al usuario
    // Realiza la petición al backend con el código postal como parámetro
    try {
      // Django ya filtra internamente y te da la lista unificada
      const url = `${ENDPOINTS.BUSCADOR}?cp=${cp}`; // Construye la URL con el código postal
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors", // Forzamos explícitamente el modo CORS
      }); //envía la petición HTTP al backend y espera la respuesta
      if (!response.ok) throw new Error("Error en la respuesta");

      const data = await response.json();
      setResultados(data); // 'data' es el data_final de Django
      // Notificar al padre (Home) para que guarde los datos por si se hace zoom
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
    <div
      className={`flex flex-col w-full h-full ${esMiniatura ? "gap-2" : "gap-6"}`}
    >
      {/* 1. BARRA DE BÚSQUEDA */}
      <div
        className={`bg-white rounded-3xl border border-gray-300 ${esMiniatura ? "p-2 shadow-md" : "p-6 shadow-xl"}`}
      >
        {!esMiniatura && (
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            🔍 Explorador de Comercios
          </h2>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              obtenerUbicacionActual();
            }}
            className={`bg-gray-100 hover:bg-gray-200 rounded-xl transition-all ${esMiniatura ? "p-2 text-lg" : "p-5 text-xl flex-1"}`}
          >
            📍
          </button>
          <input
            type="text"
            placeholder={
              esMiniatura ? "CP..." : "Introduce tu código postal..."
            }
            className={`border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none text-black font-bold shadow-sm ${esMiniatura ? "!p-3 text-base !w-32" : "!p-5 text-2xl flex-1"}`}
            value={cp}
            onClick={(e) => e.stopPropagation()} // Evita el zoom al escribir
            onChange={(e) => setCp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                buscarComercios();
              }
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              buscarComercios();
            }}
            disabled={loading}
            className={`bg-blue-700 hover:bg-blue-700 text-white font-black rounded-xl transition-all ${esMiniatura ? "px-3 text-sm" : "px-10 py-4"}`}
          >
            {loading ? "..." : esMiniatura ? "Buscar" : "Buscar"}
          </button>
        </div>

        {/* Experto en Mercado (Solo fuera de miniatura) */}
        {!esMiniatura && cp.length === 5 && (
          <div className="mt-6 border-t pt-4">
            <ExpertoMercado codigoPostal={cp} />
          </div>
        )}
      </div>

      {/* 2. MAPA */}
      <div
        className={`rounded-2xl overflow-hidden shadow-inner border border-gray-50 ${esMiniatura ? "h-[180px]" : "h-[450px]"}`}
      >
        <Mapa puntos={resultados} />
      </div>

      {/* 3. LISTADO DE TARJETAS (Con scroll si es miniatura) */}
      <div
        className={`grid gap-4 ${esMiniatura ? "grid-cols-1 overflow-y-auto pr-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
        style={esMiniatura ? { maxHeight: "200px" } : {}}
      >
        {resultados.length > 0
          ? resultados.map((c) => (
              <div
                key={c.id_establecimiento || c.id_servicio || c.id}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between ${esMiniatura ? "p-3" : "p-5 hover:shadow-md transition-all"}`}
              >
                <div>
                  <h3
                    className={`font-bold text-blue-900 ${esMiniatura ? "text-sm" : "text-lg mb-1"}`}
                  >
                    {c.nombre_comercio || c.categoria}
                  </h3>

                  {/* ESTRELLAS DEL BACKEND */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={
                            star <= Math.round(c.promedio_valoraciones || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {c.promedio_valoraciones || 0} (
                      {c.numero_valoraciones || 0})
                    </span>
                  </div>

                  <p
                    className={`text-gray-500 ${esMiniatura ? "text-[10px] leading-tight" : "text-sm mb-3"}`}
                  >
                    {c.direccion || "Servicio profesional"}
                  </p>
                  <span className="inline-block mt-2 bg-gray-50 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    CP: {c.cp}
                  </span>
                </div>
                {/* Botón Valorar (Solo en pantalla completa) */}
                {!esMiniatura && c.tipo !== "google" && (
                  <button
                    onClick={() => setValorando(c)}
                    className="w-full mt-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all text-sm"
                  >
                    ⭐ Valorar ahora
                  </button>
                )}
              </div>
            ))
          : !loading && (
              <div
                className={`col-span-full text-center text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100 ${esMiniatura ? "py-6 text-xs" : "py-20"}`}
              >
                Introduce un código postal para ver los comercios
              </div>
            )}
      </div>

      {/* 4. MODAL FLOTANTE DE VALORACIÓN (Solo fuera de miniatura) */}
      {!esMiniatura && valorando && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200 text-black">
            <h3 className="text-xl font-bold mb-2 text-center">
              Valora tu experiencia
            </h3>
            <p className="text-gray-500 text-center mb-6 text-sm">
              En:{" "}
              <span className="font-bold text-blue-600">
                {valorando.nombre_comercio || valorando.categoria}
              </span>
            </p>

            <select
              className="w-full p-4 border-2 border-gray-100 rounded-2xl mb-6 outline-none focus:border-blue-500"
              value={puntuacionNueva}
              onChange={(e) => setPuntuacionNueva(Number(e.target.value))}
            >
              <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
              <option value="4">⭐⭐⭐⭐ Muy bueno</option>
              <option value="3">⭐⭐⭐ Normal</option>
              <option value="2">⭐⭐ Pobre</option>
              <option value="1">⭐ Malo</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => setValorando(null)}
                className="flex-1 py-4 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl"
              >
                Cancelar
              </button>
              <button
                onClick={enviarValoracion}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}