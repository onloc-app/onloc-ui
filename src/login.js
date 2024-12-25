import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "./assets/images/foreground.svg";
import { login } from "./api";

function Login() {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleHideSnackbar = () => setSnackbarStatus(false);

  const handleLogin = async () => {
    setUsernameError("");
    setPasswordError("");
    setError("");

    let formIsValid = true;

    if (username.trim() === "") {
      setUsernameError("Username is required");
      formIsValid = false;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

    const data = await login(username, password);
    if (data.error && data.message) {
      setError(data.message);
      setSnackbarStatus(true);
      return;
    }

    console.log(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", data.user);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          height: "100vh",
        }}
      >
        <Card
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: 8,
            py: 2,
          }}
        >
          <h1>Onloc</h1>
          <p>Login to start tracking your devices.</p>
          <img src={Logo} />
        </Card>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              m: 0,
            }}
          >
            <h1 style={{ margin: 0 }}>Onloc</h1>
            <img src={Logo} width={60} />
          </Box>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            error={error !== "" || usernameError !== ""}
            helperText={usernameError}
            required
          />
          <TextField
            fullWidth
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type={showPassword ? "text" : "password"}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "Hide the password"
                          : "Display the password"
                      }
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            error={error !== "" || passwordError !== ""}
            helperText={passwordError}
            required
          />
          <Button fullWidth variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarStatus}
        autoHideDuration={5000}
        onClose={handleHideSnackbar}
      >
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Login;
