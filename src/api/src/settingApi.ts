import type { Setting } from "@/types/types"
import { fetchWithAuth } from "@/api/apiClient"
import { API_URL } from "@/api/config"
import ApiError from "./apiError"

export async function getSettings() {
  try {
    const response = await fetchWithAuth(`${API_URL}/settings`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.settings
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function postSetting(setting: Setting) {
  try {
    const response = await fetchWithAuth(`${API_URL}/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: setting.key,
        value: setting.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.setting
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function patchSetting(setting: Setting) {
  try {
    const response = await fetchWithAuth(`${API_URL}/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: setting.id,
        key: setting.key,
        value: setting.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.setting
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}
