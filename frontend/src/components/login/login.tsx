"use client";
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import AxiosInstance from '../AxiosInstance'
import StoreIcon from "@mui/icons-material/Store";
import MyTextField from "./forms/MyTextField";
import MyPassField from "./forms/MyPassField";
import MyButton from "./forms/MyButton";

const LoginForm = () => {

  type RegisterForm = {
    email: string;
    password: string;

  };
  const { handleSubmit, control } = useForm<RegisterForm>()
  const router = useRouter()

  const submission = (data: { email: any; password: any; }) => {
    AxiosInstance.post(`/auth/login/`, {
      email: data.email,
      password: data.password,
    })

      .then((response) => {
        console.log(response)
        localStorage.setItem('token', response.data.access)
        const decoded = JSON.parse(atob(response.data.access.split(".")[1]));
        console.log("DECODED:", decoded);
        setTimeout(() => {
          window.location.href = "/";
        }, 50);
      })
      .catch((error) => {

        console.error('Error during login', error)
      })
  }


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
          border: '4px solid #10b981'
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
            <MyTextField<RegisterForm>
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

            <MyButton
              type={"submit"}
              label={"Entrar"}
              fullWidth
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
      <Box>
        <Button
          startIcon={<StoreIcon />}
          component={Link}
          href="/registroEstablecimiento"
          variant="outlined"
          sx={{
            mt: 4,
            px: 5,
            py: 1.5,
            borderRadius: "999px",
            background: "linear-gradient(135deg, #34d399, #10b981)",
            color: "#fff",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            },
          }}
          fullWidth
        >
          Soy un comercio
        </Button>
      </Box>

    </Box>

  );
};
export default LoginForm