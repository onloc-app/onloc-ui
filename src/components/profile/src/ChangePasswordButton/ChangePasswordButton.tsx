import { CustomPasswordInput } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { Button, Modal } from "@mantine/core"
import { useState, type SubmitEventHandler } from "react"
import { useTranslation } from "react-i18next"
import classes from "./ChangePasswordButton.module.css"

export default function ChangePasswordButton() {
  const auth = useAuth()
  const { t } = useTranslation()

  const [password, setPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState<string>("")

  const [opened, setOpened] = useState<boolean>(false)
  const handleOpen = () => {
    setOpened(true)
  }
  const handleClose = () => {
    setOpened(false)
    setPassword("")
    setPasswordConfirmation("")
  }

  const handleChangePassword: SubmitEventHandler = async (e?) => {
    if (!auth) return

    e?.preventDefault()

    let formIsValid = true

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
      return
    }

    handleClose()
    return
  }

  return (
    <>
      <Button onClick={handleOpen}>
        {t("components.change_password_button.title")}
      </Button>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={t("components.change_password_button.title")}
        centered
      >
        <form className={classes["form"]} onSubmit={handleChangePassword}>
          <div className={classes["form__content"]}>
            <CustomPasswordInput
              label={t("components.change_password_button.new_password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={t(passwordError)}
              withAsterisk
            />
            <CustomPasswordInput
              label={t(
                "components.change_password_button.new_password_confirmation",
              )}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              error={t(passwordConfirmationError)}
              withAsterisk
            />
          </div>
          <div className={classes["form__actions"]}>
            <Button variant="subtle" onClick={handleClose}>
              {t("components.change_password_button.cancel")}
            </Button>
            <Button type="submit">
              {t("components.change_password_button.change")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
