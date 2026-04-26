import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 👉 Mete el token automáticamente en cada request
AxiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("knox_token"); // ✅ un solo nombre siempre
    if (token) config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default AxiosInstance;