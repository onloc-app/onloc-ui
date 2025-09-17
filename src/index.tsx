import React from "react"
import ReactDOM from "react-dom/client"
import AuthProvider from "@/contexts/AuthProvider"
import PrivateRoutes from "@/PrivateRoutes"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "@/index.css"
import Dashboard from "@/Dashboard"
import Login from "@/Login"
import Register from "@/Register"
import Map from "@/Map"
import Devices from "@/Devices"
import Profile from "@/Profile"
import Settings from "@/Settings"
import NotFound from "@/NotFound"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import CustomThemeProvider from "@/contexts/ThemeContext"

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
          <CustomThemeProvider>
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
          </CustomThemeProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
