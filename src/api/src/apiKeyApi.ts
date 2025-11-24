import { fetchWithAuth } from "../apiClient"
import { API_URL } from "../config"
import ApiError from "./apiError"

export async function getApiKeys() {
  try {
    const response = await fetchWithAuth(`${API_URL}/apikeys`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.api_keys
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function postApiKey(name: string) {
  try {
    const response = await fetchWithAuth(`${API_URL}/apikeys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.apiKey
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function deleteApiKey(id: number) {
  try {
    const response = await fetchWithAuth(`${API_URL}/apiKeys/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new ApiError(response.status, "Api key could not be deleted")
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
