import { getStatus } from "@/api"
import {
  CustomPasswordInput,
  LanguageSelect,
  OnlocIcon,
  ThemeToggle,
} from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { Button, Card, Loader, Text, TextInput, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { type SubmitEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import classes from "./Login.module.css"

export default function Login() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const { data: serverInfo, isLoading } = useQuery({
    queryKey: ["server_info"],
    queryFn: getStatus,
  })

  useEffect(() => {
    if (serverInfo) {
      if (serverInfo.is_setup === false) {
        navigate("/register")
      }
    }
  }, [serverInfo, navigate])

  const handleLogin = async (e?: SubmitEvent) => {
    if (!auth) return

    e?.preventDefault()

    setUsernameError("")
    setPasswordError("")

    let formIsValid = true

    if (username.trim() === "") {
      setUsernameError("pages.login.username_required")
      formIsValid = false
    }

    if (password.trim() === "") {
      setPasswordError("pages.login.password_required")
      formIsValid = false
    }

    if (!formIsValid) {
      return
    }

    const crendentials = {
      username: username,
      password: password,
    }

    auth.loginAction(crendentials)
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
          <Text>{t("pages.login.description")}</Text>
          <OnlocIcon size={4} />
        </Card>
        <div>
          <div className={classes["content__title__compact"]}>
            <Title>Onloc</Title>
            <OnlocIcon size={3} />
          </div>
          <form className={classes["content__form"]} onSubmit={handleLogin}>
            <div className={classes["content__form__inputs"]}>
              <TextInput
                label={t("pages.login.username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={t(usernameError)}
                withAsterisk
                size="md"
              />
              <CustomPasswordInput
                label={t("pages.login.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={t(passwordError)}
                withAsterisk
                size="md"
              />
            </div>
            <div className={classes["content__form__actions"]}>
              <Button type="submit">{t("pages.login.login")}</Button>
              {(!serverInfo || serverInfo.registration) && (
                <Button variant="outline" onClick={() => navigate("/register")}>
                  {t("pages.login.register")}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
