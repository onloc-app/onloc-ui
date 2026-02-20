import { ActionIcon, Flex, TextInput } from "@mantine/core"
import { mdiMinus, mdiPlus } from "@mdi/js"
import Icon from "@mdi/react"
import type { ChangeEvent } from "react"
import { useTranslation } from "react-i18next"

interface MaxDevicesFieldProps {
  value: number | null
  withAsterisk?: boolean
  onChange: (value: number | null) => void
}

export default function MaxDevicesField({
  value,
  withAsterisk = false,
  onChange,
}: MaxDevicesFieldProps) {
  const { t } = useTranslation()

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
    <Flex align="end" gap="xs">
      <ActionIcon onClick={handleLowerMaxDevices} disabled={value === null}>
        <Icon path={mdiMinus} size={1} />
      </ActionIcon>

      <TextInput
        flex={1}
        label={t("components.max_devices_field.label")}
        withAsterisk={withAsterisk}
        value={
          value !== null ? value : t("components.max_devices_field.unlimited")
        }
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

      <ActionIcon
        onClick={handleIncreaseMaxDevices}
        disabled={value === Number.MAX_SAFE_INTEGER}
      >
        <Icon path={mdiPlus} size={1} />
      </ActionIcon>
    </Flex>
  )
}
