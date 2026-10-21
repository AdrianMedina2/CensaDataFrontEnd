import api from "../utils/axiosInstance";

let socket = null;        // para chats privados
let globalSocket = null;  // para notificaciones globales

// Conexión a sala privada
export function connect(roomName, onMessage, onStatusChange) {
    const baseUrl = api.defaults.baseURL;
    const wsProtocol = baseUrl.startsWith("https") ? "wss" : "ws";

    const token = localStorage.getItem("accessToken");
    document.cookie = `ws_access_token=${token}; path=/;`;

    const wsUrl = `${baseUrl.replace(/^https?/, wsProtocol)}/api/mensajeria/${roomName}/`;

    socket = new WebSocket(wsUrl);

    socket.onopen = () => onStatusChange("connected");
    socket.onclose = () => onStatusChange("disconnected");
    socket.onmessage = (e) => {
        const payload = JSON.parse(e.data);

        if (payload.type === "historial") {
            const mensajes = payload.mensajes.map(m => ({
                ...m,
                fechaLocal: new Date(m.fecha).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
            }));
            onMessage({ type: "historial", mensajes });
        } else if (payload.type === "chat_message") {
            const incoming = payload.mensaje;
            const mensaje = {
                ...incoming,
                fechaLocal: new Date(incoming.fecha).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
            };
            onMessage({ type: "chat_message", mensaje });
        }
    };
}

// Conexión a sala global de notificaciones
export function connectGlobal(onMessage, onStatusChange) {
    const baseUrl = api.defaults.baseURL;
    const wsProtocol = baseUrl.startsWith("https") ? "wss" : "ws";

    const token = localStorage.getItem("accessToken");
    document.cookie = `ws_access_token=${token}; path=/;`;

    const wsUrl = `${baseUrl.replace(/^https?/, wsProtocol)}/api/mensajeria/notificaciones/`;

    globalSocket = new WebSocket(wsUrl);

    globalSocket.onopen = () => onStatusChange("connected");
    globalSocket.onclose = () => onStatusChange("disconnected");
    globalSocket.onmessage = (e) => {
        const payload = JSON.parse(e.data);
        if (payload.type === "notificacion") {
            onMessage(payload);
        }
    };
}

// Enviar mensaje en sala privada
export function sendMessage(texto, inv1, inv2) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const payload = {
            mensaje: texto,
            investigador1: {
                id_invest: inv1.id,
                nombrecompleto: inv1.primernombre + " " + inv1.primerapellido,
                edad: inv1.edad,
                sexo: inv1.sexo
            },
            investigador2: {
                id_invest: inv2.id,
                nombrecompleto: inv2.primernombre + " " + inv2.primerapellido,
                edad: inv2.edad,
                sexo: inv2.sexo
            }
        };
        socket.send(JSON.stringify(payload));
    }
}

// Cerrar conexiones
export function close() {
    if (socket) {
        socket.close();
        socket = null;
    }
}

export function closeGlobal() {
    if (globalSocket) {
        globalSocket.close();
        globalSocket = null;
    }
}
