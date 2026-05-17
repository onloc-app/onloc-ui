import { getSettings, getTiers, patchSetting, postSetting } from "@/api"
import {
  MainAppShell,
  SettingList,
  TierAccordionList,
  UsersTable,
} from "@/components"
import { NavOptions, SettingType } from "@/types/enums"
import type { Setting, SettingTemplate, Tier } from "@/types/types"
import { Box, Divider, Flex } from "@mantine/core"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"

export default function Admin() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: serverSettings = [], isLoading: isServerSettingsLoading } =
    useQuery<Setting[]>({
      queryKey: ["server_settings"],
      queryFn: getSettings,
    })

  const { data: tiers = [] } = useQuery<Tier[]>({
    queryKey: ["tiers"],
    queryFn: getTiers,
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

  const defaultTierOptions = useMemo(() => {
    const sortedTiers = tiers.sort((a, b) => a.order_rank - b.order_rank)
    return sortedTiers.map((tier) => ({
      name: tier.name,
      value: tier.id.toString(),
    }))
  }, [tiers])

  const serverSettingTemplates: SettingTemplate[] = useMemo(() => {
    return [
      {
        key: "registration",
        desc: "pages.admin.settings.registration.description",
        defaultValue: "false",
        type: SettingType.SWITCH,
      },
      {
        key: "default_tier",
        desc: "pages.admin.settings.default_tier.description",
        defaultValue: "",
        type: SettingType.SELECT,
        options: defaultTierOptions,
      },
    ]
  }, [defaultTierOptions])

  const handleSettingChange = useCallback(
    (setting: Setting) => {
      if (setting.id !== -1n) {
        patchSettingMutation.mutate(setting)
      } else {
        postSettingMutation.mutate({
          id: -1n,
          key: setting.key,
          value: setting.value,
        })
      }
    },
    [patchSettingMutation, postSettingMutation],
  )

  return (
    <MainAppShell selectedNav={NavOptions.ADMIN}>
      <Flex direction="column" align="center" p="xs">
        <Box w={{ base: "100%", sm: "80%", md: "60%" }} p="xs">
          <SettingList
            name={t("pages.admin.setting_list.title")}
            settings={serverSettings}
            settingTemplates={serverSettingTemplates}
            isLoading={isServerSettingsLoading}
            onChange={handleSettingChange}
          />
          <Divider my="lg" />
          <TierAccordionList />
          <Divider my="lg" />
          <UsersTable />
        </Box>
      </Flex>
    </MainAppShell>
  )
}
