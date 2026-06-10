import { useEffect, useState } from "react";
import {
    getEmpleos,
    createEmpleo,
    patchEmpleo,
    deleteEmpleo
} from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function EmpleoSection() {
    const [empleos, setEmpleos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        getEmpleos()
            .then(data => {
                console.log("Respuesta API Empleos:", data);
                setEmpleos(data);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "empleo", label: "Empleo", rules: { required: true, minLength: 3 } },
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchEmpleo(id, data)
            .then(() => getEmpleos().then(setEmpleos))
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Empleo editado correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteEmpleo(id)
            .then(() => getEmpleos().then(setEmpleos))
            .finally(() => {
                setProcessing(false);
                setMessage("Empleo eliminado correctamente 🗑️");
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            // asegurar que siempre se mande estado: true
            await createEmpleo({ ...nuevo, estado: true });
            getEmpleos().then(setEmpleos);
            setMessage("Empleo creado correctamente ➕");
        } catch (error) {
            setMessage("Error al crear el empleo ❌");
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
                data={Array.isArray(empleos) ? empleos.filter(e => e.estado === true) : []}
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
