import api from "../utils/axiosInstance";

// -------------------
// DISCAPACIDADES
// -------------------

// Obtener todas las discapacidades
export const getDiscapacidades = async () => {
    const res = await api.get("/api/Discapacidades/");
    return res.data;
};

// Obtener una discapacidad por ID
export const getDiscapacidadById = async (id) => {
    const res = await api.get(`/api/Discapacidades/${id}/`);
    return res.data;
};

// Crear una nueva discapacidad
export const createDiscapacidad = async (data) => {
    const res = await api.post("/api/Discapacidades/", data);
    return res.data;
};

// Actualizar parcialmente una discapacidad (PATCH)
export const patchDiscapacidad = async (id, data) => {
    const res = await api.patch(`/api/Discapacidades/${id}/`, data);
    return res.data;
};

// Eliminar una discapacidad
export const deleteDiscapacidad = async (id) => {
    const res = await api.delete(`/api/Discapacidades/${id}/`);
    return res.data;
};
