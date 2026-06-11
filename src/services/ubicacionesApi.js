import api from "../utils/axiosInstance";

// Departamentos
export const getDepartamentos = async () => {
    const { data } = await api.get("/api/departamentos/");
    return data;
};

export const createDepartamento = async (data) => {
    const response = await api.post("/api/departamentos/", data);
    return response.data;
};

export const patchDepartamento = async (id, data) => {
    const response = await api.patch(`/api/departamentos/${id}/`, data);
    return response.data;
};

export const deleteDepartamento = async (id) => {
    await api.delete(`/api/departamentos/${id}/`);
};

// Municipios
export const getMunicipios = async () => {
    const { data } = await api.get("/api/municipios/");
    return data;
};

export const createMunicipio = async (data) => {
    const response = await api.post("/api/municipios/", data);
    return response.data;
};

export const patchMunicipio = async (id, data) => {
    const response = await api.patch(`/api/municipios/${id}/`, data);
    return response.data;
};

export const deleteMunicipio = async (id) => {
    await api.delete(`/api/municipios/${id}/`);
};

// Barrios
export const getBarrios = async () => {
    const { data } = await api.get("/api/barrios/");
    return data;
};

export const createBarrio = async (data) => {
    const response = await api.post("/api/barrios/", data);
    return response.data;
};

export const patchBarrio = async (id, data) => {
    const response = await api.patch(`/api/barrios/${id}/`, data);
    return response.data;
};

export const deleteBarrio = async (id) => {
    await api.delete(`/api/barrios/${id}/`);
};
