// Detectamos si estamos en el navegador y si la URL es localhost
const isLocalhost = typeof window !== "undefined" && 
                    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// La URL base de Railway 
export const API_BASE_URL = isLocalhost 
  ? "http://127.0.0.1:8000" 
  : "https://proyecto-daw-production.up.railway.app"; 

export const ENDPOINTS = {

    BUSCADOR: `${API_BASE_URL}/buscar/`,
    GEOLOCALIZAR: `${API_BASE_URL}/geolocalizar/`,
    GOOGLE_PROXY: `${API_BASE_URL}/google-maps/`, 
};