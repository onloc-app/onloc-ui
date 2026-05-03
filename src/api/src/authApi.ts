import api from "@/api/apiClient"
import { getRefreshToken } from "@/helpers/localStorage"
import type { User } from "@/types/types"

const AUTH_ENDPOINT = "/auth"
const TOKENS_ENDPOINT = "/tokens"

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
  version: string
}

export async function getStatus(): Promise<StatusResponse> {
  const { data } = await api.get("/status")
  return data
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await api.post(`${AUTH_ENDPOINT}/login`, {
    username: username,
    password: password,
  })
  return data
}

export async function register(
  username: string,
  password: string,
): Promise<RegisterResponse> {
  const { data } = await api.post(`${AUTH_ENDPOINT}/register`, {
    username: username,
    password: password,
  })
  return data
}

export async function logout(): Promise<void> {
  await api.delete(TOKENS_ENDPOINT, {
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ refresh_token: getRefreshToken() }),
  })
}
