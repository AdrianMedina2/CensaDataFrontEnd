import api from "../utils/axiosInstance";

// -----------------------------
// Actividades Extracurriculares
// -----------------------------

// Obtener todas las actividades extracurriculares
export const getActividadesExtraCurriculares = async () => {
    const res = await api.get("/api/ActividadesExtraCurriculares/");
    return res.data;
};

// Obtener una actividad extracurricular por ID
export const getActividadExtraCurricularById = async (id) => {
    const res = await api.get(`/api/ActividadesExtraCurriculares/${id}/`);
    return res.data;
};

// Crear una nueva actividad extracurricular
export const createActividadExtraCurricular = async (data) => {
    const res = await api.post("/api/ActividadesExtraCurriculares/", data);
    return res.data;
};

// Actualizar parcialmente una actividad extracurricular (PATCH)
export const patchActividadExtraCurricular = async (id, data) => {
    const res = await api.patch(`/api/ActividadesExtraCurriculares/${id}/`, data);
    return res.data;
};

// Eliminar una actividad extracurricular
export const deleteActividadExtraCurricular = async (id) => {
    const res = await api.delete(`/api/ActividadesExtraCurriculares/${id}/`);
    return res.data;
};

// -----------------------------
// Eventos
// -----------------------------

// Obtener todos los eventos
export const getEventos = async () => {
    const res = await api.get("/api/Eventos/");
    return res.data;
};

// Obtener un evento por ID
export const getEventoById = async (id) => {
    const res = await api.get(`/api/Eventos/${id}/`);
    return res.data;
};

// Crear un nuevo evento
export const createEvento = async (data) => {
    const res = await api.post("/api/Eventos/", data);
    return res.data;
};

// Actualizar parcialmente un evento (PATCH)
export const patchEvento = async (id, data) => {
    const res = await api.patch(`/api/Eventos/${id}/`, data);
    return res.data;
};

// Eliminar un evento
export const deleteEvento = async (id) => {
    const res = await api.delete(`/api/Eventos/${id}/`);
    return res.data;
};

// -----------------------------
// Categorías de Eventos
// -----------------------------

// Obtener todas las categorías de eventos
export const getCategoriasEventos = async () => {
    const res = await api.get("/api/Categorias/");
    return res.data;
};

// Obtener una categoría de evento por ID
export const getCategoriaEventoById = async (id) => {
    const res = await api.get(`/api/Categorias/${id}/`);
    return res.data;
};

// Crear un nuevo evento
export const createCategoriaEvento = async (data) => {
    const res = await api.post("/api/Categorias/", data);
    return res.data;
};

// Actualizar parcialmente una categoría de evento (PATCH)
export const patchCategoriaEvento = async (id, data) => {
    const res = await api.patch(`/api/Categorias/${id}/`, data);
    return res.data;
};

// Eliminar una categoría de evento
export const deleteCategoriaEvento = async (id) => {
    const res = await api.delete(`/api/Categorias/${id}/`);
    return res.data;
};