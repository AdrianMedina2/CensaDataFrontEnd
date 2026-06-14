import { useState, useEffect } from "react";

export default function SectionLayout({ title, sections }) {
    const [active, setActive] = useState(sections[0].key);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div className="container">
            <h2 className="fw-bold mt-2 mb-4">{title}</h2>

            {isMobile ? (
                // Dropdown en móvil
                <select
                    className="form-select mb-3"
                    value={active}
                    onChange={(e) => setActive(e.target.value)}
                >
                    {sections.map((s) => (
                        <option key={s.key} value={s.key}>
                            {s.label}
                        </option>
                    ))}
                </select>
            ) : (
                // Botones en desktop
                <div className="btn-group mb-3">
                    {sections.map((s) => (
                        <button
                            key={s.key}
                            className={`btn ${active === s.key ? "btn-brand" : "btn-outline-primary"}`}
                            onClick={() => setActive(s.key)}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            )}

            {sections.map((s) =>
                active === s.key ? <s.component key={s.key} /> : null
            )}
        </div>
    );
}
