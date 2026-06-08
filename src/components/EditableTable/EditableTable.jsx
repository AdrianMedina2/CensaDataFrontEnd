import { useState, useEffect } from "react";

export default function EditableTable({ columns, data, onEdit, onDelete, onAdd }) {
    const [editingRow, setEditingRow] = useState(null);
    const [formData, setFormData] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const startEdit = (row) => {
        setEditingRow(row.id);
        setFormData(row);
    };

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const saveEdit = () => {
        onEdit(editingRow, formData);
        setEditingRow(null);
        setFormData({});
    };

    return (
        <div>
            <button className="btn btn-success mb-2" onClick={onAdd}>Añadir nuevo</button>

            {isMobile ? (
                // Vista en cards para móvil
                data.map(row => (
                    <div key={row.id} className="card mb-2">
                        <div className="card-body">
                            {columns.map(col => (
                                <p key={col.key}>
                                    <strong>{col.label}:</strong>{" "}
                                    {editingRow === row.id ? (
                                        <input
                                            className="form-control form-control-sm"
                                            value={formData[col.key] || ""}
                                            onChange={(e) => handleChange(col.key, e.target.value)}
                                        />
                                    ) : (
                                        row[col.key]
                                    )}
                                </p>
                            ))}
                            {editingRow === row.id ? (
                                <>
                                    <button className="btn btn-sm btn-primary me-2" onClick={saveEdit}>Guardar</button>
                                    <button className="btn btn-sm btn-secondary" onClick={() => setEditingRow(null)}>Cancelar</button>
                                </>
                            ) : (
                                <>
                                    <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(row)}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(row.id)}>Eliminar</button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                // Vista en tabla para escritorio
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                {columns.map(col => <th key={col.key}>{col.label}</th>)}
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(row => (
                                <tr key={row.id}>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {editingRow === row.id ? (
                                                <input
                                                    className="form-control form-control-sm"
                                                    value={formData[col.key] || ""}
                                                    onChange={(e) => handleChange(col.key, e.target.value)}
                                                />
                                            ) : (
                                                row[col.key]
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        {editingRow === row.id ? (
                                            <>
                                                <button className="btn btn-sm btn-primary me-2" onClick={saveEdit}>Guardar</button>
                                                <button className="btn btn-sm btn-secondary" onClick={() => setEditingRow(null)}>Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(row)}>Editar</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => onDelete(row.id)}>Eliminar</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
