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
import { useTranslation } from "react-i18next"

export default function ChangePasswordButton() {
  const auth = useAuth()
  const { t } = useTranslation()

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
      setPasswordError("components.change_password_button.password_required")
      formIsValid = false
    }

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError(
        "components.change_password_button.passwords_dont_match",
      )
      formIsValid = false
    }

    if (!passwordConfirmation.trim()) {
      setPasswordConfirmationError(
        "components.change_password_button.password_confirmation_required",
      )
      formIsValid = false
    }

    if (!formIsValid) {
      return
    }

    try {
      await auth.changePasswordAction(password)
    } catch (error) {
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
        {t("components.change_password_button.title")}
      </Button>
      <Dialog open={passwordDialogOpened} onClose={handlePasswordDialogClose}>
        <form onSubmit={handleChangePassword}>
          <DialogTitle>
            {t("components.change_password_button.title")}
          </DialogTitle>
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
                label={t("components.change_password_button.new_password")}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={changePasswordError || !!passwordError}
                helperText={t(passwordError)}
                required
              />
              <PasswordTextField
                fullWidth
                label={t(
                  "components.change_password_button.new_password_confirmation",
                )}
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                error={changePasswordError || !!passwordConfirmationError}
                helperText={t(passwordConfirmationError)}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePasswordDialogClose}>
              {t("components.change_password_button.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleChangePassword}
              type="submit"
            >
              {t("components.change_password_button.change")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
