import Icon from "@mdi/react"
import { mdiMapMarker } from "@mdi/js"
import { AvailableIcons } from "@/types/enums"
import { useComputedColorScheme, useMantineTheme } from "@mantine/core"

interface SymbolProps {
  name?: string | null
  color?: string | null
  size?: number
}

export default function Symbol({ name, color = null, size = 1 }: SymbolProps) {
  const theme = useMantineTheme()
  const colorScheme = useComputedColorScheme("light")
  const colorFallback =
    colorScheme === "light" ? theme.colors.gray[9] : theme.colors.dark[0]

  const IconPath = name ? AvailableIcons[name] : mdiMapMarker

  return <Icon path={IconPath} size={size} color={color ?? colorFallback} />
}
