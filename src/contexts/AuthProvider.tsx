import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactElement,
  useRef,
  RefObject,
} from "react"
import { useNavigate } from "react-router-dom"
import { userInfo, login, logout, register, patchUser } from "../api/index"
import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material"
import Logo from "../assets/images/foreground.svg"
import {
  Device,
  Location,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/types"
import { Severity } from "../types/enums"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../api/apiClient"
import { io, Socket } from "socket.io-client"
import { SERVER_URL } from "../api/config"

interface AuthContextType {
  user: User | null
  socketRef: RefObject<Socket | null>
  throwMessage: (message: string, severity: Severity) => void
  Severity: typeof Severity
  loginAction: (credentials: LoginCredentials) => Promise<any>
  registerAction: (credentials: RegisterCredentials) => Promise<any>
  logoutAction: () => void
  changeUsernameAction: (username: string) => Promise<any>
  changePasswordAction: (password: string) => Promise<any>
}

interface AuthProviderProps {
  children: ReactElement
}

const AuthContext = createContext<AuthContextType | null>(null)

function AuthProvider({ children }: AuthProviderProps) {
  const socketRef = useRef<Socket | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

  const { data: currentUserInfo, isFetching } = useQuery({
    queryKey: ["current_user_info"],
    queryFn: () => userInfo(),
    enabled: !!getRefreshToken(),
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      login(credentials.username, credentials.password),
    onSuccess: (data) => {
      setUser(data.user)
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
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
      setUser(data.user)
      setAccessToken(data.accessToken)
      setRefreshToken(data.refreshToken)
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
    onSuccess: (data) => {
      setUser(data)
      throwMessage("User patched!", Severity.SUCCESS)
    },
    onError: (error) => {
      throwMessage(error.message, Severity.ERROR)
    },
  })

  useEffect(() => {
    socketRef.current = io(SERVER_URL, {
      auth: { token: getAccessToken() },
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!socketRef.current) return

    const handleNewLocation = (location: Location) => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      })
      queryClient.setQueryData<Device[]>(["devices"], (prev = []) =>
        prev.map((device) =>
          device.id === location.device_id
            ? { ...device, latest_location: location }
            : device
        )
      )
    }

    socketRef.current.on("locationsUpdate", handleNewLocation)
    return () => {
      socketRef.current?.off("locationsUpdate", handleNewLocation)
    }
  }, [queryClient])

  useEffect(() => {
    if (currentUserInfo) {
      if (!user) {
        setUser(currentUserInfo)
      }
    }

    if (!isFetching) setAuthReady(true)
  }, [currentUserInfo, isFetching, user])

  async function loginAction(credentials: LoginCredentials) {
    try {
      return await loginMutation.mutateAsync(credentials)
    } catch (error) {
      return
    }
  }

  async function registerAction(credentials: RegisterCredentials) {
    try {
      return await registerMutation.mutateAsync(credentials)
    } catch (error) {
      return
    }
  }

  async function logoutAction() {
    try {
      await logoutMutation.mutateAsync()
      setUser(null)
      clearTokens()
      navigate("/login")
    } catch (error) {}
  }

  async function changeUsernameAction(username: string) {
    if (!user) return
    try {
      return await patchUserMutation.mutateAsync({ id: user.id, username })
    } catch (error) {
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
          <img src={Logo} width={60} alt="Onloc logo" />
        </Box>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        socketRef,
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

export default AuthProvider

export const useAuth = () => {
  return useContext(AuthContext)
}
