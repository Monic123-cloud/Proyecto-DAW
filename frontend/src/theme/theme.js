import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#10b981",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#334155",
    },
    success: {
      main: "#10b981",
      light: "#ecfdf5",
      dark: "#065f46",
    },
    error: {
      main: "#ef4444",
      light: "#fef2f2",
      dark: "#991b1b",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
    background: {
      default: "#f9fafb",
      paper: "rgba(255,255,255,0.92)",
    },
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h1: {
      fontSize: "2.4rem",
      fontWeight: 700,
      lineHeight: 1.05,
    },
    body1: {
      color: "#334155",
    },
  },

  shadows: ["none", ...Array(24).fill("0 20px 60px rgba(15,23,42,0.08)")],

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "28px",
          border: "1px solid #e5e7eb",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          borderRadius: "16px",
          padding: "13px 18px",
          fontWeight: 700,
          textTransform: "none",
        },
        containedPrimary: {
          backgroundColor: "#10b981",
          "&:hover": { backgroundColor: "#059669" },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        margin: "normal",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": { borderRadius: "14px" },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#10b981",
            boxShadow: "0 0 0 4px rgba(16,185,129,0.12)",
          },
        },
      },
    },
  },
});

export default theme;