import api from "../utils/axiosInstance";

// ------------------------
// RELACIONES DE PARENTESCO
// ------------------------

// Obtener todas las relaciones de parentesco
export const getRelacionesParentescos = async () => {
    const res = await api.get("/api/relacionesParentescos/");
    return res.data;
};

// Obtener una relación de parentesco por ID
export const getRelacionParentescoById = async (id) => {
    const res = await api.get(`/api/relacionesParentescos/${id}/`);
    return res.data;
};

// Crear una nueva relación de parentesco
export const createRelacionParentesco = async (data) => {
    const res = await api.post("/api/relacionesParentescos/", data);
    return res.data;
};

// Actualizar parcialmente una relación de parentesco (PATCH)
export const patchRelacionParentesco = async (id, data) => {
    const res = await api.patch(`/api/relacionesParentescos/${id}/`, data);
    return res.data;
};

// Eliminar una relación de parentesco
export const deleteRelacionParentesco = async (id) => {
    const res = await api.delete(`/api/relacionesParentescos/${id}/`);
    return res.data;
};

// ----------------------
// NIVELES EDUCATIVOS
// ----------------------

// Obtener todos los niveles educativos
export const getNivelesEducativos = async () => {
    const res = await api.get("/api/NivelesEducativos/");
    return res.data;
};

// Obtener un nivel educativo por ID
export const getNivelEducativoById = async (id) => {
    const res = await api.get(`/api/NivelesEducativos/${id}/`);
    return res.data;
};

// Crear un nuevo nivel educativo
export const createNivelEducativo = async (data) => {
    const res = await api.post("/api/NivelesEducativos/", data);
    return res.data;
};

// Actualizar parcialmente un nivel educativo (PATCH)
export const patchNivelEducativo = async (id, data) => {
    const res = await api.patch(`/api/NivelesEducativos/${id}/`, data);
    return res.data;
};

// Eliminar un nivel educativo
export const deleteNivelEducativo = async (id) => {
    const res = await api.delete(`/api/NivelesEducativos/${id}/`);
    return res.data;
};

// -------------------
// EMPLEOS
// -------------------

// Obtener todos los empleos
export const getEmpleos = async () => {
    const res = await api.get("/api/empleos/");
    return res.data;
};

// Obtener un empleo por ID
export const getEmpleoById = async (id) => {
    const res = await api.get(`/api/empleos/${id}/`);
    return res.data;
};

// Crear un nuevo empleo
export const createEmpleo = async (data) => {
    const res = await api.post("/api/empleos/", data);
    return res.data;
};

// Actualizar parcialmente un empleo (PATCH)
export const patchEmpleo = async (id, data) => {
    const res = await api.patch(`/api/empleos/${id}/`, data);
    return res.data;
};

// Eliminar un empleo
export const deleteEmpleo = async (id) => {
    const res = await api.delete(`/api/empleos/${id}/`);
    return res.data;
};

// -------------------
// Estados Civiles
// -------------------

// Obtener todos los estados civiles
export const getEstadosCiviles = async () => {
    const res = await api.get("/api/estadosCiviles/");
    return res.data;
};

// Crear un nuevo estado civil
export const createEstadoCivil = async (data) => {
    const res = await api.post("/api/estadosCiviles/", data);
    return res.data;
};

// Editar (PATCH) un estado civil existente
export const patchEstadoCivil = async (id, data) => {
    const res = await api.patch(`/api/estadosCiviles/${id}/`, data);
    return res.data;
};

// Eliminar un estado civil
export const deleteEstadoCivil = async (id) => {
    const res = await api.delete(`/api/estadosCiviles/${id}/`);
    return res.data;
};

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
