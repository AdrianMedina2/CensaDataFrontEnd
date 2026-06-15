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

// -------------------
// INFRAESTRUCTURAS
// -------------------

export const getInfraestructuras = async () => {
    // 1. Traer infraestructuras
    const res = await api.get("/api/Infraestructuras/");
    const infraestructuras = res.data.data;

    // 2. Traer catálogos (cada uno devuelve { data: [...] })
    const materialesRes = await getMaterialesConstrucciones();
    const techosRes = await getTiposDeTechos();
    const pisosRes = await getTiposDePisos();

    // 3. Extraer los arrays de cada respuesta
    const materiales = materialesRes.data ?? [];
    const techos = techosRes.data ?? [];
    const pisos = pisosRes.data ?? [];

    // 4. Mapear IDs a nombres legibles
    return infraestructuras.map((i) => ({
        ...i,
        material:
            materiales.find((m) => m.id === i.materialcontruccionid)?.materialcontruccion ||
            "Desconocido",
        techo:
            techos.find((t) => t.id === i.tipodetechoid)?.tipodetecho ||
            "Desconocido",
        piso:
            pisos.find((p) => p.id === i.tipodepisoid)?.tipopiso ||
            "Desconocido",
    }));
};

export const createInfraestructura = async ({ materialcontruccionid, tipodetechoid, tipodepisoid }) => {
    const res = await api.post("/api/Infraestructuras/", {
        materialcontruccionid: Number(materialcontruccionid),
        tipodetechoid: Number(tipodetechoid),
        tipodepisoid: Number(tipodepisoid),
        estado: true
    });
    return res.data.data; // devuelve el objeto creado con su id
};
