module.exports = [
"[project]/app/config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "ENDPOINTS",
    ()=>ENDPOINTS
]);
// Detectamos si estamos en el navegador y si la URL es localhost
const isLocalhost = ("TURBOPACK compile-time value", "undefined") !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const API_BASE_URL = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "https://proyecto-daw-production.up.railway.app";
const ENDPOINTS = {
    // Añadimos el prefijo 'api/buscador' que Django está usando
    BUSCADOR: `${API_BASE_URL}/api/buscador/buscar/`,
    GEOLOCALIZAR: `${API_BASE_URL}/api/buscador/geolocalizar/`,
    GOOGLE_PROXY: `${API_BASE_URL}/api/buscador/google-maps/`,
    ESTABLECIMIENTOS: `${API_BASE_URL}/api/formulario/`
};
}),
"[project]/components/RegistroEstablecimiento.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RegistroEstablecimiento
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$google$2d$maps$2f$api$2f$dist$2f$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-google-maps/api/dist/esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/config.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const libraries = [
    "places",
    "geometry"
];
const ESTRUCTURA = {
    "Educación y Cultura": {
        Academia: [
            "Idiomas",
            "Refuerzo Escolar",
            "Música",
            "Otros..."
        ],
        Colegio: [
            "Infantil",
            "Primaria",
            "ESO",
            "Bachillerato",
            "Otros..."
        ],
        Instituto: [
            "Ciclos Formativos",
            "Bachillerato",
            "Educación de Adultos",
            "Otros..."
        ],
        Guardería: null,
        "Papelería / Librería": null,
        Biblioteca: null,
        Ludoteca: null,
        "Otros...": null
    },
    "Salud y Belleza": {
        Farmacia: null,
        "Clínica Dental": null,
        "Centro de Estética": null,
        Peluquería: null,
        Manicura: null,
        "Gimnasio / Centro Deportivo": [
            "Gym",
            "Yoga",
            "Zumba",
            "Baile",
            "Boxeo",
            "Otros..."
        ],
        Fisioterapia: null,
        Óptica: null,
        Veterinaria: null,
        "Centros Salud": [
            "Público",
            "Privado",
            "Concertado"
        ],
        Hospitales: [
            "Público",
            "Privado",
            "Concertado"
        ],
        "Otros...": null
    },
    Alimentación: {
        Mercado: null,
        Supermercado: null,
        "Frutería / Verdulería": null,
        Pescadería: null,
        "Carnicería / Charcutería": null,
        "Panadería / Pastelería": null,
        Mercadillo: [
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Sábado",
            "Domingo"
        ],
        "Otros...": null
    },
    "Hostelería (Ocio)": {
        "Bar / Cafetería": null,
        Restaurante: [
            "Pizzería",
            "Hamburguesería",
            "Comida Española",
            "Mexicano",
            "Sushi",
            "Oriental",
            "Otros..."
        ],
        "Pub / Discoteca": null,
        "Comida para llevar": null,
        Cocktelería: null,
        Eventos: [
            "Conciertos",
            "Catas",
            "Teatro",
            "Otros..."
        ],
        "Clases cocina": null,
        Vinotecas: null,
        "Otros...": null
    },
    "Servicios y Tiendas": {
        Ferretería: null,
        "Tienda de Ropa": null,
        Calzado: null,
        "Informática / Telefonía": null,
        "Taller Mecánico": null,
        "Tintorería / Lavandería": null,
        Floristería: null,
        "Otros...": null
    }
};
function RegistroEstablecimiento() {
    const { isLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$google$2d$maps$2f$api$2f$dist$2f$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useJsApiLoader"])({
        id: "google-map-script",
        googleMapsApiKey: ("TURBOPACK compile-time value", "AIzaSyB-PYUy3N7UoCC_d0mWkqGrBAzMmEyojA8") || "",
        libraries
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const autocompleteRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        nombre_comercio: "",
        tipo_negocio: "comercio",
        grupo: "",
        categoria: "",
        subcategoria: "",
        categoria_libre: "",
        subcategoria_libre: "",
        direccion: "",
        municipio: "",
        provincia: "",
        cp: "",
        telefono: "",
        correo: "",
        url_web: "",
        latitud: 0,
        longitud: 0
    });
    const inputClasses = "form-control bg-dark text-white border-secondary";
    const selectClasses = "form-select bg-dark text-white border-secondary";
    const onPlaceChanged = ()=>{
        const place = autocompleteRef.current?.getPlace();
        if (!place || !place.address_components || !place.geometry) return;
        const coords = place.geometry.location;
        let addressInfo = {
            direccion: place.name || "",
            cp: "",
            municipio: "",
            provincia: ""
        };
        place.address_components.forEach((component)=>{
            const types = component.types;
            if (types.includes("postal_code")) addressInfo.cp = component.long_name;
            if (types.includes("locality")) addressInfo.municipio = component.long_name;
            if (types.includes("administrative_area_level_2")) addressInfo.provincia = component.long_name;
        });
        setFormData((prev)=>({
                ...prev,
                direccion: addressInfo.direccion,
                cp: addressInfo.cp,
                municipio: addressInfo.municipio,
                provincia: addressInfo.provincia,
                latitud: coords?.lat() || 0,
                longitud: coords?.lng() || 0
            }));
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        const datosAEnviar = {
            ...formData,
            categoria: formData.categoria === "Otros..." ? formData.categoria_libre : formData.categoria,
            subcategoria: formData.subcategoria === "Otros..." ? formData.subcategoria_libre : formData.subcategoria
        };
        try {
            const response = await fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].ESTABLECIMIENTOS}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosAEnviar)
            });
            if (response.ok) alert("¡Establecimiento registrado!");
            else alert("Error en el servidor.");
        } catch (error) {
            alert("Error de conexión.");
        } finally{
            setLoading(false);
        }
    };
    if (!isLoaded) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-white text-center py-5",
        children: "Cargando buscador..."
    }, void 0, false, {
        fileName: "[project]/components/RegistroEstablecimiento.tsx",
        lineNumber: 183,
        columnNumber: 7
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container py-5",
        style: {
            backgroundColor: "#1a3a3a",
            backgroundImage: `linear-gradient(rgba(26, 58, 58, 0.8), rgba(26, 58, 58, 0.8)), url('/formularios.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "15px"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center mb-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white d-inline-block rounded-circle p-3 mb-3",
                        style: {
                            width: "80px",
                            height: "80px"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/tu-icono.png",
                            alt: "logo",
                            style: {
                                width: "100%"
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/RegistroEstablecimiento.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-white fw-bold h2",
                        children: "Registra tu Negocio"
                    }, void 0, false, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "mx-auto bg-dark p-4 rounded-4 shadow",
                style: {
                    maxWidth: "420px",
                    border: "1px solid #385c5c"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "form-label text-white fw-bold small",
                                children: "Nombre del Negocio"
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                className: inputClasses,
                                value: formData.nombre_comercio,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        nombre_comercio: e.target.value
                                    }),
                                placeholder: "Ej: Cafetería Central",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "form-label text-white fw-bold small",
                                children: "Tipo de Negocio"
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "d-flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `btn btn-sm w-50 ${formData.tipo_negocio === "comercio" ? "btn-warning" : "btn-outline-secondary text-white"}`,
                                        onClick: ()=>setFormData({
                                                ...formData,
                                                tipo_negocio: "Comercio"
                                            }),
                                        children: "Comercio"
                                    }, void 0, false, {
                                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                        lineNumber: 240,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: `btn btn-sm w-50 ${formData.tipo_negocio === "Productor Local" ? "btn-warning" : "btn-outline-secondary text-white"}`,
                                        onClick: ()=>setFormData({
                                                ...formData,
                                                tipo_negocio: "Productor Local"
                                            }),
                                        children: "Productor Local"
                                    }, void 0, false, {
                                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                        lineNumber: 249,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 239,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 235,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                        className: "text-secondary my-4"
                    }, void 0, false, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 261,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "form-label text-white fw-bold text-uppercase",
                                style: {
                                    fontSize: "0.75rem",
                                    letterSpacing: "1px"
                                },
                                children: "1. Bloque de Actividad"
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 265,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: selectClasses,
                                value: formData.grupo,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        grupo: e.target.value,
                                        categoria: "",
                                        subcategoria: ""
                                    }),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Selecciona bloque..."
                                    }, void 0, false, {
                                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this),
                                    Object.keys(ESTRUCTURA).map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: g,
                                            children: g
                                        }, g, false, {
                                            fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                            lineNumber: 285,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 264,
                        columnNumber: 9
                    }, this),
                    formData.grupo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 animate__animated animate__fadeIn",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "form-label text-white fw-bold text-uppercase",
                                style: {
                                    fontSize: "0.75rem"
                                },
                                children: "2. Categoría"
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 295,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: selectClasses,
                                value: formData.categoria,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        categoria: e.target.value,
                                        subcategoria: ""
                                    }),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Selecciona categoría..."
                                    }, void 0, false, {
                                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                        lineNumber: 312,
                                        columnNumber: 15
                                    }, this),
                                    Object.keys(ESTRUCTURA[formData.grupo] || {}).map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: c,
                                            children: c
                                        }, c, false, {
                                            fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                            lineNumber: 316,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 301,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 294,
                        columnNumber: 11
                    }, this),
                    formData.categoria && Array.isArray(ESTRUCTURA[formData.grupo]?.[formData.categoria]) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 animate__animated animate__fadeIn",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "form-label text-warning fw-bold text-uppercase",
                                style: {
                                    fontSize: "0.75rem"
                                },
                                children: "3. Detalle Especialidad"
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 332,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: `${selectClasses} border-warning`,
                                value: formData.subcategoria,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        subcategoria: e.target.value
                                    }),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Selecciona detalle..."
                                    }, void 0, false, {
                                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                        lineNumber: 345,
                                        columnNumber: 17
                                    }, this),
                                    ESTRUCTURA[formData.grupo][formData.categoria].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: s,
                                            children: s
                                        }, s, false, {
                                            fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                            lineNumber: 349,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 338,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 331,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "form-label text-white fw-bold small",
                                children: "Busca tu Dirección *"
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 358,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$google$2d$maps$2f$api$2f$dist$2f$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Autocomplete"], {
                                onLoad: (ref)=>autocompleteRef.current = ref,
                                onPlaceChanged: onPlaceChanged,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: inputClasses,
                                    placeholder: "Calle, número...",
                                    value: formData.direccion,
                                    onChange: (e)=>setFormData({
                                            ...formData,
                                            direccion: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                    lineNumber: 365,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 361,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 357,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "row mb-3 g-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: inputClasses,
                                    placeholder: "Municipio",
                                    value: formData.municipio,
                                    readOnly: true
                                }, void 0, false, {
                                    fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                    lineNumber: 379,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 378,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    className: inputClasses,
                                    placeholder: "C.P.",
                                    value: formData.cp,
                                    readOnly: true
                                }, void 0, false, {
                                    fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                    lineNumber: 388,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 387,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 377,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "form-label text-white fw-bold small",
                                children: "Correo electrónico"
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 399,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "email",
                                className: inputClasses,
                                value: formData.correo,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        correo: e.target.value
                                    }),
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 402,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "form-label text-white fw-bold small",
                                children: "Página Web (opcional)"
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 413,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "url",
                                className: inputClasses,
                                placeholder: "https://tuweb.com",
                                value: formData.url_web,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        url_web: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                                lineNumber: 416,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 412,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: loading,
                        className: "btn btn-warning w-100 fw-bold py-3 text-uppercase shadow-sm",
                        style: {
                            color: "#275656"
                        },
                        children: loading ? "Registrando..." : "Finalizar Registro"
                    }, void 0, false, {
                        fileName: "[project]/components/RegistroEstablecimiento.tsx",
                        lineNumber: 427,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/RegistroEstablecimiento.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/RegistroEstablecimiento.tsx",
        lineNumber: 186,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_87237e9e._.js.map