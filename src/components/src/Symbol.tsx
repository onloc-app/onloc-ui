import Icon from "@mdi/react"
import { mdiMapMarker } from "@mdi/js"
import { AvailableIcons } from "@/types/enums"

interface SymbolProps {
  name?: string | null
  color?: string
  size?: number
}

export default function Symbol({
  name,
  color = "white",
  size = 1,
}: SymbolProps) {
  const IconPath = name ? AvailableIcons[name] : mdiMapMarker

  return <Icon path={IconPath} size={size} color={color} />
}
