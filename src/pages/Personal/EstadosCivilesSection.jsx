import { useEffect, useState } from "react";
import {
    getEstadosCiviles,
    createEstadoCivil,
    patchEstadoCivil,
    deleteEstadoCivil
} from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function EstadosCivilesSection() {
    const [estadosCiviles, setEstadosCiviles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        getEstadosCiviles()
            .then(data => {
                setEstadosCiviles(data);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "estadocivil", label: "Estado Civil", rules: { required: true, minLength: 3 } },
    ];

    const handleEdit = async (id, data) => {
        setProcessing(true);
        try {
            await patchEstadoCivil(id, data);
            getEstadosCiviles().then(setEstadosCiviles);
            setMessage({ text: "Estado civil editado correctamente ✅", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al editar el estado civil ❌", type: "error" });
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        setProcessing(true);
        try {
            await deleteEstadoCivil(id);
            getEstadosCiviles().then(setEstadosCiviles);
            setMessage({ text: "Estado civil eliminado correctamente 🗑️", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al eliminar el estado civil ❌", type: "error" });
        } finally {
            setProcessing(false);
        }
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createEstadoCivil({ ...nuevo, estado: true });
            getEstadosCiviles().then(setEstadosCiviles);
            setMessage({ text: "Estado civil creado correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear el estado civil ❌", type: "error" });
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
                data={Array.isArray(estadosCiviles) ? estadosCiviles.filter(e => e.estado === true) : []}
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
