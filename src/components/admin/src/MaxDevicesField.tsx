import { mdiMinus, mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import { Box, IconButton, TextField } from "@mui/material"
import type { ChangeEvent } from "react"

interface MaxDevicesFieldProps {
  value: number | null
  required?: boolean
  onChange: (value: number | null) => void
}

export default function MaxDevicesField({
  value,
  required = false,
  onChange,
}: MaxDevicesFieldProps) {
  const handleLowerMaxDevices = () => {
    if (value !== null) {
      const newValue = value - 1
      onChange(newValue < 0 ? null : newValue)
    }
  }

  const handleIncreaseMaxDevices = () => {
    if (value === null) {
      onChange(0)
    } else {
      onChange(value + 1)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
      }}
    >
      <IconButton onClick={handleLowerMaxDevices} disabled={value === null}>
        <Icon path={mdiMinus} size={1} />
      </IconButton>
      <TextField
        label="Maximum devices"
        size="small"
        required={required}
        value={value !== null ? value : "Unlimited"}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const raw = event.target.value.trim()

          if (raw === "") {
            onChange(null)
            return
          }

          const newValue = Number(raw)

          if (Number.isNaN(newValue)) return

          onChange(newValue)
        }}
      />
      <IconButton
        onClick={handleIncreaseMaxDevices}
        disabled={value === Number.MAX_SAFE_INTEGER}
      >
        <Icon path={mdiPlus} size={1} />
      </IconButton>
    </Box>
  )
}
