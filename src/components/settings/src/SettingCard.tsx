import { capitalizeFirstLetter } from "@/helpers/utils"
import { SettingType } from "@/types/enums"
import type { Setting } from "@/types/types"
import { Card, Switch, ToggleButton, ToggleButtonGroup } from "@mui/material"

interface SettingCardProps {
  description: string
  setting: Setting | undefined
  defaultKey: string
  defaultValue: string
  type: SettingType
  onChange: (setting: Setting) => void
  options?: string[] | null
}

export default function SettingCard({
  description,
  setting,
  defaultKey,
  defaultValue,
  type,
  onChange,
  options,
}: SettingCardProps) {
  switch (type) {
    case SettingType.SWITCH:
      return (
        <Card
          sx={{
            padding: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {description}
          <Switch
            checked={
              setting?.value
                ? setting.value === "true"
                : defaultValue === "true"
            }
            onChange={(event) => {
              const newValue = event.target.checked ? "true" : "false"
              const newSetting = {
                id: setting?.id || -1,
                key: setting?.key || defaultKey,
                value: newValue,
              }
              onChange(newSetting)
            }}
          />
        </Card>
      )
    case SettingType.TOGGLE:
      return (
        <Card
          sx={{
            padding: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {description}
          {options && options.length >= 2 ? (
            <ToggleButtonGroup
              value={setting?.value ? setting.value : defaultValue}
              exclusive
              onChange={(_, newValue) => {
                if (newValue) {
                  const newSetting = {
                    id: setting?.id || -1,
                    key: setting?.key || defaultKey,
                    value: newValue,
                  }
                  onChange(newSetting)
                }
              }}
            >
              {options.map((option) => {
                return (
                  <ToggleButton value={option}>
                    {capitalizeFirstLetter(option)}
                  </ToggleButton>
                )
              })}
            </ToggleButtonGroup>
          ) : null}
        </Card>
      )
  }
}
