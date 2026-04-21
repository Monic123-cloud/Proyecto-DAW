"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

type Establecimiento = {
  id_establecimiento: number;
  nombre_comercio: string;
  cif_nif?: string | null;
  tipo_negocio?: string | null;
  grupo?: string | null;
  categoria?: string | null;
  subcategoria?: string | null;
  telefono?: string | null;
  correo?: string | null;
  direccion?: string | null;
  numero?: string | null;
  municipio?: string | null;
  provincia?: string | null;
  cp?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  url_web?: string | null;
  usuario_id?: number | null;
};

type Producto = {
  id_producto: number;
  tipo_producto: string;
  producto: string;
  stock: number;
  precio: number;
  id_establecimiento: number;
};

type Pedido = {
  id_pedido: number;
  importe_total: number;
  fecha: string;
  metodo_pago: string;
  descuento: number;
  metodo_entrega: string;
  estado: string;
  id_establecimiento: number;
  id_usuario: number;
};

type PedidoLinea = {
  id_detalle: number;
  id_producto: number;
  producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
};

type PedidoDetalleResp =
  | { ok: true; pedido: Pedido; lineas: PedidoLinea[] }
  | { ok: false; error: string };

type Tab = "resumen" | "productos" | "pedidos" | "ajustes";

export default function ComercioDashboardPage() {
  // UI
  const [tab, setTab] = useState<Tab>("resumen");

  // auth
  const [token, setToken] = useState<string | null>(null);

  // data
  const [est, setEst] = useState<Establecimiento | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  // page state
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // detalle pedidos (desplegable)
  const [openPedidoId, setOpenPedidoId] = useState<number | null>(null);
  const [detalleByPedido, setDetalleByPedido] = useState<Record<number, PedidoLinea[]>>({});
  const [detalleLoading, setDetalleLoading] = useState<Record<number, boolean>>({});
  const [detalleErr, setDetalleErr] = useState<Record<number, string | null>>({});

  // headers (si hay token)
  const headers = useMemo(() => {
    return token
      ? { Authorization: `Token ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  }, [token]);

  // --- helpers auth ---
  const logout = () => {
    localStorage.removeItem("knox_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
    window.location.href = "/acceso/login";
  };

  // --- load main dashboard ---
  const loadAll = async () => {
    if (!token) return;

    setLoading(true);
    setErr(null);

    try {
      const [rMe, rProds, rPeds] = await Promise.all([
        fetch(`${API_BASE}/api/comercio/me/`, { headers }),
        fetch(`${API_BASE}/api/comercio/me/productos/`, { headers }),
        fetch(`${API_BASE}/api/comercio/me/pedidos/`, { headers }),
      ]);

      if (!rMe.ok) throw new Error(`No autorizado / error cargando comercio (${rMe.status})`);
      if (!rProds.ok) throw new Error(`Error cargando productos (${rProds.status})`);
      if (!rPeds.ok) throw new Error(`Error cargando pedidos (${rPeds.status})`);

      const dMe = await rMe.json();
      const dProds = await rProds.json();
      const dPeds = await rPeds.json();

      setEst(dMe.establecimiento ?? null);
      setProductos(dProds.items ?? []);
      setPedidos(dPeds.items ?? []);

      // si cambian pedidos, cierro detalle abierto (evita confusión)
      setOpenPedidoId(null);
    } catch (e: any) {
      setErr(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  // --- load detalle pedido (comercio) ---
  const loadDetalle = async (id_pedido: number) => {
    if (!token) return;

    // si ya lo tengo, no repito
    if (detalleByPedido[id_pedido]) return;

    setDetalleLoading((p) => ({ ...p, [id_pedido]: true }));
    setDetalleErr((p) => ({ ...p, [id_pedido]: null }));

    try {
      const res = await fetch(
        `${API_BASE}/api/comercio/me/pedidos/${id_pedido}/detalle/`,
        { headers }
      );

      const raw = await res.text();
      let data: PedidoDetalleResp | null = null;

      try {
        data = raw ? (JSON.parse(raw) as PedidoDetalleResp) : null;
      } catch {
        throw new Error(`La API no devolvió JSON (HTTP ${res.status}).`);
      }

      if (!res.ok || !data || !("ok" in data) || !data.ok) {
        throw new Error((data as any)?.error ?? `HTTP ${res.status}`);
      }

      setDetalleByPedido((p) => ({ ...p, [id_pedido]: data!.lineas }));
    } catch (e: any) {
      setDetalleErr((p) => ({ ...p, [id_pedido]: e?.message ?? "Error cargando detalle" }));
    } finally {
      setDetalleLoading((p) => ({ ...p, [id_pedido]: false }));
    }
  };

  // --- init token & first load ---
  useEffect(() => {
    const t = localStorage.getItem("knox_token");
    if (!t) {
      window.location.href = "/acceso/login";
      return;
    }
    setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // --- KPIs ---
  const kpis = useMemo(() => {
    const totalPedidos = pedidos.length;
    const ingresos = pedidos.reduce((acc, p) => acc + Number(p.importe_total || 0), 0);
    const ticketMedio = totalPedidos > 0 ? ingresos / totalPedidos : 0;

    const sinStock = productos.filter((p) => Number(p.stock) <= 0).length;
    const stockBajo = productos.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 5).length;

    return { totalPedidos, ingresos, ticketMedio, sinStock, stockBajo };
  }, [pedidos, productos]);

  return (
    <div className="page">
      <main className="tienda-page">
        <div className="tienda-container">
          {/* Top bar */}
          <div
            className="est-card"
            style={{
              padding: "16px 16px",
              display: "flex",
              gap: 14,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                <h1 className="tienda-title" style={{ margin: 0 }}>
                  Mi Establecimiento
                </h1>
                <span className="tienda-muted">Panel de comercio</span>
              </div>

              <div className="tienda-muted" style={{ marginTop: 6 }}>
                {est ? (
                  <>
                    <strong style={{ color: "#0f172a" }}>{est.nombre_comercio}</strong>
                    {est.categoria ? ` · ${est.categoria}` : ""}
                    {est.subcategoria ? ` · ${est.subcategoria}` : ""}
                    {est.municipio ? ` · ${est.municipio}` : ""}
                  </>
                ) : (
                  "Cargando tu comercio…"
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={loadAll} disabled={loading || !token}>
                ↻ Actualizar
              </button>
              <Link className="btn btn-secondary" href="/tienda">
                Ver tienda
              </Link>
              <Link className="btn btn-primary" href="/tienda/alta-producto">
                + Nuevo producto
              </Link>
              <button className="btn btn-secondary" onClick={logout}>
                Salir
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="tienda-chips" style={{ marginTop: 14 }}>
            <button
              className={`tienda-chip ${tab === "resumen" ? "is-active" : ""}`}
              onClick={() => setTab("resumen")}
            >
              Resumen
            </button>
            <button
              className={`tienda-chip ${tab === "productos" ? "is-active" : ""}`}
              onClick={() => setTab("productos")}
            >
              Productos
            </button>
            <button
              className={`tienda-chip ${tab === "pedidos" ? "is-active" : ""}`}
              onClick={() => setTab("pedidos")}
            >
              Pedidos
            </button>
            <button
              className={`tienda-chip ${tab === "ajustes" ? "is-active" : ""}`}
              onClick={() => setTab("ajustes")}
            >
              Ajustes
            </button>
          </div>

          {loading && (
            <p className="tienda-muted" style={{ marginTop: 14 }}>
              Cargando panel…
            </p>
          )}

          {err && (
            <div className="est-card" style={{ marginTop: 14 }}>
              <p className="notice-err" style={{ margin: 0 }}>
                {err}
              </p>
              <p className="tienda-muted" style={{ marginTop: 10 }}>
                Si ves 401/403: token ausente o inválido. Vuelve a iniciar sesión.
              </p>
            </div>
          )}

          {!loading && !err && (
            <>
              {/* ===== RESUMEN ===== */}
              {tab === "resumen" && (
                <>
                  <div className="section-card">
                    <div className="kpi-grid">
                      <div className="kpi-card">
                        <p className="kpi-label">Ingresos</p>
                        <p className="kpi-value">{kpis.ingresos.toFixed(2)} €</p>
                        <p className="kpi-meta">Total facturado (importe_total)</p>
                      </div>

                      <div className="kpi-card">
                        <p className="kpi-label">Pedidos</p>
                        <p className="kpi-value">{kpis.totalPedidos}</p>
                        <p className="kpi-meta">Pedidos recibidos</p>
                      </div>

                      <div className="kpi-card">
                        <p className="kpi-label">Ticket medio</p>
                        <p className="kpi-value">{kpis.ticketMedio.toFixed(2)} €</p>
                        <p className="kpi-meta">Ingresos / pedidos</p>
                      </div>

                      <div className="kpi-card">
                        <p className="kpi-label">Stock bajo</p>
                        <p className="kpi-value">{kpis.stockBajo}</p>
                        <p className="kpi-meta">Productos con stock 1–5</p>
                      </div>

                      <div className="kpi-card">
                        <p className="kpi-label">Sin stock</p>
                        <p className="kpi-value">{kpis.sinStock}</p>
                        <p className="kpi-meta">Productos con stock 0</p>
                      </div>
                    </div>
                  </div>

                  <div className="section-card">
                    <div className="section-head">
                      <h2 className="section-title">Últimos pedidos</h2>
                      <button className="btn-soft" onClick={() => setTab("pedidos")}>
                        Ver todos
                      </button>
                    </div>

                    {pedidos.length === 0 ? (
                      <p className="tienda-muted" style={{ marginTop: 12 }}>
                        Aún no hay pedidos.
                      </p>
                    ) : (
                      <div className="order-list">
                        {pedidos.slice(0, 5).map((o) => {
                          const estado = (o.estado ?? "").toLowerCase();
                          const badgeClass = estado.includes("pag")
                            ? "badge-violet"
                            : estado.includes("pend")
                            ? "badge-warn"
                            : "badge-ok";

                          return (
                            <div key={o.id_pedido} className="order-card">
                              <div>
                                <p className="order-title">Pedido #{o.id_pedido}</p>
                                <p className="order-meta">
                                  {new Date(o.fecha).toLocaleString()} · {o.metodo_pago} ·{" "}
                                  {o.metodo_entrega}
                                </p>
                                <span className={`badge-status ${badgeClass}`}>
                                  Estado: {o.estado}
                                </span>
                              </div>

                              <div className="order-price">
                                {Number(o.importe_total).toFixed(2)} €
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ===== PRODUCTOS ===== */}
              {tab === "productos" && (
                <div className="est-card" style={{ marginTop: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "baseline",
                    }}
                  >
                    <h2 style={{ margin: 0, color: "#0f172a" }}>Productos</h2>
                    <div className="tienda-muted">{productos.length} productos</div>
                  </div>

                  {productos.length === 0 ? (
                    <p className="tienda-muted" style={{ marginTop: 10 }}>
                      No tienes productos. Pulsa <strong>+ Nuevo producto</strong>.
                    </p>
                  ) : (
                    <div style={{ overflowX: "auto", marginTop: 12 }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "separate",
                          borderSpacing: "0 10px",
                        }}
                      >
                        <thead>
                          <tr style={{ textAlign: "left", color: "#64748b", fontSize: 13 }}>
                            <th>ID</th>
                            <th>Producto</th>
                            <th>Tipo</th>
                            <th>Stock</th>
                            <th>Precio</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {productos.map((p) => (
                            <tr key={p.id_producto} style={{ background: "white" }}>
                              <td style={tdCell()}>{p.id_producto}</td>
                              <td style={tdCell()}>
                                <strong>{p.producto}</strong>
                              </td>
                              <td style={tdCell()}>{p.tipo_producto}</td>
                              <td style={tdCell()}>
                                <span
                                  style={{
                                    fontWeight: 900,
                                    color:
                                      p.stock <= 0
                                        ? "#dc2626"
                                        : p.stock <= 5
                                        ? "#b45309"
                                        : "#059669",
                                  }}
                                >
                                  {p.stock}
                                </span>
                              </td>
                              <td style={tdCell()}>{Number(p.precio).toFixed(2)} €</td>
                              <td style={tdCell({ textAlign: "right" })}>
                                <button className="btn btn-secondary" disabled>
                                  Editar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="tienda-muted" style={{ marginTop: 8 }}>
                        * “Editar” para cuando se integre todo
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ===== PEDIDOS (con desplegable detalle) ===== */}
              {tab === "pedidos" && (
                <div className="section-card" style={{ marginTop: 14 }}>
                  <div className="section-head">
                    <h2 className="section-title">Pedidos</h2>
                    <div className="tienda-muted">{pedidos.length} pedidos</div>
                  </div>

                  {pedidos.length === 0 ? (
                    <p className="tienda-muted" style={{ marginTop: 12 }}>
                      Aún no tienes pedidos.
                    </p>
                  ) : (
                    <div className="order-list" style={{ marginTop: 12 }}>
                      {pedidos.map((o) => {
                        const isOpen = openPedidoId === o.id_pedido;

                        const estado = (o.estado ?? "").toLowerCase();
                        const badgeClass = estado.includes("pag")
                          ? "badge-violet"
                          : estado.includes("pend")
                          ? "badge-warn"
                          : "badge-ok";

                        return (
                          <div key={o.id_pedido} className="order-card" style={{ alignItems: "flex-start" }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                <div>
                                  <p className="order-title">Pedido #{o.id_pedido}</p>
                                  <p className="order-meta">
                                    {new Date(o.fecha).toLocaleString()} · {o.metodo_pago} · {o.metodo_entrega}
                                  </p>
                                  <span className={`badge-status ${badgeClass}`}>Estado: {o.estado}</span>
                                </div>

                                <div style={{ textAlign: "right" }}>
                                  <div className="order-price">{Number(o.importe_total).toFixed(2)} €</div>

                                  <button
                                    className="btn-soft"
                                    style={{ marginTop: 8 }}
                                    onClick={async () => {
                                      const next = isOpen ? null : o.id_pedido;
                                      setOpenPedidoId(next);

                                      if (!isOpen) {
                                        await loadDetalle(o.id_pedido);
                                      }
                                    }}
                                  >
                                    {isOpen ? "Ocultar" : "Ver detalle"}
                                  </button>
                                </div>
                              </div>

                              {/* desplegable */}
                              {isOpen && (
                                <div style={{ marginTop: 12 }}>
                                  {detalleLoading[o.id_pedido] && (
                                    <p className="tienda-muted">Cargando detalle…</p>
                                  )}

                                  {detalleErr[o.id_pedido] && (
                                    <p className="notice-err" style={{ marginTop: 8 }}>
                                      {detalleErr[o.id_pedido]}
                                    </p>
                                  )}

                                  {!detalleLoading[o.id_pedido] && !detalleErr[o.id_pedido] && (
                                    <div style={{ display: "grid", gap: 10 }}>
                                      {(detalleByPedido[o.id_pedido] ?? []).map((l) => (
                                        <div
                                          key={l.id_detalle}
                                          style={{
                                            border: "1px solid rgba(15,23,42,.10)",
                                            borderRadius: 14,
                                            padding: 12,
                                            background: "rgba(15,23,42,.02)",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: 12,
                                          }}
                                        >
                                          <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 900 }}>{l.producto}</div>
                                            <div className="tienda-muted" style={{ marginTop: 4 }}>
                                              {l.cantidad} × {Number(l.precio_unitario).toFixed(2)} €
                                            </div>
                                          </div>

                                          <div style={{ fontWeight: 900, color: "#059669", whiteSpace: "nowrap" }}>
                                            {Number(l.subtotal).toFixed(2)} €
                                          </div>
                                        </div>
                                      ))}

                                      {(detalleByPedido[o.id_pedido] ?? []).length === 0 && (
                                        <p className="tienda-muted">
                                          Este pedido no tiene líneas (detalle_pedido vacío).
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ===== AJUSTES ===== */}
              {tab === "ajustes" && (
                <div className="est-card" style={{ marginTop: 14 }}>
                  <h2 style={{ margin: 0, color: "#0f172a" }}>Ajustes del comercio</h2>
                  <p className="tienda-muted" style={{ marginTop: 10 }}>
                    Mostrar “ficha de tienda” y (más adelante) permitir editarla.
                  </p>

                  {est ? (
                    <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                      <div className="tienda-muted">
                        <strong>Nombre:</strong> {est.nombre_comercio}
                      </div>
                      <div className="tienda-muted">
                        <strong>Categoría:</strong> {est.categoria ?? "-"}
                      </div>
                      <div className="tienda-muted">
                        <strong>Subcategoría:</strong> {est.subcategoria ?? "-"}
                      </div>
                      <div className="tienda-muted">
                        <strong>Dirección:</strong> {est.direccion ?? "-"} {est.numero ?? ""}
                      </div>
                      <div className="tienda-muted">
                        <strong>Municipio:</strong> {est.municipio ?? "-"}
                      </div>
                      <div className="tienda-muted">
                        <strong>Teléfono:</strong> {est.telefono ?? "-"}
                      </div>
                      <div className="tienda-muted">
                        <strong>Email:</strong> {est.correo ?? "-"}
                      </div>
                      <div className="tienda-muted">
                        <strong>Web:</strong> {est.url_web ?? "-"}
                      </div>

                      <button className="btn btn-secondary" disabled style={{ width: "fit-content" }}>
                        Editar (próximo)
                      </button>
                    </div>
                  ) : (
                    <p className="tienda-muted" style={{ marginTop: 12 }}>
                      No se pudo cargar la ficha del comercio.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/** helpers visuales para tabla */
function tdCell(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    padding: "12px 14px",
    borderTop: "1px solid rgba(15,23,42,.08)",
    borderBottom: "1px solid rgba(15,23,42,.08)",
    ...extra,
  };
}