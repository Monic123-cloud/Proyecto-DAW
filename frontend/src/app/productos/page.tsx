"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import { ENDPOINTS } from "@/app/config";
import { formatEUR, useCart } from "@/components/cart/CartContext";

type Producto = {
  id_producto: number;
  id_establecimiento?: number;
  comercio_nombre?: string;
  comercio_cp?: string;
  comercio_municipio?: string;
  comercio_direccion?: string;
  tipo_producto?: string;
  producto: string;
  stock?: number | null;
  precio: string | number;
};

function ProductosContent() {
  const params = useSearchParams();
  const establecimiento = params.get("establecimiento") || "";
  const { addItem } = useCart();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [q, setQ] = useState("");
  const [cp, setCp] = useState("");
  const [tipo, setTipo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams();

    if (q.trim()) query.set("q", q.trim());
    if (cp.trim()) query.set("cp", cp.trim());
    if (tipo.trim()) query.set("tipo", tipo.trim());
    if (establecimiento) query.set("establecimiento", establecimiento);

    setLoading(true);
    setError("");

    fetch(`${ENDPOINTS.PRODUCTOS}${query.toString() ? `?${query.toString()}` : ""}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar los productos");
        return res.json();
      })
      .then((data: Producto[]) => setProductos(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [q, cp, tipo, establecimiento]);

  const tipos = useMemo(() => {
    const valores = productos
      .map((p) => p.tipo_producto)
      .filter((v): v is string => Boolean(v));
    return Array.from(new Set(valores));
  }, [productos]);

  return (
    <main className="tienda-page">
      <div className="tienda-container">
        <div className="tienda-head">
          <div>
            <p className="section-tag">Productos</p>
            <h1 className="tienda-title">Productos de comercios locales</h1>
            <p className="tienda-muted">
              Busca productos, filtra por zona y añádelos al carrito.
            </p>
          </div>

          <Link href="/carrito" className="tienda-link">
            Ver carrito →
          </Link>
        </div>

        <section className="section-card">
          <div className="c4u-grid">
            <label className="c4u-field">
              <span className="c4u-label">Buscar producto</span>
              <input
                className="c4u-input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ej: pan, tomate, aceite..."
              />
            </label>

            <label className="c4u-field">
              <span className="c4u-label">Código postal</span>
              <input
                className="c4u-input"
                value={cp}
                onChange={(e) => setCp(e.target.value)}
                placeholder="Ej: 28942"
              />
            </label>

            <label className="c4u-field">
              <span className="c4u-label">Tipo</span>
              <input
                className="c4u-input"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Ej: alimentación"
              />
            </label>
          </div>

          {tipos.length > 0 && (
            <div className="tienda-chips">
              <button
                type="button"
                className={`tienda-chip ${tipo === "" ? "is-active" : ""}`}
                onClick={() => setTipo("")}
              >
                Todos
              </button>
              {tipos.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`tienda-chip ${tipo === item ? "is-active" : ""}`}
                  onClick={() => setTipo(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </section>

        {error && <p className="notice-err">{error}</p>}

        <div className="prod-grid" style={{ marginTop: 18 }}>
          {loading ? (
            <div className="est-card">Cargando productos...</div>
          ) : productos.length === 0 ? (
            <div className="est-card">
              No hay productos disponibles con estos filtros.
            </div>
          ) : (
            productos.map((producto) => {
              const precio = Number(producto.precio);
              const sinStock = producto.stock !== null && producto.stock !== undefined && producto.stock <= 0;

              return (
                <article key={producto.id_producto} className="prod-card">
                  <p className="prod-title">{producto.producto}</p>
                  <p className="prod-meta">
                    {producto.tipo_producto || "Producto local"}
                    {producto.comercio_nombre ? ` · ${producto.comercio_nombre}` : ""}
                  </p>
                  <p className="prod-meta">
                    {producto.comercio_municipio || "Zona no indicada"}
                    {producto.comercio_cp ? ` · CP ${producto.comercio_cp}` : ""}
                  </p>
                  <p className="prod-price">{formatEUR(precio)}</p>
                  <p className="prod-meta">
                    Stock: {producto.stock ?? "consultar"}
                  </p>

                  <div className="c4u-actions-row">
                    <button
                      className="btn-close4u"
                      type="button"
                      disabled={sinStock}
                      onClick={() =>
                        addItem({
                          id: String(producto.id_producto),
                          name: producto.producto,
                          price: precio,
                        })
                      }
                    >
                      {sinStock ? "Sin stock" : "Añadir"}
                    </button>

                    <Link href={`/producto/${producto.id_producto}`} className="tienda-link">
                      Detalle
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProductosPage() {
  return (
    <div className="page">
      <Header />
      <Suspense fallback={<main className="tienda-page"><div className="tienda-container">Cargando...</div></main>}>
        <ProductosContent />
      </Suspense>
    </div>
  );
}
