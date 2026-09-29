import { SettingCard } from "@/components"
import type { Preference, Setting, SettingTemplate } from "@/types/types"
import { Skeleton, Title } from "@mantine/core"
import classes from "./SettingList.module.css"

interface SettingListProps {
  name: string
  settings: Setting[] | Preference[]
  settingTemplates: SettingTemplate[]
  isLoading?: boolean
  onChange: (setting: Setting) => void
}

export default function SettingList({
  name,
  settings,
  settingTemplates,
  isLoading = false,
  onChange,
}: SettingListProps) {
  return (
    <div className={classes["container"]}>
      <Title>{name}</Title>
      <div className={classes["list"]}>
        {!isLoading ? (
          settingTemplates.map((settingTemplate) => {
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
          })
        ) : (
          <Skeleton height={64} />
        )}
      </div>
    </div>
  )
}
