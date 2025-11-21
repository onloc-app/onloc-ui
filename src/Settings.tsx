import { MainAppBar } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import type { Preference, Setting, SettingTemplate } from "@/types/types"
import { Box, Divider } from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getPreferences,
  patchPreference,
  postPreference,
} from "./api/src/preferenceApi"
import { KeyList, SessionList, SettingList } from "@/components/settings"
import {
  MapProjection,
  NavOptions,
  PreferencesKey,
  SettingType,
} from "@/types/enums"

const mapSettingTemplates: SettingTemplate[] = [
  {
    key: PreferencesKey.DEFAULT_PROJECTION,
    desc: "Default projection method",
    defaultValue: MapProjection.MERCATOR,
    type: SettingType.TOGGLE,
    options: [MapProjection.MERCATOR, MapProjection.GLOBE],
  },
  {
    key: PreferencesKey.MAP_ANIMATIONS,
    desc: "Map animations",
    defaultValue: "true",
    type: SettingType.SWITCH,
  },
]

export default function Settings() {
  const auth = useAuth()
  const queryClient = useQueryClient()

  const { data: userPreferences = [], isLoading: userPreferencesIsLoading } =
    useQuery<Preference[]>({
      queryKey: ["user_preferences"],
      queryFn: () => getPreferences(),
    })

  const patchPreferenceMutation = useMutation({
    mutationFn: (updatedPreference: Preference) =>
      patchPreference(updatedPreference),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user_preferences"] }),
  })

  const postPreferenceMutation = useMutation({
    mutationFn: (newPreference: Preference) => postPreference(newPreference),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user_preferences"] }),
  })

  function handlePreferenceChange(setting: Setting) {
    if (!auth?.user) return

    if (setting.id !== -1) {
      patchPreferenceMutation.mutate({
        id: setting.id,
        user_id: auth.user.id,
        key: setting.key,
        value: setting.value,
      })
    } else {
      postPreferenceMutation.mutate({
        id: -1,
        user_id: auth.user.id,
        key: setting.key,
        value: setting.value,
      })
    }
  }

  if (!auth) return
  if (!auth.user) return

  return (
    <>
      <MainAppBar selectedNav={NavOptions.SETTINGS} />
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
          {!userPreferencesIsLoading ? (
            <SettingList
              name="Map"
              settings={userPreferences}
              settingTemplates={mapSettingTemplates}
              onChange={(setting: Setting) => {
                handlePreferenceChange(setting)
              }}
            />
          ) : null}
          <Divider sx={{ my: 4 }} />
          <SessionList />
          <Divider sx={{ my: 4 }} />
          <KeyList />
          <Divider sx={{ my: 4, opacity: 0 }} />
        </Box>
      </Box>
    </>
  )
}
