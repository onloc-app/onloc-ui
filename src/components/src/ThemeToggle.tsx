import Icon from "@mdi/react"
import { useColorMode } from "../../contexts/ThemeContext"
import { mdiBrightness3, mdiBrightness7, mdiBrightnessAuto } from "@mdi/js"
import { IconButton } from "@mui/material"

export default function ThemeToggle() {
  const { mode, setMode } = useColorMode()

  function handleClick() {
    setMode(nextMode)
  }

  const nextMode =
    mode === "light" ? "dark" : mode === "dark" ? "auto" : "light"

  let icon = <Icon path={mdiBrightness7} size={1} />

  if (mode === "dark") {
    icon = <Icon path={mdiBrightness3} size={1} />
  }

  if (mode === "auto") {
    icon = <Icon path={mdiBrightnessAuto} size={1} />
  }

  return (
    <IconButton onClick={handleClick} color="inherit">
      {icon}
    </IconButton>
  )
}
