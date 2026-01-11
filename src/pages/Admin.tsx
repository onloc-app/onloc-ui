import { getSettings, getTiers, patchSetting, postSetting } from "@/api"
import { MainAppBar, SettingList } from "@/components"
import { TierAccordionList, UsersTable } from "@/components/admin"
import { NavOptions, SettingType } from "@/types/enums"
import type {
  Setting,
  SettingOption,
  SettingTemplate,
  Tier,
} from "@/types/types"
import { Box, Divider } from "@mui/material"
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
              name={t("pages.admin.setting_list.title")}
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
