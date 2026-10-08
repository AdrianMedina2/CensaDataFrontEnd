import { useEffect, useState } from "react";
import {
    getEventos,
    createEvento,
    patchEvento,
    deleteEvento,
    getAreasConocimientos
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
        Promise.all([getEventos(), getAreasConocimientos()])
            .then(([resEventos, resCategorias]) => {
                const datosEventos = Array.isArray(resEventos?.data)
                    ? resEventos.data.filter(e => e.estado)
                    : [];
                const ordenadosEventos = datosEventos.sort((a, b) => b.id - a.id);

                const datosCategorias = Array.isArray(resCategorias?.data)
                    ? resCategorias.data.filter(c => c.estado)
                    : [];
                setCategorias(datosCategorias);

                // Mapear categoriaid -> nombre
                const eventosConNombre = ordenadosEventos.map(e => {
                    const categoria = datosCategorias.find(c => c.id === e.categoriaid);
                    return {
                        ...e,
                        categoriaNombre: categoria ? categoria.areaconocimiento : "Sin categoría"
                    };
                });

                setEventos(eventosConNombre);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const columns = [
        { key: "evento", label: "Evento", rules: { required: true, minLength: 3, maxLength: 30 } },
        {
            key: "categoriaid",
            label: "Categoría",
            type: "select",
            options: categorias.map(c => ({ value: c.id, label: c.areaconocimiento })),
            rules: { required: true },
            render: (row) => {
                const cat = categorias.find(c => c.id === row.categoriaid);
                return cat ? cat.areaconocimiento : "Sin asignar";
            }
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
