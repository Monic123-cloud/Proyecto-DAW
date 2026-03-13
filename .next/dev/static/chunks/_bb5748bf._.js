(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "ENDPOINTS",
    ()=>ENDPOINTS
]);
// Detectamos si estamos en el navegador y si la URL es localhost
const isLocalhost = ("TURBOPACK compile-time value", "object") !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const API_BASE_URL = isLocalhost ? "http://127.0.0.1:8000" : "https://proyecto-daw-production.up.railway.app";
const ENDPOINTS = {
    // Añadimos el prefijo 'api/buscador' que Django está usando
    BUSCADOR: `${API_BASE_URL}/api/buscador/buscar/`,
    GEOLOCALIZAR: `${API_BASE_URL}/api/buscador/geolocalizar/`,
    GOOGLE_PROXY: `${API_BASE_URL}/api/buscador/google-maps/`,
    ESTABLECIMIENTOS: `${API_BASE_URL}/api/formulario/`
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Mapa.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Mapa
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$google$2d$maps$2f$api$2f$dist$2f$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-google-maps/api/dist/esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"); // Para manejar el estado del mapa, el punto seleccionado y la carga del mapa
;
var _s = __turbopack_context__.k.signature();
"use client"; //Indica que este componente se ejecuta en el navegador
;
;
const libraries = [
    "places"
];
const containerStyle = {
    width: "100%",
    height: "400px"
};
const defaultCenter = {
    lat: 40.4167,
    lng: -3.7037
};
function Mapa({ puntos }) {
    _s();
    const { isLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$google$2d$maps$2f$api$2f$dist$2f$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useJsApiLoader"])({
        id: "google-map-script",
        googleMapsApiKey: ("TURBOPACK compile-time value", "AIzaSyB-PYUy3N7UoCC_d0mWkqGrBAzMmEyojA8"),
        libraries
    });
    const [map, setMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Estado para saber qué marcador se ha pulsado
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Calculamos el centro del mapa usando useMemo para evitar recalcularlo en cada renderizado
    const center = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Mapa.useMemo[center]": ()=>{
            if (puntos && puntos.length > 0) {
                return {
                    lat: Number(puntos[0].latitud),
                    lng: Number(puntos[0].longitud)
                };
            }
            return defaultCenter; // Si no hay puntos, centramos en Madrid por defecto
        }
    }["Mapa.useMemo[center]"], [
        puntos
    ]);
    // Cada vez que cambian los puntos o el mapa, ajustamos el zoom para que se vean todos los marcadores
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Mapa.useEffect": ()=>{
            if (map && puntos.length > 1) {
                const bounds = new window.google.maps.LatLngBounds();
                puntos.forEach({
                    "Mapa.useEffect": (p)=>bounds.extend({
                            lat: Number(p.latitud),
                            lng: Number(p.longitud)
                        })
                }["Mapa.useEffect"]);
                map.fitBounds(bounds);
            }
        }
    }["Mapa.useEffect"], [
        map,
        puntos
    ]);
    if (!isLoaded) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400",
        children: "Cargando mapa..."
    }, void 0, false, {
        fileName: "[project]/components/Mapa.tsx",
        lineNumber: 57,
        columnNumber: 7
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$google$2d$maps$2f$api$2f$dist$2f$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleMap"], {
        mapContainerStyle: containerStyle,
        center: center,
        zoom: 14,
        onLoad: (m)=>setMap(m),
        onClick: ()=>setSelected(null),
        options: {
            streetViewControl: false,
            mapTypeControl: false
        },
        children: [
            puntos.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$google$2d$maps$2f$api$2f$dist$2f$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarkerF"], {
                    position: {
                        lat: Number(p.latitud),
                        lng: Number(p.longitud)
                    },
                    onClick: ()=>setSelected(p),
                    // CONFIGURACIÓN DEL PUNTO AZUL
                    icon: {
                        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        scaledSize: new window.google.maps.Size(40, 40)
                    }
                }, p.id_establecimiento, false, {
                    fileName: "[project]/components/Mapa.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this)),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$google$2d$maps$2f$api$2f$dist$2f$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InfoWindowF"], {
                position: {
                    lat: Number(selected.latitud),
                    lng: Number(selected.longitud)
                },
                onCloseClick: ()=>setSelected(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-2 text-black max-w-[200px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "font-bold text-blue-700 text-sm mb-1",
                            children: selected.nombre_comercio
                        }, void 0, false, {
                            fileName: "[project]/components/Mapa.tsx",
                            lineNumber: 94,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-600 leading-tight",
                            children: selected.direccion
                        }, void 0, false, {
                            fileName: "[project]/components/Mapa.tsx",
                            lineNumber: 97,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Mapa.tsx",
                    lineNumber: 93,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Mapa.tsx",
                lineNumber: 86,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Mapa.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(Mapa, "eQ/yLFpD+B8VLkGEixeuGU+VVxY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$google$2d$maps$2f$api$2f$dist$2f$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useJsApiLoader"]
    ];
});
_c = Mapa;
var _c;
__turbopack_context__.k.register(_c, "Mapa");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Buscador.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Buscador
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"); // Para manejar el estado de los comercios, el código postal y la carga
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Mapa$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Mapa.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client"; //Indica que este componente se ejecuta en el navegador (necesario para usar hooks y eventos)
;
;
;
function Buscador() {
    _s();
    const [comercios, setComercios] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false); // Para mostrar "Cargando..." mientras se obtiene la respuesta
    const [cp, setCp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Función para buscar comercios por código postal o por ubicación actual.Asíncrona para que la web no se congele mientras espera la respuesta
    const buscarComercios = async ()=>{
        if (!cp.trim()) return;
        setLoading(true); // Activa el estado de carga para mostrar feedback al usuario
        // Realiza la petición al backend con el código postal como parámetro
        try {
            const url = `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENDPOINTS"].BUSCADOR}?cp=${cp}`; // Construye la URL con el código postal
            const response = await fetch(url); //envía la petición HTTP al backend y espera la respuesta
            if (!response.ok) throw new Error("Error en la respuesta");
            const data = await response.json(); // 'data' recibe el JSON convertido en un Array de objetos
            setComercios(data);
        } catch (error) {
            console.error("Error:", error);
            alert("Error al conectar con el servidor.");
        } finally{
            setLoading(false);
        }
    };
    //Se dispara cuando el usuario hace clic en el botón del pin. Es una función de flecha que engloba toda la lógica de geolocalización.
    const obtenerUbicacionActual = ()=>{
        if (!navigator.geolocation) {
            // Verifica si el navegador soporta geolocalización
            alert("Tu navegador no soporta geolocalización.");
            return;
        }
        setLoading(true);
        //Este es el método oficial de HTML5 para pedir la ubicación actual
        navigator.geolocation.getCurrentPosition(async (position)=>{
            //se ejecutará solo si el usuario acepta dar permiso y el navegador logra encontrar la posición.
            const { latitude, longitude } = position.coords;
            try {
                // usamos 'lat' y 'lng' en la URL
                const url = `http://localhost:8000/api/buscador/buscar/?lat=${latitude}&lng=${longitude}`;
                const response = await fetch(url);
                const data = await response.json();
                setComercios(data);
            } catch (error) {
                console.error("Error:", error);
            } finally{
                setLoading(false);
            }
        }, (error)=>{
            setLoading(false);
            alert("Permiso de ubicación denegado.");
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-5xl mx-auto p-4 flex flex-col gap-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white p-6 rounded-3xl shadow-xl border border-gray-100",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2",
                        children: "🔍 Explorador de Comercios"
                    }, void 0, false, {
                        fileName: "[project]/components/Buscador.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: obtenerUbicacionActual,
                                disabled: loading,
                                className: "bg-gray-100 hover:bg-gray-200 text-2xl px-5 rounded-2xl transition-all border border-gray-200 disabled:opacity-50",
                                title: "Usar mi ubicación actual",
                                children: [
                                    " ",
                                    "📍",
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Buscador.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Código Postal (ej: 28042)...",
                                className: "border-2 border-gray-100 p-4 rounded-2xl flex-1 focus:border-blue-500 outline-none transition-all text-black",
                                value: cp,
                                onChange: (e)=>setCp(e.target.value),
                                onKeyDown: (e)=>e.key === "Enter" && buscarComercios()
                            }, void 0, false, {
                                fileName: "[project]/components/Buscador.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: buscarComercios,
                                disabled: loading,
                                className: "bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl transition-all disabled:bg-blue-300",
                                children: loading ? "..." : "Buscar"
                            }, void 0, false, {
                                fileName: "[project]/components/Buscador.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Buscador.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-[400px] rounded-2xl overflow-hidden shadow-inner border border-gray-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Mapa$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            puntos: comercios
                        }, void 0, false, {
                            fileName: "[project]/components/Buscador.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/Buscador.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/Buscador.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                children: comercios.length > 0 ? comercios.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-blue-900 text-lg mb-1",
                                children: c.nombre_comercio
                            }, void 0, false, {
                                fileName: "[project]/components/Buscador.tsx",
                                lineNumber: 126,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mb-3",
                                children: c.direccion
                            }, void 0, false, {
                                fileName: "[project]/components/Buscador.tsx",
                                lineNumber: 129,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full",
                                children: [
                                    "CP: ",
                                    c.cp
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Buscador.tsx",
                                lineNumber: 130,
                                columnNumber: 17
                            }, this)
                        ]
                    }, c.id_establecimiento, true, {
                        fileName: "[project]/components/Buscador.tsx",
                        lineNumber: 122,
                        columnNumber: 15
                    }, this)) : !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border-2 border-dashed border-gray-100",
                    children: "Ingresa un código postal para ver resultados"
                }, void 0, false, {
                    fileName: "[project]/components/Buscador.tsx",
                    lineNumber: 136,
                    columnNumber: 15
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Buscador.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Buscador.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_s(Buscador, "BMnCJZej9bvT6r62G3mK73BDtmk=");
_c = Buscador;
var _c;
__turbopack_context__.k.register(_c, "Buscador");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_bb5748bf._.js.map