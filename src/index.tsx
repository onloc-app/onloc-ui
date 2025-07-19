import React from "react"
import ReactDOM from "react-dom/client"
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"
import AuthProvider from "./contexts/AuthProvider"
import PrivateRoutes from "./PrivateRoutes"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./index.css"
import Dashboard from "./Dashboard"
import Login from "./Login"
import Register from "./Register"
import Map from "./Map"
import Devices from "./Devices"
import Profile from "./Profile"
import Settings from "./Settings"
import NotFound from "./NotFound"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9768ff",
    },
    secondary: {
      main: "#de8bff",
    },
  },
  typography: {
    fontFamily: ["Outfit", "Nunito"].join(","),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontSize: 16,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
  },
})

const container = document.getElementById("root")

if (!container) {
  throw new Error("Root element not found")
}

const root = ReactDOM.createRoot(container)

const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AuthProvider>
              <Routes>
                <Route element={<PrivateRoutes />}>
                  <Route path="/" element={<Navigate to={"/dashboard"} />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/map" element={<Map />} />
                  <Route path="/devices" element={<Devices />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
