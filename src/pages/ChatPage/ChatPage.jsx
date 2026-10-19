import React, { useEffect, useState, useRef } from "react";
import { connect, sendMessage, close, connectGlobal, closeGlobal } from "../../services/chatSocket";
import { getMensajes, getInvestigadores } from "../../services";
import { useAuth } from "../../context/AuthContext";

function ChatPage() {
    const { auth } = useAuth();
    const userId = Number(auth.user?.id);

    const [investigadores, setInvestigadores] = useState([]);
    const [search, setSearch] = useState("");
    const [destinatarioId, setDestinatarioId] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState("");
    const [unread, setUnread] = useState({});
    const chatRef = useRef(null);

    const getId = (inv) => inv?.id_inves ?? inv?.id_invest;

    // Cargar lista de investigadores
    useEffect(() => {
        getInvestigadores().then(res => {
            const lista = Array.isArray(res.data) ? res.data : res;
            setInvestigadores(lista.map(i => ({ ...i, id: Number(i.id) })));
        });
    }, []);

    // Conexión al socket: sala dinámica según usuario y destinatario
    useEffect(() => {
        if (!userId || !destinatarioId) return;

        // Sala con convención id1_id2
        const roomName = `sala_${Math.min(userId, destinatarioId)}_${Math.max(userId, destinatarioId)}`;

        connect(
            roomName,
            (payload) => {
                if (payload.type === "chat_message" && payload.mensaje) {
                    const incoming = payload.mensaje;
                    setMensajes(prev => {
                        const existe = prev.some(m => m._id === incoming._id);
                        return existe ? prev : [...prev, incoming];
                    });
                }
                console.log("payload recibido:", payload);
            },
            (status) => console.log("Estado:", status)
        );

        return () => {
            console.log("Chat cerrado, cerrando socket de chat");
            close();
        };
    }, [userId, destinatarioId]);

    // Conexión global a notificaciones
    useEffect(() => {
        if (!userId) return;

        connectGlobal(
            (payload) => {
                if (payload.type === "notificacion") {
                    const { remitenteId, destinatarioId } = payload;
                    // Si el usuario es el destinatario y no está en ese chat, marca badge
                    if (Number(payload.destinatarioId) === userId && Number(destinatarioId) !== Number(payload.remitenteId)) {
                        setUnread(prev => ({ ...prev, [payload.remitenteId]: true }));
                    }

                }
                console.log("Notificación global recibida:", payload);
            },
            (status) => console.log("Estado global:", status)
        );

        return () => {
            console.log("ChatPage desmontado, cerrando socket global");
            closeGlobal();
        };
    }, [userId]);

    // Cargar historial vía API
    useEffect(() => {
        async function cargarHistorial() {
            if (destinatarioId) {
                const data = await getMensajes(userId, destinatarioId);
                setMensajes(Array.isArray(data.mensajes) ? data.mensajes : []);
            }
        }
        cargarHistorial();
    }, [destinatarioId, userId]);

    // Scroll automático
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [mensajes]);

    const handleSend = () => {
        if (texto.trim() && destinatarioId) {
            const inv1 = investigadores.find(i => Number(i.id) === Number(userId));
            const inv2 = investigadores.find(i => Number(i.id) === Number(destinatarioId));
            if (inv1 && inv2) {
                sendMessage(texto, inv1, inv2);
                setTexto("");
            }
        }
    };

    const destinatario = investigadores.find(i => Number(i.id) === Number(destinatarioId));

    return (
        <div className="chat-page d-flex flex-column h-100">
            <div className="row flex-grow-1 h-100">
                {/* Sidebar solo en desktop */}
                <div className="col-md-3 border-end bg-light p-3 h-100 d-none d-md-block">
                    <input
                        type="text"
                        placeholder="Buscar investigador..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control mb-3"
                    />
                    <div className="list-group">
                        {investigadores
                            .filter(inv =>
                                inv.id !== userId &&
                                `${inv.primernombre} ${inv.primerapellido}`.toLowerCase().includes(search.toLowerCase())
                            )
                            .map(inv => (
                                <button
                                    key={inv.id}
                                    className={`list-group-item list-group-item-action ${Number(destinatarioId) === inv.id ? "active" : ""}`}
                                    onClick={() => {
                                        setDestinatarioId(inv.id);
                                        setMensajes([]);
                                        setUnread(prev => ({ ...prev, [inv.id]: false }));
                                    }}
                                >
                                    <strong>{inv.primernombre} {inv.primerapellido}</strong>
                                    {unread[inv.id] && <span className="badge bg-danger ms-2">Nuevo</span>}
                                </button>
                            ))}
                    </div>
                </div>

                {/* Panel de chat (en móvil ocupa todo) */}
                <div className="col-12 col-md-9 d-flex flex-column p-3 h-100">
                    {destinatarioId ? (
                        <>
                            <div className="d-flex align-items-center border-bottom pb-2 mb-3">
                                <button
                                    className="btn btn-outline-secondary btn-sm me-2"
                                    onClick={() => setDestinatarioId(null)}
                                >
                                    ←
                                </button>
                                <h5 className="mb-0">
                                    Chat con {destinatario?.primernombre} {destinatario?.primerapellido}
                                </h5>
                            </div>

                            <div
                                ref={chatRef}
                                className="flex-grow-1 overflow-auto mb-3 p-3 bg-white border rounded"
                                style={{ minHeight: 0 }}
                            >
                                <ul className="list-unstyled">
                                    {mensajes.map((m, i) => {
                                        const fechaObj = new Date(m.fecha);
                                        const hora = isNaN(fechaObj.getTime())
                                            ? "hora desconocida"
                                            : fechaObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

                                        const esRemitente = Number(getId(m.investigador1)) === userId;

                                        return (
                                            <li
                                                key={m._id ?? i}
                                                className={`p-2 mb-2 rounded ${esRemitente ? "bg-primary text-white ms-auto text-end" : "bg-light text-dark me-auto"}`}
                                                style={{ maxWidth: "70%" }}
                                            >
                                                <div>{m.mensaje}</div>
                                                <small className="text-muted d-block">{hora}</small>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Escribe un mensaje..."
                                    value={texto}
                                    onChange={(e) => setTexto(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                />
                                <button className="btn btn-primary" onClick={handleSend}>
                                    <i className="bi bi-send-fill"></i>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* En móvil: lista arriba */}
                            <div className="d-md-none w-100">
                                <input
                                    type="text"
                                    placeholder="Buscar investigador..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-control mb-3"
                                />
                                <div className="list-group">
                                    {investigadores
                                        .filter(inv =>
                                            inv.id !== userId &&
                                            `${inv.primernombre} ${inv.primerapellido}`.toLowerCase().includes(search.toLowerCase())
                                        )
                                        .map(inv => (
                                            <button
                                                key={inv.id}
                                                className="list-group-item list-group-item-action"
                                                onClick={() => {
                                                    setDestinatarioId(inv.id);
                                                    setMensajes([]);
                                                    setUnread(prev => ({ ...prev, [inv.id]: false }));
                                                }}
                                            >
                                                <strong>{inv.primernombre} {inv.primerapellido}</strong>
                                                {unread[inv.id] && <span className="badge bg-danger ms-2">Nuevo</span>}
                                            </button>
                                        ))}
                                </div>
                            </div>

                            {/* En desktop: texto centrado */}
                            <div className="d-none d-md-flex flex-grow-1 align-items-center justify-content-center">
                                <h4 className="text-muted">Selecciona un investigador</h4>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

    );
}

export default ChatPage;
