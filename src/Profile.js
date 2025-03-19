import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import MainAppBar from "./components/MainAppBar";
import { useAuth } from "./contexts/AuthProvider";
import { useState } from "react";
import PasswordTextField from "./components/PasswordTextField";

function Profile() {
  const auth = useAuth();

  const [username, setUsername] = useState(auth.user.username);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState("");
  const [changePasswordError, setChangePasswordError] = useState(false);

  const [passwordDialogOpened, setPasswordDialogOpened] = useState(false);
  const handlePasswordDialogOpen = () => {
    setPasswordDialogOpened(true);
  };
  const handlePasswordDialogClose = () => {
    setPasswordDialogOpened(false);
    setPassword("");
    setPasswordConfirmation("");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    let formIsValid = true;

    setChangePasswordError(false);
    setPasswordError("");
    setPasswordConfirmationError("");

    if (!password.trim()) {
      setPasswordError("Password is required");
      formIsValid = false;
    }

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError("Passwords do not match");
      formIsValid = false;
    }

    if (!passwordConfirmation.trim()) {
      setPasswordConfirmationError("Password Confirmation is required");
      formIsValid = false;
    }

    if (!formIsValid) {
      return;
    }

    const data = await auth.changePasswordAction(
      password,
      passwordConfirmation
    );

    if (data.error) {
      setChangePasswordError(true);
      return;
    }

    handlePasswordDialogClose();
    return;
  };

  return (
    <>
      <MainAppBar selectedNav="profile" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 1,
          height: "calc(100vh - 64px)",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "80%", md: "60%" },
            height: "100%",
            padding: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              gap: 1,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 24, md: 32 },
                fontWeight: 500,
                mb: 2,
                textAlign: { xs: "left", sm: "center", md: "left" },
              }}
            >
              Account Settings
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TextField
                label="Username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              ></TextField>
              <Button
                variant="outlined"
                disabled={auth.user.username === username || !username.trim()}
                onClick={async () => {
                  const data = await auth.changeUsernameAction(username);
                  if (!data.error) {
                    setUsername(data.username);
                  }
                }}
              >
                Save
              </Button>
            </Box>
            <Button variant="contained" onClick={handlePasswordDialogOpen}>
              Change Password
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Dialog to change password */}
      <Dialog open={passwordDialogOpened} onClose={handlePasswordDialogClose}>
        <form
          onSubmit={handleChangePassword}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 16,
          }}
        >
          <DialogTitle>Change Password</DialogTitle>

          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                paddingTop: 1,
              }}
            >
              <PasswordTextField
                fullWidth
                label="New Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={changePasswordError || passwordError}
                helperText={passwordError}
                required
              />
              <PasswordTextField
                fullWidth
                label="New Password Confirmation"
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                error={changePasswordError || passwordConfirmationError}
                helperText={passwordConfirmationError}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePasswordDialogClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleChangePassword}
              type="submit"
            >
              Change
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default Profile;
