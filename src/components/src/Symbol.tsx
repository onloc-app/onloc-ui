import Icon from "@mdi/react"
import { mdiMapMarker } from "@mdi/js"
import { AvailableIcons } from "@/types/enums"
import { useTheme } from "@mui/material"

interface SymbolProps {
  name?: string | null
  color?: string | null
  size?: number
}

export default function Symbol({ name, color = null, size = 1 }: SymbolProps) {
  const theme = useTheme()
  const colorFallback = theme.palette.text.primary

  const IconPath = name ? AvailableIcons[name] : mdiMapMarker

  return <Icon path={IconPath} size={size} color={color ?? colorFallback} />
}
