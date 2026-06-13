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

    const cargarDatos = () => {
        getEmpleos()
            .then(res => {
                const datos = Array.isArray(res.data) ? res.data : [];
                const ordenados = datos.sort((a, b) => b.id - a.id);
                setEmpleos(ordenados);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const columns = [
        { key: "empleo", label: "Empleo", rules: { required: true, minLength: 3 } },
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchEmpleo(id, data)
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Empleo editado correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteEmpleo(id)
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Empleo eliminado correctamente 🗑️", type: "success" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createEmpleo({ ...nuevo});
            cargarDatos();
            setMessage({ text: "Empleo creado correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear el empleo ❌", type: "error" });
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
                data={Array.isArray(empleos) ? empleos : []}
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
