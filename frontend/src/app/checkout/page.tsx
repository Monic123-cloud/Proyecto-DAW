"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, formatEUR } from "../../components/cart/CartContext";
import AxiosInstance from "../../components/AxiosInstance";

export default function CheckoutPage() {
  const { items, totals, clear } = useCart();

  const [token, setToken] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [pagando, setPagando] = useState(false);
  const [pagado, setPagado] = useState(false);
  const [errorPago, setErrorPago] = useState("");
  const [referencia, setReferencia] = useState("");
  const [importePagado, setImportePagado] = useState(0);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("access") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");
    setToken(storedToken);
    setCheckingAuth(false);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) return;
    if (items.length === 0) return;

    const formData = new FormData(event.currentTarget);
    const metodoEntrega = String(formData.get("metodo_entrega") || "");
    const metodoPago = String(formData.get("metodo_pago") || "");

    setErrorPago("");
    setPagando(true);

    try {
      const response = await AxiosInstance.post(
        "/buscador/checkout/descontar-stock/",
        {
          metodo_entrega: metodoEntrega,
          metodo_pago: metodoPago,
          items: items.map((item) => ({
            id_producto: item.id,
            cantidad: item.qty,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const pedidos = response.data?.pedidos || [];
      const idsPedido = pedidos.map((pedido: any) => pedido.id_pedido).join("-");

      setImportePagado(Number(response.data?.total || totals.subtotal));
      setReferencia(
        idsPedido ? `PED-${idsPedido}` : `C4U-${Date.now().toString().slice(-6)}`
      );
      setPagado(true);
      clear();
    } catch (error: any) {
      console.error("Error al crear pedido", error);
      setErrorPago(
        error?.response?.data?.error ||
          error?.response?.data?.detail ||
          "No se ha podido crear el pedido ni descontar el stock."
      );
    } finally {
      setPagando(false);
    }
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
                Tu pedido se ha creado correctamente y el stock se ha actualizado.
                No se ha realizado ningún cargo real.
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
                        name="metodo_entrega"
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
                        name="metodo_pago"
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

                  {errorPago && (
                    <div
                      style={{
                        marginTop: 16,
                        padding: "12px 14px",
                        borderRadius: 14,
                        background: "#fee2e2",
                        color: "#991b1b",
                        fontWeight: 700,
                      }}
                    >
                      {errorPago}
                    </div>
                  )}

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