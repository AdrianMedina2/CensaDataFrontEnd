import { useEffect, useState } from "react";
import {
    getDiscapacidades,
    createDiscapacidad,
    patchDiscapacidad,
    deleteDiscapacidad
} from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function DiscapacidadesSection() {
    const [discapacidades, setDiscapacidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        getDiscapacidades()
            .then(res => {
                setDiscapacidades(Array.isArray(res.data) ? res.data : []);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "discapacidad", label: "Discapacidad", rules: { required: true, minLength: 3 } },
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchDiscapacidad(id, data)
            .then(() =>
                getDiscapacidades().then(res =>
                    setDiscapacidades(Array.isArray(res.data) ? res.data : [])
                )
            )
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Discapacidad editada correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteDiscapacidad(id)
            .then(() =>
                getDiscapacidades().then(res =>
                    setDiscapacidades(Array.isArray(res.data) ? res.data : [])
                )
            )
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Discapacidad eliminada correctamente 🗑️", type: "success" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createDiscapacidad(nuevo);
            getDiscapacidades().then(res =>
                setDiscapacidades(Array.isArray(res.data) ? res.data : [])
            );
            setMessage({ text: "Discapacidad creada correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear la discapacidad ❌", type: "error" });
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
                data={Array.isArray(discapacidades) ? discapacidades : []}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
            />

            {/* Mensaje de acción en curso */}
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

            {/* Mensajes de éxito/error */}
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
