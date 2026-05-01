'use client'
import { useRouter } from "next/navigation";
import { useForm, Controller, useWatch } from 'react-hook-form'
import MyTextField from './forms/MyTextField'
import MyPassField from './forms/MyPassField'
import MyButton from './forms/MyButton'
import Link from 'next/link'
import AxiosInstance from '../AxiosInstance'
import MySelect from './forms/MySelect'

import { Paper, Box, Button, Stack, Checkbox, FormControlLabel } from "@mui/material";
import MyDatePicker from "./forms/DatePicker";

const Register = () => {
  const router = useRouter()
  type RegisterForm = {
    email: string;
    password: string;
    password2: string;
    nombre: string;
    apellidos: string;
    sexo: string;
    fecha_nacimiento: string;
    telefono: string;
    direccion: string;
    numero: string;
    piso: string;
    letra: string;
    municipio: string;
    provincia: string;
    cp: string;
    latitud: number;
    longitud: number;
    voluntariado: boolean;
    dias_disponibles: string;
    horario_inicio: string;
    horario_fin: string;
    acepta_legal: boolean;
  };

  const { control, handleSubmit } = useForm<RegisterForm>({
    defaultValues: {
      email: "",
      password: "",
      password2: "",
      sexo: "",
    },
  });
  const voluntarioActivo = useWatch({
    control,
    name: "voluntariado",
  });


  const submission = (data: RegisterForm) => {
    const formatDate = (date: any) => {
      if (!date) return null;

      const d = new Date(date);
      return d.toISOString().split("T")[0]; 
    };
    if (data.voluntariado && (!data.horario_inicio || !data.horario_fin)) {
      alert("Debes indicar disponibilidad");
      return;
    }
    if (!data.acepta_legal) {
      alert("Debes aceptar la política de privacidad");
      return;
    }

    AxiosInstance.post('auth/register/', {
      email: data.email,
      password: data.password,
      nombre: data.nombre,
      apellidos: data.apellidos,


      sexo: data.sexo,
      fecha_nacimiento: formatDate(data.fecha_nacimiento),
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
      voluntariado: data.voluntariado,
      dias_disponibles: data.dias_disponibles,
      horario_inicio: data.horario_inicio,
      horario_fin: data.horario_fin,
    })

      .then(() => {
        router.push(`/`)

      }
      )
      .catch(err => {
        console.log("ERROR:", err.response.data)
      })

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
          border: '4px solid #10b981'
        }}
      >
        <form onSubmit={handleSubmit(submission)}>
          <Box className={"whiteBox"} >

            <Box className={"itemBox"} >
              <Box sx={{ typography: 'h4', textAlign: 'center', fontWeight: 'bold', color: 'primary.dark' }}>Alta de usuario</Box>
            </Box>


            <Box className={"itemBox"}>
              <MyTextField
                label={"Nombre"}
                name={"nombre"}
                control={control}
              />
            </Box>


            <Box className={"itemBox"}>
              <MyTextField
                label={"Apellidos"}
                name={"apellidos"}
                control={control}
              />
            </Box>


            <Box className={"itemBox"}>
              <MyTextField
                label={"Correo"}
                name={"email"}
                control={control}
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
                  { value: "No decirlo", label: "Prefiero no decirlo" }
                ]}
              />
            </Box>


            <Box className={"itemBox"}>
              <MyDatePicker
                name={"fecha_nacimiento"}
                label="Fecha"
                control={control} />
            </Box>


            <Box className={"itemBox"}>
              <MyTextField
                label={"Teléfono"}
                name={"telefono"}
                control={control}
              />
            </Box>


            <Box className={"itemBox"}>
              <MyTextField
                label={"Dirección"}
                name={"direccion"}
                control={control}
              />
            </Box>


            <Box className={"itemBox"}>
              <MyTextField
                label={"Número"}
                name={"numero"}
                control={control}
              />
            </Box>


            <Box className={"itemBox"}>
              <MyTextField
                label={"Piso"}
                name={"piso"}
                control={control}
              />
            </Box>


            <Box className={"itemBox"}>
              <MyTextField
                label={"Letra"}
                name={"letra"}
                control={control}
              />
            </Box>


            <Box className={"itemBox"}>
              <MyTextField
                label={"Municipio"}
                name={"municipio"}
                control={control}
              />
            </Box>


            <Box className={"itemBox"}>
              <MyTextField
                label={"Provincia"}
                name={"provincia"}
                control={control}
              />
            </Box>


            <Box className={"itemBox"}>
              <MyTextField
                label={"CP"}
                name={"cp"}
                control={control}
              />
            </Box>




            <Box >
              <MyPassField<RegisterForm>
                label="Contraseña"
                name="password"
                control={control}
                rules={{
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                }}
              />
            </Box>


            <Box >
              <MyPassField<RegisterForm>
                label="Confirmar contraseña"
                name="password2"
                control={control}
                rules={{
                  required: "Debes confirmar la contraseña",
                  validate: (value, formValues) =>
                    value === formValues.password || "Las contraseñas no coinciden",
                }}
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
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="¿Quieres participar en voluntariado?"
                  />

                )}
              />
              {voluntarioActivo && (
                <>
                  <Box className={"itemBox"}>
                    <MyTextField
                      label={"Días disponibles (ej: Lunes, Martes)"}
                      name={"dias_disponibles"}
                      control={control}
                    />
                  </Box>

                  <Box className={"itemBox"}>
                    <MyTextField
                      label={"Horario inicio (HH:mm)"}
                      name={"horario_inicio"}
                      control={control}
                    />
                  </Box>

                  <Box className={"itemBox"}>
                    <MyTextField
                      label={"Horario fin (HH:mm)"}
                      name={"horario_fin"}
                      control={control}
                    />
                  </Box>

                </>
              )}
            </Box>
            <Box display="flex" justifyContent="center">
              <Controller

                name="acepta_legal"
                control={control}
                defaultValue={false}
                rules={{
                  required: "Debes aceptar la política de privacidad",
                }}
                render={({ field, fieldState }) => (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label={
                        <>
                          Acepto la{" "}
                          <Link href="/legal" style={{ color: "#10b981" }}>
                            política de privacidad
                          </Link>
                        </>
                      }
                    />
                    {fieldState.error && (
                      <span style={{ color: "red" }}>
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </Box>


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
        <Stack spacing={1} mt={2}>
          <Button
            component={Link}
            href="/registroM"
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: '#10b981',
              backgroundColor: "#d1b3ff",
              "&:hover": {
                backgroundColor: "#c49eff"
              }
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
              color: 'white',
              borderColor: '#10b981',
              backgroundColor: "#d1b3ff",
              "&:hover": {
                backgroundColor: "#c49eff"
              }
            }}
            fullWidth
          >
            Ya estoy registrado
          </Button>
        </Stack>
      </Paper>


    </Box>

  )

}



export default Register
