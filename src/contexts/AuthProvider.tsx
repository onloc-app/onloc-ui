import {
  getUserInfo,
  login,
  logout,
  patchUser,
  register,
  type LoginResponse,
  type RegisterResponse,
} from "@/api"
import {
  clearTokens,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/api/apiClient"
import { useColorMode } from "@/contexts/ThemeContext"
import { Severity } from "@/types/enums"
import type { LoginCredentials, RegisterCredentials, User } from "@/types/types"
import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState, type ReactElement } from "react"
import { useNavigate } from "react-router-dom"
import BlackLogo from "../assets/images/foreground-black.svg"
import WhiteLogo from "../assets/images/foreground.svg"
import AuthContext from "./AuthContext"

interface AuthProviderProps {
  children: ReactElement
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const { resolvedMode } = useColorMode()

  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)

  // Snackbar
  const [snackbarStatus, setSnackbarStatus] = useState(false)
  const [severity, setSeverity] = useState<Severity | undefined>(undefined)
  const [message, setMessage] = useState("")
  function handleHideSnackbar() {
    setSnackbarStatus(false)
  }
  function throwMessage(message: string, severity: Severity) {
    setSeverity(severity)
    setMessage(message)
    setSnackbarStatus(true)
  }

  const { data: currentUserInfo, isLoading } = useQuery({
    queryKey: ["current_user_info", getRefreshToken()],
    queryFn: () => getUserInfo(),
    enabled: !!getRefreshToken(),
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      login(credentials.username, credentials.password),
    onSuccess: (data) => {
      setAccessToken(data.access_token)
      setRefreshToken(data.refresh_token)
      navigate("/")
    },
    onError: (error) => {
      throwMessage(error.message, Severity.ERROR)
    },
  })

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      register(credentials.username, credentials.password),
    onSuccess: (data) => {
      setAccessToken(data.access_token)
      setRefreshToken(data.refresh_token)
      navigate("/")
      throwMessage("Welcome to Onloc!", Severity.SUCCESS)
    },
    onError: (error) => {
      throwMessage(error.message, Severity.ERROR)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
  })

  const patchUserMutation = useMutation({
    mutationFn: (user: User) => patchUser(user),
    onSuccess: () => {
      throwMessage("User patched", Severity.SUCCESS)
    },
    onError: (error) => {
      throwMessage(error.message, Severity.ERROR)
    },
  })

  useEffect(() => {
    if (!isLoading) {
      setUser(currentUserInfo ?? null)
      setAuthReady(true)
    }
  }, [isLoading, currentUserInfo])

  async function loginAction(
    credentials: LoginCredentials,
  ): Promise<LoginResponse> {
    try {
      return await loginMutation.mutateAsync(credentials)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function registerAction(
    credentials: RegisterCredentials,
  ): Promise<RegisterResponse> {
    try {
      return await registerMutation.mutateAsync(credentials)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function logoutAction() {
    try {
      await logoutMutation.mutateAsync()
      setUser(null)
      clearTokens()
      navigate("/login")
    } catch (error) {
      console.error(error)
    }
  }

  async function changeUsernameAction(username: string) {
    if (!user) return
    try {
      return await patchUserMutation.mutateAsync({ id: user.id, username })
    } catch (error) {
      console.error(error)
      return
    }
  }

  async function changePasswordAction(password: string) {
    if (!user) return
    try {
      return await patchUserMutation.mutateAsync({
        id: user.id,
        password: password,
      })
    } catch (error) {
      console.error(error)
      return
    }
  }

  if (!authReady) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography variant="h1" sx={{ fontFamily: "Nunito", fontSize: 48 }}>
            Onloc
          </Typography>
          <img
            src={resolvedMode === "dark" ? WhiteLogo : BlackLogo}
            width={60}
            alt="Onloc logo"
          />
        </Box>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        throwMessage,
        Severity,
        loginAction,
        registerAction,
        logoutAction,
        changeUsernameAction,
        changePasswordAction,
      }}
    >
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarStatus}
        autoHideDuration={5000}
        onClose={handleHideSnackbar}
      >
        <Alert severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  )
}
