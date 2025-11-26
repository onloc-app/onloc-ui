import type { Tier } from "@/types/types"
import { fetchWithAuth } from "../apiClient"
import { API_URL } from "../config"
import ApiError from "./apiError"

export async function getTiers() {
  try {
    const response = await fetchWithAuth(`${API_URL}/tiers`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.tiers
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getTier(id: number) {
  try {
    const response = await fetchWithAuth(`${API_URL}/tiers/${id}`, {
      method: "GET",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.tier
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function postTier(tier: Tier) {
  try {
    const response = await fetchWithAuth(`${API_URL}/tiers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: tier.name,
        max_devices: tier.max_devices,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.tier
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function patchTier(tier: Tier) {
  try {
    const response = await fetchWithAuth(`${API_URL}/tiers`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: tier.id,
        name: tier.name,
        max_devices: tier.max_devices,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.tier
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function deleteTier(id: number) {
  try {
    const response = await fetchWithAuth(`${API_URL}/tiers/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new ApiError(response.status, "Could not delete tier")
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function reorderTiers(tiers: Tier[]) {
  try {
    const response = await fetchWithAuth(`${API_URL}/tiers/reorder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tiers),
    })

    if (!response.ok) {
      throw new ApiError(response.status, "Could not reorder tiers")
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
