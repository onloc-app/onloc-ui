import { PasswordTextField } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import { useState, type FormEvent } from "react"

export default function ChangePasswordButton() {
  const auth = useAuth()

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

  return (
    <>
      <Button variant="contained" onClick={handlePasswordDialogOpen}>
        Change Password
      </Button>
      <Dialog open={passwordDialogOpened} onClose={handlePasswordDialogClose}>
        <form onSubmit={handleChangePassword}>
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
