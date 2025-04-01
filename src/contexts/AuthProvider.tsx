import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactElement,
} from "react";
import { Register, useNavigate } from "react-router-dom";
import { userInfo, login, logout, register, patchUser } from "../api";
import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import Logo from "../assets/images/foreground.svg";
import { LoginCredentials, RegisterCredentials, User } from "../types/types";
import { Severity } from "../types/enums";

interface AuthContextType {
  token: string;
  user: User | null;
  throwMessage: (message: string, severity: Severity) => void;
  Severity: typeof Severity;
  loginAction: (credentials: LoginCredentials) => Promise<any>;
  registerAction: (credentials: RegisterCredentials) => Promise<any>;
  logoutAction: () => void;
  changeUsernameAction: (username: string) => Promise<any>;
  changePasswordAction: (
    password: string,
    passwordConfirmation: string
  ) => Promise<any>;
}

interface AuthProviderProps {
  children: ReactElement;
}

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  // Snackbar
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [severity, setSeverity] = useState<Severity | undefined>(undefined);
  const [message, setMessage] = useState("");
  function handleHideSnackbar() {
    setSnackbarStatus(false);
  }
  function throwMessage(message: string, severity: Severity) {
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
          throwMessage(data.message, Severity.ERROR);
          logoutAction();
        }
      }
    }
    fetchUserInfo();
  }, [token]);

  async function loginAction(credentials: LoginCredentials) {
    const data = await login(credentials.username, credentials.password);

    if (data.token && data.user) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/");
    }

    return data;
  }

  async function registerAction(credentials: RegisterCredentials) {
    const data = await register(
      credentials.username,
      credentials.password,
      credentials.password_confirmation
    );

    if (data.token && data.user) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/");
      throwMessage("Welcome to Onloc!", Severity.SUCCESS);
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

  async function changeUsernameAction(username: string) {
    if (!user) return;

    const data = await patchUser(token, { id: user.id, username });

    if (data.error) {
      throwMessage(data.message, Severity.ERROR);
      return data;
    }

    if (data.id) {
      setUser(data);
      throwMessage("Username changed!", Severity.SUCCESS);
    }

    return data;
  }

  async function changePasswordAction(
    password: string,
    passwordConfirmation: string
  ) {
    if (!user) return;

    const data = await patchUser(token, {
      id: user.id,
      password: password,
      password_confirmation: passwordConfirmation,
    });

    if (data.error) {
      throwMessage(data.message, Severity.ERROR);
      return data;
    }

    if (data.id) {
      throwMessage("Password changed!", Severity.SUCCESS);
    }

    return data;
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        throwMessage,
        Severity,
        loginAction,
        registerAction,
        logoutAction,
        changeUsernameAction,
        changePasswordAction,
      }}
    >
      {token && !user ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Typography
              variant="h1"
              sx={{ fontFamily: "Nunito", fontSize: 48 }}
            >
              Onloc
            </Typography>
            <img src={Logo} width={60} alt="Onloc logo" />
          </Box>
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
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
