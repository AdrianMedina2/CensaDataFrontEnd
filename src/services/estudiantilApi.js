import api from "../utils/axiosInstance";

// -----------------------------
// Carreras
// -----------------------------

// Obtener todas las carreras
export const getCarreras = async () => {
    const res = await api.get("/api/Carreras/");
    return res.data;
};

// Obtener una carrera por ID
export const getCarreraById = async (id) => {
    const res = await api.get(`/api/Carreras/${id}/`);
    return res.data;
};

// Crear una nueva carrera
export const createCarrera = async (data) => {
    const res = await api.post("/api/Carreras/", data);
    return res.data;
};

// Actualizar parcialmente una carrera (PATCH)
export const patchCarrera = async (id, data) => {
    const res = await api.patch(`/api/Carreras/${id}/`, data);
    return res.data;
};

// Eliminar una carrera
export const deleteCarrera = async (id) => {
    const res = await api.delete(`/api/Carreras/${id}/`);
    return res.data;
};

// -----------------------------
// Areas de conocimiento
// -----------------------------

// Obtener todas las áreas de conocimiento
export const getAreasConocimientos = async () => {
    const res = await api.get("/api/AreasConocimientos/");
    return res.data;
};

// Obtener un área de conocimiento por ID
export const getAreaConocimientoById = async (id) => {
    const res = await api.get(`/api/AreasConocimientos/${id}/`);
    return res.data;
};

// Crear una nueva área de conocimiento
export const createAreaConocimiento = async (data) => {
    const res = await api.post("/api/AreasConocimientos/", data);
    return res.data;
};

// Actualizar parcialmente un área de conocimiento (PATCH)
export const patchAreaConocimiento = async (id, data) => {
    const res = await api.patch(`/api/AreasConocimientos/${id}/`, data);
    return res.data;
};

// Eliminar un área de conocimiento
export const deleteAreaConocimiento = async (id) => {
    const res = await api.delete(`/api/AreasConocimientos/${id}/`);
    return res.data;
};