import React from "react";
import Select from "react-select";
import ValidatedInput from "../ValidatedInput/ValidatedInput";

export default function PersonaEmpadronadoForm({
    index,
    persona,
    empadronado,
    onChangePersona,
    onChangeEmpadronado,
    relaciones,
    estadosCiviles,
    nivelesEducativos,
    empleos,
    submitted,
}) {
    const nivelesUnicos = [...new Set(nivelesEducativos.map(n => n.niveleducativo))];
    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-body">
                <h5 className="card-title">Persona {index + 1}</h5>
                {/* Datos de Persona */}
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Primer Nombre</label>
                        <ValidatedInput
                            value={persona.primernombre || ""}
                            onChange={(val) =>
                                onChangePersona(index, { ...persona, primernombre: val })
                            }
                            error={
                                submitted && (!persona.primernombre || persona.primernombre.length < 3)
                                    ? "Debe tener al menos 3 caracteres."
                                    : ""
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Segundo Nombre</label>
                        <ValidatedInput
                            value={persona.segundonombre || ""}
                            onChange={(val) =>
                                onChangePersona(index, { ...persona, segundonombre: val })
                            }
                            error={
                                submitted && (!persona.segundonombre && persona.segundonombre.length < 3)
                                    ? "Debe tener al menos 3 caracteres."
                                    : ""
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Primer Apellido</label>
                        <ValidatedInput
                            value={persona.primerapellido || ""}
                            onChange={(val) =>
                                onChangePersona(index, { ...persona, primerapellido: val })
                            }
                            error={
                                submitted && (!persona.primerapellido || persona.primerapellido.length < 3)
                                    ? "Debe tener al menos 3 caracteres."
                                    : ""
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Segundo Apellido</label>
                        <ValidatedInput
                            value={persona.segundoapellido || ""}
                            onChange={(val) =>
                                onChangePersona(index, { ...persona, segundoapellido: val })
                            }
                            error={
                                submitted && (!persona.segundoapellido && persona.segundoapellido.length < 3)
                                    ? "Debe tener al menos 3 caracteres."
                                    : ""
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Fecha de Nacimiento</label>
                        <ValidatedInput
                            type="date"
                            value={persona.fechanacimiento || ""}
                            onChange={(val) =>
                                onChangePersona(index, { ...persona, fechanacimiento: val })
                            }
                            error={
                                submitted && !persona.fechanacimiento
                                    ? "Debe seleccionar una fecha."
                                    : ""
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Sexo</label>
                        <select
                            className={`form-select form-select-sm ${submitted && !persona.sexo ? "is-invalid" : ""}`}
                            value={persona.sexo || ""}
                            onChange={(e) =>
                                onChangePersona(index, { ...persona, sexo: e.target.value })
                            }
                        >
                            <option value="">Seleccione...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                        {submitted && !persona.sexo && (
                            <div className="invalid-feedback">Debe seleccionar sexo.</div>
                        )}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Relación de parentesco</label>
                        <Select
                            options={relaciones.map(r => ({ value: r.id, label: r.relacion }))}
                            value={relaciones.find(r => r.id === parseInt(empadronado.relacionid))
                                ? { value: empadronado.relacionid, label: relaciones.find(r => r.id === parseInt(empadronado.relacionid)).relacion }
                                : null}
                            onChange={(selected) =>
                                onChangeEmpadronado(index, { ...empadronado, relacionid: selected ? selected.value : "" })
                            }
                            placeholder="Seleccione..."
                            isClearable
                            className={submitted && !empadronado.relacionid ? "is-invalid" : ""}
                        />
                        {submitted && !empadronado.relacionid && (
                            <div className="invalid-feedback d-block">Debe seleccionar relación.</div>
                        )}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Número de Cédula</label>
                        <ValidatedInput
                            value={empadronado.numerocedula || ""}
                            onChange={(val) =>
                                onChangeEmpadronado(index, { ...empadronado, numerocedula: val })
                            }
                            error={
                                submitted && empadronado.numerocedula && empadronado.numerocedula.length < 10
                                    ? "Debe tener al menos 10 caracteres."
                                    : ""
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Estado Civil</label>
                        <Select
                            options={estadosCiviles.map(e => ({ value: e.id, label: e.estadocivil }))}
                            value={estadosCiviles.find(e => e.id === parseInt(empadronado.estadocivilid))
                                ? { value: empadronado.estadocivilid, label: estadosCiviles.find(e => e.id === parseInt(empadronado.estadocivilid)).estadocivil }
                                : null}
                            onChange={(selected) =>
                                onChangeEmpadronado(index, { ...empadronado, estadocivilid: selected ? selected.value : "" })
                            }
                            placeholder="Seleccione..."
                            isClearable
                            className={submitted && !empadronado.estadocivilid ? "is-invalid" : ""}
                        />
                        {submitted && !empadronado.estadocivilid && (
                            <div className="invalid-feedback d-block">Debe seleccionar estado civil.</div>
                        )}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Empleo</label>
                        <Select
                            options={empleos.map(em => ({ value: em.id, label: em.empleo }))}
                            value={empleos.find(em => em.id === parseInt(empadronado.empleoid))
                                ? { value: empadronado.empleoid, label: empleos.find(em => em.id === parseInt(empadronado.empleoid)).empleo }
                                : null}
                            onChange={(selected) =>
                                onChangeEmpadronado(index, { ...empadronado, empleoid: selected ? selected.value : "" })
                            }
                            placeholder="Seleccione..."
                            isClearable
                            className={submitted && !empadronado.empleoid ? "is-invalid" : ""}
                        />
                        {submitted && !empadronado.empleoid && (
                            <div className="invalid-feedback d-block">Debe seleccionar empleo.</div>
                        )}
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-6">
                                <label className="form-label">Nivel Educativo</label>
                                <Select
                                    options={nivelesUnicos.map(n => ({ value: n, label: n }))}
                                    value={empadronado.niveleducativo ? { value: empadronado.niveleducativo, label: empadronado.niveleducativo } : null}
                                    onChange={(selected) => {
                                        const nivel = selected ? selected.value : "";
                                        onChangeEmpadronado(index, {
                                            ...empadronado,
                                            niveleducativo: nivel,
                                            grado: nivel === "Ninguno" ? 0 : "" // si es Ninguno, grado = 0
                                        });
                                    }}
                                    placeholder="Seleccione nivel..."
                                    className={submitted && !empadronado.niveleducativo ? "is-invalid" : ""}
                                />
                                {submitted && !empadronado.niveleducativo && (
                                    <div className="invalid-feedback d-block">Debe seleccionar nivel educativo.</div>
                                )}
                            </div>

                            <div className="col-6">
                                <label className="form-label">Grado</label>
                                <Select
                                    options={nivelesEducativos
                                        .filter(n => n.niveleducativo === empadronado.niveleducativo)
                                        .map(n => ({ value: n.grado, label: n.grado }))}
                                    value={empadronado.grado ? { value: empadronado.grado, label: empadronado.grado } : null}
                                    onChange={(selected) =>
                                        onChangeEmpadronado(index, { ...empadronado, grado: selected ? selected.value : "" })
                                    }
                                    placeholder="Seleccione grado..."
                                    isDisabled={empadronado.niveleducativo === "Ninguno"} // desactiva si es Ninguno
                                    className={submitted && empadronado.niveleducativo !== "Ninguno" && !empadronado.grado ? "is-invalid" : ""}
                                />
                                {submitted && empadronado.niveleducativo !== "Ninguno" && !empadronado.grado && (
                                    <div className="invalid-feedback d-block">Debe seleccionar grado.</div>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6">
                        <label className="form-label">Ingreso Personal</label>
                        <ValidatedInput
                            type="number"
                            value={empadronado.ingresopersonal || ""}
                            onChange={(val) =>
                                onChangeEmpadronado(index, { ...empadronado, ingresopersonal: val })
                            }
                            error={
                                submitted && (
                                    empadronado.ingresopersonal === "" || empadronado.ingresopersonal === undefined
                                        ? "Debe ingresar un valor."
                                        : Number(empadronado.ingresopersonal) < 0
                                            ? "El ingreso no puede ser negativo."
                                            : ""
                                )
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
