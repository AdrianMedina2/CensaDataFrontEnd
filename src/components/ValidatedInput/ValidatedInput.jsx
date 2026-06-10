export default function ValidatedInput({ value, onChange, error, type = "text" }) {
    return (
        <div>
            <input
                type={type}
                className={`form-control form-control-sm ${error ? "is-invalid" : ""}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
}
