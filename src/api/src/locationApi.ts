import { Dayjs } from "dayjs"
import api from "@/api/apiClient"
import type { Location } from "@/types/types"

interface LocationsResponse {
  device_id: number
  locations: Location[]
}

export async function getLocationsByDeviceId(
  deviceId: bigint,
  startDate: Dayjs | null = null,
  endDate: Dayjs | null = null,
): Promise<LocationsResponse[]> {
  const hasValidDates = startDate?.isValid() && endDate?.isValid()

  const { data } = await api.get("/locations", {
    params: {
      device_id: deviceId,
      ...(hasValidDates && {
        start_date: startDate!.toISOString(),
        end_date: endDate!.toISOString(),
      }),
    },
  })
  return data.locations
}

export async function getAvailableDatesByDeviceId(
  deviceId: bigint,
): Promise<string[]> {
  const { data } = await api.get(`/locations/dates?device_id=${deviceId}`)
  return data.dates
}

export async function deleteLocationsByUserId(id: bigint): Promise<void> {
  await api.delete(`/locations?user_id=${id}`)
}
