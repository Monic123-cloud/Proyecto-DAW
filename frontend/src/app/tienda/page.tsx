"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../components/cart/CartContext";

type ApiProducto = {
  id_producto: number;
  tipo_producto: string;
  producto: string;
  precio: number;
};

export default function TiendaPage() {
  const { addItem } = useCart();
  const [items, setItems] = useState<ApiProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/productos/");
        if (!res.ok) throw new Error("No se pudieron cargar productos");
        const data = (await res.json()) as ApiProducto[];
        setItems(data);
      } catch (e: any) {
        setErr(e?.message ?? "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 18, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Tienda</h1>
        <Link href="/carrito">Ir al carrito</Link>
      </div>

      {loading && <p>Cargando…</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
          marginTop: 14,
        }}
      >
        {items.map((p) => (
          <div
            key={p.id_producto}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              padding: 14,
              background: "white",
            }}
          >
            <div style={{ fontWeight: 900 }}>{p.producto}</div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>Tipo: {p.tipo_producto}</div>
            <div style={{ marginTop: 10, fontWeight: 900 }}>{Number(p.precio).toFixed(2)} €</div>

            <button
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 999,
                fontWeight: 900,
                cursor: "pointer",
              }}
              onClick={() =>
                addItem(
                  {
                    id: String(p.id_producto),
                    name: p.producto,
                    price: Number(p.precio),
                  },
                  1
                )
              }
            >
              Añadir al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}