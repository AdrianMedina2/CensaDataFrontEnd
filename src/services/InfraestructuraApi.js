import api from "../utils/axiosInstance";

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
