"use client";

import { useState } from 'react';
import { ENDPOINTS } from '../app/config';
import Mapa from './Mapa';

interface Comercio {
  id_establecimiento: string | number;
  nombre_comercio: string;
  direccion: string;
  cp: string;
  latitud: number;
  longitud: number;
}

export default function Buscador() {
  const [comercios, setComercios] = useState<Comercio[]>([]);
  const [loading, setLoading] = useState(false);
  const [cp, setCp] = useState("");

  const buscarComercios = async () => {
    if (!cp.trim()) return;
    setLoading(true);
    
    try {
      const url = `${ENDPOINTS.BUSCADOR}?cp=${cp}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error("Error en la respuesta");

      const data = await response.json();
      setComercios(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col gap-6">
      {/* PANEL SUPERIOR: BUSCADOR Y MAPA */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          🔍 Explorador de Comercios
        </h2>
        
        <div className="flex gap-3 mb-6">
          <input 
            type="text" 
            placeholder="Código Postal (ej: 28042)..." 
            className="border-2 border-gray-100 p-4 rounded-2xl flex-1 focus:border-blue-500 outline-none transition-all text-black"
            value={cp}
            onChange={(e) => setCp(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscarComercios()}
          />
          <button 
            onClick={buscarComercios}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl transition-all disabled:bg-blue-300"
          >
            {loading ? "..." : "Buscar"}
          </button>
        </div>

        {/* MAPA */}
        <div className="h-[400px] rounded-2xl overflow-hidden shadow-inner border border-gray-50">
           <Mapa puntos={comercios} />
        </div>
      </div>

      {/* LISTADO DE RESULTADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comercios.length > 0 ? (
          comercios.map((c) => (
            <div key={c.id_establecimiento} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-blue-900 text-lg mb-1">{c.nombre_comercio}</h3>
              <p className="text-sm text-gray-500 mb-3">{c.direccion}</p>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                CP: {c.cp}
              </span>
            </div>
          ))
        ) : (
          !loading && (
            <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              Ingresa un código postal para ver resultados
            </div>
          )
        )}
      </div>
    </div>
  );
}