"use client";

import { Box, Button, Link, Paper, Stack, Typography, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import AxiosInstance from "../AxiosInstance";
import StoreIcon from "@mui/icons-material/Store";
import MyTextField from "./forms/MyTextField";
import MyPassField from "./forms/MyPassField";
import MyButton from "./forms/MyButton";
import { useState } from "react";

type RegisterForm = {
  email: string;
  password: string;
};

function getErrorMessage(error: any): string {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.error ||
    error?.message ||
    "No se ha podido iniciar sesión."
  );
}

const LoginForm = () => {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control } = useForm<RegisterForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submission = async (data: RegisterForm) => {
    setError("");
    setLoading(true);

    try {

      const response = await AxiosInstance.post("/auth/login/", {
        email: data.email,
        password: data.password,
      });

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      if (!accessToken) {
        throw new Error("El backend no ha devuelto token de acceso.");
      }

      /*
        Guardamos el token con varios nombres porque otras partes del proyecto
        consultan token/access/access_token.
      */
      localStorage.setItem("token", accessToken);
      localStorage.setItem("access", accessToken);
      localStorage.setItem("access_token", accessToken);

      if (refreshToken) {
        localStorage.setItem("refresh", refreshToken);
      }

      /*
        Cambio de rol real:
        Después de validar usuario/contraseña, preguntamos al backend
        si ese usuario tiene un comercio asociado.
      */
      try {
        await AxiosInstance.get("/buscador/establecimiento/mi_local/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        localStorage.setItem("tipo", "comercio");
        router.push("/panel-comercio");
      } catch {
        localStorage.setItem("tipo", "cliente");
        router.push("/panel-cliente");
      }
    } catch (error: any) {
      console.error("Error during login", error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, rgb(233,255,235), rgb(250,255,217))",
        p: 2,
      }}
    >
      <Paper
        sx={{
          p: 6,
          width: "100%",
          maxWidth: 400,
          borderRadius: "20px",
          background: "rgba(255,255,255,0.95)",
          border: "4px solid #10b981",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
        >
          Iniciar sesión
        </Typography>

        <form onSubmit={handleSubmit(submission)}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            <MyTextField
              label="Email"
              name="email"
              control={control}
              rules={{
                required: "El correo es obligatorio",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Correo inválido",
                },
              }}
            />

            <MyPassField
              label="Password"
              name="password"
              control={control}
              rules={{
                required: "La contraseña es obligatoria",
              }}
            />

            <MyButton
              type="submit"
              label={loading ? "Entrando..." : "Entrar"}
              fullWidth
              disabled={loading}
              sx={{ mt: 4 }}
            />

            <Button
              component={Link}
              href="/acceso/registro"
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "#10b981",
                backgroundColor: "#d1b3ff",
                "&:hover": {
                  backgroundColor: "#c49eff",
                },
              }}
              fullWidth
            >
              No tengo cuenta
            </Button>
          </Stack>
        </form>
      </Paper>

      
    </Box>
  );
};

export default LoginForm;
