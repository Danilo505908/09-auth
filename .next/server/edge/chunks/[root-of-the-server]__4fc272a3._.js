(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__4fc272a3._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/app/api/api.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [middleware-edge] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: 'https://notehub-api.goit.study',
    withCredentials: true
});
}),
"[project]/lib/api/serverApi.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkSession",
    ()=>checkSession,
    "fetchNoteById",
    ()=>fetchNoteById,
    "fetchNotes",
    ()=>fetchNotes,
    "getMe",
    ()=>getMe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/headers.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/request/cookies.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$api$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/api.ts [middleware-edge] (ecmascript)");
;
;
const fetchNotes = async (params)=>{
    const cookieStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    // Build Cookie header manually
    const cookieHeader = [
        accessToken && `accessToken=${accessToken}`,
        refreshToken && `refreshToken=${refreshToken}`
    ].filter(Boolean).join('; ');
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$api$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["api"].get("/notes", {
        params,
        headers: {
            Cookie: cookieHeader
        }
    });
    return data;
};
const fetchNoteById = async (id)=>{
    const cookieStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    // Build Cookie header manually
    const cookieHeader = [
        accessToken && `accessToken=${accessToken}`,
        refreshToken && `refreshToken=${refreshToken}`
    ].filter(Boolean).join('; ');
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$api$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["api"].get(`/notes/${id}`, {
        headers: {
            Cookie: cookieHeader
        }
    });
    return data;
};
const getMe = async ()=>{
    try {
        const cookieStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
        const accessToken = cookieStore.get('accessToken')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;
        // Build Cookie header manually
        const cookieHeader = [
            accessToken && `accessToken=${accessToken}`,
            refreshToken && `refreshToken=${refreshToken}`
        ].filter(Boolean).join('; ');
        if (!cookieHeader) {
            throw new Error('No authentication tokens found');
        }
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$api$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["api"].get("/users/me", {
            headers: {
                Cookie: cookieHeader
            }
        });
        return data;
    } catch (error) {
        console.error('getMe error:', error);
        throw error;
    }
};
const checkSession = async ()=>{
    try {
        const cookieStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
        const accessToken = cookieStore.get('accessToken')?.value;
        const refreshToken = cookieStore.get('refreshToken')?.value;
        // Build Cookie header manually
        const cookieHeader = [
            accessToken && `accessToken=${accessToken}`,
            refreshToken && `refreshToken=${refreshToken}`
        ].filter(Boolean).join('; ');
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$api$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["api"].get("/auth/session", {
            headers: {
                Cookie: cookieHeader
            }
        });
        return response;
    } catch  {
        return null;
    }
};
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$serverApi$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/serverApi.ts [middleware-edge] (ecmascript)");
;
;
const PUBLIC_PATHS = [
    "/sign-in",
    "/sign-up"
];
const PRIVATE_PATHS = [
    "/profile",
    "/notes"
];
async function middleware(req) {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const url = req.nextUrl.clone();
    const isPublic = PUBLIC_PATHS.some((path)=>url.pathname.startsWith(path));
    const isPrivate = PRIVATE_PATHS.some((path)=>url.pathname.startsWith(path));
    if (!accessToken && refreshToken) {
        const sessionResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$serverApi$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["checkSession"])();
        if (!sessionResponse) {
            url.pathname = "/sign-in";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
        const session = sessionResponse.data;
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        response.cookies.set("accessToken", session.accessToken, {
            httpOnly: true,
            path: "/"
        });
        if (session.refreshToken) {
            response.cookies.set("refreshToken", session.refreshToken, {
                httpOnly: true,
                path: "/"
            });
        }
        return response;
    }
    if (!accessToken && isPrivate) {
        url.pathname = "/sign-in";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    if (accessToken && isPublic) {
        url.pathname = "/";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/profile/:path*",
        "/notes/:path*",
        "/sign-in",
        "/sign-up"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__4fc272a3._.js.map