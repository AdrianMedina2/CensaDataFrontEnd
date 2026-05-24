const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
// este cambia a false con el api real.
const USE_MOCK = true;


// MOCK
export async function loginMock(usuario, password, role) {
    // usuarios fake
    const users = [
        { usuario: "adminUser", password: "123", role: "admin" },
        { usuario: "investUser", password: "456", role: "investigador" }
    ];

    // buscar coincidencia exacta
    const match = users.find(
        u => u.usuario === usuario && u.password === password && u.role === role
    );

    if (match) {
        return {
            access_token: "fake-access-token",
            token_type: "Bearer",
            expires_in: 3600,
            refresh_token: "fake-refresh-token",
            role: match.role
        };
    } else {
        throw new Error("Credenciales inválidas o rol incorrecto");
    }
}


// Login real, con fetch al backend
export async function loginReal(usuario, password, role) {
    const res = await fetch(`${API_BASE}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password, Role: role })
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
        refresh_token: data.refresh_token,
        role: data.role || role
    };
}

// exporta la función de login, según el valor de USE_MOCK
export async function login(usuario, password, role) {
    return USE_MOCK
        ? loginMock(usuario, password, role)
        : login(usuario, password, role);
}

// Obtener perfil del usuario
export async function getProfile() {
    if (USE_MOCK) {
        // llamada simulada
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    name: localStorage.getItem("user_name") || "Adrian",
                    role: localStorage.getItem("role") || "investigador",
                });
            }, 100);
        });
    } else {
        // ya con backend real, se hace fetch a /api/me/ o similar
        const res = await fetch(`${API_BASE}/api/me/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        });
        if (!res.ok) throw new Error("No se pudo obtener el perfil");
        return await res.json();
    }
}

// Logout
export async function logout() {
    if (USE_MOCK) {
        // Limpieza local de localstorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");
        localStorage.removeItem("user_name");
        return Promise.resolve();
    } else {
        // ya con backend real, se hace fetch a la api para invalidar el token
        await fetch(`${API_BASE}/api/logout/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        }).catch(() => {});
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");
        localStorage.removeItem("user_name");
    }
}
