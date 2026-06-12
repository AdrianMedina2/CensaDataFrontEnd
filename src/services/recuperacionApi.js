// src/services/recuperacionApi.js
import api from "../utils/axiosInstance"; // tu instancia global de axios

// 1. Solicitar código de recuperación
export const requestRecovery = (correo) => {
    return api.post("/api/recovery/request/", { correo });
};

// 2. Verificar código y obtener token
export const verifyRecovery = (correo, code) => {
    return api.post("/api/recovery/verify/", { Id: correo, code });
};

// 3. Cambiar contraseña usando token
export const changePassword = (token, password) => {
    return api.post("/api/recovery/changePassword/", { token, password });
};
