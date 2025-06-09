import { Dayjs } from "dayjs"
import { API_URL } from "./../config"
import ApiError from "./apiError"

export async function getLocationsByDeviceId(
  token: string,
  deviceId: number,
  startDate: Dayjs | null = null,
  endDate: Dayjs | null = null
) {
  try {
    const dateOptions =
      startDate && endDate
        ? `&start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`
        : ""

    const response = await fetch(
      `${API_URL}/locations?device_id=${deviceId}${dateOptions}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

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

export async function getAvailableDatesByDeviceId(
  token: string,
  deviceId: number
) {
  try {
    const response = await fetch(
      `${API_URL}/locations/dates?device_id=${deviceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

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
