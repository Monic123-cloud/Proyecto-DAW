"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Dashboard() {
  // Estado para Analytics (Google)
  const [data, setData] = useState<{ visitas: any[]; conversion: any[] }>({
    visitas: [],
    conversion: [],
  });

  // Estado para la tabla de Voluntarios (Postgres)
  const [solicitudes, setSolicitudes] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // PETICIÓN 1: Analytics
    fetch("http://localhost:8000/api/analytics/")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al conectar con Analytics:", err);
        setLoading(false);
      });

    // PETICIÓN 2: Solicitudes de Ayuda (Separada)

    fetch('http://localhost:8000/api/buscador/solicitudes-ayuda/')
      .then((res) => res.json())
      .then((json) => setSolicitudes(json))
      .catch((err) => console.error("Error al cargar solicitudes:", err));
  }, []);

  if (loading)
    return <div className="p-5 text-center">Cargando Panel de Control...</div>;

  // Cálculos de Analytics
  const totalVisitas =
    data.conversion?.find((e) => e.nombre === "Visitas")?.valor || 0;
  const totalVentas =
    data.conversion?.find((e) => e.nombre === "Ventas")?.valor || 0;
  const ratioConversion =
    totalVisitas > 0 ? ((totalVentas / totalVisitas) * 100).toFixed(2) : 0;

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-primary fw-bold">Panel de Control General</h2>

      {/* SECCIÓN 1: KPI Rápido */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div
            className="card shadow border-0 p-3"
            style={{ borderLeft: "5px solid #0d6efd" }}
          >
            <h6 className="text-muted text-uppercase small fw-bold">
              Ratio de Conversión
            </h6>
            <h3 className="text-primary fw-bold mb-0">{ratioConversion}%</h3>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Gráficos de Analytics */}
      <div className="row mb-5">
        <div className="col-md-7 mb-4">
          <div className="card shadow border-0 p-4 h-100">
            <h5 className="fw-bold mb-4">Usuarios Activos (7 días)</h5>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={data.visitas}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eee"
                  />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="usuarios"
                    fill="#0d6efd"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-5 mb-4">
          <div className="card shadow border-0 p-4 h-100">
            <h5 className="fw-bold mb-4">Datos de Conversión</h5>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.conversion}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="valor"
                    nameKey="nombre"
                    label
                  >
                    {data.conversion?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: Tabla de Gestión de Voluntariado e Impacto Social */}
      <div className="card shadow border-0 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold text-dark mb-0">
            Seguimiento de Ayuda y Satisfacción
          </h5>
          <span className="badge bg-primary px-3">
            {solicitudes.length} Registros
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>C.P. / Contacto</th>
                <th>Estado Seguimiento</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.length > 0 ? (
                solicitudes.map((s, i) => (
                  <tr key={i}>
                    <td className="fw-bold">{s.nombre_completo}</td>
                    <td>
                      <span className="badge bg-light text-dark border me-2">
                        {s.cp}
                      </span>
                      <span className="text-primary fw-bold">{s.telefono}</span>
                    </td>
                    <td>
                      {/* Lógica de colores según el perfil del usuario */}
                      {s.requiere_llamada ? (
                        <span className="badge bg-danger p-2">
                          📞 PENDIENTE LLAMADA (MAYOR)
                        </span>
                      ) : s.encuesta_enviada ? (
                        <span className="badge bg-success p-2">
                          ✅ ENCUESTA ENVIADA
                        </span>
                      ) : (
                        <span className="badge bg-info text-dark p-2">
                          ⏳ EN ESPERA (7 DÍAS)
                        </span>
                      )}
                    </td>
                    <td>
                      {s.requiere_llamada ? (
                        <button className="btn btn-sm btn-outline-danger">
                          Registrar Llamada
                        </button>
                      ) : (
                        <span className="text-muted small">Automático</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
                    No hay solicitudes externas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
