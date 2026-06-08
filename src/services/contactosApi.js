import api from "../utils/axiosInstance";

// Obtener todos los contactos
export async function getContactos() {
    const res = await api.get("/api/contactosinvestigador/");
    return res.data;
}

// Obtener contactos de un investigador específico
export async function getContactosByInvestigador(investigadorId) {
    const res = await api.get(`/api/contactosinvestigador/?investigadorid=${investigadorId}`);
    return res.data;
}

// Crear un nuevo contacto para un investigador
export async function createContacto(data) {
    // data debe incluir: contacto, estado (opcional), investigadorid
    const res = await api.post("/api/contactosinvestigador/", data);
    return res.data;
}

// Editar contacto (PATCH)
export async function patchContacto(id, data) {
    const res = await api.patch(`/api/contactosinvestigador/${id}/`, data);
    return res.data;
}

// Desactivar contacto (DELETE seguro: cambia estado=false en backend)
export async function deleteContacto(id) {
    const res = await api.delete(`/api/contactosinvestigador/${id}/`);
    return res.data;
}
