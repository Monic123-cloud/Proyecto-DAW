import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#d1b3ff" },   // lavanda
    secondary: { main: "#059669" }, // verde
    background: { default: "#f8fafc" },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
});

export default theme;