import React from "react";
import ValidatedInput from "../../components/ValidatedInput/ValidatedInput";
import Select from "react-select";

export default function CasaForm({ Casa, setCasa, submitted}) {
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
        </>
    );
}
