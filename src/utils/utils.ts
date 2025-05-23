import { LatLngTuple } from "leaflet"
import { Device, Location } from "../types/types"
import { Sort } from "../types/enums"
import dayjs, { Dayjs } from "dayjs"

export function formatISODate(isoDate: string): string {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function stringToHexColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = Math.abs(hash) % 360
  const saturation = 70 + (Math.abs(hash) % 30)
  const lightness = 50 + (Math.abs(hash) % 30)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

// TODO use this function to sort the Devices page
export function sortDevices(
  devices: Device[],
  type: Sort = Sort.NAME,
  reversed: boolean = false
): Device[] {
  let sortedDevices = [...devices]

  switch (type) {
    case Sort.NAME:
      sortedDevices.sort((a, b) => a.name.localeCompare(b.name))
      break
    case Sort.LATEST_LOCATION:
      sortedDevices.sort((a, b) => {
        const dateA = a.latest_location?.created_at
          ? new Date(a.latest_location.created_at).getTime()
          : 0
        const dateB = b.latest_location?.created_at
          ? new Date(b.latest_location.created_at).getTime()
          : 0

        if (dateA === dateB) {
          return a.name.localeCompare(b.name)
        }
        return dateB - dateA
      })
      break
    default:
      break
  }

  if (reversed) sortedDevices.reverse()

  return sortedDevices
}

export function getBoundsByLocations(
  locations: Location[]
): [LatLngTuple, LatLngTuple] {
  const latitudes = locations.map((location) => location.latitude)
  const longitudes = locations.map((location) => location.longitude)

  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const minLng = Math.min(...longitudes)
  const maxLng = Math.max(...longitudes)

  const bounds: [LatLngTuple, LatLngTuple] = [
    [minLat, minLng],
    [maxLat, maxLng],
  ]

  return bounds
}

export function isAllowedHour(
  timestamp: string,
  allowedHours: number[] | null
) {
  if (!allowedHours || allowedHours.length < 2) return false

  return (
    dayjs(timestamp).hour() >= allowedHours[0] &&
    dayjs(timestamp).hour() <= allowedHours[1]
  )
}

export function isAllowedDate(timestamp: string, allowedDate: Dayjs | null) {
  if (!allowedDate) return false

  return dayjs(timestamp) === allowedDate
}
