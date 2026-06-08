import { useEffect, useState } from "react";
import { getInvestigadores, patchInvestigador, deleteInvestigador, createInvestigador } from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";

export default function Investigadores() {
    const [investigadores, setInvestigadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null); // estado para mensajes
    const [processing, setProcessing] = useState(false); // estado para acciones en curso

    useEffect(() => {
        getInvestigadores()
            .then(setInvestigadores)
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "primernombre", label: "Nombre" },
        { key: "primerapellido", label: "Apellido" },
        { key: "edad", label: "Edad" },
        { key: "sexo", label: "Sexo" },
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchInvestigador(id, data)
            .then(() => getInvestigadores().then(setInvestigadores))
            .finally(() => {
                setProcessing(false);
                setMessage("Investigador editado correctamente ✅");
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteInvestigador(id)
            .then(() => getInvestigadores().then(setInvestigadores))
            .finally(() => {
                setProcessing(false);
                setMessage("Investigador eliminado correctamente ❌");
            });
    };

    const handleAdd = () => {
        setProcessing(true);
        const nuevo = { primernombre: "Nuevo", primerapellido: "Investigador", edad: 30, sexo: "M" };
        createInvestigador(nuevo)
            .then(() => getInvestigadores().then(setInvestigadores))
            .finally(() => {
                setProcessing(false);
                setMessage("Investigador creado correctamente ➕");
            });
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
            {/* Mensaje de acción en curso */}
            {processing && (
                <div className="alert alert-warning d-flex align-items-center" role="alert">
                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                    Procesando acción, por favor espera…
                </div>
            )}

            {/* Mensaje de resultado */}
            {message && (
                <div className="alert alert-info alert-dismissible fade show" role="alert">
                    {message}
                    <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
                </div>
            )}

            <div className="table-responsive">
                <EditableTable
                    columns={columns}
                    data={investigadores}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={handleAdd}
                />
            </div>
        </div>
    );
}
