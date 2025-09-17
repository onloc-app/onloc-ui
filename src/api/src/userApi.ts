import type { User } from "@/types/types"
import { fetchWithAuth } from "@/api/apiClient"
import { API_URL } from "@/api/config"
import ApiError from "./apiError"

export async function userInfo() {
  try {
    const response = await fetchWithAuth(`${API_URL}/user`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.user
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function patchUser(user: User) {
  try {
    const response = await fetchWithAuth(`${API_URL}/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.user
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function getSessions() {
  try {
    const response = await fetchWithAuth(`${API_URL}/tokens`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.tokens
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}

export async function deleteSession(id: number) {
  try {
    const response = await fetchWithAuth(`${API_URL}/tokens/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new ApiError(response.status, "Session could not be deleted")
    }
  } catch (error: unknown) {
    console.error(error)
    throw error
  }
}
