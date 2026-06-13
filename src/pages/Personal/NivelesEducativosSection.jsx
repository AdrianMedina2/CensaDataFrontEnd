import { useEffect, useState } from "react";
import {
    getNivelesEducativos,
    createNivelEducativo,
    patchNivelEducativo,
    deleteNivelEducativo
} from "../../services/";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function EducacionSection() {
    const [nivelesEducativos, setNivelesEducativos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    const cargarDatos = () => {
        getNivelesEducativos()
            .then(res => {
                const datos = Array.isArray(res.data) ? res.data : [];
                const ordenados = datos.sort((a, b) => b.id - a.id);
                setNivelesEducativos(ordenados);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const columns = [
        { key: "niveleducativo", label: "Nivel Educativo", rules: { required: true, minLength: 3 } },
        { key: "grado", label: "Grado", rules: { required: true, min: 1 } },
    ];

    const handleEdit = async (id, data) => {
        setProcessing(true);
        try {
            await patchNivelEducativo(id, data);
            cargarDatos();
            setMessage({ text: "Nivel educativo editado correctamente ✅", type: "success" });
        } catch (error) {
            let errorMsg = "Error al editar el nivel educativo";
            if (error.response && error.response.data) {
                if (typeof error.response.data === "string") {
                    errorMsg = error.response.data;
                } else if (error.response.data.detail) {
                    errorMsg = error.response.data.detail;
                } else {
                    errorMsg = Object.values(error.response.data).join(" | ");
                }
            }
            setMessage({ text: errorMsg, type: "error" });
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        setProcessing(true);
        try {
            await deleteNivelEducativo(id);
            cargarDatos();
            setMessage({ text: "Nivel educativo eliminado correctamente 🗑️", type: "success" });
        } catch (error) {
            let errorMsg = "Error al eliminar el nivel educativo";
            if (error.response && error.response.data) {
                if (typeof error.response.data === "string") {
                    errorMsg = error.response.data;
                } else if (error.response.data.detail) {
                    errorMsg = error.response.data.detail;
                } else {
                    errorMsg = Object.values(error.response.data).join(" | ");
                }
            }
            setMessage({ text: errorMsg, type: "error" });
        } finally {
            setProcessing(false);
        }
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createNivelEducativo(nuevo);
            cargarDatos();
            setMessage({ text: "Nivel educativo creado correctamente ➕", type: "success" });
        } catch (error) {
            let errorMsg = "Error al crear el nivel educativo";
            if (error.response && error.response.data) {
                if (typeof error.response.data === "string") {
                    errorMsg = error.response.data;
                } else if (error.response.data.detail) {
                    errorMsg = error.response.data.detail;
                } else {
                    errorMsg = Object.values(error.response.data).join(" | ");
                }
            }
            setMessage({ text: errorMsg, type: "error" });
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
                data={Array.isArray(nivelesEducativos) ? nivelesEducativos : []}
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
