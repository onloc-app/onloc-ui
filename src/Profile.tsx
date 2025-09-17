import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material"
import { MainAppBar, PasswordTextField } from "@/components"
import { useAuth } from "@/contexts/AuthProvider"
import { type FormEvent, useState } from "react"

function Profile() {
  const auth = useAuth()

  const [username, setUsername] = useState<string>(auth?.user?.username || "")
  const [password, setPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState<string>("")
  const [changePasswordError, setChangePasswordError] = useState<boolean>(false)

  const [passwordDialogOpened, setPasswordDialogOpened] =
    useState<boolean>(false)
  const handlePasswordDialogOpen = () => {
    setPasswordDialogOpened(true)
  }
  const handlePasswordDialogClose = () => {
    setPasswordDialogOpened(false)
    setPassword("")
    setPasswordConfirmation("")
  }

  const handleChangePassword = async (event: FormEvent) => {
    if (!auth) return

    event.preventDefault()

    let formIsValid = true

    setChangePasswordError(false)
    setPasswordError("")
    setPasswordConfirmationError("")

    if (!password.trim()) {
      setPasswordError("Password is required")
      formIsValid = false
    }

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError("Passwords do not match")
      formIsValid = false
    }

    if (!passwordConfirmation.trim()) {
      setPasswordConfirmationError("Password Confirmation is required")
      formIsValid = false
    }

    if (!formIsValid) {
      return
    }

    try {
      await auth.changePasswordAction(password)
    } catch (error: unknown) {
      console.error(error)
      setChangePasswordError(true)
      return
    }

    handlePasswordDialogClose()
    return
  }

  if (!auth || !auth.user) return

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
                  setUsername(event.target.value)
                }}
              ></TextField>
              <Button
                variant="outlined"
                disabled={auth.user.username === username || !username.trim()}
                onClick={async () => {
                  try {
                    await auth.changeUsernameAction(username)
                  } catch (error: unknown) {
                    console.error(error)
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
                error={changePasswordError || !!passwordError}
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
                error={changePasswordError || !!passwordConfirmationError}
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
  )
}

export default Profile
