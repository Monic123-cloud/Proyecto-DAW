"use client";

import { useMemo, useState } from "react";

type ProductoForm = {
  tipo_producto: string;
  producto: string;
  stock: number;
  precio: number;
};

type CreatedResponse =
  | { ok: true; id_producto: number }
  | { ok: false; error: string };

type Creado = ProductoForm & {
  id_producto: number;
  createdAt: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export default function AltaProductoPage() {
  const [form, setForm] = useState<ProductoForm>({
    tipo_producto: "",
    producto: "",
    stock: 0,
    precio: 0,
  });

  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [creados, setCreados] = useState<Creado[]>([]);

  const canSubmit = useMemo(() => {
    return form.tipo_producto.trim().length > 0 && form.producto.trim().length > 0;
  }, [form]);

  const setField = <K extends keyof ProductoForm>(key: K, value: ProductoForm[K]) => {
    setOkMsg(null);
    setErrMsg(null);
    setForm((p) => ({ ...p, [key]: value }));
  };

  const reset = () => {
    setOkMsg(null);
    setErrMsg(null);
    setForm((p) => ({
      ...p,
      tipo_producto: "",
      producto: "",
      stock: 0,
      precio: 0,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setOkMsg(null);
    setErrMsg(null);

    try {
      const token = localStorage.getItem("knox_token");
      if (!token) throw new Error("No hay sesión. Inicia sesión como comercio.");

      const res = await fetch(`${API_BASE}/api/productos/alta/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`, // ✅ Knox
        },
        body: JSON.stringify({
          tipo_producto: form.tipo_producto,
          producto: form.producto,
          stock: form.stock,
          precio: form.precio,
        }),
      });

      const data = (await res.json()) as CreatedResponse;

      if (!res.ok || !("ok" in data) || data.ok === false) {
        throw new Error("error" in data ? data.error : `HTTP ${res.status}`);
      }

      setOkMsg(`Guardado ✅ id_producto: ${data.id_producto}`);
      setCreados((prev) => [
        {
          ...form,
          id_producto: data.id_producto,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      reset();
    } catch (err: any) {
      setErrMsg(err?.message ?? "Error guardando producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <main className="tienda-page">
        <div className="tienda-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <h1 className="tienda-title">Alta de producto</h1>
          </div>

          <p className="tienda-muted" style={{ marginTop: 8 }}>
            Endpoint: <code>{API_BASE}/api/productos/alta/</code>
          </p>

          <div className="est-card" style={{ marginTop: 14 }}>
            <form onSubmit={submit} className="c4u-form">
              <div className="c4u-grid">
                <div className="c4u-field">
                  <label className="c4u-label">Tipo de producto</label>
                  <input
                    className="c4u-input"
                    value={form.tipo_producto}
                    onChange={(e) => setField("tipo_producto", e.target.value)}
                    placeholder="Ej: Alimentación / Ocio / Salud…"
                  />
                </div>

                <div className="c4u-field" style={{ gridColumn: "1 / -1" }}>
                  <label className="c4u-label">Producto</label>
                  <input
                    className="c4u-input"
                    value={form.producto}
                    onChange={(e) => setField("producto", e.target.value)}
                    placeholder="Ej: Tomate ecológico / Entrada / Masaje…"
                  />
                </div>

                <div className="c4u-field">
                  <label className="c4u-label">Stock</label>
                  <input
                    className="c4u-input"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setField("stock", Number(e.target.value) || 0)}
                  />
                </div>

                <div className="c4u-field">
                  <label className="c4u-label">Precio (€)</label>
                  <input
                    className="c4u-input"
                    type="number"
                    step="0.01"
                    value={form.precio}
                    onChange={(e) => setField("precio", Number(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="c4u-actions-row">
                <button className="btn-close4u" type="submit" disabled={!canSubmit || loading}>
                  {loading ? "Guardando…" : "Guardar producto"}
                </button>

                <button type="button" className="tienda-cat" onClick={reset} disabled={loading}>
                  Limpiar
                </button>

                <span className="tienda-muted" style={{ marginLeft: "auto" }}>
                  {canSubmit ? "Listo para enviar" : "Completa tipo y nombre"}
                </span>
              </div>

              {okMsg && <p style={{ color: "#059669", fontWeight: 900, marginTop: 10 }}>{okMsg}</p>}
              {errMsg && <p style={{ color: "crimson", fontWeight: 900, marginTop: 10 }}>{errMsg}</p>}
            </form>
          </div>

          <div className="est-card" style={{ marginTop: 14 }}>
            <h2 style={{ marginTop: 0, color: "#0f172a" }}>Últimos productos creados</h2>
            {creados.length === 0 ? (
              <p className="tienda-muted" style={{ margin: 0 }}>
                Aún no has creado ninguno.
              </p>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {creados.map((p) => (
                  <div
                    key={p.id_producto}
                    style={{
                      border: "1px solid rgba(15,23,42,.10)",
                      borderRadius: 14,
                      padding: 12,
                      background: "rgba(15,23,42,.02)",
                    }}
                  >
                    <div style={{ fontWeight: 950 }}>
                      #{p.id_producto} · {p.producto} <span className="tienda-muted">({p.tipo_producto})</span>
                    </div>
                    <div className="tienda-muted" style={{ marginTop: 4 }}>
                      Stock: {p.stock} · Precio: {p.precio.toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}