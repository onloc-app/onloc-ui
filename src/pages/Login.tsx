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

function Login() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [username, setUsername] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [error, setError] = useState(false)

  const { data: serverInfo, isLoading } = useQuery({
    queryKey: ["server_info"],
    queryFn: () => getStatus(),
  })

  useEffect(() => {
    if (serverInfo) {
      alert("hi")
      if (serverInfo.is_setup === false) {
        navigate("/register")
      }
    }
  }, [serverInfo, navigate])

  const handleLogin = async (event: FormEvent) => {
    if (!auth) return

    event.preventDefault()

    setUsernameError("")
    setPasswordError("")
    setError(false)

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
              {t("pages.login.description")}
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
              onSubmit={handleLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <TextField
                fullWidth
                label={t("pages.login.username")}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                error={error || usernameError !== ""}
                helperText={t(usernameError)}
                required
              />
              <PasswordTextField
                fullWidth
                label={t("pages.login.password")}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={error || passwordError !== ""}
                helperText={t(passwordError)}
                required
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                onClick={handleLogin}
              >
                {t("pages.login.login")}
              </Button>
              {serverInfo.registration ? (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/register")}
                >
                  {t("pages.login.register")}
                </Button>
              ) : null}
            </form>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Login
