import Admin from "@/Admin"
import AdminRoutes from "@/AdminRoutes"
import AuthProvider from "@/contexts/AuthProvider"
import CustomThemeProvider from "@/contexts/ThemeContext"
import Dashboard from "@/Dashboard"
import Devices from "@/Devices"
import "@/index.css"
import Login from "@/Login"
import Map from "@/Map"
import NotFound from "@/NotFound"
import PrivateRoutes from "@/PrivateRoutes"
import Profile from "@/Profile"
import Register from "@/Register"
import Settings from "@/Settings"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import SocketProvider from "./contexts/SocketProvider"

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
              <SocketProvider>
                <Routes>
                  <Route element={<PrivateRoutes />}>
                    <Route path="/" element={<Navigate to={"/dashboard"} />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/devices" element={<Devices />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route element={<AdminRoutes />}>
                      <Route path="/admin" element={<Admin />} />
                    </Route>
                  </Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SocketProvider>
            </AuthProvider>
          </CustomThemeProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
