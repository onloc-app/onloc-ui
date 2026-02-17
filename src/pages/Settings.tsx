import { getPreferences, patchPreference, postPreference } from "@/api"
import { KeyList, MainAppShell, SessionList, SettingList } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import {
  MapProjection,
  NavOptions,
  PreferencesKey,
  SettingType,
} from "@/types/enums"
import type { Preference, Setting, SettingTemplate } from "@/types/types"
import { Divider, Flex, Space, Stack } from "@mantine/core"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export default function Settings() {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const mapSettingTemplates: SettingTemplate[] = [
    {
      key: PreferencesKey.DEFAULT_PROJECTION,
      desc: "pages.settings.projection",
      defaultValue: MapProjection.MERCATOR,
      type: SettingType.TOGGLE,
      options: [
        { value: MapProjection.MERCATOR, name: "pages.settings.mercator" },
        { value: MapProjection.GLOBE, name: "pages.settings.globe" },
      ],
    },
    {
      key: PreferencesKey.MAP_ANIMATIONS,
      desc: "pages.settings.map_animations",
      defaultValue: "true",
      type: SettingType.SWITCH,
    },
  ]

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

    if (setting.id !== "-1") {
      patchPreferenceMutation.mutate({
        id: setting.id,
        user_id: auth.user.id,
        key: setting.key,
        value: setting.value,
      })
    } else {
      postPreferenceMutation.mutate({
        id: "-1",
        user_id: auth.user.id,
        key: setting.key,
        value: setting.value,
      })
    }
  }

  if (!auth) return
  if (!auth.user) return

  return (
    <MainAppShell selectedNav={NavOptions.SETTINGS}>
      <Flex direction="column" align="center" p="xs">
        <Stack
          w={{ base: "100%", sm: "80%", md: "60%" }}
          h="100%"
          p="xs"
          gap="lg"
        >
          {!userPreferencesIsLoading ? (
            <SettingList
              name={t("pages.settings.map")}
              settings={userPreferences}
              settingTemplates={mapSettingTemplates}
              onChange={(setting: Setting) => {
                handlePreferenceChange(setting)
              }}
            />
          ) : null}
          <Divider />
          <SessionList />
          <Divider />
          <KeyList />
          <Space />
        </Stack>
      </Flex>
    </MainAppShell>
  )
}
