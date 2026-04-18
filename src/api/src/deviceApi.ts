import type { Device } from "@/types/types"
import api from "@/api/apiClient"

const ENDPOINT = "/devices"

export async function getDevices(): Promise<Device[]> {
  const { data } = await api.get("/devices")
  return data.devices
}

export async function postDevice(device: Device): Promise<Device> {
  const { data } = await api.post(ENDPOINT, {
    name: device.name,
    color: device.color,
    can_ring: device.can_ring,
    can_lock: device.can_lock,
    can_flash: device.can_flash,
    icon: device.icon,
  })
  return data.device
}

export async function patchDevice(device: Device): Promise<Device> {
  const { data } = await api.patch(ENDPOINT, {
    id: device.id,
    user_id: device.user_id,
    name: device.name,
    color: device.color,
    icon: device.icon,
    can_ring: device.can_ring,
    can_lock: device.can_lock,
    can_flash: device.can_flash,
  })
  return data.device
}

export async function deleteDevice(id: bigint): Promise<void> {
  await api.delete(`${ENDPOINT}/${id}`)
}

export async function ringDevice(id: bigint): Promise<number> {
  const { status } = await api.post(`${ENDPOINT}/${id}/ring`)
  return status
}

export async function lockDevice(
  id: bigint,
  message: string | null = null,
): Promise<number> {
  const { status } = await api.post(
    `${ENDPOINT}/${id}/lock`,
    message ? { message: message } : null,
  )
  return status
}

export async function flashDevice(id: bigint): Promise<number> {
  const { status } = await api.post(`${ENDPOINT}/${id}/flash`)
  return status
}

export async function getSharedDevices(): Promise<Device[]> {
  const { data } = await api.get(`${ENDPOINT}/shared`)
  return data.devices
}
