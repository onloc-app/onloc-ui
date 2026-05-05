import {
  ApiError,
  getStatus,
  getUserInfo,
  login,
  logout,
  patchUser,
  register,
  type LoginResponse,
  type RegisterResponse,
} from "@/api"
import { clearTokens } from "@/api/apiClient"
import { useColorMode } from "@/contexts/ThemeContext"
import { Severity } from "@/types/enums"
import type { LoginCredentials, RegisterCredentials, User } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState, type ReactElement } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import BlackLogo from "../assets/images/foreground-black.svg"
import WhiteLogo from "../assets/images/foreground.svg"
import AuthContext from "./AuthContext"
import { Flex, Loader, Typography } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { version } from "../../package.json"
import axios from "axios"
import {
  getOutdatedNotificationDismissedDate,
  getRefreshToken,
  setAccessToken,
  setOutdatedNotificationDismissedDate,
  setRefreshToken,
} from "@/helpers/localStorage"

const ONE_DAY = 24 * 60 * 60 * 1000

interface AuthProviderProps {
  children: ReactElement
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const { resolvedMode } = useColorMode()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)

  const { data: status } = useQuery({
    queryKey: ["status"],
    queryFn: getStatus,
  })

  // Fetch releases info from GitHub to check versions
  const { data: latestApiRelease } = useQuery({
    queryKey: ["github_api_release"],
    queryFn: async () => {
      const res = await axios.get(
        "https://api.github.com/repos/onloc-app/onloc-api/releases/latest",
      )
      return res.data
    },
  })
  const { data: latestUiRelease } = useQuery({
    queryKey: ["github_ui_release"],
    queryFn: async () => {
      const res = await axios.get(
        "https://api.github.com/repos/onloc-app/onloc-ui/releases/latest",
      )
      return res.data
    },
  })

  useEffect(() => {
    if (status && user?.admin) {
      const apiVersion = status.version
      const uiVersion = version

      if (!latestApiRelease || !latestUiRelease) return

      const dismissedDate = getOutdatedNotificationDismissedDate()
      if (dismissedDate && Date.now() - dismissedDate.getTime() < ONE_DAY)
        return

      const latestApiVersion = latestApiRelease.tag_name
      const latestUiVersion = latestUiRelease.tag_name

      if (apiVersion !== latestApiVersion || uiVersion !== latestUiVersion) {
        notifications.show({
          message: t("auth.server_outdated"),
          position: "bottom-center",
          color: Severity.WARNING,
        })
        setOutdatedNotificationDismissedDate(new Date())
      }
    }
  })

  function throwMessage(stringKey: string, severity: Severity) {
    notifications.show({
      message: t(stringKey),
      position: "top-center",
      color: severity,
    })
  }

  const { data: currentUserInfo, isLoading } = useQuery<User>({
    queryKey: ["current_user_info", getRefreshToken()],
    queryFn: getUserInfo,
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
      if (error instanceof ApiError) {
        if (error.status === 401) {
          throwMessage("auth.invalid_credentials", Severity.ERROR)
          return
        }
      }
      throwMessage("auth.generic_error", Severity.ERROR)
    },
  })

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      register(credentials.username, credentials.password),
    onSuccess: (data) => {
      setAccessToken(data.access_token)
      setRefreshToken(data.refresh_token)
      navigate("/")
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          throwMessage("auth.username_taken", Severity.ERROR)
          return
        }
      }
      throwMessage("auth.generic_error", Severity.ERROR)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
  })

  const patchUserMutation = useMutation({
    mutationFn: (user: User) => patchUser(user),
    onSuccess: () => {
      throwMessage("auth.user_patched", Severity.SUCCESS)
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          throwMessage("auth.username_taken", Severity.ERROR)
          return
        }
      }
      throwMessage("auth.generic_error", Severity.ERROR)
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
      queryClient.clear()
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
      await patchUserMutation.mutateAsync({ id: user.id, username })
      queryClient.invalidateQueries({ queryKey: ["current_user_info"] })
    } catch (error) {
      console.error(error)
    }
  }

  async function changePasswordAction(password: string) {
    if (!user) return
    try {
      await patchUserMutation.mutateAsync({
        id: user.id,
        password: password,
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (!authReady) {
    return (
      <Flex
        h="100vh"
        direction="column"
        align="center"
        justify="center"
        gap="xs"
      >
        <Flex>
          <Typography ff="heading" fz={48}>
            Onloc
          </Typography>
          <img
            src={resolvedMode === "dark" ? WhiteLogo : BlackLogo}
            width={60}
            alt="Onloc logo"
          />
        </Flex>
        <Loader />
      </Flex>
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
    </AuthContext.Provider>
  )
}
