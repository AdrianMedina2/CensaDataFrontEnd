import React, { useRef, useEffect } from "react";
import "./TiltCard.css";

function TiltCard({ children, className }) {
    const wrapperRef = useRef(null); // recibe la clase de tamaño (w-50, etc.)
    const cardRef = useRef(null);    // elemento visual que rota (bg, shadow, padding)

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const card = cardRef.current;
        if (!wrapper || !card) return;

        let rafId = null;
        let mouseX = 0;
        let mouseY = 0;
        let rect = null;

        const onMove = (e) => {
            rect = wrapper.getBoundingClientRect();
            mouseX = (e.clientX ?? (e.touches && e.touches[0].clientX)) - rect.left;
            mouseY = (e.clientY ?? (e.touches && e.touches[0].clientY)) - rect.top;
            if (rafId === null) rafId = requestAnimationFrame(update);
        };

        const update = () => {
            rafId = null;
            if (!rect) rect = wrapper.getBoundingClientRect();
            const cx = rect.width / 2;
            const cy = rect.height / 2;

            const sens = 40; // mayor = movimiento más sutil
            const max = 8;   // límite de grados
            const rotateX = Math.max(Math.min(((mouseY - cy) / sens) * -1, max), -max);
            const rotateY = Math.max(Math.min((mouseX - cx) / sens, max), -max);

            // transform AL ELEMENTO VISUAL (card)
            card.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        };

        const onLeave = () => {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            card.style.transition = "transform 200ms cubic-bezier(.2,.9,.2,1)";
            card.style.transform = "perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0)";
            setTimeout(() => {
                if (card) {
                    card.style.transition = "";
                    card.style.transform = "none";
                }
            }, 210);
        };


        wrapper.addEventListener("mousemove", onMove);
        wrapper.addEventListener("mouseleave", onLeave);
        wrapper.addEventListener("touchmove", onMove, { passive: true });
        wrapper.addEventListener("touchend", onLeave);

        return () => {
            wrapper.removeEventListener("mousemove", onMove);
            wrapper.removeEventListener("mouseleave", onLeave);
            wrapper.removeEventListener("touchmove", onMove);
            wrapper.removeEventListener("touchend", onLeave);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    // IMPORTANTE: className va en el wrapper solo si contiene tamaño (w-50).
    // Las clases visuales (bg-white, shadow, p-4, rounded-5) deben ir en tilt-card-inner.
    return (
        <div ref={wrapperRef} className={`tilt-wrapper ${className || ""}`}>
            <div ref={cardRef} className="tilt-card-inner">
                {children}
            </div>
        </div>
    );
}

export default TiltCard;
