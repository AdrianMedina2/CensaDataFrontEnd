import api from "../utils/axiosInstance"; 

// Login
export const loginRequest = async ({ Correo, password }) => {
    const res = await api.post("/token/", { Correo, password });
    return res.data;
};

// Refresh
export const refreshRequest = async ({ refresh }) => {
    const res = await api.post("/token/refresh/", { refresh });
    return res.data;
};
