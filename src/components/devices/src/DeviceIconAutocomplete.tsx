import Symbol from "@/components/src/Symbol"
import { AvailableIcons } from "@/types/enums"
import { Autocomplete, Group, Typography } from "@mantine/core"
import { useTranslation } from "react-i18next"

interface DeviceIconAutocompleteProps {
  selectedIcon: string | null
  onChange: (icon: string) => void
}

export default function DeviceIconAutocomplete({
  selectedIcon,
  onChange,
}: DeviceIconAutocompleteProps) {
  const { t } = useTranslation()

  return (
    <Autocomplete
      size="sm"
      data={Object.keys(AvailableIcons)}
      value={selectedIcon || ""}
      onChange={onChange}
      label={t("components.add_device_button.icon")}
      renderOption={({ option }) => (
        <Group gap="xs">
          <Symbol name={option.value} size={1} />
          <Typography>{option.value}</Typography>
        </Group>
      )}
      clearable
    />
  )
}
