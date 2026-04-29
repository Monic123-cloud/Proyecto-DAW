"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import { ENDPOINTS } from "@/app/config";
import { formatEUR } from "@/components/cart/CartContext";

type Comercio = {
  id_establecimiento: number;
  nombre_comercio?: string;
  direccion?: string;
  municipio?: string;
  provincia?: string;
  cp?: string;
  telefono?: string;
  correo?: string;
};

type Producto = {
  id_producto: number;
  id_establecimiento?: number;
  comercio_nombre?: string;
  tipo_producto?: string;
  producto: string;
  stock?: number | null;
  precio: string | number;
};

type ProductoForm = {
  producto: string;
  tipo_producto: string;
  stock: string;
  precio: string;
};

const EMPTY_FORM: ProductoForm = {
  producto: "",
  tipo_producto: "",
  stock: "",
  precio: "",
};

function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token") || localStorage.getItem("token");
}

function getAuthorizationHeader() {
  if (typeof window === "undefined") return {};

  const jwtToken = localStorage.getItem("access_token");
  if (jwtToken) return { Authorization: `Bearer ${jwtToken}` };

  const knoxToken = localStorage.getItem("token");
  if (knoxToken) return { Authorization: `Token ${knoxToken}` };

  return {};
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    ...getAuthorizationHeader(),
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Se ha producido un error";
}

