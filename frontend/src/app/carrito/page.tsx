"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, formatEUR } from "../../components/cart/CartContext";

export default function CarritoPage() {
  const { items, totals, setQty, removeItem, clear } = useCart();

  return (
    <div className="page">
      {/* Header simple para volver */}
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

          <Link href="/" className="btn btn-secondary">
            ← Seguir comprando
          </Link>
        </div>
      </header>

      <main className="section">
        <div className="container" style={{ maxWidth: 1100 }}>
          <h1 style={{ marginTop: 0 }}>Carrito</h1>

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
                      </div>

                      <input
                        type="number"
                        min={1}
                        value={it.qty}
                        onChange={(e) => setQty(it.id, Number(e.target.value))}
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
                          cursor: "pointer",
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

              {/* Resumen */}
              <div
                className="card"
                style={{ borderRadius: 24, height: "fit-content" }}
              >
                <h3 style={{ marginTop: 0 }}>Resumen</h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Artículos</span>
                  <strong>{totals.count}</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <span>Subtotal</span>
                  <strong>{formatEUR(totals.subtotal)}</strong>
                </div>

                <Link
                  href="/checkout"
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  Continuar
                </Link>

                <p style={{ marginTop: 12, color: "#64748b", fontSize: 13 }}>
                  * En el siguiente paso añadimos recogida/entrega y pago.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}