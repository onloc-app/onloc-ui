import { stringToHexColor } from "@/helpers/utils"
import { SettingType } from "@/types/enums"
import type { Setting, SettingTemplate } from "@/types/types"
import {
  Autocomplete,
  Box,
  Card,
  Combobox,
  Flex,
  Group,
  SegmentedControl,
  Select,
  Switch,
} from "@mantine/core"
import { mdiCheck } from "@mdi/js"
import Icon from "@mdi/react"
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
        <Card>
          <Flex
            align="center"
            justify={{ base: "center", xs: "space-between" }}
            gap="xs"
          >
            {t(desc)}
            <Switch
              checked={localValue === "true"}
              onChange={(event) => {
                const value = event.target.checked ? "true" : "false"

                setLocalValue(value)

                const newSetting: Setting = {
                  id: setting?.id || "-1",
                  key: setting?.key || key,
                  value: value,
                }
                onChange(newSetting)
              }}
            />
          </Flex>
        </Card>
      )
    }
    case SettingType.TOGGLE: {
      return (
        <Card>
          <Flex
            direction={{ base: "column", xs: "row" }}
            align="center"
            justify={{ base: "center", xs: "space-between" }}
            gap="xs"
          >
            {t(desc)}
            {options && options.length >= 2 ? (
              <SegmentedControl
                value={localValue}
                onChange={(newValue) => {
                  if (!newValue) return

                  setLocalValue(newValue)

                  const newSetting: Setting = {
                    id: setting?.id || "-1",
                    key: setting?.key || key,
                    value: newValue,
                  }
                  onChange(newSetting)
                }}
                data={options.map(({ value, name }) => ({
                  value,
                  label: t(name),
                }))}
              />
            ) : null}
          </Flex>
        </Card>
      )
    }
    case SettingType.SELECT: {
      const autocompleteOptions =
        options?.map((option) => ({
          label: option.name,
          value: option.value,
        })) ?? []

      return (
        <Card>
          <Flex
            direction={{ base: "column", xs: "row" }}
            align="center"
            justify={{ base: "center", xs: "space-between" }}
            gap="xs"
          >
            {t(desc)}
            {options ? (
              <Select
                placeholder={t("pages.admin.settings.autocomplete_label")}
                data={autocompleteOptions}
                value={localValue || null}
                onChange={(value) => {
                  const newValue = value || defaultValue

                  setLocalValue(newValue)

                  const newSetting: Setting = {
                    id: setting?.id || "-1",
                    key: setting?.key || key,
                    value: newValue,
                  }

                  onChange(newSetting)
                }}
                clearable
                renderOption={({ option, checked }) => {
                  return (
                    <Group justify="space-between" w="100%">
                      <Group>
                        <Box
                          w="xs"
                          h="xs"
                          bg={stringToHexColor(option.label)}
                          sx={{ borderRadius: "50%" }}
                        />
                        {option.label}
                      </Group>
                      <Group>
                        {checked ? <Icon path={mdiCheck} size={0.75} /> : null}
                      </Group>
                    </Group>
                  )
                }}
              />
            ) : null}
          </Flex>
        </Card>
      )
    }
  }
}
