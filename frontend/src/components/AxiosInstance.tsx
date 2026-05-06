import axios from "axios";

/*
  AxiosInstance normalizado para local, Vercel y Railway.

  Objetivo:
  - Si NEXT_PUBLIC_API_URL viene sin /api, se añade automáticamente.
  - Si NEXT_PUBLIC_API_URL ya viene con /api, se respeta.
  - Si alguna llamada empieza por /api/..., se corrige para evitar /api/api/...

  Ejemplos válidos:
  NEXT_PUBLIC_API_URL=https://backend.up.railway.app
  NEXT_PUBLIC_API_URL=https://backend.up.railway.app/api
*/

const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const cleanBaseUrl = rawBaseUrl.replace(/\/$/, "");

const baseURL = cleanBaseUrl.endsWith("/api")
  ? cleanBaseUrl
  : `${cleanBaseUrl}/api`;

const AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
});

AxiosInstance.interceptors.request.use((config) => {
  /*
    Evita duplicar /api si en algún componente se llama así:
    AxiosInstance.post("/api/auth/login/")

    Como baseURL ya termina en /api, esa llamada debe quedarse como:
    /auth/login/
  */
  if (config.url?.startsWith("/api/")) {
    config.url = config.url.replace(/^\/api/, "");
  }

  return config;
});

export default AxiosInstance;
