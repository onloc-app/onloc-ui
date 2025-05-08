import { User } from "../types/types"
import { API_URL } from "./apiConfig"

export async function userInfo(token: string) {
  try {
    const response = await fetch(`${API_URL}/api/user`, {
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
    if (!error.status) {
      console.log(error)
      return { message: error.message, error: true }
    }
    return error
  }
}

export async function patchUser(token: string, user: User) {
  try {
    const response = await fetch(`${API_URL}/api/user`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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

export async function getSessions(token: string) {
  try {
    const response = await fetch(`${API_URL}/api/user/tokens`, {
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

export async function deleteSession(token: string, id: number) {
  try {
    const response = await fetch(`${API_URL}/api/user/tokens/${id}`, {
      method: "DELETE",
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
