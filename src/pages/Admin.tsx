import { getSettings, getTiers, patchSetting, postSetting } from "@/api"
import {
  MainAppShell,
  SettingList,
  TierAccordionList,
  UsersTable,
} from "@/components"
import { NavOptions, SettingType } from "@/types/enums"
import type {
  Setting,
  SettingOption,
  SettingTemplate,
  Tier,
} from "@/types/types"
import { Box, Divider, Flex } from "@mantine/core"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

export default function Admin() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: serverSettings = [], isLoading: serverSettingsIsLoading } =
    useQuery<Setting[]>({
      queryKey: ["server_settings"],
      queryFn: () => getSettings(),
    })

  const { data: tiers = [] } = useQuery<Tier[]>({
    queryKey: ["tiers"],
    queryFn: () => getTiers(),
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

  const [defaultTierOptions, setDefaultTierOptions] = useState<SettingOption[]>(
    [],
  )

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

  useEffect(() => {
    if (tiers) {
      const tierOptions = tiers.map((tier) => ({
        name: tier.name,
        value: tier.id.toString(),
      }))
      setDefaultTierOptions(tierOptions)
    }
  }, [tiers])

  function handleSettingChange(setting: Setting) {
    if (setting.id !== -1n) {
      patchSettingMutation.mutate(setting)
    } else {
      postSettingMutation.mutate({
        id: -1n,
        key: setting.key,
        value: setting.value,
      })
    }
  }

  return (
    <MainAppShell selectedNav={NavOptions.ADMIN}>
      <Flex direction="column" align="center" p="xs">
        <Box w={{ base: "100%", sm: "80%", md: "60%" }} p="xs">
          {!serverSettingsIsLoading ? (
            <SettingList
              name={t("pages.admin.setting_list.title")}
              settings={serverSettings}
              settingTemplates={serverSettingTemplates}
              onChange={(setting: Setting) => {
                handleSettingChange(setting)
              }}
            />
          ) : null}
          <Divider my="lg" />
          <TierAccordionList />
          <Divider my="lg" />
          <UsersTable />
        </Box>
      </Flex>
    </MainAppShell>
  )
}
