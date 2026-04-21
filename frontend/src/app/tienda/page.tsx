"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../../components/cart/CartContext";

type ApiProducto = {
  id_producto: number;
  tipo_producto: string;
  producto: string;
  stock?: number;
  precio: number | string;
  id_establecimiento: number;
};

type ApiEstablecimiento = {
  id_establecimiento: number;
  nombre_comercio: string;
  categoria?: string | null;
  municipio?: string | null;
  subcategoria?: string | null;
  productos: ApiProducto[];
};

export default function TiendaPage() {
  const { addItem } = useCart();

  const [ests, setEsts] = useState<ApiEstablecimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const categorias = useMemo(() => {
    const set = new Set<string>();
    for (const e of ests) {
      const c = (e.categoria ?? "").trim();
      if (c) set.add(c);
    }
    return ["Todas", ...Array.from(set).sort((a, b) => a.localeCompare(b, "es"))];
  }, [ests]);

  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  const estsFiltrados = useMemo(() => {
    if (categoriaActiva === "Todas") return ests;
    return ests.filter((e) => (e.categoria ?? "").trim() === categoriaActiva);
  }, [ests, categoriaActiva]);

  useEffect(() => {
    (async () => {
      try {
        const url = "http://127.0.0.1:8000/api/productos/establecimientos/";
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}: no se pudieron cargar establecimientos`);
        const data = (await res.json()) as ApiEstablecimiento[];
        setEsts(data);
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

      {/* categorías */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            style={{
              borderRadius: 999,
              padding: "8px 12px",
              fontWeight: 900,
              cursor: "pointer",
              border: "1px solid rgba(15,23,42,.12)",
              background: categoriaActiva === cat ? "#0f172a" : "white",
              color: categoriaActiva === cat ? "white" : "#0f172a",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p>Cargando…</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
        {estsFiltrados.map((e) => (
          <details
            key={e.id_establecimiento}
            style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: 14, background: "white" }}
          >
            <summary style={{ display: "flex", justifyContent: "space-between", cursor: "pointer", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 900 }}>{e.nombre_comercio}</div>
                <div style={{ opacity: 0.7, fontSize: 13 }}>
                  {(e.categoria ?? "")}
                  {e.subcategoria ? ` · ${e.subcategoria}` : ""}
                  {e.municipio ? ` · ${e.municipio}` : ""}
                </div>
              </div>
              <div style={{ opacity: 0.75, fontWeight: 800 }}>{e.productos?.length ?? 0} productos</div>
            </summary>

            {(!e.productos || e.productos.length === 0) ? (
              <p style={{ marginTop: 12, opacity: 0.7 }}>Este establecimiento no tiene productos.</p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 14,
                  marginTop: 14,
                }}
              >
                {e.productos.map((p) => {
                  const price = Number(p.precio ?? 0);
                  return (
                    <div
                      key={`${e.id_establecimiento}-${p.id_producto}`}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 16,
                        padding: 14,
                        background: "white",
                      }}
                    >
                      <div style={{ fontWeight: 900 }}>{p.producto}</div>
                      <div style={{ opacity: 0.75, marginTop: 6 }}>
                        Tipo: {p.tipo_producto}
                      </div>
                      <div style={{ marginTop: 10, fontWeight: 900 }}>
                        {(Number.isFinite(price) ? price : 0).toFixed(2)} €
                      </div>

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
                              id: `${e.id_establecimiento}-${p.id_producto}`,
                              id_producto: p.id_producto,
                              id_establecimiento: e.id_establecimiento,
                              name: `${p.producto} · ${e.nombre_comercio}`,
                              price: Number(p.precio),
                            },
                            1,
                          )
                        }
                      >
                        Añadir al carrito
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </details>
        ))}
      </div>
    </div>
  );
}