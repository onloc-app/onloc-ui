import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import AuthProvider from "./contexts/AuthProvider";
import PrivateRoutes from "./PrivateRoutes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./Login";
import Map from "./Map";
import Devices from "./Devices";
import Settings from "./Settings";

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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Navigate to={"/dashboard"} />} />
              <Route path="/dashboard" element={<App />} />
              <Route path="/map" element={<Map />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
