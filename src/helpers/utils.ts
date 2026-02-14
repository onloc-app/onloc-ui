import type { Device, User } from "@/types/types"
import { Sort } from "@/types/enums"
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
  const saturation = 65 + (Math.abs(hash) % 25)
  const lightness = 50 + (Math.abs(hash) % 12)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function sortDevices(
  devices: Device[],
  type: Sort = Sort.NAME,
  reversed: boolean = false,
): Device[] {
  const sortedDevices = [...devices]

  switch (type) {
    case Sort.NAME:
      sortedDevices.sort((a, b) => a.name.localeCompare(b.name))
      if (reversed) sortedDevices.reverse()
      break
    case Sort.LATEST_LOCATION:
      sortedDevices.sort((a, b) => {
        const hasLocationA = !!a.latest_location?.created_at
        const hasLocationB = !!b.latest_location?.created_at

        if (!hasLocationA && hasLocationB) return 1
        if (hasLocationA && !hasLocationB) return -1
        if (!hasLocationA && !hasLocationB)
          return reversed
            ? -a.name.localeCompare(b.name)
            : a.name.localeCompare(b.name)

        const dateA = new Date(a.latest_location!.created_at!).getTime()
        const dateB = new Date(b.latest_location!.created_at!).getTime()

        if (dateA === dateB) return a.name.localeCompare(b.name)

        return reversed ? dateA - dateB : dateB - dateA
      })
      break
    default:
      break
  }

  return sortedDevices
}

export function separateSharedDevies(devices: Device[]): Device[] {
  const ownDevices = devices.filter((device) => !device.device_share)
  const sharedDevices = devices.filter((device) => device.device_share)
  return [...ownDevices, ...sharedDevices]
}

export function isAllowedHour(
  timestamp: string,
  allowedHours: number[] | null,
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

export function sortUsers(users: User[]) {
  return [...users].sort((a, b) =>
    (a.username ?? "").localeCompare(b.username ?? ""),
  )
}
