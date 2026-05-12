// app/privacidad/page.tsx

"use client";

import { Box, Typography, Container, Paper } from "@mui/material";

export default function PrivacidadPage() {
  return (
    <><Container maxWidth="md" sx={{ py: 6 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Política de Privacidad
              </Typography>

              <Typography paragraph>
                  En Close4u respetamos tu privacidad y protegemos tus datos
                  personales conforme a la normativa vigente.
              </Typography>

              <Typography variant="h6" gutterBottom>
                  Datos que recopilamos
              </Typography>

              <Typography paragraph>
                  Podemos recopilar información como:
              </Typography>

              <Box component="ul" sx={{ pl: 3 }}>
                  <li>Email</li>
                  <li>Nombre y apellidos</li>
                  <li>Dirección y código postal</li>
                  <li>Teléfono</li>
              </Box>

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                  Finalidad
              </Typography>

              <Typography paragraph>
                  Los datos se utilizan para gestionar la plataforma y conectar
                  usuarios con servicios y comercios locales.
              </Typography>

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                  Derechos
              </Typography>

              <Typography paragraph>
                  Puedes solicitar la modificación o eliminación de tus datos
                  contactándonos por email.
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
                  Última actualización: 2026
              </Typography>
          </Paper>
      </Container><Container maxWidth="md" sx={{ py: 6 }}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                      Términos y Condiciones
                  </Typography>

                  <Typography paragraph>
                      Al utilizar Close4u aceptas los siguientes términos y condiciones.
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                      Uso de la plataforma
                  </Typography>

                  <Typography paragraph>
                      Los usuarios se comprometen a utilizar la plataforma de forma legal,
                      respetuosa y sin realizar actividades fraudulentas.
                  </Typography>

                  <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                      Responsabilidad
                  </Typography>

                  <Typography paragraph>
                      Close4u actúa como intermediario entre usuarios y comercios, no siendo
                      responsable de acuerdos o servicios externos realizados entre ellos.
                  </Typography>

                  <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                      Cuentas de usuario
                  </Typography>

                  <Typography paragraph>
                      Cada usuario es responsable de la seguridad de su cuenta y credenciales.
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
                      Última actualización: 2026
                  </Typography>
              </Paper>
          </Container></>
  );
}