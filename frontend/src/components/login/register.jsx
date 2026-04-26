"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import AxiosInstance from "../AxiosInstance";

import MyTextField from "./forms/MyTextField";
import MyPassField from "./forms/MyPassField";
import MyButton from "./forms/MyButton";
import MySelect from "./forms/MySelect.jsx";
import MyDatePicker from "./forms/DatePicker";

import {
  Paper,
  Box,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";

dayjs.extend(customParseFormat);

function makeAuthId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `auth_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

function formatAxiosError(err) {
  if (!err?.response) return err?.message || "Error de red (¿backend caído / CORS?)";

  const { status, data } = err.response;

  if (typeof data === "string") return `HTTP ${status}: ${data}`;

  // DRF típico: {campo: ["msg"]}
  if (data && typeof data === "object") {
    if (data.error) return data.error;
    if (data.detail) return data.detail;

    // convierte {campo:["x"]} en texto legible
    const keys = Object.keys(data);
    if (keys.length) {
      const lines = keys.map((k) => `${k}: ${Array.isArray(data[k]) ? data[k].join(" ") : String(data[k])}`);
      return lines.join(" | ");
    }
  }

  return `HTTP ${status}: ${JSON.stringify(data)}`;
}

export default function Register() {
  const router = useRouter();
  const { handleSubmit, control } = useForm({
    defaultValues: { voluntariado: false },
  });

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const [okMsg, setOkMsg] = useState(null);

  const submission = async (data) => {
    setErrMsg(null);
    setOkMsg(null);

    if ((data.password ?? "") !== (data.password2 ?? "")) {
      setErrMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      // ✅ fecha siempre YYYY-MM-DD
      const fecha = data.fecha_nacimiento
        ? dayjs(data.fecha_nacimiento).format("YYYY-MM-DD")
        : null;

      const payload = {
        // mínimos
        email: data.email,
        password: data.password,
        username: data.email, // por si tu backend lo necesita

        // perfil
        nombre: data.nombre,
        apellidos: data.apellidos,
        auth_id: makeAuthId(),

        sexo: data.sexo,
        fecha_nacimiento: fecha,
        telefono: data.telefono,

        direccion: data.direccion,
        numero: data.numero,
        piso: data.piso,
        letra: data.letra,

        municipio: data.municipio,
        provincia: data.provincia,
        cp: data.cp,

        latitud: data.latitud,
        longitud: data.longitud,

        voluntariado: !!data.voluntariado,
      };

      // ✅ 1º intenta endpoint cliente (si existe), si no existe -> fallback a register/
      try {
        await AxiosInstance.post("register/cliente/", payload);
      } catch (err) {
        if (err?.response?.status === 404) {
          await AxiosInstance.post("register/", payload);
        } else {
          throw err;
        }
      }

      setOkMsg("Usuario creado ✅ Ya puedes iniciar sesión.");
      router.push("/acceso/login");
    } catch (err) {
      setErrMsg(formatAxiosError(err));
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
        backgroundImage: `
          linear-gradient(rgba(255,255,163,0.67), rgba(255,255,255,0.09)),
          url("/images/background2.jpg")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "20px",
          width: "100%",
          maxWidth: 600,
          border: "4px solid #10b981",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(2px)",
        }}
      >
        <form onSubmit={handleSubmit(submission)}>
          <Box className={"whiteBox"}>
            <Box className={"itemBox"}>
              <Box
                sx={{
                  typography: "h4",
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "primary.dark",
                }}
              >
                Alta de usuario (cliente)
              </Box>
            </Box>

            {errMsg && (
              <Box sx={{ mb: 2 }}>
                <Alert severity="error">{String(errMsg)}</Alert>
              </Box>
            )}
            {okMsg && (
              <Box sx={{ mb: 2 }}>
                <Alert severity="success">{String(okMsg)}</Alert>
              </Box>
            )}

            <Box className={"itemBox"}>
              <MyTextField
                label={"Nombre"}
                name={"nombre"}
                control={control}
                rules={{ required: "Obligatorio" }}
              />
            </Box>

            <Box className={"itemBox"}>
              <MyTextField
                label={"Apellidos"}
                name={"apellidos"}
                control={control}
                rules={{ required: "Obligatorio" }}
              />
            </Box>

            <Box className={"itemBox"}>
              <MyTextField
                label={"Correo"}
                name={"email"}
                control={control}
                rules={{
                  required: "Obligatorio",
                  pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
                }}
              />
            </Box>

            <Box className={"itemBox"}>
              <MySelect
                label={"Sexo"}
                name={"sexo"}
                control={control}
                options={[
                  { value: "", label: "Selecciona" },
                  { value: "Mujer", label: "Mujer" },
                  { value: "Hombre", label: "Hombre" },
                  { value: "Otro", label: "Otro" },
                  { value: "No decirlo", label: "Prefiero no decirlo" },
                ]}
              />
            </Box>

            <Box className={"itemBox"}>
              <MyDatePicker
                control={control}
                name="fecha_nacimiento"
                label="Fecha de nacimiento"
                rules={{ required: "Obligatorio" }}
              />
            </Box>

            <Box className={"itemBox"}>
              <MyTextField label={"Teléfono"} name={"telefono"} control={control} />
            </Box>

            <Box className={"itemBox"}>
              <MyTextField label={"Dirección"} name={"direccion"} control={control} />
            </Box>

            <Box className={"itemBox"}>
              <MyTextField label={"Número"} name={"numero"} control={control} />
            </Box>

            <Box className={"itemBox"}>
              <MyTextField label={"Piso"} name={"piso"} control={control} />
            </Box>

            <Box className={"itemBox"}>
              <MyTextField label={"Letra"} name={"letra"} control={control} />
            </Box>

            <Box className={"itemBox"}>
              <MyTextField label={"Municipio"} name={"municipio"} control={control} />
            </Box>

            <Box className={"itemBox"}>
              <MyTextField label={"Provincia"} name={"provincia"} control={control} />
            </Box>

            <Box className={"itemBox"}>
              <MyTextField label={"CP"} name={"cp"} control={control} />
            </Box>

            <Box className={"itemBox"}>
              <MyPassField
                label={"Password"}
                name={"password"}
                control={control}
                rules={{ required: "Obligatorio" }}
              />
            </Box>

            <Box className={"itemBox"}>
              <MyPassField
                label={"Confirm password"}
                name={"password2"}
                control={control}
                rules={{ required: "Obligatorio" }}
              />
            </Box>

            <Box display="flex" justifyContent="center">
              <Controller
                name="voluntariado"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="¿Quieres participar en voluntariado?"
                  />
                )}
              />
            </Box>

            <Box>
              <MyButton
                type={"submit"}
                label={loading ? "Registrando..." : "Registrar"}
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              />
            </Box>
          </Box>
        </form>

        <Stack spacing={1} mt={2}>
          <Button
            component={Link}
            href="/registroM"
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "#10b981",
              backgroundColor: "#d1b3ff",
              "&:hover": { backgroundColor: "#c49eff" },
            }}
            fullWidth
          >
            Soy Negocio
          </Button>

          <Button
            component={Link}
            href="/acceso/login"
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "#10b981",
              backgroundColor: "#d1b3ff",
              "&:hover": { backgroundColor: "#c49eff" },
            }}
            fullWidth
          >
            Ya estoy registrado
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}