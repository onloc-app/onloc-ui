import type { Connection } from "@/types/types"
import api from "../apiClient"

const ENDPOINT = "/connections"

export async function getConnections(): Promise<Connection[]> {
  const { data } = await api.get(ENDPOINT)
  return data.connections
}

export async function sendConnectionRequest(
  addresseeId: bigint,
): Promise<Connection> {
  const { data } = await api.post(`${ENDPOINT}/send`, {
    addressee_id: addresseeId,
  })
  return data.connection
}

export async function acceptConnectionRequest(id: bigint): Promise<Connection> {
  const { data } = await api.post(`${ENDPOINT}/accept`, {
    id: id,
  })
  return data.connection
}

export async function rejectConnectionRequest(id: bigint): Promise<Connection> {
  const { data } = await api.post(`${ENDPOINT}/reject`, {
    id: id,
  })
  return data.connection
}
