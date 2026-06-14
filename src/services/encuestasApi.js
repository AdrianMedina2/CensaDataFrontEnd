import api from "../utils/axiosInstance";

export const encuestasApi = {
    create: async (data) => {
        try {
            const response = await api.post("/api/EncuestaCompleta/", data);
            return response.data;
        } catch (error) {
            console.error("Error creando encuesta:", error);
            throw error;
        }
    },
};