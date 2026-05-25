import { refreshWithCookie } from "../services/api";

/**
* apiFetch(url, options, authContext)
* - usa Authorization Bearer si hay token en contexto
* - usa credentials: "include" para que la cookie viaje
* - si recibe 401 intenta refreshWithCookie() y reintenta la petición
*/
export async function apiFetch(url, options = {}, authContext) {
    const token = authContext?.token;
    const headers = { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };

    let res = await fetch(url, { ...options, headers, credentials: "include" });
    if (res.status !== 401) return res;

    try {
        const newData = await refreshWithCookie();
        if (!newData || !newData.access_token) throw new Error("Refresh no devolvió access_token");

        authContext.setToken(newData.access_token);

        const retryHeaders = { ...(options.headers || {}), Authorization: `Bearer ${newData.access_token}` };
        return fetch(url, { ...options, headers: retryHeaders, credentials: "include" });
    } catch (err) {
        try { await authContext.logout(); } catch (e) { }
        throw err;
    }
}
