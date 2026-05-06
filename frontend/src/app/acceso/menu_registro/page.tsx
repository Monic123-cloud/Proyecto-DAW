"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

export default function RegisterSelector() {
  const router = useRouter();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={6}
      flexWrap="wrap"
      p={2}
    >
      {/* Usuario */}
      <Card
        sx={{
          width: 380,
          height: 500, 
          borderRadius: 3,
          overflow: "hidden",
          transition: "0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          height="220"
          image="/images/usuario-menu.jpg"
          alt="Usuario"
        />

        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Usuario
          </Typography>

          <Typography variant="body1" mb={2}>
            Participa en la comunidad.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => router.replace("/acceso/registro")}
          >
            Registrarme como usuario
          </Button>
        </CardContent>
      </Card>

      {/* Comercio */}
      <Card
        sx={{
          width: 380,
          height: 500, 
          borderRadius: 3,
          overflow: "hidden",
          transition: "0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          height="220"
          image="/images/imagen-comercio-menu.jpg"
          alt="Comercio"
        />

        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Comercio
          </Typography>

          <Typography variant="body1" mb={2}>
            Registra tu negocio y llega a más clientes.
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => router.push("/registroEstablecimiento")}
          >
            Registrar comercio
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}