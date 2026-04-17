'use client'
import { useRouter } from "next/navigation";
import { useForm, Controller } from 'react-hook-form'
import MyTextField from './forms/MyTextField'
import MyPassField from './forms/MyPassField'
import MyButton from './forms/MyButton'
import Link from 'next/link'
import AxiosInstance from '../AxiosInstance'
import MySelect from './forms/MySelect.jsx'
import DatePicker from './forms/DatePicker'
import { Paper, Box, Button, Stack, Checkbox, FormControlLabel } from "@mui/material";

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
      longitud: data.longitud,
      voluntariado: data.voluntariado,
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
              <DatePicker 
              name={"fecha_nacimiento"}/>
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
              <MyPassField
                label={"Password"}
                name={"password"}
                control={control}
              />
            </Box>


            <Box >
              <MyPassField
                label={"Confirm password"}
                name={"password2"}
                control={control}
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
