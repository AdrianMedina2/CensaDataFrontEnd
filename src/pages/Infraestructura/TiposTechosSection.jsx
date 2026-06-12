import { useEffect, useState } from "react";
import {
    getTiposDeTechos,
    createTipoDeTecho,
    patchTipoDeTecho,
    deleteTipoDeTecho
} from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function TiposTechosSection() {
    const [tiposTechos, setTiposTechos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        getTiposDeTechos()
            .then(res => {
                setTiposTechos(Array.isArray(res.data) ? res.data : []);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "tipodetecho", label: "Tipo de techo", rules: { required: true, minLength: 3 } },
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchTipoDeTecho(id, data)
            .then(() =>
                getTiposDeTechos().then(res =>
                    setTiposTechos(Array.isArray(res.data) ? res.data : [])
                )
            )
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Tipo de techo editado correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteTipoDeTecho(id)
            .then(() =>
                getTiposDeTechos().then(res =>
                    setTiposTechos(Array.isArray(res.data) ? res.data : [])
                )
            )
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Tipo de techo eliminado correctamente 🗑️", type: "success" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createTipoDeTecho(nuevo);
            getTiposDeTechos().then(res =>
                setTiposTechos(Array.isArray(res.data) ? res.data : [])
            );
            setMessage({ text: "Tipo de techo creado correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear el tipo de techo ❌", type: "error" });
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
                data={Array.isArray(tiposTechos) ? tiposTechos : []}
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
