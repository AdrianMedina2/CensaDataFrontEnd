import api from "../utils/axiosInstance";

// Obtener todos los investigadores
export async function getInvestigadores() {
    const res = await api.get("/api/investigadores/");
    return res.data;
}

// Obtener un investigador por id
export async function getInvestigadorById(id) {
    const res = await api.get(`/api/investigadores/${id}/`);
    return res.data;
}

// Crear un nuevo investigador
export async function createInvestigador(data) {
    // data debe incluir: primernombre, primerapellido, edad, sexo, cuentaid, administradorid
    const res = await api.post("/api/investigadores/", data);
    return res.data;
}

// Editar investigador (PATCH)
export async function patchInvestigador(id, data) {
    const res = await api.patch(`/api/investigadores/${id}/`, data);
    return res.data;
}

// Desactivar investigador (DELETE seguro: cambia estado=false en backend)
export async function deleteInvestigador(id) {
    const res = await api.delete(`/api/investigadores/${id}/`);
    return res.data;
}

// Obtener todos los administradores
export async function getAdministradores() {
    const res = await axiosInstance.get("/api/administradores/");
    return res.data;
}

// Obtener un administrador por id
export async function getAdministradorById(id) {
    const res = await axiosInstance.get(`/api/administradores/${id}/`);
    return res.data;
}