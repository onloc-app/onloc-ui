import Icon from "@mdi/react"
import { useColorMode } from "@/contexts/ThemeContext"
import { mdiBrightness3, mdiBrightness7, mdiBrightnessAuto } from "@mdi/js"
import { ActionIcon } from "@mantine/core"

export default function ThemeToggle() {
  const { mode, setMode } = useColorMode()

  const cycleMode = () => {
    setMode(mode === "auto" ? "light" : mode === "light" ? "dark" : "auto")
  }

  let icon = <Icon path={mdiBrightness7} size={1} />

  if (mode === "dark") {
    icon = <Icon path={mdiBrightness3} size={1} />
  }

  if (mode === "auto") {
    icon = <Icon path={mdiBrightnessAuto} size={1} />
  }

  return (
    <ActionIcon onClick={cycleMode} variant="subtle" size="xl" radius="xl">
      {icon}
    </ActionIcon>
  )
}
