import { Dayjs } from "dayjs"
import { API_URL } from "@/api/config"
import ApiError from "./apiError"
import { fetchWithAuth } from "@/api/apiClient"

export async function getLocationsByDeviceId(
  deviceId: string,
  startDate: Dayjs | null = null,
  endDate: Dayjs | null = null,
) {
  try {
    const dateOptions =
      startDate && endDate
        ? `&start_date=${startDate.format(
            "YYYY-MM-DDTHH:mm:ssZ",
          )}&end_date=${endDate.format("YYYY-MM-DDTHH:mm:ssZ")}`
        : ""

    const response = await fetchWithAuth(
      `${API_URL}/locations?device_id=${deviceId}${dateOptions}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.locations
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getAvailableDatesByDeviceId(deviceId: string) {
  try {
    const response = await fetchWithAuth(
      `${API_URL}/locations/dates?device_id=${deviceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    )

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.message)
    }

    return data.dates
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function deleteLocationsByUserId(userId: number) {
  try {
    const response = await fetchWithAuth(
      `${API_URL}/locations?user_id=${userId}`,
      {
        method: "DELETE",
      },
    )

    if (!response.ok) {
      throw new ApiError(response.status, "Could not delete locations")
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}
