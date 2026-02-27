import api, { getRefreshToken } from "@/api/apiClient"
import type { User } from "@/types/types"

export interface LoginResponse {
  user: User
  access_token: string
  refresh_token: string
}

export interface RegisterResponse {
  user: User
  access_token: string
  refresh_token: string
}

export interface StatusResponse {
  registration: boolean
  is_setup: boolean
}

export async function getStatus(): Promise<StatusResponse> {
  const { data } = await api.get("/status")
  return data
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await api.post("/auth/login", {
    username: username,
    password: password,
  })
  return data
}

export async function register(
  username: string,
  password: string,
): Promise<RegisterResponse> {
  const { data } = await api.post("/auth/register", {
    username: username,
    password: password,
  })
  return data
}

export async function logout(): Promise<void> {
  await api.delete("/tokens", {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ refresh_token: getRefreshToken() }),
  })
}
