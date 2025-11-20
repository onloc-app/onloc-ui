import {
  mdiCellphone,
  mdiDesktopTowerMonitor,
  mdiLaptop,
  mdiMapMarker,
  mdiMonitor,
  mdiSatelliteVariant,
  mdiSpaceStation,
  mdiTablet,
} from "@mdi/js"

export type Severity = "success" | "info" | "warning" | "error"

export const Severity = {
  SUCCESS: "success",
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
} as const

export type Sort = "Name" | "Latest location"

export const Sort = {
  NAME: "Name" as Sort,
  LATEST_LOCATION: "Latest location" as Sort,
}

export const AvailableIcons: Record<string, string> = {
  place: mdiMapMarker,
  cellphone: mdiCellphone,
  desktop: mdiDesktopTowerMonitor,
  laptop: mdiLaptop,
  monitor: mdiMonitor,
  tablet: mdiTablet,
  space_station: mdiSpaceStation,
  satellite_variant: mdiSatelliteVariant,
}

export type NavOptions =
  | "dashboard"
  | "map"
  | "devices"
  | "profile"
  | "admin"
  | "settings"

export const NavOptions = {
  DASHBOARD: "dashboard",
  MAP: "map",
  DEVICES: "devices",
  PROFILE: "profile",
  ADMIN: "admin",
  SETTINGS: "settings",
} as const

export type SettingType = "switch" | "toggle"

export const SettingType = {
  SWITCH: "switch",
  TOGGLE: "toggle",
} as const

export type CrudAction = "create" | "update" | "delete"

export const CrudAction = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
} as const
