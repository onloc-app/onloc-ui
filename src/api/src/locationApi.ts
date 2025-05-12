import { Dayjs } from "dayjs"
import { API_URL } from "./../config"

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
      `${API_URL}/api/locations?device_id=${deviceId}${dateOptions}`,
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
      throw { status: response.status, message: data.message, error: true }
    }

    return data
  } catch (error: any) {
    console.error(error)
    return error
  }
}

export async function getAvailableDatesByDeviceId(
  token: string,
  deviceId: number
) {
  try {
    const response = await fetch(
      `${API_URL}/api/locations/dates?device_id=${deviceId}`,
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
      throw { status: response.status, message: data.message, error: true }
    }

    return data
  } catch (error: any) {
    console.error(error)
    return error
  }
}
