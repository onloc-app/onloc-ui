import type { Session, User } from "@/types/types"
import api from "@/api/apiClient"

const USERS_ENDPOINT = "/users"
const TOKENS_ENDPOINT = "/tokens"

export async function getUserInfo(): Promise<User> {
  const { data } = await api.get(`${USERS_ENDPOINT}/info`)
  return data.user
}

export async function getUser(id: bigint): Promise<User> {
  const { data } = await api.get(`${USERS_ENDPOINT}/${id}`)
  return data.user
}

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get(USERS_ENDPOINT)
  return data.users
}

export async function patchUser(user: User): Promise<User> {
  const { data } = await api.patch(USERS_ENDPOINT, user)
  return data.user
}

export async function deleteUser(id: bigint): Promise<void> {
  await api.delete(`${USERS_ENDPOINT}/${id}`)
}

export async function getSessions(): Promise<Session[]> {
  const { data } = await api.get(TOKENS_ENDPOINT)
  return data.tokens
}

export async function deleteSession(id: bigint): Promise<void> {
  await api.delete(`${TOKENS_ENDPOINT}/${id}`)
}
