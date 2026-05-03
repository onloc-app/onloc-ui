import type { ThemeMode } from "@/contexts/ThemeContext"

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

export function getAccessToken(): string | null {
  return localStorage.getItem("access_token")
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token")
}

export function setTheme(mode: ThemeMode) {
  localStorage.setItem("theme", mode)
}

export function getTheme(): ThemeMode {
  return localStorage.getItem("theme") as ThemeMode
}

export function setOutdatedDismissedDate(date: Date) {
  localStorage.setItem("outdated_dismissed_date", date.toISOString())
}

export function getOutdatedDismissedDate() {
  const rawDate = localStorage.getItem("outdated_dismissed_date")
  if (!rawDate) return null
  return new Date(rawDate)
}
