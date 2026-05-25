const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
export const AUTH_MODE = "cookie";

// MOCK: simula cookie HttpOnly usando sessionStorage (solo para dev)
export async function loginMock(usuario, password, role) {
    const users = [
        { usuario: "adminUser", password: "123", role: "admin" },
        { usuario: "investUser", password: "456", role: "investigador" }
    ];
    const match = users.find(u => u.usuario === usuario && u.password === password && u.role === role);
    if (!match) throw new Error("Credenciales inválidas o rol incorrecto");

    // Simular que el backend puso una cookie HttpOnly: se guardará en sessionStorage
    const fakeRefresh = "mock-refresh-token-" + Math.random().toString(36).slice(2);
    sessionStorage.setItem("mock_refresh_cookie", fakeRefresh);
    sessionStorage.setItem("mock_role", match.role); // para que refreshWithCookie sepa qué rol devolver

    return {
        access_token: "mock-access-token-" + Math.random().toString(36).slice(2),
        token_type: "Bearer",
        expires_in: 3600,
        role: match.role
    };
}

// REAL login: backend debe enviar Set-Cookie HttpOnly; usamos credentials: include
export async function loginReal(usuario, password, role) {
    const res = await fetch(`${API_BASE}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password, Role: role }),
        credentials: "include"
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail || "Login falló");
    }
    const data = await res.json();
    return {
        access_token: data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
        role: data.role || role
    };
}

export async function login(usuario, password, role) {
    return USE_MOCK ? loginMock(usuario, password, role) : loginReal(usuario, password, role);
}

// refresh usando cookie HttpOnly (mock o real)
export async function refreshWithCookie() {
    if (USE_MOCK) {
        const mock = sessionStorage.getItem("mock_refresh_cookie");
        if (!mock) {
            const err = new Error("No hay cookie de refresh simulada");
            err.status = 401;
            throw err;
        }
        // rotación simulada
        const newAccess = "mock-access-token-" + Math.random().toString(36).slice(2);
        const newRefresh = "mock-refresh-token-" + Math.random().toString(36).slice(2);
        sessionStorage.setItem("mock_refresh_cookie", newRefresh);
        return { access_token: newAccess, role: sessionStorage.getItem("mock_role") || "investigador" };
    }

    const res = await fetch(`${API_BASE}/api/refresh/`, {
        method: "POST",
        credentials: "include"
    });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail || "Refresh falló");
    }
    return res.json(); // { access_token, role? }
}

// profile y logout con cookie-only
export async function getProfile(accessToken) {
    if (USE_MOCK) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    name: localStorage.getItem("user_name") || "Adrian",
                    role: sessionStorage.getItem("mock_role") || localStorage.getItem("role") || "investigador"
                });
            }, 100);
        });
    }
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    const res = await fetch(`${API_BASE}/api/me/`, { headers, credentials: "include" });
    if (!res.ok) throw new Error("No se pudo obtener el perfil");
    return res.json();
}

export async function logoutRequest(accessToken) {
    if (USE_MOCK) {
        localStorage.removeItem("role");
        sessionStorage.removeItem("mock_refresh_cookie");
        sessionStorage.removeItem("mock_role");
        return Promise.resolve();
    }
    await fetch(`${API_BASE}/api/logout/`, {
        method: "POST",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        credentials: "include"
    }).catch(() => { });
    localStorage.removeItem("role");
}
