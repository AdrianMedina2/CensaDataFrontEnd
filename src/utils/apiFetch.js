import { refreshRequest } from "../services/api";

/**
* apiFetch(url, options, authContext)
* Maneja automáticamente:
*  - Enviar accessToken en Authorization
*  - Detectar 401 (token expirado)
*  - Intentar refresh con refreshToken
*  - Guardar nuevos tokens en AuthContext
*  - Reintentar la petición original
*  - Hacer logout si el refresh falla
*/
export async function apiFetch(url, options = {}, authContext) {
    const access = authContext?.accessToken;
    const refresh = authContext?.refreshToken;

    const headers = {
        ...(options.headers || {}),
        ...(access ? { Authorization: `Bearer ${access}` } : {})
    };

    // 1) petición original
    let res = await fetch(url, { ...options, headers });

    if (res.status !== 401) return res;

    // 2) si devuelve 401 se intenta refresh
    try {
        if (!refresh) throw new Error("No hay refresh token");

        const data = await refreshRequest({ refresh_token: refresh });

        if (!data || !data.access_token) throw new Error("Refresh inválido");

        // guardar nuevos tokens
        authContext.setTokens(data.access_token, data.refresh_token, data.role);

        // 3) reintentar petición original con nuevo token
        const retryHeaders = {
            ...(options.headers || {}),
            Authorization: `Bearer ${data.access_token}`
        };

        return fetch(url, { ...options, headers: retryHeaders });

    } catch (error) {
        // Si refresh falla, hacer logout para limpiar sesión
        try { await authContext.logout(); } catch (_) { }
        throw error;
    }
}
