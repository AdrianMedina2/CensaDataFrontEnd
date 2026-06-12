import { useEffect, useState } from "react";
import {
    getDepartamentos,
    createDepartamento,
    patchDepartamento,
    deleteDepartamento
} from "../../services/";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function DepartamentosSection() {
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        getDepartamentos()
            .then(res => {
                setDepartamentos(Array.isArray(res.data) ? res.data : []);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "nombre", label: "Departamento", rules: { required: true, minLength: 3 } },
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchDepartamento(id, data)
            .then(() =>
                getDepartamentos().then(res =>
                    setDepartamentos(Array.isArray(res.data) ? res.data : [])
                )
            )
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Departamento editado correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteDepartamento(id)
            .then(() =>
                getDepartamentos().then(res =>
                    setDepartamentos(Array.isArray(res.data) ? res.data : [])
                )
            )
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Departamento eliminado correctamente 🗑️", type: "warning" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createDepartamento({ ...nuevo, cantidadmunicipios: 0, estado: true });
            getDepartamentos().then(res =>
                setDepartamentos(Array.isArray(res.data) ? res.data : [])
            );
            setMessage({ text: "Departamento creado correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear el departamento ❌", type: "danger" });
        } finally {
            setProcessing(false);
        }
    };

    const departamentosActivos = Array.isArray(departamentos)
    ? departamentos.sort((a, b) => b.id - a.id)
    : [];


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
                data={departamentosActivos}
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
