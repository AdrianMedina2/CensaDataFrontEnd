
import api from "../utils/axiosInstance";

let socket = null;
let globalSocket = null;

let privateVersion = 0;
let globalVersion = 0;

let privateReconnectTimer = null;
let globalReconnectTimer = null;

const RECONNECT_DELAY = 3000;

export async function getWsTicket() {
    const res = await api.post("/api/ticketws/");

    if (!res.data?.ticket) {
        throw new Error("La API no devolvió un ticket WebSocket");
    }

    return res.data.ticket;
}

function buildWsUrl(path, ticket) {
    const baseUrl = api.defaults.baseURL || window.location.origin;
    const url = new URL(baseUrl, window.location.origin);

    const basePath = url.pathname.replace(/\/+$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (basePath.endsWith("/api") && cleanPath.startsWith("/api/")) {
        url.pathname = basePath + cleanPath.slice(4);
    } else {
        url.pathname = basePath + cleanPath;
    }

    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.search = "";
    url.searchParams.set("ticket", ticket);

    return url.toString();
}

function formatMessage(mensaje) {
    if (!mensaje || typeof mensaje !== "object") {
        return mensaje;
    }

    const id = mensaje.id ?? mensaje._id;
    const fecha = new Date(mensaje.fecha);

    return {
        ...mensaje,
        id: id != null ? String(id) : undefined,
        fechaLocal: Number.isNaN(fecha.getTime())
            ? "Hora desconocida"
            : fecha.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            })
    };
}

function clearPrivateTimer() {
    if (privateReconnectTimer !== null) {
        clearTimeout(privateReconnectTimer);
        privateReconnectTimer = null;
    }
}

function clearGlobalTimer() {
    if (globalReconnectTimer !== null) {
        clearTimeout(globalReconnectTimer);
        globalReconnectTimer = null;
    }
}

export function connect(roomName, onMessage, onStatusChange) {
    close();

    const version = privateVersion;

    const startConnection = async () => {
        if (version !== privateVersion) return;

        onStatusChange?.("connecting");

        try {
            const ticket = await getWsTicket();

            if (version !== privateVersion) return;

            const wsUrl = buildWsUrl(
                `/api/mensajeria/${encodeURIComponent(roomName)}/`,
                ticket
            );

            const ws = new WebSocket(wsUrl);
            socket = ws;

            ws.onopen = () => {
                if (version !== privateVersion) {
                    ws.close();
                    return;
                }

                console.log("[WS privado] Conectado:", roomName);
                onStatusChange?.("connected");
            };

            ws.onmessage = (event) => {
                if (version !== privateVersion) return;

                try {
                    const payload = JSON.parse(event.data);

                    console.log("[WS privado] Payload recibido:", payload);

                    if (payload.type === "chat_message") {
                        const mensaje = formatMessage(payload.mensaje);

                        if (!mensaje || typeof mensaje !== "object") {
                            return;
                        }

                        onMessage?.({
                            type: "chat_message",
                            mensaje
                        });
                    } else if (payload.type === "historial") {
                        const mensajes = Array.isArray(payload.mensajes)
                            ? payload.mensajes.map(formatMessage)
                            : [];

                        onMessage?.({
                            type: "historial",
                            mensajes
                        });
                    } else {
                        console.warn(
                            "[WS privado] Payload desconocido:",
                            payload
                        );
                    }
                } catch (error) {
                    console.error(
                        "[WS privado] Error procesando mensaje:",
                        error
                    );
                }
            };

            ws.onerror = (error) => {
                if (version !== privateVersion) return;

                console.error("[WS privado] Error:", error);
                onStatusChange?.("error");
            };

            ws.onclose = (event) => {
                if (socket === ws) {
                    socket = null;
                }

                if (version !== privateVersion) return;

                console.warn("[WS privado] Desconectado:", {
                    codigo: event.code,
                    motivo: event.reason
                });

                onStatusChange?.("disconnected");

                clearPrivateTimer();

                privateReconnectTimer = setTimeout(() => {
                    privateReconnectTimer = null;

                    if (version === privateVersion) {
                        startConnection();
                    }
                }, RECONNECT_DELAY);
            };
        } catch (error) {
            if (version !== privateVersion) return;

            console.error("[WS privado] Error de conexión:", error);
            onStatusChange?.("error");

            clearPrivateTimer();

            privateReconnectTimer = setTimeout(() => {
                privateReconnectTimer = null;

                if (version === privateVersion) {
                    startConnection();
                }
            }, RECONNECT_DELAY);
        }
    };

    startConnection();

    return () => {
        if (version === privateVersion) {
            close();
        }
    };
}

