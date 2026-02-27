import { getStatus } from "@/api"
import Logo from "@/assets/images/foreground.svg"
import { CustomPasswordInput, LanguageSelect, ThemeToggle } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import {
  Box,
  Button,
  Card,
  Flex,
  Loader,
  Space,
  Stack,
  TextInput,
  Typography,
} from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState, type SubmitEvent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

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
      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Loader />
      </Flex>
    )
  }

  return (
    <Flex direction="column" justify="center" align="center" h="100vh" py="xl">
      <Flex gap={8}>
        <LanguageSelect />
        <ThemeToggle />
      </Flex>
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
            onSubmit={handleRegister}
            align="stretch"
            gap="sm"
          >
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
            <Space />
            <Button type="submit">{t("pages.register.register")}</Button>
            {serverInfo?.is_setup ? (
              <Button variant="outline" onClick={() => navigate("/login")}>
                {t("pages.register.login")}
              </Button>
            ) : null}
          </Stack>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Register
