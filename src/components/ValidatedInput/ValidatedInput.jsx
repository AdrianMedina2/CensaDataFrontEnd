export default function ValidatedInput({ value, onChange, error, type = "text", options = [] }) {
    return (
        <div>
            {type === "select" ? (
                <select
                    className={`form-select form-select-sm ${error ? "is-invalid" : ""}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    className={`form-control form-control-sm ${error ? "is-invalid" : ""}`}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}
