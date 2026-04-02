"use client";

import React, { useState } from "react";
import { authService } from "../services/authService";
import { ENDPOINTS } from "../app/config";

const CATEGORIAS_SERVICIOS = {
  Educación: [
    "Clases de Idiomas",
    "Recuperación Escolar",
    "Oposiciones",
    "Música",
  ],
  Cuidados: [
    "Cuidado de niños",
    "Llevar/Recoger del cole",
    "Acompañamiento mayores",
  ],
  Hogar: ["Limpieza del hogar", "Plancha", "Cocina a domicilio"],
  Mascotas: ["Paseador de perros", "Cuidado de mascotas"],
  Reparaciones: [
    "Cerrajero",
    "Fontanería",
    "Electricidad",
    "Pequeñas reparaciones",
  ],
};

const RegistroServicio = () => {
  const [datos, setDatos] = useState({
    categoria: "",
    descripcion: "",
    precio_hora: "",
  });

  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [loading, setLoading] = useState(false);

  const inputClasses = "form-control bg-dark text-white border-secondary";
  const selectClasses = "form-select bg-dark text-white border-secondary";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement
    >,
  ) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ texto: "Enviando...", tipo: "info" });

    try {
      const response = await fetch(ENDPOINTS.SERVICIOS, {
        method: "POST",
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        setMensaje({
          texto: "¡Servicio publicado con éxito!",
          tipo: "success",
        });
        setDatos({ categoria: "", descripcion: "", precio_hora: "" });
      } else {
        const errorData = await response.json();
        setMensaje({
          texto:
            errorData.error ||
            "Error al publicar. Revisa que estés dado de alta como usuario.",
          tipo: "error",
        });
      }
    } catch (error) {
      setMensaje({
        texto: "Error de conexión con el servidor.",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-white fw-bold h3">Ofrecer nuevo servicio</h1>
      </div>

      <div className="mx-auto w-100" style={{ maxWidth: "450px" }}>
        <form
          onSubmit={handleSubmit}
          className="bg-dark p-4 rounded-4 shadow border border-secondary"
        >
          {mensaje.texto && (
            <div
              className={`alert ${mensaje.tipo === "success" ? "alert-success" : "alert-danger"} mb-4`}
            >
              {mensaje.texto}
            </div>
          )}

          {/* CATEGORÍA */}
          <div className="mb-3">
            <label className="form-label text-white fw-bold small">
              ¿QUÉ SERVICIO OFRECES?
            </label>
            <select
              name="categoria"
              value={datos.categoria}
              onChange={handleChange}
              required
              className={selectClasses}
            >
              <option value="">Selecciona una opción...</option>
              {Object.entries(CATEGORIAS_SERVICIOS).map(([grupo, opciones]) => (
                <optgroup label={grupo} key={grupo} className="bg-secondary">
                  {opciones.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="mb-3">
            <label className="form-label text-white fw-bold small">
              DESCRIPCIÓN DETALLADA
            </label>
            <textarea
              name="descripcion"
              value={datos.descripcion}
              onChange={handleChange}
              placeholder="Ej: Clases de inglés para B2..."
              required
              className={inputClasses}
              style={{ height: "120px" }}
            />
          </div>

          {/* PRECIO */}
          <div className="mb-4">
            <label className="form-label text-white fw-bold small">
              PRECIO POR HORA (€)
            </label>
            <input
              type="number"
              name="precio_hora"
              value={datos.precio_hora}
              onChange={handleChange}
              placeholder="0.00"
              required
              className={inputClasses}
            />
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-warning fw-bold py-3 text-uppercase shadow-sm w-100"
            style={{ color: "#275656" }}
          >
            {loading ? "Publicando..." : "Publicar mi servicio"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroServicio;
