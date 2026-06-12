import { useEffect, useState } from "react";
import {
    getRelacionesParentescos,
    createRelacionParentesco,
    patchRelacionParentesco,
    deleteRelacionParentesco
} from "../../services/";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function ParentescoSection() {
    const [parentescos, setParentescos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        getRelacionesParentescos()
            .then(res => {
                setParentescos(Array.isArray(res.data) ? res.data : []);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "relacion", label: "Relación", rules: { required: true, minLength: 3 } },
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchRelacionParentesco(id, data)
            .then(() =>
                getRelacionesParentescos().then(res =>
                    setParentescos(Array.isArray(res.data) ? res.data : [])
                )
            )
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Relación editada correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteRelacionParentesco(id)
            .then(() =>
                getRelacionesParentescos().then(res =>
                    setParentescos(Array.isArray(res.data) ? res.data : [])
                )
            )
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Relación eliminada correctamente 🗑️", type: "success" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createRelacionParentesco(nuevo);
            getRelacionesParentescos().then(res =>
                setParentescos(Array.isArray(res.data) ? res.data : [])
            );
            setMessage({ text: "Relación creada correctamente ➕", type: "success" });
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
                data={Array.isArray(parentescos) ? parentescos : []}
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
