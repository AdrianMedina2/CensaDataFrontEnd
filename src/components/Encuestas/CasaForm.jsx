import React from "react";
import ValidatedInput from "../../components/ValidatedInput/ValidatedInput";
import Select from "react-select";

export default function CasaForm({ Casa, setCasa, submitted, materiales, techos, pisos, barrios }) {
    return (
        <>
            <h4 className="mt-2 mb-4 fw-bold">Datos de la Casa</h4>
            <div className="mb-2">
                <label className="form-label">Número de Casa</label>
                <ValidatedInput
                    value={Casa.numcasa}
                    onChange={(val) => setCasa({ ...Casa, numcasa: val })}
                    error={submitted && !Casa.numcasa ? "Número de casa requerido" : ""}
                />
            </div>
            <div className="row mb-2">
                {/* Material de Construcción */}
                <div className="col-md-4">
                    <label className="form-label">Material de Construcción</label>
                    <Select
                        options={[
                            ...materiales.map(m => ({ value: m.id, label: m.materialcontruccion })),
                            { value: "otro", label: "Otro..." }
                        ]}
                        value={
                            materiales.find(m => m.id === Casa.materialcontruccionid)
                                ? { value: Casa.materialcontruccionid, label: materiales.find(m => m.id === Casa.materialcontruccionid).materialcontruccion }
                                : Casa.materialcontruccionid === "otro"
                                    ? { value: "otro", label: "Otro..." }
                                    : null
                        }
                        onChange={(selected) =>
                            setCasa({ ...Casa, materialcontruccionid: selected ? selected.value : "" })
                        }
                        placeholder="Seleccione material..."
                        className={submitted && !Casa.materialcontruccionid ? "is-invalid" : ""}
                    />
                    {Casa.materialcontruccionid === "otro" && (
                        <ValidatedInput
                            value={Casa.nuevoMaterial || ""}
                            onChange={(val) => setCasa({ ...Casa, nuevoMaterial: val })}
                            error={submitted && !Casa.nuevoMaterial ? "Ingrese nuevo material" : ""}
                        />
                    )}
                    {submitted && !Casa.materialcontruccionid && (
                        <div className="invalid-feedback d-block">Seleccione material</div>
                    )}
                </div>

                {/* Tipo de Techo */}
                <div className="col-md-4">
                    <label className="form-label">Tipo de Techo</label>
                    <Select
                        options={[
                            ...techos.map(t => ({ value: t.id, label: t.tipodetecho })),
                            { value: "otro", label: "Otro..." }
                        ]}
                        value={
                            techos.find(t => t.id === Casa.tipodetechoid)
                                ? { value: Casa.tipodetechoid, label: techos.find(t => t.id === Casa.tipodetechoid).tipodetecho }
                                : Casa.tipodetechoid === "otro"
                                    ? { value: "otro", label: "Otro..." }
                                    : null
                        }
                        onChange={(selected) =>
                            setCasa({ ...Casa, tipodetechoid: selected ? selected.value : "" })
                        }
                        placeholder="Seleccione techo..."
                        className={submitted && !Casa.tipodetechoid ? "is-invalid" : ""}
                    />
                    {Casa.tipodetechoid === "otro" && (
                        <ValidatedInput
                            value={Casa.nuevoTecho || ""}
                            onChange={(val) => setCasa({ ...Casa, nuevoTecho: val })}
                            error={submitted && !Casa.nuevoTecho ? "Ingrese nuevo techo" : ""}
                        />
                    )}
                    {submitted && !Casa.tipodetechoid && (
                        <div className="invalid-feedback d-block">Seleccione techo</div>
                    )}
                </div>

                {/* Tipo de Piso */}
                <div className="col-md-4">
                    <label className="form-label">Tipo de Piso</label>
                    <Select
                        options={[
                            ...pisos.map(p => ({ value: p.id, label: p.tipopiso })),
                            { value: "otro", label: "Otro..." }
                        ]}
                        value={
                            pisos.find(p => p.id === Casa.tipodepisoid)
                                ? { value: Casa.tipodepisoid, label: pisos.find(p => p.id === Casa.tipodepisoid).tipopiso }
                                : Casa.tipodepisoid === "otro"
                                    ? { value: "otro", label: "Otro..." }
                                    : null
                        }
                        onChange={(selected) =>
                            setCasa({ ...Casa, tipodepisoid: selected ? selected.value : "" })
                        }
                        placeholder="Seleccione piso..."
                        className={submitted && !Casa.tipodepisoid ? "is-invalid" : ""}
                    />
                    {Casa.tipodepisoid === "otro" && (
                        <ValidatedInput
                            value={Casa.nuevoPiso || ""}
                            onChange={(val) => setCasa({ ...Casa, nuevoPiso: val })}
                            error={submitted && !Casa.nuevoPiso ? "Ingrese nuevo piso" : ""}
                        />
                    )}
                    {submitted && !Casa.tipodepisoid && (
                        <div className="invalid-feedback d-block">Seleccione piso</div>
                    )}
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-md-6">
                    <label className="form-label">Barrio</label>
                    <Select
                        options={barrios.map(b => ({ value: String(b.id), label: b.nombre }))}
                        value={barrios.find(b => String(b.id) === Casa.barrioid)
                            ? { value: Casa.barrioid, label: barrios.find(b => String(b.id) === Casa.barrioid).nombre }
                            : null}
                        onChange={(selected) => setCasa({ ...Casa, barrioid: selected ? String(selected.value) : "" })}
                        placeholder="Seleccione barrio..."
                        className={submitted && !Casa.barrioid ? "is-invalid" : ""}
                    />
                    {submitted && !Casa.barrioid && (
                        <div className="invalid-feedback d-block">Seleccione barrio</div>
                    )}
                </div>
                <div className="col-md-3">
                    <label className="form-label">Servicio de Agua</label>
                    <Select
                        options={[
                            { value: "1", label: "Sí" },
                            { value: "0", label: "No" }
                        ]}
                        value={Casa.serviciodeagua !== ""
                            ? { value: Casa.serviciodeagua, label: Casa.serviciodeagua === "1" ? "Sí" : "No" }
                            : null}
                        onChange={(selected) => setCasa({ ...Casa, serviciodeagua: selected ? selected.value : "" })}
                        placeholder="Seleccione..."
                        className={submitted && Casa.serviciodeagua === "" ? "is-invalid" : ""}
                    />
                    {submitted && Casa.serviciodeagua === "" && (
                        <div className="invalid-feedback d-block">Seleccione opción</div>
                    )}
                </div>
                <div className="col-md-3">
                    <label className="form-label">Servicio de Energía</label>
                    <Select
                        options={[
                            { value: "1", label: "Sí" },
                            { value: "0", label: "No" }
                        ]}
                        value={Casa.serviciodeenergia !== ""
                            ? { value: Casa.serviciodeenergia, label: Casa.serviciodeenergia === "1" ? "Sí" : "No" }
                            : null}
                        onChange={(selected) => setCasa({ ...Casa, serviciodeenergia: selected ? selected.value : "" })}
                        placeholder="Seleccione..."
                        className={submitted && Casa.serviciodeenergia === "" ? "is-invalid" : ""}
                    />
                    {submitted && Casa.serviciodeenergia === "" && (
                        <div className="invalid-feedback d-block">Seleccione opción</div>
                    )}
                </div>
            </div>
        </>
    );
}
