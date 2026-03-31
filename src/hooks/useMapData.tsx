import {
  getAvailableDatesByDeviceId,
  getDevices,
  getLocationsByDeviceId,
  getSharedDevices,
  getUser,
} from "@/api"
import { getGeolocation } from "@/helpers/locations"
import { type Device, type Location, type User } from "@/types/types"
import { useQueries, useQuery } from "@tanstack/react-query"
import type { Dayjs } from "dayjs"

interface MapDataState {
  devices: Device[]
  isDevicesLoading: boolean
  sharedDevices: Device[]
  sharedUsers: User[]
  locations: Location[]
  availableDates: string[]
  userGeolocation: GeolocationPosition | null
}

export default function useMapData(
  selectedDeviceId: bigint | null,
  startDate: Dayjs | null,
  endDate: Dayjs | null,
  isDateRange: boolean,
): MapDataState {
  const { data: devices = [], isLoading: isDevicesLoading } = useQuery<
    Device[]
  >({
    queryKey: ["devices"],
    queryFn: getDevices,
  })

  const { data: sharedDevices = [] } = useQuery<Device[]>({
    queryKey: ["shared_devices"],
    queryFn: getSharedDevices,
  })

  const sharedUsersQueries = useQueries({
    queries: sharedDevices.map((device) => ({
      queryKey: [device.user_id.toString()],
      queryFn: () => getUser(device.user_id),
      enabled: !!device.user_id,
    })),
  })

  const sharedUsers = sharedUsersQueries
    .map((q) => q.data)
    .filter((user): user is User => user !== undefined)

  const { data: availableDates = [] } = useQuery<string[]>({
    queryKey: ["available_dates", selectedDeviceId?.toString()],
    queryFn: () => getAvailableDatesByDeviceId(selectedDeviceId!),
    enabled: !!selectedDeviceId,
  })

  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: getGeolocation,
    retry: false,
  })

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: [
      "locations",
      "devices",
      "shared_devices",
      selectedDeviceId?.toString(),
      startDate,
      endDate,
      isDateRange,
    ],
    queryFn: async () => {
      const data = await getLocationsByDeviceId(
        selectedDeviceId!,
        startDate!.startOf("day"),
        isDateRange && endDate
          ? endDate!.endOf("day")
          : startDate!.endOf("day"),
      )
      return data[0].locations
    },
    enabled: !!selectedDeviceId && !!startDate && startDate.isValid(),
  })

  return {
    devices,
    isDevicesLoading,
    sharedDevices,
    sharedUsers,
    locations,
    availableDates,
    userGeolocation,
  }
}
