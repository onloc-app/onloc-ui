import {
  mdiCellphone,
  mdiDesktopTowerMonitor,
  mdiLaptop,
  mdiMapMarker,
  mdiMonitor,
  mdiTablet,
} from "@mdi/js"

export enum Severity {
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export enum Sort {
  NAME = "Name",
  LATEST_LOCATION = "Latest location",
}

export const IconEnum: Record<string, string> = {
  place: mdiMapMarker,
  cellphone: mdiCellphone,
  desktop: mdiDesktopTowerMonitor,
  laptop: mdiLaptop,
  monitor: mdiMonitor,
  tablet: mdiTablet,
}
