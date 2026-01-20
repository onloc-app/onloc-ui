import Symbol from "@/components/src/Symbol"
import { AvailableIcons } from "@/types/enums"
import { Autocomplete, Box, TextField } from "@mui/material"
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
      size="small"
      options={Object.keys(AvailableIcons)}
      renderOption={(props, option) => {
        return (
          <li {...props}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mr: 1,
              }}
            >
              <Symbol name={option} />
            </Box>
            {option}
          </li>
        )
      }}
      renderInput={(params) => (
        <TextField {...params} label={t("components.add_device_button.icon")} />
      )}
      onChange={(_, newValue) => onChange(newValue || "")}
      value={selectedIcon}
    />
  )
}
