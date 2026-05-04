"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import { ENDPOINTS } from "@/app/config";
import { formatEUR, useCart } from "@/components/cart/CartContext";

type Producto = {
  id_producto: number;
  comercio_nombre?: string;
  comercio_cp?: string;
  comercio_municipio?: string;
  comercio_direccion?: string;
  tipo_producto?: string;
  producto: string;
  stock?: number | null;
  precio: string | number;
};

export default function ProductoDetallePage() {
  const params = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;

    setLoading(true);
    setError("");

    fetch(`${ENDPOINTS.PRODUCTOS}${params.id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar el producto");
        return res.json();
      })
      .then((data: Producto) => setProducto(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  const precio = producto ? Number(producto.precio) : 0;
  const sinStock = producto?.stock !== null && producto?.stock !== undefined && producto.stock <= 0;

  return (
    <div className="page">
      <Header />

      <main className="tienda-page">
        <div className="tienda-container">
          <Link href="/productos" className="tienda-link">
            ← Volver a productos
          </Link>

          {loading ? (
            <div className="est-card" style={{ marginTop: 18 }}>Cargando producto...</div>
          ) : error ? (
            <p className="notice-err">{error}</p>
          ) : producto ? (
            <article className="section-card" style={{ marginTop: 18 }}>
              <p className="section-tag">Detalle del producto</p>
              <h1 className="tienda-title">{producto.producto}</h1>

              <div className="prod-grid" style={{ marginTop: 18 }}>
                <div className="prod-card">
                  <p className="kpi-label">Precio</p>
                  <p className="kpi-value">{formatEUR(precio)}</p>
                </div>

                <div className="prod-card">
                  <p className="kpi-label">Stock</p>
                  <p className="kpi-value">{producto.stock ?? "Consultar"}</p>
                </div>

                <div className="prod-card">
                  <p className="kpi-label">Tipo</p>
                  <p className="kpi-value">{producto.tipo_producto || "Producto local"}</p>
                </div>
              </div>

              <div className="est-card" style={{ marginTop: 18 }}>
                <h2 className="est-name">{producto.comercio_nombre || "Comercio local"}</h2>
                <p className="est-sub">
                  {producto.comercio_direccion || "Dirección no indicada"}
                  {producto.comercio_municipio ? ` · ${producto.comercio_municipio}` : ""}
                  {producto.comercio_cp ? ` · CP ${producto.comercio_cp}` : ""}
                </p>
              </div>

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
                  {sinStock ? "Sin stock" : "Añadir al carrito"}
                </button>

                <Link href="/carrito" className="tienda-link">
                  Ir al carrito
                </Link>
              </div>
            </article>
          ) : null}
        </div>
      </main>
    </div>
  );
}
