import api from "../utils/axiosInstance";

// Obtener todos los censos
export const getCensos = async () => {
    const res = await api.get("/api/Censos/");
    return res.data;
};

// Obtener un censo por ID
export const getCensoById = async (id) => {
    const res = await api.get(`/api/Censos/${id}/`);
    return res.data;
};

// Crear un nuevo censo (POST)
export const createCenso = async (data) => {
    const payload = {
        nombrecenso: data.nombrecenso,
        estado: true,
        fechainiciocenso: data.fechainiciocenso,   
        fechafincenso: data.fechafincenso,         
        cantidadencuestados: 0,
        cantidadrespuestaspositivas: 0,
        cantidadrespuestasnegativas: 0,
        cantidadencuestas: 0,
        muestrapoblacional: 0,
        poblaciontotal: parseInt(data.poblaciontotal, 10), 
        cantidadcasasencuestadas: 0,
    };

    const res = await api.post("/api/censoCompleto/", payload);
    return res.data;
};



// Actualizar parcialmente un censo (PATCH)
export const patchCenso = async (id, data) => {
    const res = await api.patch(`/api/Censos/${id}/`, data);
    return res.data;
};

// Eliminar un censo
export const deleteCenso = async (id) => {
    const res = await api.delete(`/api/Censos/${id}/`);
    return res.data;
};
