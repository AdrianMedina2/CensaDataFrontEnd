import api from "../utils/axiosInstance";

// -----------------------------
// MATERIALES DE CONSTRUCCIÓN
// -----------------------------

// Obtener todos los materiales de construcción
export const getMaterialesConstrucciones = async () => {
    const res = await api.get("/api/materialesConstrucciones/");
    return res.data;
};

// Obtener un material de construcción por ID
export const getMaterialConstruccionById = async (id) => {
    const res = await api.get(`/api/materialesConstrucciones/${id}/`);
    return res.data;
};

// Crear un nuevo material de construcción
export const createMaterialConstruccion = async (data) => {
    const res = await api.post("/api/materialesConstrucciones/", data);
    return res.data;
};

// Actualizar parcialmente un material de construcción (PATCH)
export const patchMaterialConstruccion = async (id, data) => {
    const res = await api.patch(`/api/materialesConstrucciones/${id}/`, data);
    return res.data;
};

// Eliminar un material de construcción
export const deleteMaterialConstruccion = async (id) => {
    const res = await api.delete(`/api/materialesConstrucciones/${id}/`);
    return res.data;
};

// -------------------
// TIPOS DE TECHOS
// -------------------

// Obtener todos los tipos de techos
export const getTiposDeTechos = async () => {
    const res = await api.get("/api/tiposDeTechos/");
    return res.data;
};

// Obtener un tipo de techo por ID
export const getTipoDeTechoById = async (id) => {
    const res = await api.get(`/api/tiposDeTechos/${id}/`);
    return res.data;
};

// Crear un nuevo tipo de techo
export const createTipoDeTecho = async (data) => {
    const res = await api.post("/api/tiposDeTechos/", data);
    return res.data;
};

// Actualizar parcialmente un tipo de techo (PATCH)
export const patchTipoDeTecho = async (id, data) => {
    const res = await api.patch(`/api/tiposDeTechos/${id}/`, data);
    return res.data;
};

// Eliminar un tipo de techo
export const deleteTipoDeTecho = async (id) => {
    const res = await api.delete(`/api/tiposDeTechos/${id}/`);
    return res.data;
};

// -------------------
// TIPOS DE PISOS
// -------------------

// Obtener todos los tipos de pisos
export const getTiposDePisos = async () => {
    const res = await api.get("/api/tiposDePisos/");
    return res.data.data;
};

// Obtener un tipo de piso por ID
export const getTipoDePisoById = async (id) => {
    const res = await api.get(`/api/tiposDePisos/${id}/`);
    return res.data;
};

// Crear un nuevo tipo de piso
export const createTipoDePiso = async (data) => {
    const res = await api.post("/api/tiposDePisos/", data);
    return res.data;
};

// Actualizar parcialmente un tipo de piso (PATCH)
export const patchTipoDePiso = async (id, data) => {
    const res = await api.patch(`/api/tiposDePisos/${id}/`, data);
    return res.data;
};

// Eliminar un tipo de piso
export const deleteTipoDePiso = async (id) => {
    const res = await api.delete(`/api/tiposDePisos/${id}/`);
    return res.data;
};