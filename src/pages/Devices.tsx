import { getDevices, getSharedDevices } from "@/api"
import {
  AddDeviceButton,
  DeviceAccordionList,
  MainAppShell,
  SortSelect,
} from "@/components"
import { sortDevices } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { NavOptions, Sort } from "@/types/enums"
import { Box, Divider, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function Devices() {
  const { user } = useAuth()
  const { t } = useTranslation()

  const [sortType, setSortType] = useState<Sort>(Sort.NAME)
  const [sortReversed, setSortReversed] = useState<boolean>(false)

  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      return sortDevices(await getDevices(), sortType, sortReversed)
    },
  })

  const { data: sharedDevices = [] } = useQuery({
    queryKey: ["shared_devices"],
    queryFn: getSharedDevices,
  })

  const sortedDevices = sortDevices(devices, sortType, sortReversed)
  const sortedSharedDevices = sortDevices(sharedDevices, sortType, sortReversed)

  const maxDevicesReached =
    !!user?.tier?.max_devices && devices.length >= user.tier.max_devices

  const maxDevicesBusted =
    !!user?.tier?.max_devices && devices.length > user.tier.max_devices

  return (
    <MainAppShell selectedNav={NavOptions.DEVICES}>
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
            width: { xs: 1, sm: 0.8, md: 0.6 },
            height: 1,
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
                {t("pages.devices.title")}
              </Typography>
              <AddDeviceButton disabled={maxDevicesReached} />
              {user?.tier && user.tier.max_devices !== null ? (
                <Typography color={maxDevicesBusted ? "error" : undefined}>
                  {devices.length} / {user.tier.max_devices}
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
            <DeviceAccordionList devices={sortedDevices} />
          </Box>
          {sharedDevices && sharedDevices.length > 0 ? (
            <>
              <Divider sx={{ margin: 2 }} />
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
                    variant="h3"
                    sx={{
                      fontSize: { xs: 20, md: 24 },
                      fontWeight: 500,
                      textAlign: { xs: "left", sm: "center", md: "left" },
                    }}
                  >
                    {t("pages.devices.shared")}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <DeviceAccordionList devices={sortedSharedDevices} />
              </Box>
            </>
          ) : null}
        </Box>
      </Box>
    </MainAppShell>
  )
}
