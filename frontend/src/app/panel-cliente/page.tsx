"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import { formatEUR, useCart } from "@/components/cart/CartContext";

 function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || localStorage.getItem("access_token");
}
 
export default function PanelClientePage() {
  const { items, totals, setQty, removeItem, clear } = useCart();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getStoredToken());
  }, []); 

  return (
    <div className="page">
      <Header />

      <main className="tienda-page">
        <div className="tienda-container">
          <div className="tienda-head">
            <div>
              <p className="section-tag">Área privada</p>
              <h1 className="tienda-title">Panel de cliente</h1>
              <p className="tienda-muted">
                Zona preparada para consultar compras, carrito, tiendas y datos del usuario.
              </p>
            </div>

            <Link href="/productos" className="tienda-link">
              Seguir comprando →
            </Link>
          </div>

          {!token && (
            <section className="section-card">
              <h2 className="section-title">Sesión no iniciada</h2>
              <p className="tienda-muted" style={{ marginTop: 8 }}>
                Este panel está preparado para usuarios registrados. Puedes ver la maqueta, pero para datos reales debe iniciarse sesión.
              </p>
              <div className="c4u-actions-row">
                <Link href="/acceso/login" className="btn-close4u">
                  Iniciar sesión
                </Link>
                <Link href="/acceso/registro" className="tienda-link">
                  Crear cuenta
                </Link>
              </div>
            </section>
          )}

          <section className="section-card">
            <div className="kpi-grid">
              <article className="kpi-card">
                <p className="kpi-label">Artículos en carrito</p>
                <p className="kpi-value">{totals.count}</p>
                <p className="kpi-meta">Productos pendientes</p>
              </article>

              <article className="kpi-card">
                <p className="kpi-label">Subtotal</p>
                <p className="kpi-value">{formatEUR(totals.subtotal)}</p>
                <p className="kpi-meta">Importe estimado</p>
              </article>

              <article className="kpi-card">
                <p className="kpi-label">Pedidos</p>
                <p className="kpi-value">0</p>
                <p className="kpi-meta">Pendiente de conectar API</p>
              </article>

              <article className="kpi-card">
                <p className="kpi-label">Estado</p>
                <p className="kpi-value">Activo</p>
                <p className="kpi-meta">Panel visual listo</p>
              </article>

              <article className="kpi-card">
                <p className="kpi-label">Rol</p>
                <p className="kpi-value">Cliente</p>
                <p className="kpi-meta">A validar por email</p>
              </article>
            </div>
          </section>

          <section className="section-card">
            <div className="tienda-head">
              <div>
                <h2 className="section-title">Mi carrito</h2>
                <p className="tienda-muted">Productos seleccionados antes de finalizar el pedido.</p>
              </div>
              <Link href="/carrito" className="tienda-link">
                Ver carrito completo
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="est-card" style={{ marginTop: 14 }}>
                <p className="prod-title">Todavía no hay productos en el carrito.</p>
                <p className="prod-meta">Entra en productos, añade alguno y aparecerá aquí.</p>
                <div className="c4u-actions-row">
                  <Link href="/productos" className="btn-close4u">
                    Ver productos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="order-list">
                {items.map((item) => (
                  <article key={item.id} className="order-card">
                    <div>
                      <p className="order-title">{item.name}</p>
                      <p className="order-meta">
                        {formatEUR(item.price)} / unidad · Total: {formatEUR(item.price * item.qty)}
                      </p>
                      <span className="badge-status badge-violet">En carrito</span>
                    </div>

                    <div style={{ display: "grid", gap: 8, minWidth: 120 }}>
                      <input
                        className="c4u-input"
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => setQty(item.id, Number(e.target.value))}
                        aria-label={`Cantidad de ${item.name}`}
                      />
                      <button className="btn-soft" type="button" onClick={() => removeItem(item.id)}>
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}

                <div className="c4u-actions-row">
                  <Link href="/carrito" className="btn-close4u">
                    Tramitar pedido
                  </Link>
                  <button className="btn-soft" type="button" onClick={clear}>
                    Vaciar carrito
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="section-card">
            <h2 className="section-title">Accesos rápidos</h2>
            <div className="prod-grid" style={{ marginTop: 14 }}>
              <Link href="/tiendas" className="prod-card">
                <p className="prod-title">Tiendas cercanas</p>
                <p className="prod-meta">Consultar comercios registrados por zona.</p>
              </Link>

              <Link href="/productos" className="prod-card">
                <p className="prod-title">Productos locales</p>
                <p className="prod-meta">Buscar productos y añadirlos al carrito.</p>
              </Link>

              <Link href="/buscador" className="prod-card">
                <p className="prod-title">Buscador</p>
                <p className="prod-meta">Encontrar servicios o comercios según ubicación.</p>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
