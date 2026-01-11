import { SettingType } from "@/types/enums"
import type { Setting, SettingTemplate } from "@/types/types"
import {
  Autocomplete,
  Card,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

interface SettingCardProps {
  setting: Setting | undefined
  settingTemplate: SettingTemplate
  onChange: (setting: Setting) => void
}

export default function SettingCard({
  setting,
  settingTemplate: { key, desc, defaultValue, type, options },
  onChange,
}: SettingCardProps) {
  const { t } = useTranslation()

  const [localValue, setLocalValue] = useState(setting?.value ?? defaultValue)

  useEffect(() => {
    if (setting?.value !== undefined) {
      setLocalValue(setting.value)
    }
  }, [setting?.value])

  switch (type) {
    case SettingType.SWITCH: {
      return (
        <Card
          sx={{
            padding: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {t(desc)}
          <Switch
            checked={localValue === "true"}
            onChange={(event) => {
              const value = event.target.checked ? "true" : "false"

              setLocalValue(value)

              const newSetting = {
                id: setting?.id || -1,
                key: setting?.key || key,
                value: value,
              }
              onChange(newSetting)
            }}
          />
        </Card>
      )
    }
    case SettingType.TOGGLE: {
      return (
        <Card
          sx={{
            padding: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {t(desc)}
          {options && options.length >= 2 ? (
            <ToggleButtonGroup
              value={localValue}
              exclusive
              onChange={(_, newValue) => {
                if (!newValue) return

                setLocalValue(newValue)

                const newSetting = {
                  id: setting?.id || -1,
                  key: setting?.key || key,
                  value: newValue,
                }
                onChange(newSetting)
              }}
            >
              {options.map(({ value, name }) => {
                return <ToggleButton value={value}>{t(name)}</ToggleButton>
              })}
            </ToggleButtonGroup>
          ) : null}
        </Card>
      )
    }
    case SettingType.SELECT: {
      const autocompleteOptions =
        options?.map((option) => ({
          label: option.name,
          id: option.value,
        })) ?? []

      const selectedOption =
        autocompleteOptions.find((option) => option.id === localValue) ?? null

      console.log(setting?.value)

      return (
        <Card
          sx={{
            padding: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {t(desc)}
          {options ? (
            <Autocomplete
              options={autocompleteOptions}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => {
                params.size = "small"
                return (
                  <TextField
                    {...params}
                    label={t("pages.admin.settings.autocomplete_label")}
                  />
                )
              }}
              value={selectedOption}
              onChange={(_, newValue) => {
                const value = newValue?.id.toString() ?? defaultValue

                setLocalValue(value)

                const newSetting = {
                  id: setting?.id || -1,
                  key: setting?.key || key,
                  value: value,
                }
                onChange(newSetting)
              }}
              sx={{ width: 200 }}
            />
          ) : null}
        </Card>
      )
    }
  }
}
