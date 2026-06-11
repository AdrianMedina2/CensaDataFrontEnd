import { useEffect, useState } from "react";
import {
    getBarrios,
    createBarrio,
    patchBarrio,
    deleteBarrio,
    getMunicipios
} from "../../services/";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function BarriosSection() {
    const [barrios, setBarrios] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        Promise.all([getBarrios(), getMunicipios()])
            .then(([barriosData, municipiosData]) => {
                setBarrios(barriosData);
                setMunicipios(municipiosData);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { key: "nombre", label: "Barrio", rules: { required: true, minLength: 3 } },
        {
            key: "municipioid",
            label: "Municipio",
            type: "select",
            options: municipios
                .filter(m => m.estado === true || m.estado === 1)
                .map(m => ({ value: m.id, label: m.nombre })),
            rules: { required: true },
            render: (row) => {
                const municipio = municipios.find(m => m.id === row.municipioid);
                return municipio ? municipio.nombre : "Sin asignar";
            }
        }
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchBarrio(id, data)
            .then(() => getBarrios().then(setBarrios))
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Barrio editado correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteBarrio(id)
            .then(() => getBarrios().then(setBarrios))
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Barrio eliminado correctamente 🗑️", type: "warning" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createBarrio({ ...nuevo, cantidadcasas: 0, estado: true });
            getBarrios().then(setBarrios);
            setMessage({ text: "Barrio creado correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear el barrio ❌", type: "danger" });
        } finally {
            setProcessing(false);
        }
    };

    // Ordenar barrios para que el último aparezca primero
    const barriosOrdenados = barrios
        .filter(b => b.estado === true || b.estado === 1)
        .sort((a, b) => b.id - a.id);

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
                data={Array.isArray(barriosOrdenados) ? barriosOrdenados : []}
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
