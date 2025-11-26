import type { UserTier } from "@/types/types"
import { fetchWithAuth } from "../apiClient"
import { API_URL } from "../config"
import ApiError from "./apiError"

export async function postUserTier(userTier: UserTier) {
  try {
    const response = await fetchWithAuth(`${API_URL}/usertiers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userTier.user_id,
        tier_id: userTier.tier_id,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.user_tier
  } catch (error) {
    console.error(error)
    throw error
  }
}
