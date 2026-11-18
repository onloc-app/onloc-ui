import { Dayjs } from "dayjs"
import api from "@/api/apiClient"
import type { Location } from "@/types/types"

const ENDPOINT = "/locations"

export async function getLocationsByDeviceId(
  deviceId: bigint,
  startDate: Dayjs | null = null,
  endDate: Dayjs | null = null,
): Promise<Location[]> {
  const hasValidDates = startDate?.isValid() && endDate?.isValid()

  const { data } = await api.get(ENDPOINT, {
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
  const { data } = await api.get(`${ENDPOINT}/${deviceId}/dates`)
  return data.dates
}

export async function deleteLocationsByUserId(id: bigint): Promise<void> {
  await api.delete(`${ENDPOINT}?user_id=${id}`)
}
