"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AxiosInstance from "@/components/AxiosInstance";
import { formatEUR, useCart } from "@/components/cart/CartContext";

type ProductoPedido = {
  id_producto: number | null;
  producto: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
};

type PedidoCliente = {
  id_pedido: number;
  fecha: string | null;
  comercio: string;
  id_establecimiento: number | null;
  importe_total: string;
  metodo_pago: string;
  metodo_entrega: string;
  estado: string;
  productos: ProductoPedido[];
};

function getStoredToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
}

function formatearFecha(fecha: string | null) {
  if (!fecha) return "Fecha no disponible";

  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(fecha));
  } catch {
    return fecha;
  }
}

function normalizarEstado(estado: string) {
  if (!estado) return "Pendiente";

  return estado.charAt(0).toUpperCase() + estado.slice(1);
}

function claseEstado(estado: string) {
  const valor = estado.toLowerCase();

  if (valor.includes("confirm") || valor.includes("pag")) {
    return "badge-status badge-green";
  }

  if (valor.includes("pend")) {
    return "badge-status badge-violet";
  }

  if (valor.includes("cancel") || valor.includes("rechaz")) {
    return "badge-status badge-red";
  }

  return "badge-status badge-violet";
}

export default function PanelClientePage() {
  const { items, totals, setQty, removeItem, clear } = useCart();

  const [token, setToken] = useState<string | null>(null);
  const [pedidos, setPedidos] = useState<PedidoCliente[]>([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(false);
  const [errorPedidos, setErrorPedidos] = useState("");

  useEffect(() => {
    const storedToken = getStoredToken();
    setToken(storedToken);

    if (!storedToken) {
      setPedidos([]);
      return;
    }

    const cargarPedidos = async () => {
      setCargandoPedidos(true);
      setErrorPedidos("");

      try {
        const response = await AxiosInstance.get<PedidoCliente[]>(
          "/buscador/cliente/mis-pedidos/",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        setPedidos(response.data);
      } catch (error: any) {
        console.error("Error cargando pedidos del cliente", error);
        setErrorPedidos(
          error?.response?.data?.error ||
            error?.response?.data?.detail ||
            "No se han podido cargar tus pedidos."
        );
      } finally {
        setCargandoPedidos(false);
      }
    };

    cargarPedidos();
  }, []);

  return (
    <div className="page">
      <main className="tienda-page">
        <div className="tienda-container">
          <div className="tienda-head">
            <div>
              <p className="section-tag">Área privada</p>
              <h1 className="tienda-title">Panel de cliente</h1>
              <p className="tienda-muted">
                Zona preparada para consultar compras, carrito, tiendas y datos
                del usuario.
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
                Este panel está preparado para usuarios registrados. Puedes ver
                la maqueta, pero para datos reales debe iniciarse sesión.
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
                <p className="kpi-value">{pedidos.length}</p>
                <p className="kpi-meta">Compras realizadas</p>
              </article>

              <article className="kpi-card">
                <p className="kpi-label">Estado</p>
                <p className="kpi-value">Activo</p>
                <p className="kpi-meta">Cliente autenticado</p>
              </article>

              <article className="kpi-card">
                <p className="kpi-label">Rol</p>
                <p className="kpi-value">Cliente</p>
                <p className="kpi-meta">Panel de usuario</p>
              </article>
            </div>
          </section>

          <section className="section-card">
            <div className="tienda-head">
              <div>
                <h2 className="section-title">Mis pedidos</h2>
                <p className="tienda-muted">
                  Compras realizadas y estado actual de cada pedido.
                </p>
              </div>
            </div>

            {!token ? (
              <div className="est-card" style={{ marginTop: 14 }}>
                <p className="prod-title">
                  Inicia sesión para consultar tus pedidos.
                </p>
                <p className="prod-meta">
                  Cuando compres productos, aparecerán aquí con su estado.
                </p>
              </div>
            ) : cargandoPedidos ? (
              <div className="est-card" style={{ marginTop: 14 }}>
                <p className="prod-title">Cargando pedidos...</p>
                <p className="prod-meta">
                  Estamos consultando tus compras realizadas.
                </p>
              </div>
            ) : errorPedidos ? (
              <div className="est-card" style={{ marginTop: 14 }}>
                <p className="prod-title">No se han podido cargar los pedidos.</p>
                <p className="prod-meta">{errorPedidos}</p>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="est-card" style={{ marginTop: 14 }}>
                <p className="prod-title">Todavía no tienes pedidos realizados.</p>
                <p className="prod-meta">
                  Cuando finalices una compra, aparecerá aquí.
                </p>
                <div className="c4u-actions-row">
                  <Link href="/productos" className="btn-close4u">
                    Ver productos
                  </Link>
                </div>
              </div>
            ) : (
              <div className="order-list" style={{ marginTop: 14 }}>
                {pedidos.map((pedido) => (
                  <article key={pedido.id_pedido} className="order-card">
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 16,
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <p className="order-title">
                            Pedido #{pedido.id_pedido}
                          </p>
                          <p className="order-meta">
                            {pedido.comercio} · {formatearFecha(pedido.fecha)}
                          </p>
                        </div>

                        <span className={claseEstado(pedido.estado)}>
                          {normalizarEstado(pedido.estado)}
                        </span>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        {pedido.productos.map((producto) => (
                          <p
                            key={`${pedido.id_pedido}-${producto.id_producto}-${producto.producto}`}
                            className="prod-meta"
                            style={{ margin: "4px 0" }}
                          >
                            {producto.producto} · {producto.cantidad} ud. ·{" "}
                            {formatEUR(Number(producto.subtotal))}
                          </p>
                        ))}
                      </div>

                      <p className="order-meta" style={{ marginTop: 10 }}>
                        Entrega: {pedido.metodo_entrega || "No indicada"} · Pago:{" "}
                        {pedido.metodo_pago || "No indicado"}
                      </p>

                      <p className="prod-title" style={{ marginTop: 8 }}>
                        Total: {formatEUR(Number(pedido.importe_total))}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="section-card">
            <div className="tienda-head">
              <div>
                <h2 className="section-title">Mi carrito</h2>
                <p className="tienda-muted">
                  Productos seleccionados antes de finalizar el pedido.
                </p>
              </div>
              <Link href="/carrito" className="tienda-link">
                Ver carrito completo
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="est-card" style={{ marginTop: 14 }}>
                <p className="prod-title">
                  Todavía no hay productos en el carrito.
                </p>
                <p className="prod-meta">
                  Entra en productos, añade alguno y aparecerá aquí.
                </p>
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
                        {formatEUR(item.price)} / unidad · Total:{" "}
                        {formatEUR(item.price * item.qty)}
                      </p>
                      <span className="badge-status badge-violet">
                        En carrito
                      </span>
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
                      <button
                        className="btn-soft"
                        type="button"
                        onClick={() => removeItem(item.id)}
                      >
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
                <p className="prod-meta">
                  Consultar comercios registrados por zona.
                </p>
              </Link>

              <Link href="/productos" className="prod-card">
                <p className="prod-title">Productos locales</p>
                <p className="prod-meta">
                  Buscar productos y añadirlos al carrito.
                </p>
              </Link>

              <Link href="/buscador" className="prod-card">
                <p className="prod-title">Buscador</p>
                <p className="prod-meta">
                  Encontrar servicios o comercios según ubicación.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
