import type { Session, User } from "@/types/types"
import api from "@/api/apiClient"

export async function getUser(): Promise<User> {
  const { data } = await api.get("/users/info")
  return data.user
}

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get("/users")
  return data.users
}

export async function patchUser(user: User): Promise<User> {
  const { data } = await api.patch("/users", user)
  return data.user
}

export async function deleteUser(id: bigint): Promise<void> {
  await api.delete(`/users/${id}`)
}

export async function getSessions(): Promise<Session[]> {
  const { data } = await api.get("/tokens")
  return data.tokens
}

export async function deleteSession(id: bigint): Promise<void> {
  await api.delete(`/tokens/${id}`)
}
