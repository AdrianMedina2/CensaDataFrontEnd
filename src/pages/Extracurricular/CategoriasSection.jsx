import { useEffect, useState } from "react";
import {
    getCategoriasEventos,
    createCategoriaEvento,
    patchCategoriaEvento,
    deleteCategoriaEvento
} from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function CategoriasSection() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    const cargarDatos = () => {
        getCategoriasEventos()
            .then((res) => {
                const datos = Array.isArray(res?.data) ? res.data : [];
                const ordenados = datos.sort((a, b) => b.id - a.id);
                setCategorias(ordenados);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const columns = [
        { key: "categoria", label: "Categoría", rules: { required: true, minLength: 3, maxLength: 50 } }
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchCategoriaEvento(id, data)
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Categoría editada correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteCategoriaEvento(id)
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Categoría eliminada correctamente 🗑️", type: "success" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createCategoriaEvento(nuevo);
            cargarDatos();
            setMessage({ text: "Categoría creada correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear la categoría ❌", type: "error" });
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
                data={Array.isArray(categorias) ? categorias : []}
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
