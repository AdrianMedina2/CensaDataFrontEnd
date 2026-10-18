import api from "../utils/axiosInstance";

let socket = null;

export function connect(senderId, destinatarioId, onMessage, onStatusChange) {
    const baseUrl = api.defaults.baseURL;
    const wsProtocol = baseUrl.startsWith("https") ? "wss" : "ws";

    const token = localStorage.getItem("accessToken");
    document.cookie = `ws_access_token=${token}; path=/;`;
    
    const wsUrl = `${baseUrl.replace(/^https?/, wsProtocol)}/api/mensajeria/sala_101_202/${destinatarioId}/`;

    socket = new WebSocket(wsUrl);

    socket.onopen = () => onStatusChange("connected");
    socket.onclose = () => onStatusChange("disconnected");
    socket.onmessage = (e) => {
        const payload = JSON.parse(e.data);

        if (payload.type === "historial") {
            onMessage({ type: "historial", mensajes: payload.mensajes });
        } else if (payload.type === "chat_message") {
            onMessage({ type: "chat_message", mensaje: payload });
        }
    };
}

export function sendMessage(texto, inv1, inv2) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const payload = {
            mensaje: texto,
            investigador1: {
                id_inves: inv1.id,
                nombrecompleto: `${inv1.primernombre} ${inv1.primerapellido}`,
                edad: inv1.edad,
                sexo: inv1.sexo
            },
            investigador2: {
                id_inves: inv2.id,
                nombrecompleto: `${inv2.primernombre} ${inv2.primerapellido}`,
                edad: inv2.edad,
                sexo: inv2.sexo
            }
        };
        console.log("Enviando mensaje:", payload);
        socket.send(JSON.stringify(payload));
    }
}

export function close() {
    if (socket) {
        socket.close();
    }
}
