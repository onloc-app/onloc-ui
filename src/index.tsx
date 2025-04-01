import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import AuthProvider from "./contexts/AuthProvider";
import PrivateRoutes from "./PrivateRoutes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import Map from "./Map";
import Devices from "./Devices";
import Profile from "./Profile";
import Settings from "./Settings";
import NotFound from "./NotFound";

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
});

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
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
  </React.StrictMode>
);
