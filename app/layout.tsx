import 'bootstrap/dist/css/bootstrap.min.css'
import { ThemeProvider, CssBaseline } from "@mui/material";
import ThemeRegistry from "../components/ThemeRegistry";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
}