// Base de la API real (solo se usa en producción)
const API_BASE = import.meta.env.DEV ? "" : "";

// Login: envía usuario, password y role para obtener access_token, refresh_token y role
export async function loginRequest({ usuario, password, role }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usuario,
            password,
            role
        })
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "Login falló");
    }

    return res.json();
}


// Refresh: envía el refresh_token para obtener un nuevo access_token
export async function refreshRequest({ refresh_token }) {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token })
    });

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || "Refresh falló");
    }

    return res.json();
}

// Perfil del usuario
export async function getProfile(accessToken) {
    const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!res.ok) throw new Error("No se pudo obtener el perfil");

    return res.json();
}

// LOGOUT: envía el refresh_token para invalidarlo en el backend
export async function logoutRequest(refresh_token) {
    await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token })
    }).catch(() => { });
}
