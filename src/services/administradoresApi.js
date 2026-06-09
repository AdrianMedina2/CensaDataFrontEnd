import api from "../utils/axiosInstance";

// Obtener todos los administradores
export async function getAdministradores() {
    const res = await api.get("/api/administradores/");
    return res.data;
}

// Obtener un administrador por id
export async function getAdministradorById(id) {
    const res = await api.get(`/api/administradores/${id}/`);
    return res.data;
}