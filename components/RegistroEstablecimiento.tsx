"use client";

import { useState, useRef } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { ENDPOINTS } from "../app/config";

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

  const [loading, setLoading] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [formData, setFormData] = useState({
    nombre_comercio: "",
    cif_nif: "",
    tipo_negocio: "comercio",
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

  const inputClasses = "form-control bg-dark text-white border-secondary";
  const selectClasses = "form-select bg-dark text-white border-secondary";

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

    const datosAEnviar = {
      ...formData,
      categoria:
        formData.categoria === "Otros..."
          ? formData.categoria_libre
          : formData.categoria,
      subcategoria:
        formData.subcategoria === "Otros..."
          ? formData.subcategoria_libre
          : formData.subcategoria,
    };

    try {
      const response = await fetch(`${ENDPOINTS.ESTABLECIMIENTOS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAEnviar),
      });

      if (response.ok) alert("¡Establecimiento registrado!");
      else alert("Error en el servidor.");
    } catch (error) {
      alert("Error de conexión.");
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
      <div className="text-center mb-5">
        {/* He reducido el tamaño del logo para que no ocupe tanto espacio */}
        <div
          className="bg-white d-inline-block rounded-circle p-3 mb-3"
          style={{ width: "80px", height: "80px" }}
        >
          <img src="/tu-icono.png" alt="logo" style={{ width: "100%" }} />
        </div>
        <h1 className="text-white fw-bold h2">Registra tu Negocio</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto bg-dark p-4 rounded-4 shadow"
        style={{ maxWidth: "420px", border: "1px solid #385c5c" }} // <-- Más estrecho y con fondo para estilizar
      >
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
        <div className="mb-3">
          <label className="form-label text-white fw-bold small">
            CIF / NIF *
          </label>
          <input
            type="text"
            className={inputClasses}
            value={formData.cif_nif}
            onChange={(e) =>
              setFormData({
                ...formData,
                cif_nif: e.target.value.toUpperCase(),
              })
            }
            placeholder="Ej: B12345678"
            required
          />
        </div>

        {/* TIPO DE NEGOCIO (Nuevo campo) */}
        <div className="mb-3">
          <label className="form-label text-white fw-bold small">
            Tipo de Negocio
          </label>
          <div className="d-flex gap-2">
            <button
              type="button"
              className={`btn btn-sm w-50 ${formData.tipo_negocio === "comercio" ? "btn-warning" : "btn-outline-secondary text-white"}`}
              onClick={() =>
                setFormData({ ...formData, tipo_negocio: "Comercio" })
              }
            >
              Comercio
            </button>
            <button
              type="button"
              className={`btn btn-sm w-50 ${formData.tipo_negocio === "Productor Local" ? "btn-warning" : "btn-outline-secondary text-white"}`}
              onClick={() =>
                setFormData({ ...formData, tipo_negocio: "Productor Local" })
              }
            >
              Productor Local
            </button>
          </div>
        </div>

        <hr className="text-secondary my-4" />

        {/* 1. BLOQUE */}
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

        {/* 2. CATEGORÍA */}
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

        {/* 3. SUBCATEGORÍA */}
        {formData.categoria &&
          Array.isArray(
            (ESTRUCTURA[formData.grupo as keyof typeof ESTRUCTURA] as any)?.[
              formData.categoria
            ],
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
                {(ESTRUCTURA[formData.grupo as keyof typeof ESTRUCTURA] as any)[
                  formData.categoria
                ].map((s: string) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

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
        {/* NÚMERO DE LA CALLE */}
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
        <div className="row mb-3 g-2">
          <div className="col-8">
            <input
              type="text"
              className={inputClasses}
              placeholder="Municipio"
              value={formData.municipio}
              readOnly
            />
          </div>
          <div className="col-4">
            <input
              type="text"
              className={inputClasses}
              placeholder="C.P."
              value={formData.cp}
              readOnly
            />
          </div>
        </div>
        {/* Campo Código Postal */}
        <div className="mb-4">
          {" "}
          <label className="form-label text-white fw-bold small">
            Código Postal *
          </label>
          <input
            type="text"
            placeholder="Ej: 28001"
            className={inputClasses}
            value={formData.cp || ""}
            onChange={(e) => setFormData({ ...formData, cp: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
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
        <div className="mb-4">
          <label className="form-label text-white fw-bold small">
            Página Web (opcional)
          </label>
          <input
            type="url"
            className={inputClasses}
            placeholder="https://tuweb.com"
            value={formData.url_web}
            onChange={(e) =>
              setFormData({ ...formData, url_web: e.target.value })
            }
          />
        </div>
        {/* TELÉFONO */}
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

        <button
          type="submit"
          disabled={loading}
          className="btn btn-warning w-100 fw-bold py-3 text-uppercase shadow-sm"
          style={{ color: "#275656" }}
        >
          {loading ? "Registrando..." : "Finalizar Registro"}
        </button>
      </form>
    </div>
  );
}