export default function PanelComercioPage() {
  const [token, setToken] = useState<string | null>(null);
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [form, setForm] = useState<ProductoForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const resumen = useMemo(() => {
    const totalProductos = productos.length;
    const stockTotal = productos.reduce((acc, item) => acc + Number(item.stock || 0), 0);
    const valorInventario = productos.reduce(
      (acc, item) => acc + Number(item.stock || 0) * Number(item.precio || 0),
      0
    );
    const sinStock = productos.filter((item) => Number(item.stock || 0) <= 0).length;

    return { totalProductos, stockTotal, valorInventario, sinStock };
  }, [productos]);

  async function loadPanel() {
    setLoading(true);
    setError("");
    setMessage("");

    const storedToken = getStoredToken();
    setToken(storedToken);

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const comercioResponse = await fetch(ENDPOINTS.MI_LOCAL, {
        headers: authHeaders(),
      });

      if (!comercioResponse.ok) {
        throw new Error("No se ha encontrado un comercio asociado a este usuario.");
      }

      const comercioData = (await comercioResponse.json()) as Comercio;
      setComercio(comercioData);

      const productosResponse = await fetch(
        `${ENDPOINTS.PRODUCTOS}?establecimiento=${comercioData.id_establecimiento}`
      );

      if (!productosResponse.ok) {
        throw new Error("No se pudieron cargar los productos del comercio.");
      }

      const productosData = (await productosResponse.json()) as Producto[];
      setProductos(Array.isArray(productosData) ? productosData : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setComercio(null);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPanel();
  }, []);

  function handleChange(field: keyof ProductoForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEdit(producto: Producto) {
    setEditingId(producto.id_producto);
    setForm({
      producto: producto.producto,
      tipo_producto: producto.tipo_producto || "",
      stock: producto.stock === null || producto.stock === undefined ? "" : String(producto.stock),
      precio: String(producto.precio),
    });
    setMessage("");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMessage("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (!token) throw new Error("Debes iniciar sesión para gestionar productos.");
      if (!form.producto.trim()) throw new Error("El nombre del producto es obligatorio.");
      if (!form.precio.trim()) throw new Error("El precio es obligatorio.");

      const payload = {
        producto: form.producto.trim(),
        tipo_producto: form.tipo_producto.trim(),
        stock: form.stock.trim() ? Number(form.stock) : null,
        precio: Number(form.precio),
      };

      const url = editingId ? `${ENDPOINTS.PRODUCTOS}${editingId}/` : ENDPOINTS.PRODUCTOS;
      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.detail || data?.error || "No se pudo guardar el producto.");
      }

      const successMessage = editingId ? "Producto actualizado correctamente." : "Producto añadido correctamente.";
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadPanel();
      setMessage(successMessage);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (!token) throw new Error("Debes iniciar sesión para eliminar productos.");

      const response = await fetch(`${ENDPOINTS.PRODUCTOS}${id}/`, {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!response.ok) throw new Error("No se pudo eliminar el producto.");

      if (editingId === id) cancelEdit();
      await loadPanel();
      setMessage("Producto eliminado correctamente.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <Header />

      <main className="tienda-page">
        <div className="tienda-container">
          <div className="tienda-head">
            <div>
              <p className="section-tag">Área privada</p>
              <h1 className="tienda-title">Panel de comercio</h1>
              <p className="tienda-muted">
                Gestión básica de tienda, productos, stock e inventario.
              </p>
            </div>

            <Link href="/productos" className="tienda-link">
              Ver tienda pública →
            </Link>
          </div>

          {!token && (
            <section className="section-card">
              <h2 className="section-title">Sesión no iniciada</h2>
              <p className="tienda-muted" style={{ marginTop: 8 }}>
                Para gestionar productos, el comercio debe iniciar sesión con una cuenta asociada a establecimiento.
              </p>
              <div className="c4u-actions-row">
                <Link href="/acceso/login" className="btn-close4u">
                  Iniciar sesión
                </Link>
                <Link href="/registroM" className="tienda-link">
                  Registrar comercio
                </Link>
              </div>
            </section>
          )}

          {loading ? (
            <section className="section-card">Cargando panel de comercio...</section>
          ) : (
            <>
              {error && <p className="notice-err">{error}</p>}
              {message && <p className="notice-ok">{message}</p>}

              <section className="section-card">
                <div className="tienda-head">
                  <div>
                    <h2 className="section-title">
                      {comercio?.nombre_comercio || "Comercio no asociado"}
                    </h2>
                    <p className="tienda-muted">
                      {comercio
                        ? `${comercio.direccion || "Dirección no indicada"}${comercio.municipio ? ` · ${comercio.municipio}` : ""}${comercio.cp ? ` · CP ${comercio.cp}` : ""}`
                        : "Cuando el usuario tenga comercio validado, aquí aparecerán sus datos."}
                    </p>
                  </div>

                  <Link href="/registroServicio" className="tienda-link">
                    Añadir servicio
                  </Link>
                </div>

                <div className="kpi-grid" style={{ marginTop: 14 }}>
                  <article className="kpi-card">
                    <p className="kpi-label">Productos</p>
                    <p className="kpi-value">{resumen.totalProductos}</p>
                    <p className="kpi-meta">Publicados en tienda</p>
                  </article>

                  <article className="kpi-card">
                    <p className="kpi-label">Stock total</p>
                    <p className="kpi-value">{resumen.stockTotal}</p>
                    <p className="kpi-meta">Unidades disponibles</p>
                  </article>

                  <article className="kpi-card">
                    <p className="kpi-label">Inventario</p>
                    <p className="kpi-value">{formatEUR(resumen.valorInventario)}</p>
                    <p className="kpi-meta">Stock x precio</p>
                  </article>

                  <article className="kpi-card">
                    <p className="kpi-label">Sin stock</p>
                    <p className="kpi-value">{resumen.sinStock}</p>
                    <p className="kpi-meta">Revisar reposición</p>
                  </article>

                  <article className="kpi-card">
                    <p className="kpi-label">Rol</p>
                    <p className="kpi-value">Comercio</p>
                    <p className="kpi-meta">A validar por email</p>
                  </article>
                </div>
              </section>

              <section className="section-card">
                <h2 className="section-title">
                  {editingId ? "Editar producto" : "Añadir producto"}
                </h2>
                <p className="tienda-muted" style={{ marginTop: 6 }}>
                  Formulario conectado al endpoint de productos. El backend asociará el producto al comercio logueado.
                </p>

                <form className="c4u-form" onSubmit={handleSubmit}>
                  <div className="c4u-grid">
                    <label className="c4u-field">
                      <span className="c4u-label">Nombre del producto</span>
                      <input
                        className="c4u-input"
                        value={form.producto}
                        onChange={(e) => handleChange("producto", e.target.value)}
                        placeholder="Ej: Pan artesano"
                        disabled={!token || !comercio || saving}
                      />
                    </label>

                    <label className="c4u-field">
                      <span className="c4u-label">Tipo</span>
                      <input
                        className="c4u-input"
                        value={form.tipo_producto}
                        onChange={(e) => handleChange("tipo_producto", e.target.value)}
                        placeholder="Ej: Alimentación"
                        disabled={!token || !comercio || saving}
                      />
                    </label>

                    <label className="c4u-field">
                      <span className="c4u-label">Stock</span>
                      <input
                        className="c4u-input"
                        type="number"
                        min={0}
                        value={form.stock}
                        onChange={(e) => handleChange("stock", e.target.value)}
                        placeholder="Ej: 20"
                        disabled={!token || !comercio || saving}
                      />
                    </label>

                    <label className="c4u-field">
                      <span className="c4u-label">Precio</span>
                      <input
                        className="c4u-input"
                        type="number"
                        min={0}
                        step="0.01"
                        value={form.precio}
                        onChange={(e) => handleChange("precio", e.target.value)}
                        placeholder="Ej: 3.50"
                        disabled={!token || !comercio || saving}
                      />
                    </label>
                  </div>

                  <div className="c4u-actions-row">
                    <button className="btn-close4u" type="submit" disabled={!token || !comercio || saving}>
                      {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Añadir producto"}
                    </button>

                    {editingId && (
                      <button className="btn-soft" type="button" onClick={cancelEdit} disabled={saving}>
                        Cancelar edición
                      </button>
                    )}
                  </div>
                </form>
              </section>

              <section className="section-card">
                <div className="tienda-head">
                  <div>
                    <h2 className="section-title">Mis productos</h2>
                    <p className="tienda-muted">Listado editable de productos del comercio.</p>
                  </div>
                  <button className="btn-soft" type="button" onClick={loadPanel} disabled={saving}>
                    Actualizar
                  </button>
                </div>

                <div className="prod-grid" style={{ marginTop: 14 }}>
                  {productos.length === 0 ? (
                    <article className="est-card">
                      <p className="prod-title">No hay productos todavía.</p>
                      <p className="prod-meta">Añade el primer producto desde el formulario superior.</p>
                    </article>
                  ) : (
                    productos.map((producto) => {
                      const sinStock = Number(producto.stock || 0) <= 0;

                      return (
                        <article key={producto.id_producto} className="prod-card">
                          <p className="prod-title">{producto.producto}</p>
                          <p className="prod-meta">{producto.tipo_producto || "Producto local"}</p>
                          <p className="prod-price">{formatEUR(Number(producto.precio))}</p>
                          <p className="prod-meta">Stock: {producto.stock ?? "Consultar"}</p>
                          <span className={`badge-status ${sinStock ? "badge-warn" : "badge-ok"}`}>
                            {sinStock ? "Revisar stock" : "Publicado"}
                          </span>

                          <div className="c4u-actions-row">
                            <button className="btn-soft" type="button" onClick={() => startEdit(producto)} disabled={saving}>
                              Editar
                            </button>
                            <button className="btn-soft" type="button" onClick={() => handleDelete(producto.id_producto)} disabled={saving}>
                              Eliminar
                            </button>
                            <Link href={`/producto/${producto.id_producto}`} className="tienda-link">
                              Ver
                            </Link>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
