import type { Connection } from "@/types/types"
import api from "../apiClient"

export async function getConnections(): Promise<Connection[]> {
  const { data } = await api.get("/connections")
  return data.connections
}

export async function sendConnectionRequest(
  addresseeId: bigint,
): Promise<Connection> {
  const { data } = await api.post("/connections/send", {
    addressee_id: addresseeId,
  })
  return data.connection
}

export async function acceptConnectionRequest(id: bigint): Promise<Connection> {
  const { data } = await api.post("/connections/accept", {
    id: id,
  })
  return data.connection
}

export async function rejectConnectionRequest(id: bigint): Promise<Connection> {
  const { data } = await api.post("/connections/reject", {
    id: id,
  })
  return data.connection
}
