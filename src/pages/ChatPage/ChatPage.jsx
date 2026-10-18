import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getInvestigadores, connect, sendMessage, close } from "../../services";

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

    useEffect(() => {
        getInvestigadores().then(res => {
            const lista = Array.isArray(res.data) ? res.data : res;
            setInvestigadores(lista.map(i => ({ ...i, id: Number(i.id) })));
        });
    }, []);

    useEffect(() => {
        if (!userId) return;

        const currentDest = destinatarioId !== null ? Number(destinatarioId) : null;

        connect(
            userId,
            currentDest,
            (payload) => {
                if (payload.type === "historial") {
                    setMensajes(Array.isArray(payload.mensajes) ? payload.mensajes : []);
                } else if (payload.type === "chat_message") {
                    const invId = Number(payload.mensaje.investigador1.id_inves);
                    const invDest = Number(payload.mensaje.investigador2.id_inves);

                    if (
                        currentDest &&
                        (
                            (invId === userId && invDest === currentDest) ||
                            (invDest === userId && invId === currentDest)
                        )
                    ) {
                        setMensajes(prev => [...prev, payload.mensaje]);
                    }

                    if (invId !== userId && invId !== destinatarioId) {
                        setUnread(prev => ({ ...prev, [invId]: true }));
                    }

                }
            },
            (status) => console.log("Estado:", status)
        );

        return () => close();
    }, [userId, destinatarioId]);

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
                                    {mensajes.map((m, i) => (
                                        <li
                                            key={i}
                                            className={`p-2 mb-2 rounded ${
                                                Number(m.investigador1?.id_inves) === userId
                                                    ? "bg-primary text-white ms-auto text-end"
                                                    : "bg-light text-dark me-auto"
                                            }`}
                                            style={{ maxWidth: "70%" }}
                                        >
                                            <div>{m.mensaje}</div>
                                            <small className="text-muted d-block">{m.fechaLocal}</small>
                                        </li>
                                    ))}
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
                            <div className="d-md-none d-flex flex-column align-items-center">
                                <input
                                    type="text"
                                    placeholder="Buscar investigador..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-control mb-3 text-center"
                                    style={{ maxWidth: "100%" }}
                                />
                                <div className="list-group w-100">
                                    {investigadores
                                        .filter(inv =>
                                            inv.id !== userId &&
                                            `${inv.primernombre} ${inv.primerapellido}`.toLowerCase().includes(search.toLowerCase())
                                        )
                                        .map(inv => (
                                            <button
                                                key={inv.id}
                                                className="list-group-item list-group-item-action text-center fs-5"
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

                            <div className="d-flex align-items-center justify-content-center flex-grow-1 d-none d-md-flex">
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
