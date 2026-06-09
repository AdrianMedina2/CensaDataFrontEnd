import { useState } from "react";

export default function SectionLayout({ title, sections }) {
    const [active, setActive] = useState(sections[0].key);

    return (
        <div className="container mt-4">
            <h2>{title}</h2>

            <div className="btn-group mb-3">
                {sections.map((s) => (
                    <button
                        key={s.key}
                        className={`btn btn-outline-primary ${active === s.key ? "active" : ""}`}
                        onClick={() => setActive(s.key)}
                    >
                        {s.label}
                    </button>
                ))}
            </div>

            {sections.map((s) =>
                active === s.key ? <s.component key={s.key} /> : null
            )}
        </div>
    );
}
