import {
  Box,
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material"
import { type FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "@/assets/images/foreground.svg"
import { useAuth } from "@/contexts/AuthProvider"
import { getStatus } from "@/api"
import { useQuery } from "@tanstack/react-query"
import { PasswordTextField } from "@/components"

function Login() {
  const auth = useAuth()
  const navigate = useNavigate()

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
      if (serverInfo.isSetup === false) {
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
      setUsernameError("Username is required")
      formIsValid = false
    }

    if (password.trim() === "") {
      setPasswordError("Password is required")
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
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          height: "100vh",
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
            Login to start tracking your devices.
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
              label="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              error={error || usernameError !== ""}
              helperText={usernameError}
              required
            />
            <PasswordTextField
              fullWidth
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={error || passwordError !== ""}
              helperText={passwordError}
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              onClick={handleLogin}
            >
              Login
            </Button>
            {serverInfo.registration ? (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            ) : (
              ""
            )}
          </form>
        </Box>
      </Box>
    </>
  )
}

export default Login
