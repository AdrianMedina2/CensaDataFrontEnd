import { useEffect, useState } from "react";
import {
    getTiposDePisos,
    createTipoDePiso,
    patchTipoDePiso,
    deleteTipoDePiso
} from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function TiposPisosSection() {
    const [tiposPisos, setTiposPisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        getTiposDePisos()
            .then(res => {
                setTiposPisos(Array.isArray(res.data) ? res.data : []);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "tipodepiso", label: "Tipo de piso", rules: { required: true, minLength: 3 } },
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchTipoDePiso(id, data)
            .then(() =>
                getTiposDePisos().then(res =>
                    setTiposPisos(Array.isArray(res.data) ? res.data : [])
                )
            )
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Tipo de piso editado correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteTipoDePiso(id)
            .then(() =>
                getTiposDePisos().then(res =>
                    setTiposPisos(Array.isArray(res.data) ? res.data : [])
                )
            )
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Tipo de piso eliminado correctamente 🗑️", type: "success" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createTipoDePiso(nuevo);
            getTiposDePisos().then(res =>
                setTiposPisos(Array.isArray(res.data) ? res.data : [])
            );
            setMessage({ text: "Tipo de piso creado correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear el tipo de piso ❌", type: "error" });
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
                data={Array.isArray(tiposPisos) ? tiposPisos : []}
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
