import Symbol from "@/components/src/Symbol"
import { AvailableIcons } from "@/types/enums"
import { Group, Select, Typography } from "@mantine/core"
import { mdiCheck } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"

interface DeviceIconsSelectProps {
  selectedIcon: string | null
  onChange: (icon: string | null) => void
}

export default function DeviceIconsSelect({
  selectedIcon,
  onChange,
}: DeviceIconsSelectProps) {
  const { t } = useTranslation()

  return (
    <Select
      size="sm"
      data={Object.keys(AvailableIcons)}
      value={selectedIcon || null}
      onChange={(icon) => onChange(icon)}
      label={t("components.device_icons_select.label")}
      renderOption={({ option, checked }) => (
        <Group justify="space-between" w="100%">
          <Group gap="xs">
            <Symbol name={option.value} size={1} />
            <Typography>{option.value}</Typography>
          </Group>
          {checked && <Icon path={mdiCheck} size={0.75} />}
        </Group>
      )}
      clearable
      searchable
    />
  )
}
