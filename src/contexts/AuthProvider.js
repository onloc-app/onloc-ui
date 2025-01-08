import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userInfo, login, logout } from "../api";
import { Alert, Snackbar } from "@mui/material";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  // Snackbar
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [severity, setSeverity] = useState("");
  const [message, setMessage] = useState("");
  function handleHideSnackbar() {
    setSnackbarStatus(false);
  }
  function throwMessage(message, severity) {
    setSeverity(severity);
    setMessage(message);
    setSnackbarStatus(true);
  }

  useEffect(() => {
    async function fetchUserInfo() {
      if (token && !user) {
        const data = await userInfo(token);
        if (data.id) {
          setUser(data);
        }
        if (data.error) {
          logoutAction();
        }
      }
    }
    fetchUserInfo();
  }, [token]);

  async function loginAction(credentials) {
    const data = await login(credentials.username, credentials.password);

    if (data.token && data.user) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/");
    }

    return data;
  }

  function logoutAction() {
    logout(token);
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ token, user, throwMessage, SeverityEnum, loginAction, logoutAction }}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarStatus}
        autoHideDuration={5000}
        onClose={handleHideSnackbar}
      >
        <Alert severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};

export const SeverityEnum = {
  SUCCESS: "success",
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
}