import api from "../utils/axiosInstance";

// ==============================
// ENDPOINTS INVESTIGADORES
// ==============================

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
    const res = await api.post("/api/investigadores/", data);
    return res.data;
}

// Editar investigador (PATCH)
export async function patchInvestigador(id, data) {
    const res = await api.patch(`/api/investigadores/${id}/`, data);
    return res.data;
}

// Eliminar investigador (DELETE seguro: cambia estado=false en backend)
export async function deleteInvestigador(id) {
    const res = await api.delete(`/api/investigadores/${id}/`);
    return res.data;
}

// ==============================
// ENDPOINTS CUENTAS INVESTIGADORES
// ==============================

export async function getCuentas() {
    const res = await api.get("/api/cuentasInvestigadores/");
    return res.data;
}

export async function getCuentaById(id) {
    const res = await api.get(`/api/cuentasInvestigadores/${id}/`);
    return res.data;
}

export async function createCuenta(data) {
    const res = await api.post("/api/cuentasInvestigadores/", data);
    return res.data;
}

export async function patchCuenta(id, data) {
    const res = await api.patch(`/api/cuentasInvestigadores/${id}/`, data);
    return res.data;
}

export async function deleteCuenta(id) {
    const res = await api.delete(`/api/cuentasInvestigadores/${id}/`);
    return res.data;
}

// ==============================
// CONTACTOS INVESTIGADORES
// ==============================

export async function getContactosByInvestigador(investigadorId) {
    const res = await api.get(`/api/contactosInvestigadores/?investigadorid=${investigadorId}`);
    return res.data;
}

export async function createContacto(data) {
    const res = await api.post("/api/contactosInvestigadores/", data);
    return res.data;
}

export async function patchContacto(id, data) {
    const res = await api.patch(`/api/contactosInvestigadores/${id}/`, data);
    return res.data;
}

export async function deleteContacto(id) {
    const res = await api.delete(`/api/contactosInvestigadores/${id}/`);
    return res.data;
}
