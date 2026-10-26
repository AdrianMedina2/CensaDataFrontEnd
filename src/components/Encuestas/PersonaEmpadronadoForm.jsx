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
    eventos = [],
    actividades = [],
}) {
    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-body">
                <h5 className="card-title mb-4">Estudiante {index + 1}</h5>
                <section className="mb-4">
                    <h6 className="fw-bold border-bottom pb-2 mb-3">Datos personales</h6>
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
                        <div className="col-md-3">
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
                        <div className="col-md-3">
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
                        <div className="col-md-3">
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
                        <div className="col-md-3">
                            <label className="form-label">Discapacidades</label>
                            <Select
                                isMulti
                                classNamePrefix="react-select"
                                options={discapacidades
                                    .filter(d => Number(d.id) !== 0)
                                    .map(d => ({
                                        value: Number(d.id),
                                        label: d.discapacidad
                                    }))
                                }
                                value={(persona.discapacidades || []).map(id => ({
                                    value: id,
                                    label: discapacidades.find(d => Number(d.id) === Number(id))?.discapacidad
                                }))}
                                onChange={(selected) =>
                                    onChangePersona(index, {
                                        ...persona,
                                        discapacidades: selected.map(item => item.value)
                                    })
                                }
                                placeholder="Seleccione las discapacidades..."
                                noOptionsMessage={() => "No hay más opciones"}
                            />
                            <small className="text-muted">
                                Dejá vacío si no presenta ninguna discapacidad.
                            </small>
                        </div>
                    </div>
                </section>
                <section className="mb-4">
                    <h6 className="fw-bold border-bottom pb-2 mb-3">Datos estudiantiles</h6>
                    <div className="row g-3">
                        <div className="col-md-4">
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
                        <div className="col-md-3">
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
                        <div className="col-md-3">
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
                        <div className="col-md-2">
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
                            <label className="form-label">
                                Eventos <span className="text-muted fw-normal">(Opcional)</span>
                            </label>
                            <Select
                                isMulti
                                classNamePrefix="react-select"
                                options={eventos.map(e => ({
                                    value: Number(e.id),
                                    label: e.evento
                                }))}
                                value={(empadronado.eventos || []).map(ev => ({
                                    value: Number(ev.id),
                                    label: eventos.find(e => Number(e.id) === Number(ev.id))?.evento || `Evento ${ev.id}`
                                }))}
                                onChange={(selected) => {
                                    const anteriores = empadronado.eventos || [];
                                    const nuevos = selected.map(item => {
                                        const existente = anteriores.find(
                                            ev => Number(ev.id) === Number(item.value)
                                        );
                                        return existente || {
                                            id: Number(item.value),
                                            posicion: ""
                                        };
                                    });
                                    onChangeEmpadronado(index, {
                                        ...empadronado,
                                        eventos: nuevos
                                    });
                                }}
                                placeholder="Seleccione los eventos..."
                                noOptionsMessage={() => "No hay eventos disponibles"}
                            />
                            {(empadronado.eventos || []).map((evento, i) => (
                                <div key={evento.id} className="mt-2">
                                    <label className="form-label small text-muted mb-1">
                                        Posición en {
                                            eventos.find(e => Number(e.id) === Number(evento.id))?.evento ||
                                            `Evento ${evento.id}`
                                        }
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control form-control-sm ${submitted && !evento.posicion?.trim() ? "is-invalid" : ""
                                            }`}
                                        placeholder="Ej. Primer lugar, Participante, Eliminado..."
                                        value={evento.posicion || ""}
                                        onChange={(e) => {
                                            const nuevos = [...empadronado.eventos];
                                            nuevos[i] = {
                                                ...nuevos[i],
                                                posicion: e.target.value
                                            };
                                            onChangeEmpadronado(index, {
                                                ...empadronado,
                                                eventos: nuevos
                                            });
                                        }}
                                    />
                                    {submitted && !evento.posicion?.trim() && (
                                        <div className="invalid-feedback">
                                            Ingrese la posición obtenida en el evento.
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="col-md-6 mt-2">
                            <label className="form-label">
                                Actividades <span className="text-muted fw-normal">(Opcional)</span>
                            </label>
                            <Select
                                isMulti
                                classNamePrefix="react-select"
                                options={actividades.map(a => ({
                                    value: Number(a.id),
                                    label: a.actividad
                                }))}
                                value={(empadronado.actividades || []).map(id => ({
                                    value: Number(id),
                                    label: actividades.find(a => Number(a.id) === Number(id))?.actividad ||
                                        `Actividad ${id}`
                                }))}
                                onChange={(selected) =>
                                    onChangeEmpadronado(index, {
                                        ...empadronado,
                                        actividades: selected.map(item => Number(item.value))
                                    })
                                }
                                placeholder="Seleccione las actividades..."
                                noOptionsMessage={() => "No hay actividades disponibles"}
                            />
                            <small className="text-muted">
                                Puede seleccionar varias actividades.
                            </small>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
