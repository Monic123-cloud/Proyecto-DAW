"use client";

import { useState, useRef, useEffect } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { ENDPOINTS } from "../app/config";
import { validarDocumentoCompleto, validarCP } from "../components/utils/utils";
import { authService } from '../services/authService';

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

const ESTRUCTURA = {
  "Educación y Cultura": {
    Academia: ["Idiomas", "Refuerzo Escolar", "Música", "Otros..."],
    Colegio: ["Infantil", "Primaria", "ESO", "Bachillerato", "Otros..."],
    Instituto: [
      "Ciclos Formativos",
      "Bachillerato",
      "Educación de Adultos",
      "Otros...",
    ],
    Guardería: null,
    "Papelería / Librería": null,
    Biblioteca: null,
    Ludoteca: null,
    "Otros...": null,
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
      "Otros...",
    ],
    Fisioterapia: null,
    Óptica: null,
    Veterinaria: null,
    "Centros Salud": ["Público", "Privado", "Concertado"],
    Hospitales: ["Público", "Privado", "Concertado"],
    "Otros...": null,
  },
  Alimentación: {
    Mercado: null,
    Supermercado: null,
    "Frutería / Verdulería": null,
    Pescadería: null,
    "Carnicería / Charcutería": null,
    "Panadería / Pastelería": null,
    Mercadillo: ["Lunes", "Martes", "Miércoles", "Jueves", "Sábado", "Domingo"],
    "Otros...": null,
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
      "Otros...",
    ],
    "Pub / Discoteca": null,
    "Comida para llevar": null,
    Cocktelería: null,
    Eventos: ["Conciertos", "Catas", "Teatro", "Otros..."],
    "Clases cocina": null,
    Vinotecas: null,
    "Otros...": null,
  },
  "Servicios y Tiendas": {
    Ferretería: null,
    "Tienda de Ropa": null,
    Calzado: null,
    "Informática / Telefonía": null,
    "Taller Mecánico": null,
    "Tintorería / Lavandería": null,
    Floristería: null,
    "Otros...": null,
  },
};

