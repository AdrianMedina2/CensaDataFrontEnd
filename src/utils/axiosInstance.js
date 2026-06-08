import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE, 
});

// Interceptor para añadir token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para refrescar token si expira
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refresh = localStorage.getItem("refreshToken");
            if (refresh) {
                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_BASE}/api/token/refresh/`,
                        { refresh }
                    );
                    localStorage.setItem("accessToken", res.data.access);
                    error.config.headers.Authorization = `Bearer ${res.data.access}`;
                    return api.request(error.config);
                } catch (refreshError) {
                    localStorage.clear();
                    window.location.href = "/login"; // opcional: redirigir al login
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
