import { User } from "../../types/types"
import { API_URL } from "./../config"
import ApiError from "./apiError"

export async function userInfo(token: string) {
  try {
    const response = await fetch(`${API_URL}/user`, {
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

export async function patchUser(token: string, user: User) {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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

export async function getSessions(token: string) {
  try {
    const response = await fetch(`${API_URL}/user/tokens`, {
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

export async function deleteSession(token: string, id: number) {
  try {
    const response = await fetch(`${API_URL}/user/tokens/${id}`, {
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
