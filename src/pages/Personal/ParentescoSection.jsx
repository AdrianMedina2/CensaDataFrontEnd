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

    useEffect(() => {
        getRelacionesParentescos()
            .then(setParentescos)
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "relacion", label: "Relación" },
    ];

    const handleEdit = (id, data) => {
        patchRelacionParentesco(id, data)
            .then(() => getRelacionesParentescos().then(setParentescos))
            .finally(() => setMessage("Relación editada correctamente ✅"));
    };

    const handleDelete = (id) => {
        deleteRelacionParentesco(id)
            .then(() => getRelacionesParentescos().then(setParentescos))
            .finally(() => setMessage("Relación eliminada correctamente 🗑️"));
    };

    const handleAdd = async (nuevo) => {
        await createRelacionParentesco(nuevo);
        getRelacionesParentescos().then(setParentescos);
        setMessage("Relación creada correctamente ➕");
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
                data={parentescos.filter(p => p.estado === true)} // solo activos
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
