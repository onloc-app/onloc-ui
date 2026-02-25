import { fetchWithAuth } from "../apiClient"
import { API_URL } from "../config"
import ApiError from "./apiError"

export async function getConnections() {
  try {
    const response = await fetchWithAuth(`${API_URL}/connections`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.connections
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function sendConnectionRequest(addresseeId: bigint) {
  try {
    const response = await fetchWithAuth(`${API_URL}/connections/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addressee_id: addresseeId.toString(),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.connection
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function acceptConnectionRequest(id: bigint) {
  try {
    const response = await fetchWithAuth(`${API_URL}/connections/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.connection
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function rejectConnectionRequest(id: bigint) {
  try {
    const response = await fetchWithAuth(`${API_URL}/connections/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.connection
  } catch (error) {
    console.error(error)
    throw error
  }
}
