// src/utils/getBaseURL.js
export function getBaseURL() {
    // Si Jest/Node tiene process.env, úsalo
    if (typeof process !== "undefined" && process.env.VITE_API_BASE) {
        return process.env.VITE_API_BASE;
    }

    // Intentar acceder a import.meta.env solo si existe
    try {
        return globalThis.import?.meta?.env?.VITE_API_BASE || "";
    } catch {
        return "";
    }
}
