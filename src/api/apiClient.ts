import { API_URL } from "@/api/config"
import axios, { isAxiosError } from "axios"
import ApiError from "./src/apiError"

let isRefreshing = false
let refreshPromise: Promise<void> | null = null

export function setAccessToken(token: string | null) {
  if (token) {
    localStorage.setItem("access_token", token)
  } else {
    localStorage.removeItem("access_token")
  }
}

export function setRefreshToken(token: string | null) {
  if (token) {
    localStorage.setItem("refresh_token", token)
  } else {
    localStorage.removeItem("refresh_token")
  }
}

export function getAccessToken() {
  return localStorage.getItem("access_token")
}

export function getRefreshToken() {
  return localStorage.getItem("refresh_token")
}

export function clearTokens() {
  setAccessToken(null)
  setRefreshToken(null)
}

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) throw error

    const originalRequest = error.config

    if (error.response?.status !== 401 || !originalRequest) {
      throw new ApiError(
        error.response?.status ?? 500,
        error.response?.data?.message ?? "Something went wrong",
      )
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearTokens()
      throw new ApiError(401, "Session expired")
    }

    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = axios
        .post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })
        .then(({ data }) => {
          setAccessToken(data.access_token)
        })
        .catch(() => {
          clearTokens()
          throw new ApiError(401, "Session expired")
        })
        .finally(() => {
          isRefreshing = false
          refreshPromise = null
        })
    }

    await refreshPromise

    const newToken = getAccessToken()
    originalRequest.headers.Authorization = `Bearer ${newToken}`

    return api(originalRequest)
  },
)

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
