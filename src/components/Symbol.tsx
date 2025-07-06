import Icon from "@mdi/react"
import {
  mdiMapMarker,
  mdiCellphone,
  mdiDesktopTowerMonitor,
  mdiMonitor,
  mdiLaptop,
  mdiTablet,
} from "@mdi/js"

export const IconEnum: Record<string, string> = {
  place: mdiMapMarker,
  cellphone: mdiCellphone,
  desktop: mdiDesktopTowerMonitor,
  laptop: mdiLaptop,
  monitor: mdiMonitor,
  tablet: mdiTablet,
}

interface SymbolProps {
  name?: string | null
  color?: string
  size?: number
}

function Symbol({ name, color = "white", size = 1 }: SymbolProps) {
  const IconPath = name ? IconEnum[name] : mdiMapMarker

  return <Icon path={IconPath} size={size} color={color} />
}

export default Symbol
