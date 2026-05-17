import Icon from "@mdi/react"
import { type ThemeMode, useColorMode } from "@/contexts/ThemeContext"
import { mdiBrightness3, mdiBrightness7, mdiBrightnessAuto } from "@mdi/js"
import { ActionIcon } from "@mantine/core"
import { useToggle } from "@mantine/hooks"
import { useEffect } from "react"

export default function ThemeToggle() {
  const { mode, setMode } = useColorMode()
  const [nextMode, toggle] = useToggle<ThemeMode>(["auto", "light", "dark"])

  useEffect(() => {
    setMode(nextMode)
  }, [nextMode, setMode])

  let icon = <Icon path={mdiBrightness7} size={1} />

  if (mode === "dark") {
    icon = <Icon path={mdiBrightness3} size={1} />
  }

  if (mode === "auto") {
    icon = <Icon path={mdiBrightnessAuto} size={1} />
  }

  return (
    <ActionIcon onClick={() => toggle()} variant="subtle" size="xl" radius="xl">
      {icon}
    </ActionIcon>
  )
}
