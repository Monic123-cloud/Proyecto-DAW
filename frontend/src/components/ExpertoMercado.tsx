import React, { useState } from 'react';
import api from './AxiosInstance';

interface Recomendacion {
  negocio: string;
  razon: string;
}

interface Props {
  codigoPostal: string;
}

const ExpertoMercado: React.FC<Props> = ({ codigoPostal }) => {
  const [analisis, setAnalisis] = useState<Recomendacion[] | null>(null);
  const [loading, setLoading] = useState(false);

  const obtenerAnalisis = async () => {
    if (!codigoPostal || codigoPostal.length !== 5) {
      alert("Por favor, introduce un código postal válido de 5 dígitos.");
      return;
    }
    
    setLoading(true);
    setAnalisis(null);

    try {
      const response = await api.get(`/api/buscador/experto-mercado/?cp=${codigoPostal}`);
      // Accedemos a response.data (Axios) -> .data (JSON del back) -> .recomendaciones
      setAnalisis(response.data.data.recomendaciones);
    } catch (error) {
      console.error("Error al consultar con el experto de Gemini:", error);
      alert("No se ha podido analizar la zona en este momento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
      <div className="flex flex-col gap-3">
        <button 
          onClick={obtenerAnalisis}
          disabled={loading}
          className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold transition-all ${
            loading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin text-lg">⏳</span>
              Analizando mercado...
            </>
          ) : (
            <>
              <span className="text-lg">🤖</span>
              Consultar experto en zona
            </>
          )}
        </button>

        {analisis && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-inner">
              <h4 className="text-blue-800 font-bold mb-4 flex items-center gap-2">
                ✨ Análisis para el CP {codigoPostal} de Inteligencia Artificial :
              </h4>
              
              <div className="flex flex-col gap-3">
                {analisis.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm border border-gray-100">
                    <p className="font-bold text-gray-800 text-sm mb-1 uppercase">
                      📍 {item.negocio}
                    </p>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {item.razon}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertoMercado;