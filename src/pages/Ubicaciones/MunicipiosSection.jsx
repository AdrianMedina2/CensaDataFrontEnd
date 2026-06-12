import { useEffect, useState } from "react";
import {
    getMunicipios,
    createMunicipio,
    patchMunicipio,
    deleteMunicipio,
    getDepartamentos
} from "../../services/";
import EditableTable from "../../components/EditableTable/EditableTable";
import ToastMessage from "../../components/ToastMessage/ToastMessage";

export default function MunicipiosSection() {
    const [municipios, setMunicipios] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        Promise.all([getMunicipios(), getDepartamentos()])
            .then(([municipiosData, departamentosData]) => {
                setMunicipios(Array.isArray(municipiosData.data) ? municipiosData.data : []);
                setDepartamentos(Array.isArray(departamentosData.data) ? departamentosData.data : []);
            })
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        {
            key: "nombre",
            label: "Municipio",
            rules: { required: true, minLength: 3 }
        },
        {
            key: "departamentoid",
            label: "Departamento",
            type: "select",
            options: departamentos.map(d => ({ value: d.id, label: d.nombre })),
            rules: { required: true },
            render: (row) => {
                const dep = departamentos.find(d => d.id === row.departamentoid);
                return dep ? dep.nombre : "Sin asignar";
            }
        }
    ];

    const handleEdit = (id, data) => {
        setProcessing(true);
        patchMunicipio(id, data)
            .then(() => getMunicipios().then(res =>
                setMunicipios(Array.isArray(res.data) ? res.data : [])
            ))
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Municipio editado correctamente ✅", type: "success" });
            });
    };

    const handleDelete = (id) => {
        setProcessing(true);
        deleteMunicipio(id)
            .then(() => getMunicipios().then(res =>
                setMunicipios(Array.isArray(res.data) ? res.data : [])
            ))
            .finally(() => {
                setProcessing(false);
                setMessage({ text: "Municipio eliminado correctamente 🗑️", type: "warning" });
            });
    };

    const handleAdd = async (nuevo) => {
        setProcessing(true);
        try {
            await createMunicipio({ ...nuevo, cantidadbarrios: 0 });
            getMunicipios().then(res =>
                setMunicipios(Array.isArray(res.data) ? res.data : [])
            );
            setMessage({ text: "Municipio creado correctamente ➕", type: "success" });
        } catch (error) {
            setMessage({ text: "Error al crear el municipio ❌", type: "danger" });
        } finally {
            setProcessing(false);
        }
    };

    const municipiosOrdenados = Array.isArray(municipios)
        ? municipios.sort((a, b) => b.id - a.id)
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
                data={municipiosOrdenados}
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
