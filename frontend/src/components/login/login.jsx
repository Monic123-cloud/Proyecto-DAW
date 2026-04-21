"use client";

import { Box, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import AxiosInstance from "../AxiosInstance";

import MyTextField from "./forms/MyTextField";
import MyPassField from "./forms/MyPassField";
import MyButton from "./forms/MyButton";

const LoginForm = () => {
  const { handleSubmit, control } = useForm();
  const router = useRouter();

  const submission = (data) => {
    AxiosInstance.post(`login/`, {
      email: data.email,
      password: data.password,
    })
      .then((response) => {
        console.log(response);

        // ✅ Token
        localStorage.setItem("knox_token", response.data.token);

        // ✅ user
        if (response.data.user) {
          localStorage.setItem("user_email", response.data.user.email ?? "");
          localStorage.setItem("user_id", String(response.data.user.id ?? ""));
        }

        // ✅ role + establecimiento (si aplica)
        const role = response.data.role ?? "cliente";
        localStorage.setItem("role", role);

        if (response.data.establecimiento?.id_establecimiento) {
          localStorage.setItem(
            "establecimiento_id",
            String(response.data.establecimiento.id_establecimiento)
          );
        } else {
          localStorage.removeItem("establecimiento_id");
        }

        // ✅ redirección dinámica
        if (role === "comercio") router.push("/comercio");
        else router.push("/cliente");
      })
      .catch((error) => {
        console.error("Error during login", error);
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
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}>
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