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

    useEffect(() => {
        getEmpleos()
            .then(setEmpleos)
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "empleo", label: "Empleo" },
    ];

    const handleEdit = (id, data) => {
        patchEmpleo(id, data)
            .then(() => getEmpleos().then(setEmpleos))
            .finally(() => setMessage("Empleo editado correctamente ✅"));
    };

    const handleDelete = (id) => {
        deleteEmpleo(id)
            .then(() => getEmpleos().then(setEmpleos))
            .finally(() => setMessage("Empleo eliminado correctamente 🗑️"));
    };

    const handleAdd = async (nuevo) => {
        await createEmpleo(nuevo);
        getEmpleos().then(setEmpleos);
        setMessage("Empleo creado correctamente ➕");
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
                data={empleos.filter(e => e.estado === true)} // solo activos
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
