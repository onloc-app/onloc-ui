import { Setting } from "../types/types"
import { API_URL } from "./apiConfig"

export async function getSettings(token: string) {
  try {
    const response = await fetch(`${API_URL}/api/settings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw { status: response.status, message: data.message, error: true }
    }

    return data
  } catch (error: any) {
    console.error(error)
    return error
  }
}

export async function postSetting(token: string, setting: Setting) {
  try {
    const response = await fetch(`${API_URL}/api/settings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: setting.key,
        value: setting.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw { status: response.status, message: data.message, error: true }
    }

    return data
  } catch (error: any) {
    console.error(error)
    return error
  }
}

export async function patchSetting(token: string, setting: Setting) {
  try {
    const response = await fetch(`${API_URL}/api/settings/${setting.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: setting.key,
        value: setting.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw { status: response.status, message: data.message, error: true }
    }

    return data
  } catch (error: any) {
    console.error(error)
    return error
  }
}
