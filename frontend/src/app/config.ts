// Detectamos si estamos en el navegador y si la URL es localhost
const isLocalhost = typeof window !== "undefined" && 
                    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// La URL base de Railway 
export const API_BASE_URL = isLocalhost 
  ? "http://127.0.0.1:8000" 
  : "https://proyecto-daw-production.up.railway.app"; 

export const ENDPOINTS = {
    // Añadimos el prefijo 'api/buscador' que Django está usando
    BUSCADOR: `${API_BASE_URL}/api/buscador/buscar/`,
    GEOLOCALIZAR: `${API_BASE_URL}/api/buscador/geolocalizar/`,
    GOOGLE_PROXY: `${API_BASE_URL}/api/buscador/google-maps/`, 
};