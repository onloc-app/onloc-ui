import type { DeviceShare } from "@/types/types"
import api from "../apiClient"

export async function getDeviceShares() {
  const { data } = await api.get("/deviceshares")
  return data.device_shares
}

export async function postDeviceShare(deviceShare: DeviceShare) {
  const { data } = await api.post("/deviceshares", {
    connection_id: deviceShare.connection_id,
    device_id: deviceShare.device_id,
    can_ring: deviceShare.can_ring,
    can_lock: deviceShare.can_lock,
  })
  return data.device_share
}

export async function deleteDeviceShare(id: bigint) {
  await api.delete(`/deviceshares/${id}`)
}
