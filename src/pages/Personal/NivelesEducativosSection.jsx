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

    useEffect(() => {
        getNivelesEducativos()
            .then(data => {
                console.log("Respuesta API Niveles Educativos:", data);
                setNivelesEducativos(data);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "niveleducativo", label: "Nivel Educativo", rules: { required: true, minLength: 3 } },
        { key: "grado", label: "Grado", rules: { required: true, min: 1 } },
    ];

    const handleEdit = async (id, data) => {
        setProcessing(true);
        try {
            await patchNivelEducativo(id, data);
            getNivelesEducativos().then(setNivelesEducativos);
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
            getNivelesEducativos().then(setNivelesEducativos);
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
            getNivelesEducativos().then(setNivelesEducativos);
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
                data={Array.isArray(nivelesEducativos) ? nivelesEducativos.filter(e => e.estado === true) : []}
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
