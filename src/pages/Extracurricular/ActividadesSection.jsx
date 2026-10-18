import { useEffect, useState } from "react";
import {
    getActividadesExtraCurriculares,
    createActividadExtraCurricular,
    patchActividadExtraCurricular,
    deleteActividadExtraCurricular
} from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function ActividadesSection() {
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    const cargarDatos = () => {
        getActividadesExtraCurriculares()
            .then(res => {
                const datos = Array.isArray(res.data) ? res.data.filter(a => a.estado) : [];
                const ordenados = datos.sort((a, b) => b.id - a.id);
                setActividades(ordenados);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const columns = [
        { key: "actividad", label: "Actividad", rules: { required: true, minLength: 3, maxLength: 20 } }
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchActividadExtraCurricular(id, { ...data, estado: true, cantidadempadronados: 0 })
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Actividad editada correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteActividadExtraCurricular(id)
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Actividad eliminada correctamente 🗑️", type: "success" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createActividadExtraCurricular({ ...nuevo, estado: true, cantidadempadronados: 0 });
            cargarDatos();
            setMessage({ text: "Actividad creada correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear la actividad ❌", type: "error" });
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
                data={Array.isArray(actividades) ? actividades : []}
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
