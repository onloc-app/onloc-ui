import { Box, Divider } from "@mui/material"
import { MainAppBar, SettingList } from "@/components"
import { NavOptions, SettingType } from "@/types/enums"
import type { Setting, SettingTemplate } from "@/types/types"
import { getSettings, patchSetting, postSetting } from "@/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { TierAccordionList, UsersTable } from "./components/admin"

const serverSettingTemplates: SettingTemplate[] = [
  {
    key: "registration",
    desc: "Enable new user registration",
    defaultValue: "false",
    type: SettingType.SWITCH,
  },
]

export default function Admin() {
  const queryClient = useQueryClient()

  const { data: serverSettings = [], isLoading: serverSettingsIsLoading } =
    useQuery<Setting[]>({
      queryKey: ["server_settings"],
      queryFn: () => getSettings(),
    })

  const postSettingMutation = useMutation({
    mutationFn: (newSetting: Setting) => postSetting(newSetting),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["server_settings"] }),
  })

  const patchSettingMutation = useMutation({
    mutationFn: (updatedSetting: Setting) => patchSetting(updatedSetting),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["server_settings"] }),
  })

  function handleSettingChange(setting: Setting) {
    if (setting.id !== -1) {
      patchSettingMutation.mutate(setting)
    } else {
      postSettingMutation.mutate({
        id: -1,
        key: setting.key,
        value: setting.value,
      })
    }
  }

  return (
    <>
      <MainAppBar selectedNav={NavOptions.ADMIN} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 1,
          height: "calc(100vh - 64px)",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "80%", md: "60%" },
            height: "100%",
            padding: 1,
          }}
        >
          {!serverSettingsIsLoading ? (
            <SettingList
              name="Server Settings"
              settings={serverSettings}
              settingTemplates={serverSettingTemplates}
              onChange={(setting: Setting) => {
                handleSettingChange(setting)
              }}
            />
          ) : null}
          <Divider sx={{ my: 4 }} />
          <TierAccordionList />
          <Divider sx={{ my: 4 }} />
          <UsersTable />
        </Box>
      </Box>
    </>
  )
}
