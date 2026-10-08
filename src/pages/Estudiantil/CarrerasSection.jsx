import { useEffect, useState } from "react";
import {
    getCarreras,
    createCarrera,
    patchCarrera,
    deleteCarrera,
    getAreasConocimientos
} from "../../services";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function CarrerasSection() {
    const [carreras, setCarreras] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    const cargarDatos = () => {
        Promise.all([getCarreras(), getAreasConocimientos()])
            .then(([resCarreras, resAreas]) => {
                const datosCarreras = Array.isArray(resCarreras?.data) ? resCarreras.data.filter(c => c.estado) : [];
                const ordenadasCarreras = datosCarreras.sort((a, b) => b.id - a.id);
                setCarreras(ordenadasCarreras);

                const datosAreas = Array.isArray(resAreas?.data) ? resAreas.data.filter(a => a.estado) : [];
                setAreas(datosAreas);
            })
            .finally(() => setLoading(false));
    };


    useEffect(() => {
        cargarDatos();
    }, []);

    const columns = [
        { key: "carrera", label: "Carrera", rules: { required: true, minLength: 3, maxLength: 30 } },
        {
            key: "areaconocimientoid",
            label: "Área de Conocimiento",
            type: "select",
            options: areas.map(a => ({ value: a.id, label: a.areaconocimiento })),
            rules: { required: true }
        }
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchCarrera(id, { ...data, estado: true })
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Carrera editada correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteCarrera(id)
            .then(() => cargarDatos())
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Carrera eliminada correctamente 🗑️", type: "success" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createCarrera({ ...nuevo, estado: true });
            cargarDatos();
            setMessage({ text: "Carrera creada correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear la carrera ❌", type: "error" });
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
                data={Array.isArray(carreras) ? carreras : []}
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
