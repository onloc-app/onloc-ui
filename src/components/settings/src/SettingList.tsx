import { SettingCard } from "@/components"
import type { Preference, Setting, SettingTemplate } from "@/types/types"
import { Flex, Space, Typography } from "@mantine/core"

interface SettingListProps {
  name: string
  settings: Setting[] | Preference[]
  settingTemplates: SettingTemplate[]
  onChange: (setting: Setting) => void
}

export default function SettingList({
  name,
  settings,
  settingTemplates,
  onChange,
}: SettingListProps) {
  return (
    <Flex direction="column">
      <Typography fz={{ base: 24, md: 32 }} fw={500}>
        {name}
      </Typography>
      <Space h="sm" />
      <Flex direction="column" gap={16}>
        {settingTemplates.map((settingTemplate) => {
          const setting = settings.find(
            (setting: Setting) => setting.key === settingTemplate.key,
          )

          return (
            <SettingCard
              key={settingTemplate.key}
              setting={setting}
              settingTemplate={settingTemplate}
              onChange={(updatedSetting: Setting) => {
                onChange(updatedSetting)
              }}
            />
          )
        })}
      </Flex>
    </Flex>
  )
}
