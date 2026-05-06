"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

type ProductoPedido = {
  id_producto: number | null;
  producto: string;
  cantidad: number;
  precio_unitario: string | number;
  subtotal: string | number;
};

type PedidoComercio = {
  id_pedido: number;
  fecha: string | null;
  cliente: {
    id_usuario: number | null;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    municipio: string;
    cp: string;
  };
  importe_total: string | number;
  metodo_pago: string;
  metodo_entrega: string;
  estado: string;
  productos: ProductoPedido[];
};

type SeccionActiva = "pedidos" | "productos";

const EMPTY_FORM: ProductoForm = {
  producto: "",
  tipo_producto: "",
  stock: "",
  precio: "",
};

const PEDIDOS_COMERCIO_ENDPOINT = ENDPOINTS.PRODUCTOS.replace(
  /productos\/?$/,
  "comercio/mis-pedidos/"
);

function getStoredToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("access") ||
    localStorage.getItem("token")
  );
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window === "undefined") return headers;

  const jwtToken =
    localStorage.getItem("access_token") || localStorage.getItem("access");

  if (jwtToken) {
    headers.Authorization = `Bearer ${jwtToken}`;
    return headers;
  }

  const knoxToken = localStorage.getItem("token");

  if (knoxToken) {
    headers.Authorization = `Token ${knoxToken}`;
  }

  return headers;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Se ha producido un error";
}

function formatDate(fecha: string | null) {
  if (!fecha) return "Fecha no disponible";
  return new Date(fecha).toLocaleString("es-ES");
}

function estadoClass(estado: string) {
  const estadoNormalizado = (estado || "").toLowerCase();

  if (
    estadoNormalizado.includes("pendiente") ||
    estadoNormalizado.includes("prepar")
  ) {
    return "badge-warn";
  }

  return "badge-ok";
}

