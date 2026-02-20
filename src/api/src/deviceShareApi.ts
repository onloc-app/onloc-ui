import type { DeviceShare } from "@/types/types"
import { fetchWithAuth } from "../apiClient"
import { API_URL } from "../config"
import ApiError from "./apiError"

export async function getDeviceShares() {
  try {
    const response = await fetchWithAuth(`${API_URL}/deviceshares`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.device_shares
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function postDeviceShare(deviceShare: DeviceShare) {
  try {
    const response = await fetchWithAuth(`${API_URL}/deviceshares`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection_id: deviceShare.connection_id,
        device_id: deviceShare.device_id,
        can_ring: deviceShare.can_ring,
        can_lock: deviceShare.can_lock,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.device_share
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function deleteDeviceShare(id: bigint) {
  try {
    const response = await fetchWithAuth(`${API_URL}/deviceshares/${id}`, {
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
