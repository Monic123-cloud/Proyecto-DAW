"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

type PedidoDetalleResp =
  | { ok: true; pedido: Pedido; items: PedidoLinea[] }
  | { ok: false; error: string };

export default function ClientePage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // desplegable
  const [openId, setOpenId] = useState<number | null>(null);
  const [detailsById, setDetailsById] = useState<Record<number, { loading: boolean; err?: string; items?: PedidoLinea[] }>>({});

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("knox_token");
  }, []);

  const headers = useMemo(() => {
    return token ? { Authorization: `Token ${token}` } : {};
  }, [token]);

  const loadPedidos = async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch(`${API_BASE}/api/pedidos/me/`, { headers });
      if (!r.ok) throw new Error(`Error cargando pedidos (${r.status})`);
      const d = await r.json();
      setPedidos(d.items ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/acceso/login";
      return;
    }
    loadPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePedido = async (id: number) => {
    // cerrar si ya está abierto
    if (openId === id) {
      setOpenId(null);
      return;
    }

    setOpenId(id);

    // si ya lo tenemos en cache, no vuelvas a pedirlo
    if (detailsById[id]?.items || detailsById[id]?.loading) return;

    setDetailsById((p) => ({ ...p, [id]: { loading: true } }));

    try {
      const r = await fetch(`${API_BASE}/api/pedidos/${id}/`, { headers });
      const d = (await r.json()) as PedidoDetalleResp;

      if (!r.ok || !d.ok) {
        throw new Error("error" in d ? d.error : `HTTP ${r.status}`);
      }

      setDetailsById((p) => ({ ...p, [id]: { loading: false, items: d.items } }));
    } catch (e: any) {
      setDetailsById((p) => ({ ...p, [id]: { loading: false, err: e?.message ?? "Error" } }));
    }
  };

  return (
    <div className="page">
      <main className="tienda-page">
        <div className="tienda-container">
          <div className="est-card" style={{ padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 className="tienda-title" style={{ margin: 0 }}>Mi cuenta</h1>
              <p className="tienda-muted" style={{ margin: "6px 0 0" }}>
                Sesión iniciada como <strong>{typeof window !== "undefined" ? localStorage.getItem("user_email") : ""}</strong>
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn-secondary" href="/tienda">Ver tienda</Link>
              <Link className="btn btn-secondary" href="/carrito">Carrito</Link>
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
                    <div key={o.id_pedido} className="order-card" style={{ cursor: "pointer" }} onClick={() => togglePedido(o.id_pedido)}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
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
                          {Number(o.importe_total).toFixed(2)} €
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
                                      <td style={tdCell()}>{Number(l.precio_unitario).toFixed(2)} €</td>
                                      <td style={tdCell({ fontWeight: 900, color: "#059669" })}>{Number(l.subtotal).toFixed(2)} €</td>
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