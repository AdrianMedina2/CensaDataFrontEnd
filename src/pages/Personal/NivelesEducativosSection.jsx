import { useEffect, useState } from "react";
import {
    getNivelesEducativos,
    createNivelEducativo,
    patchNivelEducativo,
    deleteNivelEducativo
} from "../../services/"
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function EducacionSection() {
    const [nivelesEducativos, setNivelesEducativos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        getNivelesEducativos()
            .then(setNivelesEducativos)
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "niveleducativo", label: "Nivel Educativo" },
        { key: "grado", label: "Grado" },
    ];

    const handleEdit = (id, data) => {
        patchNivelEducativo(id, data)
            .then(() => getNivelesEducativos().then(setNivelesEducativos))
            .finally(() => setMessage("Nivel educativo editado correctamente ✅"));
    };

    const handleDelete = (id) => {
        deleteNivelEducativo(id)
            .then(() => getNivelesEducativos().then(setNivelesEducativos))
            .finally(() => setMessage("Nivel educativo eliminado correctamente 🗑️"));
    };

    const handleAdd = async (nuevo) => {
        await createNivelEducativo(nuevo);
        getNivelesEducativos().then(setNivelesEducativos);
        setMessage("Nivel educativo creado correctamente ➕");
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
                data={nivelesEducativos.filter(e => e.estado === true)} // solo activos
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
            />
            {message && (
                <ToastMessage
                    message={message}
                    type="success"
                    autohide={true}
                    delay={3000}
                    onClose={() => setMessage(null)}
                />
            )}
        </div>
    );
}
