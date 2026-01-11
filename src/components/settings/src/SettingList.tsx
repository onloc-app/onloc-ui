import { Box, Typography } from "@mui/material"
import { SettingCard } from "@/components"
import type { Preference, Setting, SettingTemplate } from "@/types/types"

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
    <>
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: 24, md: 32 },
          fontWeight: 500,
          mb: 2,
          textAlign: { xs: "left", sm: "center", md: "left" },
        }}
      >
        {name}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
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
      </Box>
    </>
  )
}
