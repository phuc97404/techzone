"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from "@mui/material/CssBaseline";
import { ReactNode } from "react";

// TechZone Design System Colors
const theme = createTheme({
  palette: {
    mode: "dark", // Premium Dark Mode
    primary: {
      main: "#ec4899", // Pink primary from our CSS
      light: "#f472b6",
      dark: "#db2777",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6366f1", // Indigo secondary
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 20px",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1e293b",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
