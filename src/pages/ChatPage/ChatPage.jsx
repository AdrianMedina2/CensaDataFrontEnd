import React, { useEffect, useRef, useState } from "react";
import { connect, connectGlobal, sendMessage } from "../../services/chatSocket";
import { getMensajes, getInvestigadores } from "../../services";
import { useAuth } from "../../context/AuthContext";
import "./ChatPage.css";
const getId = (obj) => obj?.id_inves ?? obj?.id_invest ?? obj?.id;
const horaManagua = (fecha) => {
    if (!fecha) return "";
    const texto = String(fecha);
    const iso = /(?:Z|[+-]\d{2}:\d{2})$/i.test(texto)
        ? texto
        : `${texto}Z`;
    const date = new Date(iso);
    return isNaN(date.getTime())
        ? ""
        : date.toLocaleTimeString("es-NI", {
            timeZone: "America/Managua",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
};
const normalizar = (m) => ({
    ...m,
    id: String(m.id ?? m._id),
    investigador1: {
        ...m.investigador1,
        id_inves: getId(m.investigador1)
    },
    investigador2: {
        ...m.investigador2,
        id_inves: getId(m.investigador2)
    }
});
const combinar = (actuales, nuevos) => {
    const mapa = new Map();
    [...actuales, ...nuevos].filter(Boolean).forEach((m) => {
        const msg = normalizar(m);
        mapa.set(msg.id, msg);
    });
    const lista = [...mapa.values()];
    const confirmados = lista.filter((m) => !m.optimista);
    return lista
        .filter((m) => {
            if (!m.optimista) return true;
            return !confirmados.some((real) => {
                const fechaReal = String(real.fecha || "");
                const fechaNormalizada =
                    /(?:Z|[+-]\d{2}:\d{2})$/i.test(fechaReal)
                        ? fechaReal
                        : `${fechaReal}Z`;
                const diferencia = Math.abs(
                    new Date(fechaNormalizada).getTime() -
                    new Date(m.fecha).getTime()
                );
                return (
                    real.mensaje === m.mensaje &&
                    Number(getId(real.investigador1)) ===
                        Number(getId(m.investigador1)) &&
                    Number(getId(real.investigador2)) ===
                        Number(getId(m.investigador2)) &&
                    diferencia < 60000
                );
            });
        })
        .sort((a, b) => {
            const fechaUTC = (fecha) => {
                const valor = String(fecha || "");
                return new Date(
                    /(?:Z|[+-]\d{2}:\d{2})$/i.test(valor)
                        ? valor
                        : `${valor}Z`
                ).getTime();
            };
            return fechaUTC(a.fecha) - fechaUTC(b.fecha);
        });
};
export default function ChatPage() {
    const { auth } = useAuth();
    const userId = Number(auth?.user?.id);
    const [investigadores, setInvestigadores] = useState([]);
    const [destinatarioId, setDestinatarioId] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState("");
    const [search, setSearch] = useState("");
    const [unread, setUnread] = useState({});
    const [estado, setEstado] = useState("disconnected");
    const [cargandoHistorial, setCargandoHistorial] = useState(false);
    const chatRef = useRef(null);
    const destinatarioRef = useRef(null);
    // Chat seleccionado
    destinatarioRef.current = destinatarioId;
    // Contactos
    useEffect(() => {
        let activo = true;
        getInvestigadores()
            .then((res) => {
                if (!activo) return;
                const data = res?.data ?? res;
                const lista = Array.isArray(data)
                    ? data
                    : data?.results ?? [];
                setInvestigadores(
                    lista.map((inv) => ({
                        ...inv,
                        id: Number(getId(inv))
                    }))
                );
            })
            .catch(() => {});
        return () => {
            activo = false;
        };
    }, []);
    // Historial
    const cargarMensajes = async (otroId, inicial = false) => {
        if (!userId || !otroId) return;
        try {
            const res = await getMensajes(userId, otroId);
            const data = res?.data ?? res;
            const lista = Array.isArray(data)
                ? data
                : data?.mensajes ?? [];
            // Evitar mezclar chats
            if (Number(destinatarioRef.current) !== Number(otroId)) {
                return;
            }
            setMensajes((prev) => combinar(prev, lista));
        } catch (error) {
            // No interrumpir el chat si falla la consulta.
        } finally {
            if (inicial && Number(destinatarioRef.current) === Number(otroId)) {
                setCargandoHistorial(false);
            }
        }
    };
    // Notificaciones
    useEffect(() => {
        if (!userId) return;
        const dispose = connectGlobal((payload) => {
            if (payload.type !== "notificacion") return;
            const remitente = Number(payload.remitenteId);
            const receptor = Number(payload.destinatarioId);
            const abierto = Number(destinatarioRef.current);
            if (receptor !== userId) return;
            if (remitente === abierto) {
                // Actualizar el chat abierto
                cargarMensajes(remitente);
            } else {
                setUnread((prev) => ({
                    ...prev,
                    [remitente]: true
                }));
            }
        });
        return () => dispose();
    }, [userId]);
    // Mensajes por socket
    useEffect(() => {
        if (!userId || !destinatarioId) return;
        let activo = true;
        const sala = `sala_${Math.min(userId, destinatarioId)}_${Math.max(
            userId,
            destinatarioId
        )}`;
        const dispose = connect(
            sala,
            (payload) => {
                if (!activo) return;
                if (payload.type === "chat_message" && payload.mensaje) {
                    const mensaje = normalizar(payload.mensaje);
                    setMensajes((prev) => combinar(prev, [mensaje]));
                }
                if (payload.type === "historial") {
                    setMensajes((prev) =>
                        combinar(prev, payload.mensajes ?? [])
                    );
                }
            },
            (status) => {
                if (activo) setEstado(status);
            }
        );
        // Cargar al abrir
        cargarMensajes(destinatarioId, true);
        return () => {
            activo = false;
            dispose();
        };
    }, [userId, destinatarioId]);
    // Scroll al último mensaje
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [mensajes]);
    const abrirChat = (id) => {
        const nuevoId = Number(id);
        if (nuevoId === destinatarioId) return;
        destinatarioRef.current = nuevoId;
        setDestinatarioId(nuevoId);
        setMensajes([]);
        setTexto("");
        setEstado("connecting");
        setCargandoHistorial(true);
        setUnread((prev) => ({
            ...prev,
            [nuevoId]: false
        }));
    };
    const cerrarChat = () => {
        destinatarioRef.current = null;
        setDestinatarioId(null);
        setCargandoHistorial(false);
        setMensajes([]);
        setTexto("");
    };
    const enviar = () => {
        const contenido = texto.trim();
        if (!contenido || estado !== "connected") return;
        const inv1 = investigadores.find((i) => i.id === userId);
        const inv2 = investigadores.find(
            (i) => i.id === Number(destinatarioId)
        );
        if (!inv1 || !inv2) {
            return;
        }
        if (sendMessage(contenido, inv1, inv2)) {
            setTexto("");
        }
    };
    const destinatario = investigadores.find(
        (i) => i.id === Number(destinatarioId)
    );
    const filtrados = investigadores.filter((i) => {
        const nombre = `${i.primernombre ?? ""} ${i.primerapellido ?? ""}`;
        return (
            i.id !== userId &&
            nombre.toLowerCase().includes(search.toLowerCase())
        );
    });
    const listaContactos = (
        <div className="list-group">
            {filtrados.map((i) => (
                <button
                    key={i.id}
                    type="button"
                    className={`list-group-item list-group-item-action ${
                        destinatarioId === i.id ? "active" : ""
                    }`}
                    onClick={() => abrirChat(i.id)}
                >
                    {i.primernombre} {i.primerapellido}
                    {unread[i.id] && (
                        <span className="badge bg-danger ms-2">Nuevo</span>
                    )}
                </button>
            ))}
        </div>
    );
    const conectado = estado === "connected";
    const conectando = estado === "connecting";
    return (
        <div className="chat-page d-flex flex-column h-100">
            <div className="row g-0 flex-grow-1 h-100 chat-min-height">
                <aside className="col-md-3 border-end bg-white p-3 h-100 d-none d-md-block">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="chat-brand-icon rounded-3 d-flex align-items-center justify-content-center">
                            <i className="bi bi-chat-dots-fill" />
                        </span>
                        <div>
                            <div className="fw-bold">Mensajería</div>
                            <small className="text-muted">CensaData</small>
                        </div>
                    </div>
                    <div className="position-relative mb-3">
                        <input className="form-control rounded-3 ps-3"
                            placeholder="Buscar investigador..." value={search}
                            onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <small className="text-muted fw-semibold d-block mb-2">INVESTIGADORES</small>
                    {listaContactos}
                </aside>
                <main className="col-12 col-md-9 d-flex flex-column p-3 h-100 chat-min-height">
                    {destinatarioId ? (
                        <>
                            <header className="d-flex align-items-center gap-3 bg-white border rounded-4 px-3 py-3 mb-3 shadow-sm">
                                <button type="button" className="btn btn-light border rounded-circle"
                                    onClick={cerrarChat} aria-label="Volver a contactos">←</button>
                                <div className="chat-avatar rounded-circle d-flex align-items-center justify-content-center fw-bold">
                                    {(destinatario?.primernombre || "?").charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-grow-1 chat-min-width">
                                    <div className="fw-bold text-truncate">
                                        {destinatario?.primernombre} {destinatario?.primerapellido}
                                    </div>
                                    <div className="chat-status d-flex align-items-center gap-2">
                                        {conectando && <span className="spinner-border spinner-border-sm text-warning chat-status-spinner" />}
                                        {!conectando && <span className={`chat-status-dot rounded-circle ${conectado ? "chat-status-dot--online" : "chat-status-dot--offline"}`} />}
                                        <span className={conectado ? "chat-status-text--online" : conectando ? "chat-status-text--connecting" : "chat-status-text--offline"}>
                                            {conectado ? "Conectado" : conectando ? "Conectando al chat..." : "Sin conexión · Reconectando..."}
                                        </span>
                                    </div>
                                </div>
                                <i className="bi bi-shield-check text-success" title="Conversación privada" />
                            </header>
                            <section ref={chatRef}
                                className="chat-min-height flex-grow-1 overflow-auto mb-3 p-3 p-md-4 border rounded-4 bg-white" aria-label="Mensajes de la conversación">
                                {cargandoHistorial && mensajes.length === 0 ? (
                                    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center">
                                        <div className="spinner-border text-primary mb-3" role="status" aria-label="Cargando" />
                                        <div className="fw-semibold">Cargando mensajes...</div>
                                        <small className="text-muted mt-1">Preparando la conversación</small>
                                    </div>
                                ) : mensajes.length === 0 ? (
                                    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center">
                                        <div className="chat-empty-icon rounded-circle d-flex align-items-center justify-content-center mb-3">
                                            <i className="bi bi-chat-heart fs-3" />
                                        </div>
                                        <div className="fw-semibold">Todavía no hay mensajes</div>
                                        <small className="text-muted mt-1">¡Escribí el primero para comenzar!</small>
                                    </div>
                                ) : (
                                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
                                        {mensajes.map((m) => {
                                            const propio = Number(getId(m.investigador1)) === userId;
                                            return (
                                                <li key={m.id} className={`d-flex ${propio ? "justify-content-end" : "justify-content-start"}`}>
                                                    <div className={`chat-bubble px-3 py-2 ${propio ? "chat-bubble--own text-white" : "chat-bubble--other text-dark"}`}>
                                                        <div className="chat-message-text">{m.mensaje}</div>
                                                        <div className="chat-message-time text-end mt-1">
                                                            {horaManagua(m.fecha)}
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </section>
                            <div className="d-flex align-items-center gap-2 bg-white border rounded-4 p-2 shadow-sm">
                                <input className="form-control border-0 shadow-none"
                                    placeholder={conectado ? "Escribí un mensaje..." : "Esperando conexión..."}
                                    value={texto} onChange={(e) => setTexto(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") enviar(); }}
                                    disabled={!conectado} aria-label="Escribir mensaje" />
                                <button type="button" className="btn btn-primary chat-send-button rounded-3 px-3"
                                    onClick={enviar} disabled={!conectado || !texto.trim()} aria-label="Enviar mensaje">
                                    <i className="bi bi-send-fill" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="d-md-none bg-white border rounded-4 p-3">
                                <h5 className="fw-bold mb-3">Mensajería</h5>
                                <input className="form-control mb-3" placeholder="Buscar investigador..."
                                    value={search} onChange={(e) => setSearch(e.target.value)} />
                                {listaContactos}
                            </div>
                            <div className="d-none d-md-flex flex-grow-1 flex-column align-items-center justify-content-center text-center">
                                <div className="chat-welcome-icon rounded-circle d-flex align-items-center justify-content-center mb-3">
                                    <i className="bi bi-chat-square-text fs-2" />
                                </div>
                                <h4 className="fw-bold">Tus conversaciones</h4>
                                <p className="text-muted">Seleccioná un investigador para comenzar a conversar.</p>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
