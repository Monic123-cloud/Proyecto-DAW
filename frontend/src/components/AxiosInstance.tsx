import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
});

export default AxiosInstance;
