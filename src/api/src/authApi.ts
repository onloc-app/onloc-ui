import { fetchWithAuth } from "@/api/apiClient"
import { API_URL } from "@/api/config"
import ApiError from "./apiError"
import type { User } from "@/types/types"

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export async function getStatus() {
  try {
    const response = await fetch(`${API_URL}/status`)

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function register(
  username: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function logout() {
  try {
    const response = await fetchWithAuth(`${API_URL}/tokens`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    })

    if (!response.ok) {
      throw new ApiError(response.status, "User could not be logged out")
    }
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}