export default function RegistroEstablecimiento() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [vista, setVista] = useState<"seleccion" | "busqueda" | "formulario">(
    "seleccion",
  );
  const [editId, setEditId] = useState<number | null>(null);
  const [cifBusqueda, setCifBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [password, setPassword] = useState("");

  const [formData, setFormData] = useState({
    nombre_comercio: "",
    cif_nif: "",
    tipo_negocio: "Comercio",
    grupo: "",
    categoria: "",
    subcategoria: "",
    categoria_libre: "",
    subcategoria_libre: "",
    direccion: "",
    numero: "",
    municipio: "",
    provincia: "",
    cp: "",
    telefono: "",
    correo: "",
    url_web: "",
    latitud: 0,
    longitud: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      if (!authService.isAuthenticated()) return;

      try {
      const response = await fetch(ENDPOINTS.MI_LOCAL, {
        method: "GET",
        headers: authService.getAuthHeaders(), 
      });

        if (response.ok) {
          const datosExistentes = await response.json();
          setFormData(datosExistentes);
          setEditId(datosExistentes.id_establecimiento || datosExistentes.id);
          setVista("formulario");
        }
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };
    cargarDatos();
  }, []);

  const inputClasses = "form-control bg-dark text-white border-secondary";
  const selectClasses = "form-select bg-dark text-white border-secondary";

  const buscarMiNegocio = async () => {
    if (!cifBusqueda) return alert("Por favor, introduce un CIF");
    setLoading(true);
    try {
      const res = await fetch(`${ENDPOINTS.BUSCAR_CIF}${cifBusqueda}/`);
      const data = await res.json();

      if (res.ok) {
        authService.setToken(data.access);

        const idReal = data.id_establecimiento || data.id;

        const grupoKey = data.grupo as keyof typeof ESTRUCTURA;
        const catExiste =
          ESTRUCTURA[grupoKey] &&
          Object.keys(ESTRUCTURA[grupoKey]).includes(data.categoria);

        setFormData({
          ...data,
          categoria: catExiste
            ? data.categoria
            : data.categoria
              ? "Otros..."
              : "",
          categoria_libre: catExiste ? "" : data.categoria,
        });

        setEditId(idReal);
        setVista("formulario"); // Saltamos al formulario con los datos cargados
      } else {
        alert(data.error || "No se encontró ningún negocio con ese CIF/NIF.");
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarNegocio = async () => {
    if (!window.confirm("¿Estás seguro de que quieres borrar este negocio?"))
      return;

    setLoading(true);
    try {
      const res = await fetch(`${ENDPOINTS.ESTABLECIMIENTOS}${editId}/`, {
        method: "DELETE",
        headers: authService.getAuthHeaders(),
      });
      if (res.ok) {
        alert("Negocio eliminado.");
        authService.logout();
        setEditId(null);
        setVista("seleccion");
        setFormData({
          nombre_comercio: "",
          cif_nif: "",
          tipo_negocio: "Comercio",
          grupo: "",
          categoria: "",
          subcategoria: "",
          categoria_libre: "",
          subcategoria_libre: "",
          direccion: "",
          numero: "",
          municipio: "",
          provincia: "",
          cp: "",
          telefono: "",
          correo: "",
          url_web: "",
          latitud: 0,
          longitud: 0,
        });

        // 4. Volvemos a la pantalla de selección
        setVista("seleccion");
      } else {
        alert("No se pudo eliminar el negocio. Inténtalo de nuevo.");
      }
    } catch (e) {
      alert("Error de conexión al intentar eliminar.");
    } finally {
      setLoading(false);
    }
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace();
    if (!place || !place.address_components || !place.geometry) return;

    const coords = place.geometry.location;
    let addressInfo = {
      direccion: place.name || "",
      cp: "",
      municipio: "",
      provincia: "",
    };

    place.address_components.forEach((component) => {
      const types = component.types;
      if (types.includes("postal_code")) addressInfo.cp = component.long_name;
      if (types.includes("locality"))
        addressInfo.municipio = component.long_name;
      if (types.includes("administrative_area_level_2"))
        addressInfo.provincia = component.long_name;
    });

    setFormData((prev) => ({
      ...prev,
      direccion: addressInfo.direccion,
      cp: addressInfo.cp,
      municipio: addressInfo.municipio,
      provincia: addressInfo.provincia,
      latitud: coords?.lat() || 0,
      longitud: coords?.lng() || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    // Validación: Si editamos, necesitamos el token
    if (editId && !authService.isAuthenticated()) {
      alert(
        "Sesión expirada o no encontrada. Por favor, busca tu negocio de nuevo.",
      );
      setLoading(false);
      return;
    }

    const datosAEnviar = {
      ...formData,
      password: password,
      categoria:
        formData.categoria === "Otros..."
          ? formData.categoria_libre
          : formData.categoria,
      subcategoria:
        formData.subcategoria === "Otros..."
          ? formData.subcategoria_libre
          : formData.subcategoria,
    };

    const url = editId
      ? `${ENDPOINTS.ESTABLECIMIENTOS}${editId}/`
      : ENDPOINTS.ESTABLECIMIENTOS;

    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(datosAEnviar),
      });

      if (response.ok) {
        alert(
          editId
            ? "¡Cambios guardados correctamente!"
            : "¡Negocio registrado con éxito!",
        );
        setVista("seleccion"); // Regresa al menú principal
      } else {
        const errorData = await response.json();
        alert(
          `Error: ${errorData.error || "No se pudo procesar la solicitud"}`,
        );
      }
    } catch (error) {
      console.error("Error en el envío:", error);
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded)
    return (
      <div className="text-white text-center py-5">Cargando buscador...</div>
    );

  return (
    <div
      className="container py-5"
      style={{
        backgroundColor: "#1a3a3a",
        backgroundImage: `linear-gradient(rgba(26, 58, 58, 0.8), rgba(26, 58, 58, 0.8)), url('/formularios.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: "15px",
      }}
    >
      {/* CABECERA */}
      <div className="text-center mb-4">
        <div
          className="bg-white d-inline-block rounded-circle p-3 mb-2"
          style={{ width: "80px", height: "80px" }}
        >
          <img src="/tu-icono.png" alt="logo" style={{ width: "100%" }} />
        </div>
        <h1 className="text-white fw-bold h3">Gestión de Negocio</h1>
      </div>

      <div className="mx-auto w-100" style={{ maxWidth: "450px" }}>
        {/* VISTA 1: SELECCIÓN INICIAL */}
        {vista === "seleccion" && (
          <div className="bg-dark p-4 rounded-4 shadow text-center border border-secondary">
            <h4 className="text-white mb-4">Bienvenido</h4>
            <button
              className="btn btn-warning w-100 mb-3 py-3 fw-bold"
              onClick={() => {
                setEditId(null);
                setVista("formulario");
              }}
            >
              NUEVO REGISTRO
            </button>
            <button
              className="btn btn-outline-light w-100 py-3 fw-bold"
              onClick={() => setVista("busqueda")}
            >
              YA ESTOY REGISTRADO
            </button>
          </div>
        )}

        {/* VISTA 2: BUSCADOR POR CIF */}
        {vista === "busqueda" && (
          <div className="bg-dark p-4 rounded-4 shadow border border-warning">
            <h4 className="text-warning mb-3">Buscar mi Ficha</h4>
            <p className="text-white-50 small">
              Introduce tu CIF/NIF para editar tus datos:
            </p>
            <input
              type="text"
              className={inputClasses}
              placeholder="B12345678"
              value={cifBusqueda}
              onChange={(e) => setCifBusqueda(e.target.value.toUpperCase())}
            />
            <button
              className="btn btn-warning w-100 mt-3 py-2 fw-bold"
              onClick={buscarMiNegocio}
              disabled={loading}
            >
              {loading ? "Buscando..." : "CARGAR DATOS"}
            </button>
            <button
              className="btn btn-link text-white-50 w-100 mt-2"
              onClick={() => setVista("seleccion")}
            >
              Volver
            </button>
          </div>
        )}

        {/* VISTA 3: EL FORMULARIO (Híbrido Registro/Edición) */}
        {vista === "formulario" && (
          <form
            onSubmit={handleSubmit}
            className="bg-dark p-4 rounded-4 shadow border border-secondary"
          >
            <h4 className="text-white mb-4 text-center">
              {editId ? "Editar Negocio" : "Nuevo Registro"}
            </h4>

            {/* TIPO DE NEGOCIO */}
            <div className="mb-3">
              <label className="form-label text-white-50 small fw-bold">
                TIPO DE NEGOCIO
              </label>
              <div className="d-flex gap-2">
                {["Comercio", "Productor Local"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`btn btn-sm w-50 ${formData.tipo_negocio === t ? "btn-warning" : "btn-outline-secondary text-white"}`}
                    onClick={() =>
                      setFormData({ ...formData, tipo_negocio: t })
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* NOMBRE */}
            <div className="mb-3">
              <label className="form-label text-white fw-bold small">
                Nombre del Negocio
              </label>
              <input
                type="text"
                className={inputClasses}
                value={formData.nombre_comercio}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_comercio: e.target.value })
                }
                placeholder="Ej: Cafetería Central"
                required
              />
            </div>

            {/* CIF / NIF */}
            <div className="mb-3">
              <label className="form-label text-white fw-bold small">
                CIF / NIF *
              </label>
              <input
                type="text"
                /* Combinamos tus clases base con 'is-invalid' si la validación falla */
                className={`${inputClasses} ${
                  formData.cif_nif &&
                  !validarDocumentoCompleto(formData.cif_nif)
                    ? "is-invalid"
                    : ""
                }`}
                value={formData.cif_nif}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cif_nif: e.target.value.toUpperCase().trim(),
                  })
                }
                required
                placeholder="Ej: 12345678Z o B12345678"
              />

              {/* El mensaje de error debe ir fuera del input para que Bootstrap lo muestre */}
              {formData.cif_nif &&
                !validarDocumentoCompleto(formData.cif_nif) && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    El número de identificación no es válido (letra de control o
                    formato incorrecto).
                  </div>
                )}
            </div>

            <hr className="text-secondary my-4" />

            {/* BLOQUE DE ACTIVIDAD */}
            <div className="mb-3">
              <label
                className="form-label text-white fw-bold text-uppercase"
                style={{ fontSize: "0.75rem", letterSpacing: "1px" }}
              >
                1. Bloque de Actividad
              </label>
              <select
                className={selectClasses}
                value={formData.grupo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    grupo: e.target.value,
                    categoria: "",
                    subcategoria: "",
                  })
                }
              >
                <option value="">Selecciona bloque...</option>
                {Object.keys(ESTRUCTURA).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* CATEGORÍA */}
            {formData.grupo && (
              <div className="mb-3 animate__animated animate__fadeIn">
                <label
                  className="form-label text-white fw-bold text-uppercase"
                  style={{ fontSize: "0.75rem" }}
                >
                  2. Categoría
                </label>
                <select
                  className={selectClasses}
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoria: e.target.value,
                      subcategoria: "",
                    })
                  }
                >
                  <option value="">Selecciona categoría...</option>
                  {Object.keys(
                    ESTRUCTURA[formData.grupo as keyof typeof ESTRUCTURA] || {},
                  ).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* SUBCATEGORÍA */}
            {formData.categoria &&
              Array.isArray(
                (
                  ESTRUCTURA[formData.grupo as keyof typeof ESTRUCTURA] as any
                )?.[formData.categoria],
              ) && (
                <div className="mb-3 animate__animated animate__fadeIn">
                  <label
                    className="form-label text-warning fw-bold text-uppercase"
                    style={{ fontSize: "0.75rem" }}
                  >
                    3. Detalle Especialidad
                  </label>
                  <select
                    className={`${selectClasses} border-warning`}
                    value={formData.subcategoria}
                    onChange={(e) =>
                      setFormData({ ...formData, subcategoria: e.target.value })
                    }
                  >
                    <option value="">Selecciona detalle...</option>
                    {(
                      ESTRUCTURA[
                        formData.grupo as keyof typeof ESTRUCTURA
                      ] as any
                    )[formData.categoria].map((s: string) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            {/* DIRECCIÓN CON AUTOCOMPLETE */}
            <div className="mb-3">
              <label className="form-label text-white fw-bold small">
                Busca tu Dirección *
              </label>
              <Autocomplete
                onLoad={(ref) => (autocompleteRef.current = ref)}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="Calle, número..."
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                />
              </Autocomplete>
            </div>

            {/* NÚMERO / PORTAL (El que faltaba) */}
            <div className="mb-3">
              <label className="form-label text-white fw-bold small">
                Número / Portal *
              </label>
              <input
                type="text"
                className={inputClasses}
                value={formData.numero}
                onChange={(e) =>
                  setFormData({ ...formData, numero: e.target.value })
                }
                placeholder="Ej: 12, 3B o S/N"
                required
              />
            </div>
            {/*MUNICIPIO, CP y Provincia */}
            <div className="row mb-3 g-2">
              <div className="col-8">
                <label className="form-label text-white-50 small">
                  Municipio
                </label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="Municipio"
                  value={formData.municipio}
                  readOnly
                />
              </div>
              <div className="col-4">
                <label className="form-label text-white-50 small">C.P.</label>
                <input
                  type="text"
                  className={inputClasses}
                  placeholder="C.P."
                  value={formData.cp}
                  onChange={(e) =>
                    setFormData({ ...formData, cp: e.target.value })
                  }
                />
              </div>
              <div className="col-4">
                <label className="form-label text-white-50 small">
                  Provincia
                </label>
                <input
                  type="text"
                  className={inputClasses}
                  value={formData.provincia}
                  readOnly
                />
              </div>
            </div>

            {/* CONTACTO */}
            <div className="mb-3">
              <label className="form-label text-white fw-bold small">
                Correo electrónico
              </label>
              <input
                type="email"
                className={inputClasses}
                value={formData.correo}
                onChange={(e) =>
                  setFormData({ ...formData, correo: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-white fw-bold small">
                Crea una contraseña para gestionar tu negocio:
              </label>
              <input
                type="password"
                className={inputClasses} // Añade la variable de clase
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-white fw-bold small">
                Teléfono de contacto *
              </label>
              <input
                type="tel"
                className={inputClasses}
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                placeholder="Ej: 600000000"
                required
              />
            </div>

            {/* BOTONES FINALES */}
            <div className="d-grid gap-2 mt-4">
              <button
                type="submit"
                /* Se bloquea si está cargando O si el CIF es inválido O si el CP es inválido */
                disabled={
                  loading ||
                  !validarDocumentoCompleto(formData.cif_nif) ||
                  !validarCP(formData.cp)
                }
                className="btn btn-warning fw-bold py-3 text-uppercase shadow-sm w-100 mb-3"
                style={{
                  color: "#275656",
                  cursor:
                    loading ||
                    !validarDocumentoCompleto(formData.cif_nif) ||
                    !validarCP(formData.cp)
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    loading ||
                    !validarDocumentoCompleto(formData.cif_nif) ||
                    !validarCP(formData.cp)
                      ? 0.6
                      : 1,
                }}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Procesando...
                  </>
                ) : editId ? (
                  "Guardar Cambios"
                ) : (
                  "Finalizar Registro"
                )}
              </button>

              <div className="d-flex justify-content-between align-items-center">
                {/* BOTÓN ELIMINAR (Solo en modo edición) */}
                {editId && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm border-0"
                    onClick={eliminarNegocio}
                  >
                    <i className="bi bi-trash me-1"></i> Eliminar este negocio
                  </button>
                )}

                {/* BOTÓN CANCELAR */}
                <button
                  type="button"
                  className="btn btn-link text-white-50 text-decoration-none"
                  onClick={() => setVista("seleccion")}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
