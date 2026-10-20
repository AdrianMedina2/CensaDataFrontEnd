import React from "react";
import Select from "react-select";
import ValidatedInput from "../ValidatedInput/ValidatedInput";

export default function PersonaEmpadronadoForm({
    index,
    persona,
    empadronado,
    onChangePersona,
    onChangeEmpadronado,
    submitted,
    discapacidades,
    carreras,
}) {
    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-body">
                <h5 className="card-title">Estudiante {index + 1}</h5>
                {/* Datos de Persona */}
                <div className="row g-3">
                    <div className="col-md-12">
                        <label className="form-label">Número de Cédula</label>
                        <ValidatedInput
                            value={empadronado.numerocedula || ""}
                            onChange={(val) =>
                                onChangeEmpadronado(index, { ...empadronado, numerocedula: val })
                            }
                            error={
                                submitted && (!empadronado.numerocedula || !/^[A-Za-z0-9]{14}$/.test(empadronado.numerocedula))
                                    ? "Ingrese una cédula válida de 14 caracteres."
                                    : ""
                            }
                        />
                    </div>
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
                            error=""
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
                            error=""
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Contacto</label>
                        <ValidatedInput
                            type="text"
                            value={empadronado.contacto || ""}
                            onChange={(val) =>
                                onChangeEmpadronado(index, { ...empadronado, contacto: val })
                            }
                            error={
                                submitted && (!empadronado.contacto || !/^\d{8}$/.test(empadronado.contacto))
                                    ? "Debe ingresar un contacto de 8 dígitos."
                                    : ""
                            }
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Semestre</label>
                        <ValidatedInput
                            type="number"
                            value={empadronado.semestre || ""}
                            onChange={(val) =>
                                onChangeEmpadronado(index, { ...empadronado, semestre: val })
                            }
                            error={
                                submitted && (!empadronado.semestre || empadronado.semestre < 1 || empadronado.semestre > 12)
                                    ? "Debe ingresar un semestre válido (1-12)."
                                    : ""
                            }
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Tipo de Beca</label>
                        <ValidatedInput
                            type="select"
                            value={empadronado.tipobeca || ""}
                            onChange={(val) =>
                                onChangeEmpadronado(index, { ...empadronado, tipobeca: val })
                            }
                            options={[
                                { value: "", label: "Seleccione..." },
                                { value: "Completa", label: "Completa" },
                                { value: "Alojamiento", label: "Alojamiento" }
                            ]}
                            error={submitted && !empadronado.tipobeca ? "Debe seleccionar tipo de beca." : ""}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Carrera</label>
                        <Select
                            classNamePrefix="react-select"
                            value={
                                empadronado.carreraid !== undefined && empadronado.carreraid !== ""
                                    ? {
                                        value: empadronado.carreraid,
                                        label: carreras.find(c => c.id === empadronado.carreraid)?.carrera
                                    }
                                    : null
                            }
                            onChange={(selected) =>
                                onChangeEmpadronado(index, { ...empadronado, carreraid: selected ? selected.value : "" })
                            }
                            options={carreras.map(c => ({
                                value: c.id,
                                label: c.carrera
                            }))}
                            placeholder="Seleccione..."
                            isClearable
                        />
                        {submitted && (empadronado.carreraid === "" || empadronado.carreraid === undefined) && (
                            <div className="invalid-feedback d-block">Debe seleccionar carrera.</div>
                        )}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Carnet</label>
                        <ValidatedInput
                            type="text"
                            value={empadronado.carnet || ""}
                            onChange={(val) =>
                                onChangeEmpadronado(index, { ...empadronado, carnet: val })
                            }
                            error={
                                submitted && (!empadronado.carnet || !/^\d{8}$/.test(empadronado.carnet))
                                    ? "Debe ingresar un carnet de 8 dígitos."
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
                        <label className="form-label">Discapacidad</label>
                        <select
                            className="form-select"
                            value={persona.discapacidadid ?? 0}
                            onChange={(e) =>
                                onChangePersona(index, { ...persona, discapacidadid: Number(e.target.value) })
                            }
                        >
                            <option value={0}>Ninguna</option>
                            {Array.isArray(discapacidades) &&
                                discapacidades.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.discapacidad}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
