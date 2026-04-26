"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

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
  id_pedido: number;
  id_producto: number;
  producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
};

type PedidosMeResp = { ok: true; items: Pedido[] } | { ok: false; error: string };

type PedidoDetalleResp =
  | { ok: true; pedido: Pedido; items: PedidoLinea[] }
  | { ok: false; error: string };

function eur(n: number) {
  return `${Number(n || 0).toFixed(2)} €`;
}

export default function ClientePage() {
  const [email, setEmail] = useState<string>("");

  const [token, setToken] = useState<string | null>(null);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // desplegable por pedido
  const [openId, setOpenId] = useState<number | null>(null);
  const [detailsById, setDetailsById] = useState<
    Record<number, { loading: boolean; err?: string; items?: PedidoLinea[] }>
  >({});

  // 1) Leer localStorage SOLO en cliente (evita hydration mismatch)
  useEffect(() => {
    const t = localStorage.getItem("knox_token");
    const e = localStorage.getItem("user_email") ?? "";
    setToken(t);
    setEmail(e);

    if (!t) window.location.href = "/acceso/login";
  }, []);

  const headers = useMemo(() => {
    return token ? { Authorization: `Token ${token}` } : {};
  }, [token]);

  const kpis = useMemo(() => {
    const total = pedidos.length;
    const pagados = pedidos.filter((p) => (p.estado ?? "").toLowerCase() === "pagado").length;
    const gasto = pedidos.reduce((acc, p) => acc + Number(p.importe_total || 0), 0);
    const ticket = total > 0 ? gasto / total : 0;
    return { total, pagados, gasto, ticket };
  }, [pedidos]);

  const loadPedidos = async () => {
    if (!token) return;

    setLoading(true);
    setErr(null);

    try {
      const r = await fetch(`${API_BASE}/api/pedidos/me/`, { headers });
      const raw = await r.text();

      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        throw new Error(`La API no devolvió JSON (HTTP ${r.status}).`);
      }

      if (!r.ok) {
        const msg = data?.error ?? `Error cargando pedidos (${r.status})`;
        throw new Error(msg);
      }

      const d = data as PedidosMeResp;
      if (!("ok" in d) || d.ok !== true) {
        throw new Error((d as any)?.error ?? "Respuesta inválida");
      }

      setPedidos(d.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const togglePedido = async (id_pedido: number) => {
    if (!token) return;

    // cerrar si ya está abierto
    if (openId === id_pedido) {
      setOpenId(null);
      return;
    }

    setOpenId(id_pedido);

    // cache
    if (detailsById[id_pedido]?.items || detailsById[id_pedido]?.loading) return;

    setDetailsById((p) => ({ ...p, [id_pedido]: { loading: true } }));

    try {
      const r = await fetch(`${API_BASE}/api/pedidos/${id_pedido}/`, { headers });
      const raw = await r.text();

      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        throw new Error(`La API no devolvió JSON (HTTP ${r.status}).`);
      }

      const d = data as PedidoDetalleResp;
      if (!r.ok || !d.ok) {
        throw new Error("error" in d ? d.error : `HTTP ${r.status}`);
      }

      setDetailsById((p) => ({ ...p, [id_pedido]: { loading: false, items: d.items } }));
    } catch (e: any) {
      setDetailsById((p) => ({ ...p, [id_pedido]: { loading: false, err: e?.message ?? "Error" } }));
    }
  };

  return (
    <div className="page">
      <main className="tienda-page">
        <div className="tienda-container">
          {/* Header card */}
          <div
            className="est-card"
            style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <h1 className="tienda-title" style={{ margin: 0 }}>
                Mi cuenta <span className="tienda-muted" style={{ fontSize: 14, fontWeight: 600 }}>Panel de cliente</span>
              </h1>
              <p className="tienda-muted" style={{ margin: "6px 0 0" }}>
                Sesión iniciada como{" "}
                <strong suppressHydrationWarning>{email}</strong>
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn-secondary" href="/tienda">
                Ver tienda
              </Link>
              <Link className="btn btn-secondary" href="/carrito">
                Carrito
              </Link>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  localStorage.removeItem("knox_token");
                  localStorage.removeItem("user_email");
                  localStorage.removeItem("user_id");
                  window.location.href = "/acceso/login";
                }}
              >
                Salir
              </button>
            </div>
          </div>

          {/* KPI cards */}
          <div className="kpi-grid" style={{ marginTop: 14 }}>
            <div className="kpi-card">
              <div className="kpi-label">Pedidos</div>
              <div className="kpi-value">{kpis.total}</div>
              <div className="kpi-sub">Total pedidos</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Pagados</div>
              <div className="kpi-value">{kpis.pagados}</div>
              <div className="kpi-sub">Pedidos con estado pagado</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Gasto total</div>
              <div className="kpi-value">{eur(kpis.gasto)}</div>
              <div className="kpi-sub">Suma de importe_total</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Ticket medio</div>
              <div className="kpi-value">{eur(kpis.ticket)}</div>
              <div className="kpi-sub">Gasto / pedidos</div>
            </div>
          </div>

          {/* Pedidos */}
          <div className="est-card" style={{ marginTop: 14 }}>
            <div className="section-head">
              <h2 className="section-title">Mis pedidos</h2>
              <div className="tienda-muted">{pedidos.length} pedidos</div>
            </div>

            {loading && <p className="tienda-muted" style={{ marginTop: 12 }}>Cargando pedidos…</p>}
            {err && <p className="notice-err" style={{ marginTop: 12 }}>{err}</p>}

            {!loading && !err && pedidos.length === 0 && (
              <p className="tienda-muted" style={{ marginTop: 12 }}>
                Aún no has hecho pedidos. Cuando hagas uno, aparecerá aquí con su detalle.
              </p>
            )}

            {!loading && !err && pedidos.length > 0 && (
              <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                {pedidos.map((o) => {
                  const isOpen = openId === o.id_pedido;
                  const det = detailsById[o.id_pedido];

                  return (
                    <div key={o.id_pedido} className="order-card">
                      <div
                        style={{ display: "flex", justifyContent: "space-between", gap: 12, cursor: "pointer" }}
                        onClick={() => togglePedido(o.id_pedido)}
                      >
                        <div>
                          <p className="order-title" style={{ margin: 0 }}>
                            Pedido #{o.id_pedido}
                          </p>
                          <p className="order-meta" style={{ marginTop: 6 }}>
                            {new Date(o.fecha).toLocaleString()} · {o.metodo_pago} · {o.metodo_entrega}
                          </p>

                          <span style={{ marginTop: 8, display: "inline-block" }}>
                            <span className="badge-status badge-violet">Estado: {o.estado}</span>
                          </span>

                          <div className="tienda-muted" style={{ marginTop: 10 }}>
                            Establecimiento: #{o.id_establecimiento}
                          </div>
                        </div>

                        <div className="order-price">
                          {eur(Number(o.importe_total))}
                          <div className="tienda-muted" style={{ marginTop: 10, textAlign: "right" }}>
                            {isOpen ? "▲ Ocultar" : "▼ Ver detalle"}
                          </div>
                        </div>
                      </div>

                      {isOpen && (
                        <div style={{ marginTop: 14, borderTop: "1px solid rgba(15,23,42,.08)", paddingTop: 12 }}>
                          {det?.loading && <p className="tienda-muted">Cargando detalle…</p>}
                          {det?.err && <p className="notice-err">Error cargando detalle: {det.err}</p>}

                          {det?.items && det.items.length === 0 && (
                            <p className="tienda-muted">Este pedido no tiene líneas en detalle_pedido.</p>
                          )}

                          {det?.items && det.items.length > 0 && (
                            <div style={{ overflowX: "auto" }}>
                              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 10px" }}>
                                <thead>
                                  <tr style={{ textAlign: "left", color: "#64748b", fontSize: 13 }}>
                                    <th>Producto</th>
                                    <th>Cant.</th>
                                    <th>P. unitario</th>
                                    <th>Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {det.items.map((l) => (
                                    <tr key={l.id_detalle} style={{ background: "white" }}>
                                      <td style={tdCell()}><strong>{l.producto}</strong></td>
                                      <td style={tdCell()}>{l.cantidad}</td>
                                      <td style={tdCell()}>{eur(Number(l.precio_unitario))}</td>
                                      <td style={tdCell({ fontWeight: 900, color: "#059669" })}>{eur(Number(l.subtotal))}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="est-card" style={{ marginTop: 14, textAlign: "center" }}>
            <p className="tienda-muted" style={{ margin: 0 }}>¿Te apetece seguir comprando cerca de ti?</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/tienda">Ir a la tienda</Link>
              <Link className="btn btn-secondary" href="/carrito">Ver carrito</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function tdCell(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    padding: "12px 14px",
    borderTop: "1px solid rgba(15,23,42,.08)",
    borderBottom: "1px solid rgba(15,23,42,.08)",
    ...extra,
  };
}