export default function PanelComercioPage() {
  const [token, setToken] = useState<string | null>(null);
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<PedidoComercio[]>([]);
  const [form, setForm] = useState<ProductoForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [seccionActiva, setSeccionActiva] = useState<SeccionActiva>("pedidos");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const resumen = useMemo(() => {
    const totalProductos = productos.length;
    const stockTotal = productos.reduce(
      (acc, item) => acc + Number(item.stock || 0),
      0
    );
    const valorInventario = productos.reduce(
      (acc, item) => acc + Number(item.stock || 0) * Number(item.precio || 0),
      0
    );
    const sinStock = productos.filter((item) => Number(item.stock || 0) <= 0).length;
    const totalPedidos = pedidos.length;
    const ventaTotal = pedidos.reduce(
      (acc, pedido) => acc + Number(pedido.importe_total || 0),
      0
    );
    const pedidosPendientes = pedidos.filter((pedido) =>
      ["pendiente", "confirmado", "en preparación", "preparando"].includes(
        (pedido.estado || "").toLowerCase()
      )
    ).length;

    return {
      totalProductos,
      stockTotal,
      valorInventario,
      sinStock,
      totalPedidos,
      ventaTotal,
      pedidosPendientes,
    };
  }, [productos, pedidos]);

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

      const pedidosResponse = await fetch(PEDIDOS_COMERCIO_ENDPOINT, {
        headers: authHeaders(),
      });

      if (!pedidosResponse.ok) {
        const data = await pedidosResponse.json().catch(() => null);
        throw new Error(
          data?.detail ||
            data?.error ||
            "No se pudieron cargar los pedidos del comercio."
        );
      }

      const pedidosData = (await pedidosResponse.json()) as PedidoComercio[];
      setPedidos(Array.isArray(pedidosData) ? pedidosData : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setComercio(null);
      setProductos([]);
      setPedidos([]);
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
      stock:
        producto.stock === null || producto.stock === undefined
          ? ""
          : String(producto.stock),
      precio: String(producto.precio),
    });
    setSeccionActiva("productos");
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

      const url = editingId
        ? `${ENDPOINTS.PRODUCTOS}${editingId}/`
        : ENDPOINTS.PRODUCTOS;
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

      const successMessage = editingId
        ? "Producto actualizado correctamente."
        : "Producto añadido correctamente.";
      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadPanel();
      setSeccionActiva("productos");
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
      setSeccionActiva("productos");
      setMessage("Producto eliminado correctamente.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <main className="tienda-page">
        <div className="tienda-container">
          <div className="tienda-head">
            <div>
              <p className="section-tag">Área privada</p>
              <h1 className="tienda-title">Panel de comercio</h1>
              <p className="tienda-muted">
                Gestión separada por secciones: pedidos recibidos y productos.
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
                    <p className="kpi-label">Pedidos</p>
                    <p className="kpi-value">{resumen.totalPedidos}</p>
                    <p className="kpi-meta">Pedidos recibidos</p>
                  </article>

                  <article className="kpi-card">
                    <p className="kpi-label">Ventas</p>
                    <p className="kpi-value">{formatEUR(resumen.ventaTotal)}</p>
                    <p className="kpi-meta">Importe acumulado</p>
                  </article>

                  <article className="kpi-card">
                    <p className="kpi-label">Por preparar</p>
                    <p className="kpi-value">{resumen.pedidosPendientes}</p>
                    <p className="kpi-meta">Pendientes o confirmados</p>
                  </article>

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
                    <p className="kpi-meta">Panel privado</p>
                  </article>
                </div>
              </section>

              <section className="section-card">
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <h2 className="section-title">Gestión del comercio</h2>
                    <p className="tienda-muted" style={{ marginTop: 6 }}>
                      Cambia de sección para no mezclar pedidos con productos.
                    </p>
                  </div>

                  <div className="c4u-actions-row" style={{ marginTop: 0 }}>
                    <button
                      type="button"
                      className={seccionActiva === "pedidos" ? "btn-close4u" : "btn-soft"}
                      onClick={() => setSeccionActiva("pedidos")}
                    >
                      Pedidos recibidos
                    </button>

                    <button
                      type="button"
                      className={seccionActiva === "productos" ? "btn-close4u" : "btn-soft"}
                      onClick={() => setSeccionActiva("productos")}
                    >
                      Productos
                    </button>

                    <button className="btn-soft" type="button" onClick={loadPanel} disabled={saving}>
                      Actualizar
                    </button>
                  </div>
                </div>
              </section>

              {seccionActiva === "pedidos" && (
                <section className="section-card">
                  <div className="tienda-head">
                    <div>
                      <h2 className="section-title">Pedidos recibidos</h2>
                      <p className="tienda-muted">
                        Cada pedido aparece cerrado. Pulsa en “Ver detalle” para desplegar productos, cliente y entrega.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
                    {pedidos.length === 0 ? (
                      <article className="est-card">
                        <p className="prod-title">No hay pedidos todavía.</p>
                        <p className="prod-meta">
                          Cuando un cliente compre productos de este comercio, aparecerán aquí.
                        </p>
                      </article>
                    ) : (
                      pedidos.map((pedido) => (
                        <details
                          key={pedido.id_pedido}
                          className="prod-card"
                          style={{ padding: 0, overflow: "hidden" }}
                        >
                          <summary
                            style={{
                              cursor: "pointer",
                              listStyle: "none",
                              padding: 18,
                            }}
                          >
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr auto",
                                gap: 12,
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <p className="prod-title" style={{ margin: 0 }}>
                                  Pedido #{pedido.id_pedido}
                                </p>
                                <p className="prod-meta" style={{ marginTop: 4 }}>
                                  {formatDate(pedido.fecha)}
                                </p>
                                <p className="prod-meta" style={{ marginTop: 4 }}>
                                  Cliente: {pedido.cliente?.nombre || "Cliente no disponible"}
                                </p>
                              </div>

                              <div style={{ textAlign: "right" }}>
                                <span className={`badge-status ${estadoClass(pedido.estado)}`}>
                                  {pedido.estado || "pendiente"}
                                </span>
                                <p className="prod-price" style={{ marginTop: 8 }}>
                                  {formatEUR(Number(pedido.importe_total || 0))}
                                </p>
                                <p className="tienda-link" style={{ marginTop: 6 }}>
                                  Ver detalle
                                </p>
                              </div>
                            </div>
                          </summary>

                          <div
                            style={{
                              borderTop: "1px solid rgba(15, 23, 42, 0.08)",
                              padding: 18,
                              display: "grid",
                              gap: 16,
                            }}
                          >
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: 12,
                              }}
                            >
                              <article className="est-card">
                                <p className="prod-title">Cliente</p>
                                <p className="prod-meta">
                                  {pedido.cliente?.nombre || "Cliente no disponible"}
                                </p>
                                {pedido.cliente?.email && (
                                  <p className="prod-meta">Email: {pedido.cliente.email}</p>
                                )}
                                {pedido.cliente?.telefono && (
                                  <p className="prod-meta">Teléfono: {pedido.cliente.telefono}</p>
                                )}
                              </article>

                              <article className="est-card">
                                <p className="prod-title">Entrega y pago</p>
                                <p className="prod-meta">
                                  Pago: {pedido.metodo_pago || "No indicado"}
                                </p>
                                <p className="prod-meta">
                                  Entrega: {pedido.metodo_entrega || "No indicada"}
                                </p>
                                {(pedido.cliente?.direccion ||
                                  pedido.cliente?.municipio ||
                                  pedido.cliente?.cp) && (
                                  <p className="prod-meta">
                                    Dirección:{" "}
                                    {[
                                      pedido.cliente.direccion,
                                      pedido.cliente.municipio,
                                      pedido.cliente.cp,
                                    ]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </p>
                                )}
                              </article>
                            </div>

                            <div>
                              <p className="prod-title" style={{ marginBottom: 10 }}>
                                Productos del pedido
                              </p>

                              <div style={{ display: "grid", gap: 8 }}>
                                {pedido.productos.map((producto, index) => (
                                  <article
                                    key={`${pedido.id_pedido}-${producto.id_producto ?? index}`}
                                    className="est-card"
                                    style={{
                                      padding: 12,
                                      display: "grid",
                                      gridTemplateColumns: "1fr auto",
                                      gap: 10,
                                      alignItems: "center",
                                    }}
                                  >
                                    <div>
                                      <p className="prod-title" style={{ fontSize: 15 }}>
                                        {producto.producto}
                                      </p>
                                      <p className="prod-meta">
                                        Cantidad: {producto.cantidad} · Precio:{" "}
                                        {formatEUR(Number(producto.precio_unitario || 0))}
                                      </p>
                                    </div>

                                    <p className="prod-price">
                                      {formatEUR(Number(producto.subtotal || 0))}
                                    </p>
                                  </article>
                                ))}
                              </div>
                            </div>

                            <p className="prod-price" style={{ textAlign: "right" }}>
                              Total: {formatEUR(Number(pedido.importe_total || 0))}
                            </p>
                          </div>
                        </details>
                      ))
                    )}
                  </div>
                </section>
              )}

              {seccionActiva === "productos" && (
                <>
                  <section className="section-card">
                    <h2 className="section-title">
                      {editingId ? "Editar producto" : "Añadir producto"}
                    </h2>
                    <p className="tienda-muted" style={{ marginTop: 6 }}>
                      El formulario queda separado de los pedidos para evitar confusión.
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
                        <button
                          className="btn-close4u"
                          type="submit"
                          disabled={!token || !comercio || saving}
                        >
                          {saving
                            ? "Guardando..."
                            : editingId
                              ? "Guardar cambios"
                              : "Añadir producto"}
                        </button>

                        {editingId && (
                          <button
                            className="btn-soft"
                            type="button"
                            onClick={cancelEdit}
                            disabled={saving}
                          >
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
                        <p className="tienda-muted">
                          Listado editable de productos del comercio.
                        </p>
                      </div>

                      <button className="btn-soft" type="button" onClick={loadPanel} disabled={saving}>
                        Actualizar productos
                      </button>
                    </div>

                    <div className="prod-grid" style={{ marginTop: 14 }}>
                      {productos.length === 0 ? (
                        <article className="est-card">
                          <p className="prod-title">No hay productos todavía.</p>
                          <p className="prod-meta">
                            Añade el primer producto desde el formulario superior.
                          </p>
                        </article>
                      ) : (
                        productos.map((producto) => {
                          const sinStock = Number(producto.stock || 0) <= 0;

                          return (
                            <article key={producto.id_producto} className="prod-card">
                              <p className="prod-title">{producto.producto}</p>
                              <p className="prod-meta">
                                {producto.tipo_producto || "Producto local"}
                              </p>
                              <p className="prod-price">
                                {formatEUR(Number(producto.precio))}
                              </p>
                              <p className="prod-meta">Stock: {producto.stock ?? "Consultar"}</p>
                              <span className={`badge-status ${sinStock ? "badge-warn" : "badge-ok"}`}>
                                {sinStock ? "Revisar stock" : "Publicado"}
                              </span>

                              <div className="c4u-actions-row">
                                <button
                                  className="btn-soft"
                                  type="button"
                                  onClick={() => startEdit(producto)}
                                  disabled={saving}
                                >
                                  Editar
                                </button>

                                <button
                                  className="btn-soft"
                                  type="button"
                                  onClick={() => handleDelete(producto.id_producto)}
                                  disabled={saving}
                                >
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}
