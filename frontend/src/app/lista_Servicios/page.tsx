"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ENDPOINTS } from "../config";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import Header from "@/components/header";

type Servicio = {
  id_servicio: number;
  categoria: string;
  descripcion: string;
  precio_hora: string;
  cp: string;
};

const ListaServicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cp, setCp] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchServicios = async (codigoPostal = "") => {
    setLoading(true);
    try {
      let url = ENDPOINTS.SERVICIOS;

      if (codigoPostal) {
        url += `?cp=${codigoPostal}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      setServicios(data);
    } catch (error) {
      console.error("Error cargando servicios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  return (
    <><Header></Header><Box sx={{ p: 3 }}>


          <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h5">Servicios</Typography>

              <Button
                  variant="contained"
                  onClick={() => router.push("/registroServicio")}
              >
                  + Agregar servicio
              </Button>
          </Box>


          <Box display="flex" gap={2} mb={3}>
              <TextField
                  label="Filtrar por CP"
                  value={cp}
                  onChange={(e) => setCp(e.target.value)} />

              <Button
                  variant="outlined"
                  onClick={() => fetchServicios(cp)}
              >
                  Buscar
              </Button>

              <Button
                  variant="text"
                  onClick={() => {
                      setCp("");
                      fetchServicios();
                  } }
              >
                  Limpiar
              </Button>
          </Box>


          {loading ? (
              <p>Cargando...</p>
          ) : servicios.length === 0 ? (
              <p>No hay servicios</p>
          ) : (
              servicios.map((serv) => (
                  <Paper key={serv.id_servicio} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="h6">{serv.categoria}</Typography>
                      <Typography>{serv.descripcion}</Typography>
                      <Typography color="primary">
                          {serv.precio_hora} €/hora
                      </Typography>
                      <Typography variant="caption">
                          CP: {serv.cp}
                      </Typography>
                  </Paper>
              ))
          )}
      </Box></>
  );
};

export default ListaServicios;