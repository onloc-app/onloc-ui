import { stringToHexColor } from "@/helpers/utils"
import { ActionIcon, ColorInput, useMantineTheme } from "@mantine/core"
import { mdiClose } from "@mdi/js"
import Icon from "@mdi/react"
import { useMemo } from "react"

interface ColorPickerProps {
  label: string
  value: string | null
  name?: string
  onChange: (color: string | null) => void
}

export default function ColorPicker({
  label,
  value,
  name,
  onChange,
}: ColorPickerProps) {
  const theme = useMantineTheme()

  const COLOR_OPTIONS = useMemo(
    () => [
      theme.colors.brand[6],
      theme.colors.red[6],
      theme.colors.pink[6],
      theme.colors.grape[6],
      theme.colors.violet[6],
      theme.colors.indigo[6],
      theme.colors.blue[6],
      theme.colors.cyan[6],
      theme.colors.teal[6],
      theme.colors.green[6],
      theme.colors.lime[6],
      theme.colors.yellow[6],
      theme.colors.orange[6],
    ],
    [theme],
  )

  return (
    <ColorInput
      label={label}
      value={value ?? ""}
      onChange={onChange}
      disallowInput
      swatches={
        name ? [stringToHexColor(name), ...COLOR_OPTIONS] : COLOR_OPTIONS
      }
      rightSection={
        value && (
          <ActionIcon size="sm" variant="subtle" onClick={() => onChange(null)}>
            <Icon path={mdiClose} size={0.5} />
          </ActionIcon>
        )
      }
    />
  )
}
