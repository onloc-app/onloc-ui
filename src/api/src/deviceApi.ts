import type { Device } from "@/types/types"
import api from "@/api/apiClient"

export async function getDevices(): Promise<Device[]> {
  const { data } = await api.get("/devices")
  return data.devices
}

export async function postDevice(device: Device): Promise<Device> {
  const { data } = await api.post("/devices", {
    name: device.name,
    can_ring: device.can_ring,
    can_lock: device.can_lock,
    icon: device.icon,
  })
  return data.device
}

export async function patchDevice(device: Device): Promise<Device> {
  const { data } = await api.patch("/devices", {
    id: device.id,
    user_id: device.user_id,
    name: device.name,
    icon: device.icon,
    can_ring: device.can_ring,
    can_lock: device.can_lock,
  })
  return data.device
}

export async function deleteDevice(id: bigint): Promise<void> {
  await api.delete(`/devices/${id}`)
}

export async function ringDevice(id: bigint): Promise<number> {
  const { status } = await api.post(`/devices/${id}/ring`)
  return status
}

export async function lockDevice(
  id: bigint,
  message: string | null = null,
): Promise<number> {
  const { status } = await api.post(
    `/devices/${id}/lock`,
    message ? { message: message } : null,
  )
  return status
}

export async function getSharedDevices(): Promise<Device[]> {
  const { data } = await api.get("/devices/shared")
  return data.devices
}
