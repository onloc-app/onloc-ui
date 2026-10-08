import type { Device, User } from "@/types/types"
import { Sort } from "@/types/enums"
import dayjs from "dayjs"
import {
  mdiBatteryOutline,
  mdiBattery10,
  mdiBattery20,
  mdiBattery30,
  mdiBattery40,
  mdiBattery50,
  mdiBattery60,
  mdiBattery70,
  mdiBattery80,
  mdiBattery90,
  mdiBattery,
  mdiBatteryChargingOutline,
  mdiBatteryCharging10,
  mdiBatteryCharging20,
  mdiBatteryCharging30,
  mdiBatteryCharging40,
  mdiBatteryCharging50,
  mdiBatteryCharging60,
  mdiBatteryCharging70,
  mdiBatteryCharging80,
  mdiBatteryCharging90,
  mdiBatteryCharging,
} from "@mdi/js"

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

export function numberToBadgeString(number: number) {
  return number > 99 ? "99+" : number.toString()
}

export function getBatteryPath(
  level: number,
  charging?: boolean | null,
): string {
  if (level >= 0 && level <= 10)
    return charging ? mdiBatteryOutline : mdiBatteryChargingOutline
  if (level > 10 && level <= 20)
    return charging ? mdiBatteryCharging10 : mdiBattery10
  if (level > 20 && level <= 30)
    return charging ? mdiBatteryCharging20 : mdiBattery20
  if (level > 30 && level <= 40)
    return charging ? mdiBatteryCharging30 : mdiBattery30
  if (level > 40 && level <= 50)
    return charging ? mdiBatteryCharging40 : mdiBattery40
  if (level > 50 && level <= 60)
    return charging ? mdiBatteryCharging50 : mdiBattery50
  if (level > 60 && level <= 70)
    return charging ? mdiBatteryCharging60 : mdiBattery60
  if (level > 70 && level <= 80)
    return charging ? mdiBatteryCharging70 : mdiBattery70
  if (level > 80 && level <= 90)
    return charging ? mdiBatteryCharging80 : mdiBattery80
  if (level > 90 && level < 100)
    return charging ? mdiBatteryCharging90 : mdiBattery90
  if (level === 100) return charging ? mdiBatteryCharging : mdiBattery
  return mdiBatteryOutline
}
