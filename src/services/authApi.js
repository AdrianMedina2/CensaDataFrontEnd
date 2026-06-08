import api from "../utils/axiosInstance";

// Login
export const loginRequest = async ({ Correo, password }) => {
    const res = await api.post("/api/token/", { Correo, password });
    return res.data;
};

// Refresh
export const refreshRequest = async ({ refresh }) => {
    const res = await api.post("/api/token/refresh/", { refresh });
    return res.data;
};

// Get profile
export const getProfile = async () => {
    const res = await api.get("/me/");
    return res.data;
};