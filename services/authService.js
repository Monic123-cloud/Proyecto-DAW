// services/authService.js

const TOKEN_KEY = 'access_token';

export const authService = {
    // Guarda el token en el "disco duro" del navegador
    setToken(token) {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    // Recupera el token para enviarlo a Django
    getToken() {
        if (typeof window !== 'undefined') { // Verificación necesaria para Next.js
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    // Borra todo y "cierra sesión"
    logout() {
        localStorage.removeItem(TOKEN_KEY);
        // Opcional: redirigir al inicio
        // window.location.href = '/'; 
    },

    // Crea las cabeceras que React necesita para hablar con Django
    getAuthHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    },

    isAuthenticated() {
        const token = this.getToken();
        return !!token; // Esto devuelve true si hay token y false si es null/vacío
    }
};