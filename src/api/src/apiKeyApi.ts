import type { ApiKey } from "@/types/types"
import api from "../apiClient"

export async function getApiKeys(): Promise<ApiKey[]> {
  const { data } = await api.get("/apikeys")
  return data.api_keys
}

export async function postApiKey(name: string): Promise<ApiKey> {
  const { data } = await api.post("/apikeys", {
    name: name,
  })
  return data.api_key
}

export async function deleteApiKey(id: bigint): Promise<void> {
  await api.delete(`/apikeys/${id}`)
}
