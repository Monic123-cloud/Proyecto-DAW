"use client";

import { Box, Paper, Typography, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AxiosInstance from "../AxiosInstance";

import MyTextField from "./forms/MyTextField";
import MyPassField from "./forms/MyPassField";
import MyButton from "./forms/MyButton";

export default function LoginForm() {
  const { handleSubmit, control } = useForm();
  const router = useRouter();

  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const submission = async (data) => {
    setErrMsg(null);
    setLoading(true);

    try {
      const res = await AxiosInstance.post("login/", {
        email: data.email,
        password: data.password,
      });

      // ✅ Guarda token (mismo nombre en todo el proyecto)
      localStorage.setItem("knox_token", res.data?.token ?? "");

      // ✅ Guarda user (si viene)
      if (res.data?.user) {
        localStorage.setItem("user_email", res.data.user.email ?? "");
        localStorage.setItem("user_id", String(res.data.user.id ?? ""));
        // si backend devuelve role/rol/tipo lo guardamos
        if (res.data.user.role) localStorage.setItem("user_role", res.data.user.role);
        if (res.data.user.rol) localStorage.setItem("user_role", res.data.user.rol);
      }

      // ✅ Redirección por rol (prioridad: response -> localStorage -> fallback)
      const role =
        res.data?.user?.role ||
        res.data?.user?.rol ||
        localStorage.getItem("user_role") ||
        "cliente";

      router.push(role === "comercio" ? "/comercio" : "/cliente");
    } catch (error) {
      // Si NO hay error.response => típico CORS / backend no accesible
      if (!error?.response) {
        setErrMsg(
          "Network Error: el navegador no puede leer la respuesta. Suele ser CORS (backend no permite localhost:3000) o el backend no es accesible."
        );
      } else {
        const msg =
          error.response?.data?.error ||
          error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          `HTTP ${error.response?.status}`;
        setErrMsg(msg);
      }
      console.error("Error during login", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, rgb(233,255,235), rgb(250,255,217))",
        p: 2,
      }}
    >
      <Paper
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: "20px",
          background: "rgba(255,255,255,0.95)",
          border: "4px solid #10b981",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}>
          Iniciar sesión
        </Typography>

        {errMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {String(errMsg)}
          </Alert>
        )}

        <form onSubmit={handleSubmit(submission)}>
          <MyTextField
            label={"Email"}
            name={"email"}
            control={control}
            rules={{
              required: "El correo es obligatorio",
              pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
            }}
          />

          <MyPassField
            label={"Password"}
            name={"password"}
            control={control}
            rules={{ required: "La contraseña es obligatoria" }}
          />

          <MyButton
            type={"submit"}
            label={loading ? "Entrando..." : "Entrar"}
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          />
        </form>
      </Paper>
    </Box>
  );
}