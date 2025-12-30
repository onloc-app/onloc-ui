import { SettingType } from "@/types/enums"
import type { Setting, SettingTemplate } from "@/types/types"
import { Card, Switch, ToggleButton, ToggleButtonGroup } from "@mui/material"
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
          {t(desc)}
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
                key: setting?.key || key,
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
          {t(desc)}
          {options && options.length >= 2 ? (
            <ToggleButtonGroup
              value={setting?.value ? setting.value : defaultValue}
              exclusive
              onChange={(_, newValue) => {
                if (newValue) {
                  const newSetting = {
                    id: setting?.id || -1,
                    key: setting?.key || key,
                    value: newValue,
                  }
                  onChange(newSetting)
                }
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
}
