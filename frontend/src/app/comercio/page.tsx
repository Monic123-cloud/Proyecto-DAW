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

type Tab = "resumen" | "productos" | "pedidos" | "ajustes";

export default function ComercioDashboardPage() {
  const [tab, setTab] = useState<Tab>("resumen");
  const [est, setEst] = useState<Establecimiento | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("knox_token");
  }, []);

  const headers = useMemo(() => {
    return token
      ? { Authorization: `Token ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  }, [token]);

  const logout = async () => {
    localStorage.removeItem("knox_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
    window.location.href = "/login";
  };

  const loadAll = async () => {
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
    } catch (e: any) {
      setErr(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Si no hay token, fuera
    const t = localStorage.getItem("knox_token");
    if (!t) {
      window.location.href = "/login";
      return;
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {/* Top bar tipo merchant */}
          <div className="est-card" style={{ padding: "16px 16px", display: "flex", gap: 14, alignItems: "center", justifyContent: "space-between" }}>
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
              <button className="btn btn-secondary" onClick={loadAll} disabled={loading}>
                ↻ Actualizar
              </button>
              <Link className="btn btn-secondary" href="/tienda">
                Ver tienda
              </Link>
              <Link className="btn btn-primary" href="alta_producto">
                + Nuevo producto
              </Link>
              <button className="btn btn-secondary" onClick={logout}>
                Salir
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="tienda-chips" style={{ marginTop: 14 }}>
            <button className={`tienda-chip ${tab === "resumen" ? "is-active" : ""}`} onClick={() => setTab("resumen")}>
              Resumen
            </button>
            <button className={`tienda-chip ${tab === "productos" ? "is-active" : ""}`} onClick={() => setTab("productos")}>
              Productos
            </button>
            <button className={`tienda-chip ${tab === "pedidos" ? "is-active" : ""}`} onClick={() => setTab("pedidos")}>
              Pedidos
            </button>
            <button className={`tienda-chip ${tab === "ajustes" ? "is-active" : ""}`} onClick={() => setTab("ajustes")}>
              Ajustes
            </button>
          </div>

          {loading && <p className="tienda-muted" style={{ marginTop: 14 }}>Cargando panel…</p>}

          {err && (
            <div className="est-card" style={{ marginTop: 14 }}>
              <p className="notice-err" style={{ margin: 0 }}>{err}</p>
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
                  <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
                    <div className="est-card">
                      <div className="prod-grid">
                        <div className="prod-card">
                          <p className="prod-title">Ingresos</p>
                          <div className="prod-price">{kpis.ingresos.toFixed(2)} €</div>
                          <div className="prod-meta">Total facturado (importe_total)</div>
                        </div>

                        <div className="prod-card">
                          <p className="prod-title">Pedidos</p>
                          <div className="prod-price">{kpis.totalPedidos}</div>
                          <div className="prod-meta">Pedidos recibidos</div>
                        </div>

                        <div className="prod-card">
                          <p className="prod-title">Ticket medio</p>
                          <div className="prod-price">{kpis.ticketMedio.toFixed(2)} €</div>
                          <div className="prod-meta">Ingresos / pedidos</div>
                        </div>

                        <div className="prod-card">
                          <p className="prod-title">Stock bajo</p>
                          <div className="prod-price">{kpis.stockBajo}</div>
                          <div className="prod-meta">Productos con stock 1–5</div>
                        </div>

                        <div className="prod-card">
                          <p className="prod-title">Sin stock</p>
                          <div className="prod-price">{kpis.sinStock}</div>
                          <div className="prod-meta">Productos con stock 0</div>
                        </div>
                      </div>
                    </div>

                    {/* Últimos pedidos */}
                    <div className="est-card">
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                        <h2 style={{ margin: 0, color: "#0f172a" }}>Últimos pedidos</h2>
                        <button className="btn btn-secondary" onClick={() => setTab("pedidos")}>Ver todos</button>
                      </div>

                      {pedidos.length === 0 ? (
                        <p className="tienda-muted" style={{ marginTop: 10 }}>Aún no hay pedidos.</p>
                      ) : (
                        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                          {pedidos.slice(0, 5).map((o) => (
                            <div key={o.id_pedido} className="prod-card">
                              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                <p className="prod-title" style={{ margin: 0 }}>Pedido #{o.id_pedido}</p>
                                <div className="prod-price">{Number(o.importe_total).toFixed(2)} €</div>
                              </div>
                              <div className="prod-meta">
                                {new Date(o.fecha).toLocaleString()} · {o.metodo_pago} · {o.metodo_entrega} · Estado: <strong>{o.estado}</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ===== PRODUCTOS ===== */}
              {tab === "productos" && (
                <div className="est-card" style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                    <h2 style={{ margin: 0, color: "#0f172a" }}>Productos</h2>
                    <div className="tienda-muted">{productos.length} productos</div>
                  </div>

                  {productos.length === 0 ? (
                    <p className="tienda-muted" style={{ marginTop: 10 }}>
                      No tienes productos. Pulsa <strong>+ Nuevo producto</strong>.
                    </p>
                  ) : (
                    <div style={{ overflowX: "auto", marginTop: 12 }}>
                      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
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
                              <td style={tdCell()}><strong>{p.producto}</strong></td>
                              <td style={tdCell()}>{p.tipo_producto}</td>
                              <td style={tdCell()}>
                                <span style={{ fontWeight: 900, color: p.stock <= 0 ? "#dc2626" : p.stock <= 5 ? "#b45309" : "#059669" }}>
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
                        * “Editar” para cuando se integre
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ===== PEDIDOS ===== */}
              {tab === "pedidos" && (
                <div className="est-card" style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                    <h2 style={{ margin: 0, color: "#0f172a" }}>Pedidos</h2>
                    <div className="tienda-muted">{pedidos.length} pedidos</div>
                  </div>

                  {pedidos.length === 0 ? (
                    <p className="tienda-muted" style={{ marginTop: 10 }}>Aún no tienes pedidos.</p>
                  ) : (
                    <div style={{ overflowX: "auto", marginTop: 12 }}>
                      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
                        <thead>
                          <tr style={{ textAlign: "left", color: "#64748b", fontSize: 13 }}>
                            <th>Pedido</th>
                            <th>Fecha</th>
                            <th>Pago</th>
                            <th>Entrega</th>
                            <th>Estado</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedidos.map((o) => (
                            <tr key={o.id_pedido} style={{ background: "white" }}>
                              <td style={tdCell()}><strong>#{o.id_pedido}</strong></td>
                              <td style={tdCell()}>{new Date(o.fecha).toLocaleString()}</td>
                              <td style={tdCell()}>{o.metodo_pago}</td>
                              <td style={tdCell()}>{o.metodo_entrega}</td>
                              <td style={tdCell()}>
                                <span style={pill(o.estado)}>{o.estado}</span>
                              </td>
                              <td style={tdCell({ fontWeight: 900, color: "#059669" })}>
                                {Number(o.importe_total).toFixed(2)} €
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                      <div className="tienda-muted"><strong>Nombre:</strong> {est.nombre_comercio}</div>
                      <div className="tienda-muted"><strong>Categoría:</strong> {est.categoria ?? "-"}</div>
                      <div className="tienda-muted"><strong>Subcategoría:</strong> {est.subcategoria ?? "-"}</div>
                      <div className="tienda-muted"><strong>Dirección:</strong> {est.direccion ?? "-"} {est.numero ?? ""}</div>
                      <div className="tienda-muted"><strong>Municipio:</strong> {est.municipio ?? "-"}</div>
                      <div className="tienda-muted"><strong>Teléfono:</strong> {est.telefono ?? "-"}</div>
                      <div className="tienda-muted"><strong>Email:</strong> {est.correo ?? "-"}</div>
                      <div className="tienda-muted"><strong>Web:</strong> {est.url_web ?? "-"}</div>

                      <button className="btn btn-secondary" disabled style={{ width: "fit-content" }}>
                        Editar (próximo)
                      </button>
                    </div>
                  ) : (
                    <p className="tienda-muted" style={{ marginTop: 12 }}>No se pudo cargar la ficha del comercio.</p>
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

function pill(estado: string): React.CSSProperties {
  const s = (estado || "").toLowerCase();
  const base: React.CSSProperties = {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
    border: "1px solid rgba(15,23,42,.10)",
  };

  if (s.includes("pag")) return { ...base, background: "rgba(209,179,255,.35)", color: "#0f172a" };
  if (s.includes("pend")) return { ...base, background: "rgba(255,204,172,.40)", color: "#0f172a" };
  if (s.includes("cancel")) return { ...base, background: "rgba(220,38,38,.12)", color: "#dc2626" };
  return { ...base, background: "rgba(178,216,178,.35)", color: "#065f46" };
}