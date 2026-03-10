import type { Device, User } from "@/types/types"
import { Sort } from "@/types/enums"
import dayjs from "dayjs"

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

  const s = saturation / 100
  const l = lightness / 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + hue / 30) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }

  const r = Math.round(f(0) * 255)
  const g = Math.round(f(8) * 255)
  const b = Math.round(f(4) * 255)

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
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

export function sortUsers(users: User[]) {
  return [...users].sort((a, b) =>
    (a.username ?? "").localeCompare(b.username ?? ""),
  )
}

export function snapAngle(angle: number) {
  const deg = ((angle * 180) / Math.PI + 360) % 360

  const allowed = [
    [45, 140],
    [220, 315],
  ]

  // Check if already in an allowed range
  for (const [min, max] of allowed) {
    if (deg >= min && deg <= max) return angle
  }

  // Find nearest allowed edge
  let nearest = allowed[0][0]
  let minDist = Infinity
  for (const [min, max] of allowed) {
    const distToMin = Math.abs(deg - min)
    const distToMax = Math.abs(deg - max)
    if (distToMin < minDist) {
      minDist = distToMin
      nearest = min
    }
    if (distToMax < minDist) {
      minDist = distToMax
      nearest = max
    }
  }

  return (nearest * Math.PI) / 180
}
