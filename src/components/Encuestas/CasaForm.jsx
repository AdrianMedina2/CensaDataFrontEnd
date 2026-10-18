import React from "react";
import ValidatedInput from "../../components/ValidatedInput/ValidatedInput";

export default function CasaForm({ Casa, setCasa, submitted }) {
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
                <div className="col-md-6">
                    <label className="form-label">Servicio de Agua</label>
                    <select
                        className={`form-select ${submitted && Casa.serviciodeagua === "" ? "is-invalid" : ""}`}
                        value={Casa.serviciodeagua !== "" ? Casa.serviciodeagua : ""}
                        onChange={(e) => setCasa({ ...Casa, serviciodeagua: e.target.value })}
                    >
                        <option value="">Seleccione...</option>
                        <option value="1">Sí</option>
                        <option value="0">No</option>
                    </select>
                    {submitted && Casa.serviciodeagua === "" && (
                        <div className="invalid-feedback d-block">Seleccione opción</div>
                    )}
                </div>

                <div className="col-md-6">
                    <label className="form-label">Servicio de Energía</label>
                    <select
                        className={`form-select ${submitted && Casa.serviciodeenergia === "" ? "is-invalid" : ""}`}
                        value={Casa.serviciodeenergia !== "" ? Casa.serviciodeenergia : ""}
                        onChange={(e) => setCasa({ ...Casa, serviciodeenergia: e.target.value })}
                    >
                        <option value="">Seleccione...</option>
                        <option value="1">Sí</option>
                        <option value="0">No</option>
                    </select>
                    {submitted && Casa.serviciodeenergia === "" && (
                        <div className="invalid-feedback d-block">Seleccione opción</div>
                    )}
                </div>
            </div>
        </>
    );
}
