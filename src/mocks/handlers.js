import { http, HttpResponse } from "msw";

// Estado interno del mock
let fakeAccess = "access.initial";
let fakeRefresh = "refresh.initial";
let fakeRole = null;

// Usuarios mock
const USERS = {
    admin: {
        password: "1234",
        role: "administrador"
    },
    invest: {
        password: "1234",
        role: "investigador"
    }
};

export const handlers = [

// LOGIN
    http.post("/auth/login", async ({ request }) => {
        const body = await request.json();
        const { usuario, password, role } = body;

        // Validación de campos requeridos
        if (!usuario || !password || !role) {
            return HttpResponse.json(
                { message: "Faltan campos requeridos" },
                { status: 400 }
            );
        }

        // Buscar usuario
        const user = USERS[usuario];

        if (!user) {
            return HttpResponse.json(
                { message: "Usuario no encontrado" },
                { status: 401 }
            );
        }

        // Validar password
        if (user.password !== password) {
            return HttpResponse.json(
                { message: "Contraseña incorrecta" },
                { status: 401 }
            );
        }

        // Validar rol
        if (user.role !== role) {
            return HttpResponse.json(
                { message: "Rol incorrecto para este usuario" },
                { status: 403 }
            );
        }

        // Generar tokens mock
        fakeAccess = `access.${Date.now()}`;
        fakeRefresh = `refresh.${Date.now()}`;
        fakeRole = user.role;

        return HttpResponse.json({
            access_token: fakeAccess,
            refresh_token: fakeRefresh,
            role: fakeRole,
            expires_in: 900
        });
    }),

    // REFRESH TOKEN
    http.post("/auth/refresh", async ({ request }) => {
        const { refresh_token } = await request.json();

        if (!refresh_token) {
            return HttpResponse.json(
                { message: "Falta refresh_token" },
                { status: 400 }
            );
        }

        if (refresh_token !== fakeRefresh) {
            return HttpResponse.json(
                { message: "Refresh inválido" },
                { status: 401 }
            );
        }

        // Rotación de tokens
        fakeAccess = `access.${Date.now()}`;
        fakeRefresh = `refresh.${Date.now()}`;

        return HttpResponse.json({
            access_token: fakeAccess,
            refresh_token: fakeRefresh,
            role: fakeRole,
            expires_in: 900
        });
    }),

    // LOGOUT
    http.post("/auth/logout", async () => {
        fakeAccess = null;
        fakeRefresh = null;
        fakeRole = null;

        return HttpResponse.json({ ok: true });
    }),

    // Endpoint protegido de ejemplo
    http.get("/api/protected", ({ request }) => {
        const auth = request.headers.get("authorization") || "";

        if (!auth.startsWith("Bearer ")) {
            return HttpResponse.json(
                { message: "Token no enviado" },
                { status: 401 }
            );
        }

        const token = auth.split(" ")[1];

        if (token !== fakeAccess) {
            return HttpResponse.json(
                { message: "Token inválido o expirado" },
                { status: 401 }
            );
        }

        // Respuesta según rol
        if (fakeRole === "administrador") {
            return HttpResponse.json({
                data: "Contenido para ADMINISTRADOR",
                permisos: [
                    "gestionar usuarios",
                    "ver reportes",
                    "configurar sistema"
                ]
            });
        }

        if (fakeRole === "investigador") {
            return HttpResponse.json({
                data: "Contenido para INVESTIGADOR",
                permisos: [
                    "levantar encuestas",
                    "ver sus propios datos"
                ]
            });
        }

        return HttpResponse.json({
            data: "Rol desconocido",
            permisos: []
        });
    })
];
