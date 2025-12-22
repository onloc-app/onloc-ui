import { getDevices } from "@/api"
import { DeviceAccordionList, MainAppBar, SortSelect } from "@/components"
import { sortDevices } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { NavOptions, Sort } from "@/types/enums"
import { Box, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { AddDeviceButton } from "./components"
import { useTranslation } from "react-i18next"

export default function Devices() {
  const auth = useAuth()
  const { t } = useTranslation()

  const [sortType, setSortType] = useState<Sort>(Sort.NAME)
  const [sortReversed, setSortReversed] = useState<boolean>(false)

  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      if (!auth) return []
      return sortDevices(await getDevices(), sortType, sortReversed)
    },
  })

  const maxDevicesReached =
    !!auth.user?.tier?.max_devices &&
    devices.length >= auth.user.tier.max_devices

  const maxDevicesBusted =
    !!auth.user?.tier?.max_devices &&
    devices.length > auth.user.tier.max_devices

  return (
    <>
      <MainAppBar selectedNav={NavOptions.DEVICES} />
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1.5,
                marginBottom: 2,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 24, md: 32 },
                  fontWeight: 500,
                  textAlign: { xs: "left", sm: "center", md: "left" },
                }}
              >
                {t("pages.devices.devices")}
              </Typography>
              <AddDeviceButton disabled={maxDevicesReached} />
              {auth.user?.tier && auth.user.tier.max_devices !== null ? (
                <Typography color={maxDevicesBusted ? "error" : undefined}>
                  {devices.length} / {auth.user.tier.max_devices}
                </Typography>
              ) : null}
            </Box>
            <SortSelect
              defaultType={sortType}
              defaultReversed={sortReversed}
              options={[Sort.NAME, Sort.LATEST_LOCATION]}
              callback={(type: Sort, reversed) => {
                setSortType(type)
                setSortReversed(reversed)
              }}
            />
          </Box>
          <Box>
            {devices ? (
              <DeviceAccordionList
                devices={sortDevices(devices, sortType, sortReversed)}
              />
            ) : null}
          </Box>
        </Box>
      </Box>
    </>
  )
}
