import { useEffect } from "react";

export default function ToastMessage({ message, type = "info", autohide = true, delay = 3000, onClose }) {
    useEffect(() => {
        if (autohide && message) {
            const timer = setTimeout(() => {
                onClose();
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [message, autohide, delay, onClose]);

    if (!message) return null;

    const bgClass =
        type === "success" ? "bg-success text-white" :
            type === "error" ? "bg-danger text-white" :
                type === "warning" ? "bg-warning text-dark" :
                    "bg-info text-white";

    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div className={`toast show ${bgClass}`}>
                <div className="toast-body d-flex justify-content-between align-items-center">
                    {message}
                    {!autohide && (
                        <button type="button" className="btn-close ms-2" onClick={onClose}></button>
                    )}
                </div>
            </div>
        </div>
    );
}
