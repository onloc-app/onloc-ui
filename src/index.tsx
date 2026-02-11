import AdminRoutes from "@/AdminRoutes"
import AuthProvider from "@/contexts/AuthProvider"
import CustomThemeProvider from "@/contexts/ThemeContext"
import "@/i18n"
import "@/index.css"
import NotFound from "@/NotFound"
import {
  Admin,
  Connections,
  Dashboard,
  Devices,
  Login,
  Map,
  Profile,
  Register,
  Settings,
} from "@/pages"
import PrivateRoutes from "@/PrivateRoutes"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import SettingsProvider from "./contexts/SettingsProvider"
import SocketProvider from "./contexts/SocketProvider"
import "@mantine/core/styles.css"

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
                <SettingsProvider>
                  <Routes>
                    <Route element={<PrivateRoutes />}>
                      <Route
                        path="/"
                        element={<Navigate to={"/dashboard"} />}
                      />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/map" element={<Map />} />
                      <Route path="/devices" element={<Devices />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/connections" element={<Connections />} />
                      <Route element={<AdminRoutes />}>
                        <Route path="/admin" element={<Admin />} />
                      </Route>
                    </Route>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </SettingsProvider>
              </SocketProvider>
            </AuthProvider>
          </CustomThemeProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
