"use client";

import { Box, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import AxiosInstance from "../AxiosInstance";

import MyTextField from "./forms/MyTextField";
import MyPassField from "./forms/MyPassField";
import MyButton from "./forms/MyButton";

const LoginForm = () => {
  const { handleSubmit, control } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();

  const submission = (data) => {
    AxiosInstance.post(`login/`, {
      email: data.email,
      password: data.password,
    })
      .then((response) => {
        // Token knox
        localStorage.setItem("knox_token", response.data.token);

        // User safe
        const user = response.data.user || {};
        localStorage.setItem("user_email", user.email ?? "");
        localStorage.setItem("user_id", String(user.id ?? ""));

        // Role
        const role = response.data.role || "cliente";
        localStorage.setItem("role", role);

        // ✅ Redirect por rol
        router.replace(role === "comercio" ? "/comercio" : "/cliente");
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          err?.message ||
          "Error de login";
        console.error("Error during login:", msg);
      });
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
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
        >
          Iniciar sesión
        </Typography>

        <form onSubmit={handleSubmit(submission)}>
          <MyTextField
            label={"Email"}
            name={"email"}
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
            label={"Password"}
            name={"password"}
            control={control}
            rules={{
              required: "La contraseña es obligatoria",
            }}
          />

          <MyButton type={"submit"} label={"Entrar"} fullWidth sx={{ mt: 2 }} />
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;