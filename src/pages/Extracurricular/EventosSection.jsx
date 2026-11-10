import { useEffect, useState } from "react";
import {
    getEventos,
    createEvento,
    patchEvento,
    deleteEvento,
    getCategoriasEventos
} from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function EventosSection() {
    const [eventos, setEventos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    const cargarDatos = () => {
        Promise.all([getEventos(), getCategoriasEventos()])
            .then(([resEventos, resCategorias]) => {
                const obtenerDatos = (res) => {
                    if (Array.isArray(res?.data?.data)) return res.data.data;
                    if (Array.isArray(res?.data)) return res.data;
                    return [];
                };

                const datosEventos = obtenerDatos(resEventos)
                    .filter(e => e.estado !== false)
                    .sort((a, b) => b.id - a.id);

                const datosCategorias = obtenerDatos(resCategorias)
                    .filter(c => c.estado !== false);

                setCategorias(datosCategorias);

                const eventosConNombre = datosEventos.map(e => {
                    const categoria = datosCategorias.find(
                        c => String(c.id) === String(e.categoriaid)
                    );

                    return {
                        ...e,
                        categoriaNombre: categoria?.categoria || "Sin categoría"
                    };
                });

                setEventos(eventosConNombre);
            })
            .catch(error => {
                console.error("Error al cargar eventos:", error);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const columns = [
        {
            key: "evento",
            label: "Evento",
            rules: { required: true, minLength: 3, maxLength: 30 }
        },
        {
            key: "categoriaid",
            label: "Categoría",
            type: "select",
            options: categorias.map(c => ({
                value: c.id,
                label: c.categoria
            })),
            rules: { required: true },
            render: (row) => row.categoriaNombre || "Sin categoría"
        }
    ];


    const handleEdit = (id, data) => {
        setProcessing(true);
        patchEvento(id, { ...data, estado: true })
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Evento editado correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteEvento(id)
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Evento eliminado correctamente 🗑️", type: "success" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createEvento({ ...nuevo, estado: true });
            cargarDatos();
            setMessage({ text: "Evento creado correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear el evento ❌", type: "error" });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div>
            <EditableTable
                columns={columns}
                data={Array.isArray(eventos) ? eventos : []}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
            />

            {processing && (
                <ToastMessage
                    message={
                        <div className="d-flex align-items-center">
                            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                            Procesando acción, por favor espera…
                        </div>
                    }
                    type="warning"
                    autohide={false}
                    onClose={() => setProcessing(false)}
                />
            )}

            {message && (
                <ToastMessage
                    message={message.text}
                    type={message.type}
                    autohide={true}
                    delay={3000}
                    onClose={() => setMessage(null)}
                />
            )}
        </div>
    );
}
