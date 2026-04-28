"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, formatEUR } from "../../components/cart/CartContext";

export default function CheckoutPage() {
  const { items, totals, clear } = useCart();

  const [token, setToken] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [pagando, setPagando] = useState(false);
  const [pagado, setPagado] = useState(false);
  const [referencia, setReferencia] = useState("");
  const [importePagado, setImportePagado] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setCheckingAuth(false);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) return;
    if (items.length === 0) return;

    setPagando(true);

    setTimeout(() => {
      setImportePagado(totals.subtotal);
      setReferencia(`C4U-${Date.now().toString().slice(-6)}`);
      setPagado(true);
      setPagando(false);
      clear();
    }, 1400);
  }

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
              <p className="brand-subtitle">Finalizar compra</p>
            </div>
          </Link>

          <Link href="/carrito" className="btn btn-secondary">
            ← Volver al carrito
          </Link>
        </div>
      </header>

      <main className="section">
        <div className="container" style={{ maxWidth: 1050 }}>
          {checkingAuth && (
            <div className="card" style={{ borderRadius: 24 }}>
              <p style={{ margin: 0 }}>Comprobando sesión...</p>
            </div>
          )}

          {!checkingAuth && !token && (
            <div className="card" style={{ borderRadius: 24, maxWidth: 720 }}>
              <h1 style={{ marginTop: 0 }}>Necesitas iniciar sesión</h1>

              <p style={{ color: "#64748b" }}>
                Para finalizar la compra, inicia sesión o crea una cuenta como
                cliente.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 24,
                  flexWrap: "wrap",
                }}
              >
                <Link href="/acceso/login" className="btn btn-primary">
                  Iniciar sesión
                </Link>

                <Link href="/acceso/registro" className="btn btn-secondary">
                  Registrarme
                </Link>

                <Link href="/productos" className="btn btn-secondary">
                  Seguir comprando
                </Link>
              </div>
            </div>
          )}

          {!checkingAuth && token && pagado && (
            <div className="card" style={{ borderRadius: 24, maxWidth: 720 }}>
              <h1 style={{ marginTop: 0 }}>Pago realizado correctamente</h1>

              <p style={{ color: "#64748b" }}>
                Tu compra se ha simulado correctamente. No se ha realizado ningún
                cargo real.
              </p>

              <div style={{ marginTop: 18, display: "grid", gap: 8 }}>
                <p>
                  <strong>Referencia:</strong> {referencia}
                </p>

                <p>
                  <strong>Importe:</strong> {formatEUR(importePagado)}
                </p>

                <p>
                  <strong>Estado:</strong> Pedido confirmado
                </p>
              </div>

              <div style={{ marginTop: 24 }}>
                <Link href="/productos" className="btn btn-primary">
                  Seguir comprando
                </Link>
              </div>
            </div>
          )}

          {!checkingAuth && token && !pagado && items.length === 0 && (
            <div className="card" style={{ borderRadius: 24, maxWidth: 720 }}>
              <h1 style={{ marginTop: 0 }}>Tu carrito está vacío</h1>

              <p style={{ color: "#64748b" }}>
                Añade algún producto antes de finalizar la compra.
              </p>

              <Link href="/productos" className="btn btn-primary">
                Ver productos
              </Link>
            </div>
          )}

          {!checkingAuth && token && !pagado && items.length > 0 && (
            <>
              <h1 style={{ marginTop: 0 }}>Finalizar compra</h1>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.3fr 0.7fr",
                  gap: 18,
                  alignItems: "start",
                }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="card"
                  style={{ borderRadius: 24 }}
                >
                  <h2 style={{ marginTop: 0 }}>Datos de entrega</h2>

                  <div style={{ display: "grid", gap: 14 }}>
                    <label>
                      <strong>Nombre completo</strong>
                      <input
                        required
                        className="c4u-input"
                        placeholder="Ej: Javier García"
                        style={{ marginTop: 6 }}
                      />
                    </label>

                    <label>
                      <strong>Email</strong>
                      <input
                        required
                        type="email"
                        className="c4u-input"
                        placeholder="correo@ejemplo.com"
                        style={{ marginTop: 6 }}
                      />
                    </label>

                    <label>
                      <strong>Teléfono</strong>
                      <input
                        required
                        className="c4u-input"
                        placeholder="Ej: 600 000 000"
                        style={{ marginTop: 6 }}
                      />
                    </label>

                    <label>
                      <strong>Método de entrega</strong>
                      <select
                        required
                        className="c4u-input"
                        style={{ marginTop: 6 }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Selecciona una opción
                        </option>
                        <option value="recogida">Recogida en tienda</option>
                        <option value="envio">Entrega a domicilio</option>
                      </select>
                    </label>

                    <label>
                      <strong>Método de pago</strong>
                      <select
                        required
                        className="c4u-input"
                        style={{ marginTop: 6 }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Selecciona una opción
                        </option>
                        <option value="tarjeta">Tarjeta bancaria simulada</option>
                        <option value="bizum">Bizum simulado</option>
                        <option value="tienda">Pago en tienda</option>
                      </select>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: 22 }}
                    disabled={pagando}
                  >
                    {pagando ? "Procesando pago..." : "Pagar ahora"}
                  </button>

                  <p
                    style={{
                      marginTop: 12,
                      color: "#64748b",
                      fontSize: 13,
                    }}
                  >
                    * Simulación de pasarela de pago para el TFG. No se realiza
                    ningún cobro real.
                  </p>
                </form>

                <aside
                  className="card"
                  style={{ borderRadius: 24, height: "fit-content" }}
                >
                  <h3 style={{ marginTop: 0 }}>Resumen del pedido</h3>

                  <div style={{ display: "grid", gap: 10 }}>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          borderBottom: "1px solid #e2e8f0",
                          paddingBottom: 8,
                        }}
                      >
                        <span>
                          {item.name} x {item.qty}
                        </span>

                        <strong>{formatEUR(item.price * item.qty)}</strong>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 18,
                      fontSize: 18,
                    }}
                  >
                    <span>Total</span>
                    <strong>{formatEUR(totals.subtotal)}</strong>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}