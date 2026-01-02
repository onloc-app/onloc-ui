import { API_URL } from "@/api/config"

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

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(options.headers || {})

  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()

  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`)

  const response = await fetch(url, { ...options, headers })

  if (response.status !== 401) return response

  if (!refreshToken) throw new Error("No refresh token")

  if (!isRefreshing) {
    isRefreshing = true
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Refresh failed")
        return response.json()
      })
      .then(({ access_token: newAccessToken }) => {
        setAccessToken(newAccessToken)
      })
      .catch(() => {
        clearTokens()
      })
      .finally(() => {
        isRefreshing = false
        refreshPromise = null
      })
  }

  await refreshPromise

  const retryHeaders = new Headers(options.headers || {})
  retryHeaders.set("Authorization", `Bearer ${accessToken}`)

  return fetch(url, { ...options, headers: retryHeaders })
}
