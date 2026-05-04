"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/header";
import { ENDPOINTS } from "@/app/config";

type Tienda = {
  id_establecimiento: number | string;
  nombre_comercio: string;
  direccion?: string;
  cp?: string;
  tipo?: string;
  promedio_valoraciones?: number;
  numero_valoraciones?: number;
};

export default function TiendasPage() {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [cp, setCp] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const query = cp.trim() ? `?cp=${encodeURIComponent(cp.trim())}` : "";

    setLoading(true);
    setError("");

    fetch(`${ENDPOINTS.BUSCADOR}${query}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar las tiendas");
        return res.json();
      })
      .then((data: Tienda[]) => {
        const soloTiendas = Array.isArray(data)
          ? data.filter((item) => item.tipo !== "servicio_propio")
          : [];
        setTiendas(soloTiendas);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [cp]);

  const total = useMemo(() => tiendas.length, [tiendas]);

  return (
    <div className="page">
      <Header />

      <main className="tienda-page">
        <div className="tienda-container">
          <div className="tienda-head">
            <div>
              <p className="section-tag">Tienda online</p>
              <h1 className="tienda-title">Tiendas disponibles</h1>
              <p className="tienda-muted">
                Comercios y productores locales registrados en Close4u.
              </p>
            </div>

            <Link href="/productos" className="tienda-link">
              Ver productos →
            </Link>
          </div>

          <div className="section-card">
            <div className="c4u-grid">
              <label className="c4u-field">
                <span className="c4u-label">Filtrar por código postal</span>
                <input
                  className="c4u-input"
                  value={cp}
                  onChange={(e) => setCp(e.target.value)}
                  placeholder="Ej: 28942"
                />
              </label>

              <div className="kpi-card">
                <p className="kpi-label">Tiendas encontradas</p>
                <p className="kpi-value">{loading ? "..." : total}</p>
                <p className="kpi-meta">Según el filtro actual</p>
              </div>
            </div>
          </div>

          {error && <p className="notice-err">{error}</p>}

          <div className="prod-grid" style={{ marginTop: 18 }}>
            {loading ? (
              <div className="est-card">Cargando tiendas...</div>
            ) : tiendas.length === 0 ? (
              <div className="est-card">
                No hay tiendas para mostrar con este filtro.
              </div>
            ) : (
              tiendas.map((tienda) => (
                <article key={tienda.id_establecimiento} className="est-card">
                  <h2 className="est-name">{tienda.nombre_comercio}</h2>
                  <p className="est-sub">
                    {tienda.direccion || "Dirección no disponible"}
                    {tienda.cp ? ` · CP ${tienda.cp}` : ""}
                  </p>

                  <p className="prod-meta">
                    Valoración: {tienda.promedio_valoraciones || 0} ⭐
                    {tienda.numero_valoraciones
                      ? ` (${tienda.numero_valoraciones} reseñas)`
                      : ""}
                  </p>

                  <div className="c4u-actions-row">
                    <Link
                      href={`/productos?establecimiento=${tienda.id_establecimiento}`}
                      className="btn-close4u"
                    >
                      Ver productos
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
