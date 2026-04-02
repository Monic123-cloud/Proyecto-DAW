'use client'
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from 'react-hook-form'
import MyTextField from './forms/MyTextField'
import MyPassField from './forms/MyPassField'
import MyButton from './forms/MyButton'
import Box from '@mui/material/Box'
import Link from 'next/link'
import AxiosInstance from '../AxiosInstance'
import MySelect from './forms/MySelect.jsx'
import { Paper } from "@mui/material";

const Register = () => {
  const router = useRouter()

  const { handleSubmit, control } = useForm()

  const submission = (data) => {
    AxiosInstance.post('register/', {
      email: data.email,
      password: data.password,
      nombre: data.nombre,
      apellidos: data.apellidos,
      auth_id: crypto.randomUUID(),

      sexo: data.sexo,
      fecha_nacimiento: data.fecha_nacimiento,
      telefono: data.telefono,

      direccion: data.direccion,
      numero: data.numero,
      piso: data.piso,
      letra: data.letra,

      municipio: data.municipio,
      provincia: data.provincia,
      cp: data.cp,

      latitud: data.latitud,
      longitud: data.longitud
    })

      .then(() => {
        router.push(`/`)
      }
      )
  }

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
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "20px",
          width: "100%",
          maxWidth: 600,
        }}
      >
        <form onSubmit={handleSubmit(submission)}>
          <Box className={"whiteBox"}>

            <Box className={"itemBox"}>
              <Box className={"title"}>Alta de usuario</Box>
            </Box>

            {/* Nombre */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Nombre"}
                name={"nombre"}
                control={control}
              />
            </Box>

            {/* Apellidos */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Apellidos"}
                name={"apellidos"}
                control={control}
              />
            </Box>

            {/* Correo */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Correo"}
                name={"correo"}
                control={control}
              />
            </Box>

            

            {/* Sexo */}
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
                  { value: "No decirlo", label: "Prefiero no decirlo" }
                ]}
              />
            </Box>

            {/* Fecha de nacimiento */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Fecha de nacimiento"}
                name={"fecha_nacimiento"}
                control={control}
              />
            </Box>

            {/* Teléfono */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Teléfono"}
                name={"telefono"}
                control={control}
              />
            </Box>

            {/* Dirección */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Dirección"}
                name={"direccion"}
                control={control}
              />
            </Box>

            {/* Número */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Número"}
                name={"numero"}
                control={control}
              />
            </Box>

            {/* Piso */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Piso"}
                name={"piso"}
                control={control}
              />
            </Box>

            {/* Letra */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Letra"}
                name={"letra"}
                control={control}
              />
            </Box>

            {/* Municipio */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Municipio"}
                name={"municipio"}
                control={control}
              />
            </Box>

            {/* Provincia */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Provincia"}
                name={"provincia"}
                control={control}
              />
            </Box>

            {/* CP */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"CP"}
                name={"cp"}
                control={control}
              />
            </Box>

            {/* Latitud */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Latitud"}
                name={"latitud"}
                control={control}
              />
            </Box>

            {/* Longitud */}
            <Box className={"itemBox"}>
              <MyTextField
                label={"Longitud"}
                name={"longitud"}
                control={control}
              />
            </Box>

            {/* Password */}
            <Box >
              <MyPassField
                label={"Password"}
                name={"password"}
                control={control}
              />
            </Box>

            {/* Confirm Password */}
            <Box >
              <MyPassField
                label={"Confirm password"}
                name={"password2"}
                control={control}
              />
            </Box>

            {/* Botón */}
            <Box >
              <MyButton
                type={"submit"}
                label={"Registrar"}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Box>

          </Box>
        </form>
      </Paper>


    </Box>

  )

}



export default Register
