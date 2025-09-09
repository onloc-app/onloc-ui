import Icon from "@mdi/react"
import { mdiMapMarker } from "@mdi/js"
import { IconEnum } from "../../types/enums"

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
