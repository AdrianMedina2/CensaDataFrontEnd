import api from "../utils/axiosInstance";

// Obtener todas las cuentas de investigadores
export async function getCuentas() {
    const res = await api.get("/api/cuentasinvestigador/");
    return res.data;
}

// Obtener una cuenta por id
export async function getCuentaById(id) {
    const res = await api.get(`/api/cuentasinvestigador/${id}/`);
    return res.data;
}

// Crear una nueva cuenta de investigador
export async function createCuenta(data) {
    // data debe incluir: usuario, password, Role, Correo
    const res = await api.post("/api/cuentasinvestigador/", data);
    return res.data;
}

// Editar cuenta (PATCH)
export async function patchCuenta(id, data) {
    const res = await api.patch(`/api/cuentasinvestigador/${id}/`, data);
    return res.data;
}

// Desactivar cuenta (DELETE seguro: cambia estado=false en backend)
export async function deleteCuenta(id) {
    const res = await api.delete(`/api/cuentasinvestigador/${id}/`);
    return res.data;
}
