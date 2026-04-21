"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart, formatEUR } from "../../components/cart/CartContext";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

type CreatedResp =
  | {
      ok: true;
      created: {
        id_pedido: number;
        id_establecimiento: number;
        importe_total: number;
        lineas: number;
      }[];
    }
  | { ok: false; error: string };

export default function CarritoPage() {
  const { items, totals, setQty, removeItem, clear } = useCart();

  const [metodoPago, setMetodoPago] = useState<"tarjeta" | "paypal" | "bizum">(
    "tarjeta"
  );
  const [metodoEntrega, setMetodoEntrega] = useState<
    "recogida" | "domicilio"
  >("recogida");
  const [descuento, setDescuento] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("knox_token");
  }, []);

  const canPay = items.length > 0 && !loading;

  const pagar = async () => {
    if (!token) {
      setErrMsg("No hay sesión. Inicia sesión para pagar.");
      return;
    }

    setLoading(true);
    setOkMsg(null);
    setErrMsg(null);

    try {
      // Validación: cada item debe tener id_producto e id_establecimiento
      for (const it of items) {
        if (!it.id_producto || !it.id_establecimiento) {
          throw new Error(
            "No puedo crear pedidos: falta id_establecimiento/id_producto en algún producto del carrito."
          );
        }
      }

      const payload = {
        metodo_pago: metodoPago,
        metodo_entrega: metodoEntrega,
        descuento,
        items: items.map((it) => ({
          id_producto: it.id_producto,
          id_establecimiento: it.id_establecimiento,
          cantidad: it.qty,
          precio_unitario: it.price,
        })),
      };

      const res = await fetch(`${API_BASE}/api/pedidos/crear/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Leer como texto primero para detectar HTML/errores
      const raw = await res.text();

      let data: CreatedResp | null = null;
      try {
        data = raw ? (JSON.parse(raw) as CreatedResp) : null;
      } catch {
        throw new Error(
          `La API no devolvió JSON (HTTP ${res.status}). Empieza así:\n${raw.slice(
            0,
            200
          )}`
        );
      }

      if (!res.ok || !data || !("ok" in data) || !data.ok) {
        const msg =
          data && "ok" in data && !data.ok
            ? data.error
            : `HTTP ${res.status}`;
        throw new Error(msg);
      }

      // OK ✅
      const n = data.created?.length ?? 0;
      setOkMsg(`Compra realizada ✅ Pedidos creados: ${n}`);
      clear();
    } catch (err: any) {
      setErrMsg(err?.message ?? "Error pagando");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <div className="container nav">
          <Link href="/" className="brand">
            <Image
              src="/images/Close-logo_1.png"
              alt="Logo Close4u"
              width={56}
              height={56}
              className="brand-logo-img"
              priority
            />
            <div className="brand-text-block">
              <Image
                src="/images/Close4up-logo_2.png"
                alt="Close4u"
                width={100}
                height={36}
                className="brand-name-img"
                priority
              />
              <p className="brand-subtitle">Tu carrito</p>
            </div>
          </Link>

          <Link href="/tienda" className="btn btn-secondary">
            ← Seguir comprando
          </Link>
        </div>
      </header>

      <main className="section">
        <div className="container" style={{ maxWidth: 1100 }}>
          <h1 style={{ marginTop: 0 }}>Carrito</h1>

          {okMsg && (
            <div className="card" style={{ borderRadius: 24, marginBottom: 14 }}>
              <p style={{ margin: 0, color: "#047857", fontWeight: 800 }}>
                {okMsg}
              </p>
            </div>
          )}

          {errMsg && (
            <div className="card" style={{ borderRadius: 24, marginBottom: 14 }}>
              <p style={{ margin: 0, color: "#dc2626", fontWeight: 800 }}>
                {errMsg}
              </p>
            </div>
          )}

          {items.length === 0 ? (
            <div className="card" style={{ borderRadius: 24 }}>
              <p style={{ margin: 0, color: "#64748b" }}>
                Tu carrito está vacío. Añade productos y volverás a verlos aquí.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 0.6fr",
                gap: 18,
              }}
            >
              {/* Lista */}
              <div className="card" style={{ borderRadius: 24 }}>
                <div style={{ display: "grid", gap: 14 }}>
                  {items.map((it) => (
                    <div
                      key={it.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 120px 120px",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 0",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800 }}>{it.name}</div>
                        <div style={{ color: "#64748b", marginTop: 4 }}>
                          {formatEUR(it.price)} / ud
                        </div>
                        <div className="tienda-muted" style={{ marginTop: 4 }}>
                          Est: {it.id_establecimiento} · Prod: {it.id_producto}
                        </div>
                      </div>

                      <input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={(e) =>
                          setQty(it.id, Number(e.target.value) || 1)
                        }
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 14,
                          border: "1px solid #e2e8f0",
                          outline: "none",
                        }}
                      />

                      <button
                        onClick={() => removeItem(it.id)}
                        className="btn"
                        style={{
                          background: "rgba(255,204,172,.35)",
                          border: "1px solid rgba(255,204,172,.8)",
                          color: "#0f172a",
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <button onClick={clear} className="btn btn-secondary">
                    Vaciar carrito
                  </button>

                  <div style={{ fontWeight: 800 }}>
                    Subtotal: {formatEUR(totals.subtotal)}
                  </div>
                </div>
              </div>

              {/* Checkout */}
              <div className="card" style={{ borderRadius: 24, height: "fit-content" }}>
                <h3 style={{ marginTop: 0 }}>Pago (simulado)</h3>

                <div style={{ display: "grid", gap: 10 }}>
                  <div>
                    <div className="tienda-muted" style={{ marginBottom: 6 }}>
                      Método de pago
                    </div>
                    <select
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value as any)}
                      className="c4u-input"
                    >
                      <option value="tarjeta">Tarjeta</option>
                      <option value="paypal">PayPal</option>
                      <option value="bizum">Bizum</option>
                    </select>
                  </div>

                  <div>
                    <div className="tienda-muted" style={{ marginBottom: 6 }}>
                      Entrega
                    </div>
                    <select
                      value={metodoEntrega}
                      onChange={(e) => setMetodoEntrega(e.target.value as any)}
                      className="c4u-input"
                    >
                      <option value="recogida">Recogida</option>
                      <option value="domicilio">Domicilio</option>
                    </select>
                  </div>

                  <div>
                    <div className="tienda-muted" style={{ marginBottom: 6 }}>
                      Descuento (€)
                    </div>
                    <input
                      className="c4u-input"
                      type="number"
                      step="0.01"
                      value={descuento}
                      onChange={(e) => setDescuento(Number(e.target.value) || 0)}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Artículos</span>
                    <strong>{totals.count}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Subtotal</span>
                    <strong>{formatEUR(totals.subtotal)}</strong>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    onClick={pagar}
                    disabled={!canPay}
                  >
                    {loading ? "Procesando…" : "Pagar"}
                  </button>

                  <p style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>
                    * Esto crea <strong>pedido</strong> y también{" "}
                    <strong>detalle_pedido</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}