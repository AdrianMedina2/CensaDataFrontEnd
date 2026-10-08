import { useEffect, useState } from "react";
import {
    getAreasConocimientos,
    createAreaConocimiento,
    patchAreaConocimiento,
    deleteAreaConocimiento
} from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function AreasConocimientoSection() {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    const cargarDatos = () => {
        getAreasConocimientos()
            .then(res => {
                const datos = Array.isArray(res.data) ? res.data.filter(a => a.estado) : [];
                const ordenados = datos.sort((a, b) => b.id - a.id);
                setAreas(ordenados);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const columns = [
        { key: "areaconocimiento", label: "Área de Conocimiento", rules: { required: true, minLength: 3 } }
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchAreaConocimiento(id, { ...data, estado: true })
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Área de conocimiento editada correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteAreaConocimiento(id)
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Área de conocimiento eliminada correctamente 🗑️", type: "success" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createAreaConocimiento({ ...nuevo, estado: true, cantidadcarreras: 0 });
            cargarDatos();
            setMessage({ text: "Área de conocimiento creada correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear el área de conocimiento ❌", type: "error" });
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
                data={Array.isArray(areas) ? areas : []}
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
