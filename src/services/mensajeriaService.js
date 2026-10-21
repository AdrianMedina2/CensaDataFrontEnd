import api from "../utils/axiosInstance";

export async function getMensajes(inv1Id, inv2Id) {
    const res = await api.get(`/api/mensajes/?investigador1=${inv1Id}&investigador2=${inv2Id}`);
    return res.data;
}
