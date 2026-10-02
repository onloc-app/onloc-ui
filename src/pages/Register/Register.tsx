import { getStatus } from "@/api"
import {
  CustomPasswordInput,
  LanguageSelect,
  OnlocIcon,
  ThemeToggle,
} from "@/components"
import { useAuth } from "@/hooks/useAuth"
import {
  Box,
  Button,
  Card,
  Loader,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState, type SubmitEvent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import classes from "./Register.module.css"

function Register() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [passwordConfirmationError, setPasswordConfirmationError] = useState("")

  const { data: serverInfo, isLoading } = useQuery({
    queryKey: ["server_info"],
    queryFn: () => getStatus(),
  })

  useEffect(() => {
    if (serverInfo) {
      if (!serverInfo.registration && serverInfo.is_setup) {
        navigate("/login")
      }
    }
  }, [serverInfo, navigate])

  const handleRegister = async (e?: SubmitEvent) => {
    if (!auth) return

    e?.preventDefault()

    setUsernameError("")
    setPasswordError("")
    setPasswordConfirmationError("")

    let formIsValid = true

    if (!username.trim()) {
      setUsernameError("pages.register.username_required")
      formIsValid = false
    }

    if (!password.trim()) {
      setPasswordError("pages.register.password_required")
      formIsValid = false
    }

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError("pages.register.passwords_dont_match")
      formIsValid = false
    }

    if (!passwordConfirmation.trim()) {
      setPasswordConfirmationError(
        "pages.register.password_confirmation_required",
      )
      formIsValid = false
    }

    if (!formIsValid) {
      return
    }

    const crendentials = {
      username: username,
      password: password,
      password_confirmation: passwordConfirmation,
    }

    await auth.registerAction(crendentials)
  }

  if (isLoading) {
    return (
      <div className={classes["loader"]}>
        <Loader />
      </div>
    )
  }

  return (
    <div className={classes["container"]}>
      <div className={classes["header"]}>
        <LanguageSelect />
        <ThemeToggle />
      </div>
      <div className={classes["content"]}>
        <Card className={classes["content__title__full"]}>
          <Title>Onloc</Title>
          {!serverInfo || serverInfo.is_setup ? (
            <Text>{t("pages.register.description")}</Text>
          ) : (
            <Text>{t("pages.register.setup_description")}</Text>
          )}
          <OnlocIcon size={4} />
        </Card>
        <Box>
          <div className={classes["content__title__compact"]}>
            <Title>Onloc</Title>
            <OnlocIcon size={3} />
          </div>
          <form className={classes["content__form"]} onSubmit={handleRegister}>
            <div className={classes["content__form__inputs"]}>
              <TextInput
                label={t("pages.register.username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={t(usernameError)}
                withAsterisk
              />
              <CustomPasswordInput
                label={t("pages.register.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={t(passwordError)}
                withAsterisk
              />
              <CustomPasswordInput
                label={t("pages.register.password_confirmation")}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                error={t(passwordConfirmationError)}
                withAsterisk
              />
            </div>
            <div className={classes["content__form__actions"]}>
              <Button type="submit">{t("pages.register.register")}</Button>
              {(!serverInfo || serverInfo.is_setup) && (
                <Button variant="outline" onClick={() => navigate("/login")}>
                  {t("pages.register.login")}
                </Button>
              )}
            </div>
          </form>
        </Box>
      </div>
    </div>
  )
}

export default Register
