import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const AxiosInstance = axios.create({
  baseURL: baseURL + "/",
  timeout: 15000,
});

// Añade el token Knox automáticamente si existe
AxiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("knox_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Token ${token}`;
    }
  }
  return config;
});

export default AxiosInstance;
