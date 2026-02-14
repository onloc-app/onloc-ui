import { getStatus } from "@/api"
import Logo from "@/assets/images/foreground.svg"
import { LanguageSelect } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import {
  Box,
  Button,
  Card,
  Flex,
  Loader,
  PasswordInput,
  Space,
  Stack,
  TextInput,
  Typography,
} from "@mantine/core"
import { mdiEye, mdiEyeOff } from "@mdi/js"
import Icon from "@mdi/react"
import { useQuery } from "@tanstack/react-query"
import { type SubmitEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

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
    queryFn: () => getStatus(),
  })

  useEffect(() => {
    if (serverInfo) {
      if (serverInfo.isSetup === false) {
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
      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Loader />
      </Flex>
    )
  }

  return (
    <>
      <Flex
        direction="column"
        justify="space-between"
        align="center"
        h="100vh"
        py="xl"
      >
        <LanguageSelect />
        <Flex flex={1} justify="center" align="center" gap={32}>
          <Card visibleFrom="md" p="xl">
            <Flex direction="column" justify="center" align="center">
              <Typography fz={48} ff="Nunito" fw={700}>
                Onloc
              </Typography>
              <Typography>{t("pages.login.description")}</Typography>
              <img alt="Onloc's logo" src={Logo} />
            </Flex>
          </Card>
          <Box>
            <Flex hiddenFrom="md" align="center" justify="center" gap="sm">
              <Typography fz={48} ff="Nunito" fw={700}>
                Onloc
              </Typography>
              <img alt="Onloc's logo" src={Logo} width={60} />
            </Flex>
            <Stack
              component="form"
              onSubmit={handleLogin}
              align="stretch"
              gap="sm"
            >
              <TextInput
                label={t("pages.login.username")}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                error={usernameError ? t(usernameError) : undefined}
                withAsterisk
              />
              <PasswordInput
                label={t("pages.login.password")}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={passwordError ? t(passwordError) : undefined}
                visibilityToggleIcon={({ reveal }) =>
                  reveal ? (
                    <Icon path={mdiEyeOff} size={0.8} />
                  ) : (
                    <Icon path={mdiEye} size={0.8} />
                  )
                }
                withAsterisk
              />
              <Space />
              <Button type="submit">{t("pages.login.login")}</Button>
              {serverInfo.registration ? (
                <Button variant="outline" onClick={() => navigate("/register")}>
                  {t("pages.login.register")}
                </Button>
              ) : null}
            </Stack>
          </Box>
        </Flex>
      </Flex>
    </>
  )
}