export function connectGlobal(onMessage, onStatusChange) {
    closeGlobal();

    const version = globalVersion;

    const startConnection = async () => {
        if (version !== globalVersion) return;

        onStatusChange?.("connecting");

        try {
            const ticket = await getWsTicket();

            if (version !== globalVersion) return;

            const wsUrl = buildWsUrl(
                "/api/mensajeria/notificaciones/",
                ticket
            );

            const ws = new WebSocket(wsUrl);
            globalSocket = ws;

            ws.onopen = () => {
                if (version !== globalVersion) {
                    ws.close();
                    return;
                }

                console.log("[WS global] Conectado");
                onStatusChange?.("connected");
            };

            ws.onmessage = (event) => {
                if (version !== globalVersion) return;

                try {
                    const payload = JSON.parse(event.data);

                    console.log("[WS global] Payload recibido:", payload);

                    if (payload.type === "notificacion") {
                        onMessage?.(payload);
                    }
                } catch (error) {
                    console.error(
                        "[WS global] Error procesando notificación:",
                        error
                    );
                }
            };

            ws.onerror = (error) => {
                if (version !== globalVersion) return;

                console.error("[WS global] Error:", error);
                onStatusChange?.("error");
            };

            ws.onclose = (event) => {
                if (globalSocket === ws) {
                    globalSocket = null;
                }

                if (version !== globalVersion) return;

                console.warn("[WS global] Desconectado:", {
                    codigo: event.code,
                    motivo: event.reason
                });

                onStatusChange?.("disconnected");

                clearGlobalTimer();

                globalReconnectTimer = setTimeout(() => {
                    globalReconnectTimer = null;

                    if (version === globalVersion) {
                        startConnection();
                    }
                }, RECONNECT_DELAY);
            };
        } catch (error) {
            if (version !== globalVersion) return;

            console.error("[WS global] Error de conexión:", error);
            onStatusChange?.("error");

            clearGlobalTimer();

            globalReconnectTimer = setTimeout(() => {
                globalReconnectTimer = null;

                if (version === globalVersion) {
                    startConnection();
                }
            }, RECONNECT_DELAY);
        }
    };

    startConnection();

    return () => {
        if (version === globalVersion) {
            closeGlobal();
        }
    };
}

export function sendMessage(texto, inv1, inv2) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("[WS privado] Socket no conectado");
        return false;
    }

    const payload = {
        mensaje: texto,
        investigador1: {
            id_invest: inv1.id,
            nombrecompleto: `${inv1.primernombre} ${inv1.primerapellido}`,
            edad: inv1.edad,
            sexo: inv1.sexo
        },
        investigador2: {
            id_invest: inv2.id,
            nombrecompleto: `${inv2.primernombre} ${inv2.primerapellido}`,
            edad: inv2.edad,
            sexo: inv2.sexo
        }
    };

    try {
        socket.send(JSON.stringify(payload));

        console.log("[WS privado] Mensaje enviado:", payload);
        return true;
    } catch (error) {
        console.error("[WS privado] Error enviando:", error);
        return false;
    }
}

export function close() {
    privateVersion++;
    clearPrivateTimer();

    if (socket) {
        const ws = socket;
        socket = null;
        ws.close();
    }
}

export function closeGlobal() {
    globalVersion++;
    clearGlobalTimer();

    if (globalSocket) {
        const ws = globalSocket;
        globalSocket = null;
        ws.close();
    }
}
