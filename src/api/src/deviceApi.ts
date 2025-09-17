import type { Device } from "@/types/types"
import { fetchWithAuth } from "@/api/apiClient"
import { API_URL } from "@/api/config"
import ApiError from "./apiError"

export async function getDevices() {
  try {
    const response = await fetchWithAuth(`${API_URL}/devices`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.devices
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function postDevice(device: Device) {
  try {
    const response = await fetchWithAuth(`${API_URL}/devices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: device.name,
        icon: device.icon,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.device
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function deleteDevice(id: number) {
  try {
    const response = await fetchWithAuth(`${API_URL}/devices/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new ApiError(response.status, "Device could not be deleted")
    }
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}
