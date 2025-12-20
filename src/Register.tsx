import { getStatus } from "@/api"
import Logo from "@/assets/images/foreground.svg"
import { LanguageSelect, PasswordTextField } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import {
  Box,
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { type FormEvent, useEffect, useState } from "react"
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
  const [error, setError] = useState(false)

  const { data: serverInfo, isLoading } = useQuery({
    queryKey: ["server_info"],
    queryFn: () => getStatus(),
  })

  useEffect(() => {
    if (serverInfo) {
      if (!serverInfo.registration && serverInfo.isSetup) {
        navigate("/login")
      }
    }
  }, [serverInfo, navigate])

  const handleRegister = async (event: FormEvent) => {
    if (!auth) return

    event.preventDefault()

    setUsernameError("")
    setPasswordError("")
    setPasswordConfirmationError("")
    setError(false)

    let formIsValid = true

    if (!username.trim()) {
      setUsernameError("Username is required")
      formIsValid = false
    }

    if (!password.trim()) {
      setPasswordError("Password is required")
      formIsValid = false
    }

    if (password !== passwordConfirmation) {
      setPasswordConfirmationError("Passwords do not match")
      formIsValid = false
    }

    if (!passwordConfirmation.trim()) {
      setPasswordConfirmationError("Password confirmation is required")
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
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100vh",
          py: 8,
        }}
      >
        <LanguageSelect />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
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
            <Typography
              variant="h1"
              sx={{ fontSize: 48, fontFamily: "Nunito", fontWeight: 700 }}
            >
              Onloc
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
              {serverInfo.isSetup
                ? t("pages.register.description")
                : t("pages.register.setup_description")}
            </Typography>
            <img alt="Onloc's logo" src={Logo} />
          </Card>
          <Box>
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                m: 0,
              }}
            >
              <Typography
                variant="h1"
                sx={{ fontSize: 48, fontFamily: "Nunito", fontWeight: 700 }}
              >
                Onloc
              </Typography>
              <img alt="Onloc's logo" src={Logo} width={60} />
            </Box>
            <form
              onSubmit={handleRegister}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <TextField
                fullWidth
                label={t("pages.register.username")}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                error={error || usernameError !== ""}
                helperText={usernameError}
                required
              />
              <PasswordTextField
                fullWidth
                label={t("pages.register.password")}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={error || passwordError !== ""}
                helperText={passwordError}
                required
              />
              <PasswordTextField
                fullWidth
                label={t("pages.register.password_confirmation")}
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                error={error || passwordConfirmationError !== ""}
                helperText={passwordConfirmationError}
                required
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                onClick={handleRegister}
              >
                {t("pages.register.register")}
              </Button>
              {serverInfo.isSetup ? (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/login")}
                >
                  {t("pages.register.login")}
                </Button>
              ) : null}
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Register
