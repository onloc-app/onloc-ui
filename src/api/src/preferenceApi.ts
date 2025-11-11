import type { Preference } from "@/types/types"
import { fetchWithAuth } from "../apiClient"
import { API_URL } from "../config"
import ApiError from "./apiError"

export async function getPreferences() {
  try {
    const response = await fetchWithAuth(`${API_URL}/preferences`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.preferences
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function getPreferenceByKey(key: string) {
  try {
    const response = await fetchWithAuth(`${API_URL}/preferences?key=${key}`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.preferences[0]
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function postPreference(preference: Preference) {
  try {
    const response = await fetchWithAuth(`${API_URL}/preferences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: preference.user_id,
        key: preference.key,
        value: preference.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.preference
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function patchPreference(preference: Preference) {
  try {
    const response = await fetchWithAuth(`${API_URL}/preferences`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: preference.id,
        user_id: preference.user_id,
        key: preference.key,
        value: preference.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.preference
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}
