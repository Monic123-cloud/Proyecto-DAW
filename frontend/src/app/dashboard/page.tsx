"use client";

import { useEffect, useState } from "react";
import {
  Grid,
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Divider,
} from "@mui/material";
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
import { ENDPOINTS } from "../config";

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#9c27b0", "#d32f2f"];

// Definición de tipos para evitar errores de compilación
interface DashboardData {
  db: {
    usuariosTotales: number;
    comerciosActivos: number;
    pedidosRealizados: number;
  };
  ga4: {
    grafica_semanal: any[];
    total_historico: number;
    cp_mas_buscados: any[];
  };
  conversion: any[]; // Mantengo esto aquí para tu lógica de ventas/visitas
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DashboardData>({
    db: { usuariosTotales: 0, comerciosActivos: 0, pedidosRealizados: 0 },
    ga4: { grafica_semanal: [], total_historico: 0, cp_mas_buscados: [] },
    conversion: [],
  });
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        const [resAnalytics, resSolicitudes] = await Promise.all([
          fetch(ENDPOINTS.ANALYTICS),
          fetch(ENDPOINTS.SOLICITUDES),
        ]);

        if (resAnalytics.ok && resSolicitudes.ok) {
          const jsonAnalytics = await resAnalytics.json();
          const jsonSolicitudes = await resSolicitudes.json();

          setData(jsonAnalytics);
          setSolicitudes(jsonSolicitudes);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted]);

  if (!mounted) return null;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Cargando Panel de Control...
        </Typography>
      </Box>
    );
  }

  // Lógica de cálculo original (ahora usando data.conversion que viene del backend)
  const totalVisitasSemana =
    data.conversion?.find((e) => e.nombre === "Visitas")?.valor || 0;
  const totalVentas =
    data.conversion?.find((e) => e.nombre === "Ventas")?.valor || 0;
  const ratioConversion =
    totalVisitasSemana > 0
      ? ((totalVentas / totalVisitasSemana) * 100).toFixed(2)
      : "0.00";

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Panel de Control General
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitorización en tiempo real de impacto social y métricas web.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* KPI: Ratio Conversión */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderLeft: "6px solid #1976d2", borderRadius: 2 }}
          >
            <Typography
              variant="overline"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              Ratio de Conversión
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1 }}>
              {ratioConversion}%
            </Typography>
          </Paper>
        </Grid>

        {/* KPI: Total Visitas (GA4) - Ahora muestra el histórico real */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderLeft: "6px solid #2e7d32", borderRadius: 2 }}
          >
            <Typography
              variant="overline"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              Total Visitas (GA4)
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1 }}>
              {data.ga4.total_historico}
            </Typography>
          </Paper>
        </Grid>
        {/* KPI: Usuarios Totales */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderLeft: "6px solid #0288d1", borderRadius: 2 }}
          >
            <Typography
              variant="overline"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              Usuarios Totales
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1 }}>
              {data.db.usuariosTotales}
            </Typography>
          </Paper>
        </Grid>

        {/* KPI: Comercios Activos */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderLeft: "6px solid #7b1fa2", borderRadius: 2 }}
          >
            <Typography
              variant="overline"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              Comercios Activos
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1 }}>
              {data.db.comerciosActivos}
            </Typography>
          </Paper>
        </Grid>

        {/* KPI: Pedidos Realizados */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={3}
            sx={{ p: 3, borderLeft: "6px solid #d32f2f", borderRadius: 2 }}
          >
            <Typography
              variant="overline"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              Pedidos Realizados
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", mt: 1 }}>
              {data.db.pedidosRealizados}
            </Typography>
          </Paper>
        </Grid>

        {/* Gráfica: Usuarios Activos (7 días) */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: "450px" }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
              Usuarios Activos (Últimos 7 días)
            </Typography>
            <Box sx={{ width: "100%", height: 350 }}>
              {" "}
              {/* Altura fija para evitar el error de consola */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.ga4.grafica_semanal}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "#f5f5f5" }} />
                  <Bar
                    dataKey="usuarios"
                    fill="#1976d2"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Gráfica: Distribución de Eventos (Pie Chart Original) */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: "450px" }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
              Distribución de Eventos
            </Typography>
            <Box sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.conversion}
                    innerRadius={70}
                    outerRadius={100}
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
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Tabla de Solicitudes */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#f8f9fa",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Seguimiento de Ayuda
              </Typography>
              <Chip
                label={`${solicitudes.length} Registros`}
                color="primary"
                sx={{ fontWeight: "bold" }}
              />
            </Box>
            <Divider />
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Nombre Completo
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      C.P. / Contacto
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {solicitudes.length > 0 ? (
                    solicitudes.map((s, i) => (
                      <TableRow key={i} hover>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {s.nombre_completo}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={s.cp}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                          />
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: "primary.main", fontWeight: "bold" }}
                          >
                            {s.telefono}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {s.requiere_llamada ? (
                            <Chip
                              label="📞 PENDIENTE"
                              color="error"
                              size="small"
                            />
                          ) : (
                            <Chip label="✅ OK" color="success" size="small" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {s.requiere_llamada ? (
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                            >
                              Llamar
                            </Button>
                          ) : (
                            <Typography variant="caption" color="text.disabled">
                              Automático
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                        No hay solicitudes.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
