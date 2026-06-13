import api from "../utils/axiosInstance";

// función genérica para pedir cualquier estadística
export const getEstadistica = async (tipo) => {
    try {
        const res = await api.get(`/api/estadisticas/?tipo=${encodeURIComponent(tipo)}`);
        return res.data;
    } catch (error) {
        console.error("Error al obtener estadística:", error);
        throw error;
    }
};
