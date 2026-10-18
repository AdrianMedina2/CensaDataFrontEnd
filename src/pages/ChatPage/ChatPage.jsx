import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { getInvestigadores, connect, sendMessage, close } from "../../services";

function ChatPage() {
    const { auth } = useAuth();
    const userId = auth.user?.id;

    const [investigadores, setInvestigadores] = useState([]);
    const [search, setSearch] = useState("");
    const [destinatarioId, setDestinatarioId] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState("");

    const chatRef = useRef(null);

    useEffect(() => {
        getInvestigadores().then(res => {
            const lista = Array.isArray(res.data) ? res.data : res;
            setInvestigadores(lista);
        });
    }, []);

    useEffect(() => {
        if (userId && destinatarioId) {
            connect(
                userId,
                destinatarioId,
                (payload) => {
                    if (payload.type === "historial") {
                        setMensajes(payload.mensajes);
                    } else if (payload.type === "chat_message") {
                        setMensajes((prev) => [...prev, payload.mensaje]);
                    }
                },
                (status) => console.log("Estado:", status)
            );
        }
        return () => close();
    }, [userId, destinatarioId]);

    // Scroll automático al último mensaje
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [mensajes]);

    const handleSend = () => {
        if (texto.trim() && destinatarioId) {
            const inv1 = investigadores.find(i => i.id === userId);
            const inv2 = investigadores.find(i => i.id === destinatarioId);

            if (inv1 && inv2) {
                sendMessage(texto, inv1, inv2);
                setTexto("");
            } else {
                console.error("No se encontraron los investigadores completos");
            }
        }
    };

    const destinatario = investigadores.find(i => i.id === destinatarioId);

    return (
        <div className="chat-page d-flex flex-column h-100">
            <div className="row flex-grow-1 h-100">
                {/* Sidebar izquierda en escritorio */}
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
                                    className={`list-group-item list-group-item-action ${destinatarioId === inv.id ? "active" : ""}`}
                                    onClick={() => setDestinatarioId(inv.id)}
                                >
                                    <strong>{inv.primernombre} {inv.primerapellido}</strong>
                                </button>
                            ))}
                    </div>
                </div>

                {/* Panel de chat derecha */}
                <div className="col-12 col-md-9 d-flex flex-column p-3 h-100">
                    {destinatarioId ? (
                        <>
                            {/* Header */}
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

                            {/* Mensajes */}
                            <div
                                ref={chatRef}
                                className="flex-grow-1 overflow-auto mb-3 p-3 bg-white border rounded"
                                style={{ minHeight: 0 }}
                            >
                                <ul className="list-unstyled">
                                    {mensajes.map((m, i) => (
                                        <li
                                            key={i}
                                            className={`p-2 mb-2 rounded ${m.investigador1?.id_inves === userId
                                                    ? "bg-primary text-white ms-auto text-end"
                                                    : "bg-light text-dark me-auto"
                                                }`}
                                            style={{ maxWidth: "70%" }}
                                        >
                                            {m.mensaje}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Input */}
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
                            {/* Lista de investigadores en móviles */}
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
                                                onClick={() => setDestinatarioId(inv.id)}
                                            >
                                                <strong>{inv.primernombre} {inv.primerapellido}</strong>
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
