import { Device } from "../../types/types"
import { API_URL } from "./../config"
import ApiError from "./apiError"

export async function getDevices(token: string) {
  try {
    const response = await fetch(`${API_URL}/devices`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data
  } catch (error: any) {
    console.error(error)
    throw error
  }
}

export async function postDevice(token: string, device: Device) {
  try {
    const response = await fetch(`${API_URL}/devices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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

    return data
  } catch (error: any) {
    console.error(error)
    throw error
  }
}

export async function deleteDevice(token: string, id: number) {
  try {
    const response = await fetch(`${API_URL}/devices/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data
  } catch (error: any) {
    console.error(error)
    throw error
  }
}
