import React, { useRef, useEffect } from "react";
import "./HoverFollow.css";

function HoverFollow({ children }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;

        const handleMove = (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // desplazamiento relativo (dividido para suavizar)
            const moveX = (x - centerX) / 10;
            const moveY = (y - centerY) / 10;

            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
        };

        const resetMove = () => {
            el.style.transform = "translate(0,0)";
        };

        el.addEventListener("mousemove", handleMove);
        el.addEventListener("mouseleave", resetMove);

        return () => {
            el.removeEventListener("mousemove", handleMove);
            el.removeEventListener("mouseleave", resetMove);
        };
    }, []);

    return (
        <div ref={ref} className="hover-follow">
            {children}
        </div>
    );
}

export default HoverFollow;
