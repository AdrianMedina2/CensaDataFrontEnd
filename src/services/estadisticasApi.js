import api from "../utils/axiosInstance";

// función para pedir el dashboard filtrado por fechas
export const getDashboard = async (desde, hasta) => {
    try {
        const res = await api.get(`/api/dashboard/?desde=${encodeURIComponent(desde)}&hasta=${encodeURIComponent(hasta)}`);
        return res.data; 
    } catch (error) {
        console.error("Error al obtener dashboard:", error);
        throw error;
    }
};
