import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000/'

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 15000,
    
});
AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("Token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default AxiosInstance