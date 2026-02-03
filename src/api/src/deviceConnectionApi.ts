import type { Device, DeviceConnection } from "@/types/types"
import { fetchWithAuth } from "../apiClient"
import { API_URL } from "../config"
import ApiError from "./apiError"

export async function getDeviceConnections() {
  try {
    const response = await fetchWithAuth(`${API_URL}/deviceconnections`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.device_connections
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function postDeviceConnection(deviceConnection: DeviceConnection) {
  try {
    const response = await fetchWithAuth(`${API_URL}/deviceconnections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection_id: deviceConnection.connection_id,
        device_id: deviceConnection.device_id,
        can_ring: deviceConnection.can_ring,
        can_lock: deviceConnection.can_lock,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.deviceConnection
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function deleteDeviceConnection(id: string) {
  try {
    const response = await fetchWithAuth(`${API_URL}/deviceconnections/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const data = await response.json()
      throw new ApiError(response.status, data.message)
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
