import { getDevices } from "@/api"
import { DeviceList, MainAppBar, SortSelect } from "@/components"
import { useAuth } from "@/hooks/useAuth"
import { sortDevices } from "@/helpers/utils"
import { NavOptions, Sort } from "@/types/enums"
import { Box, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { CreateDeviceButton } from "./components"

export default function Devices() {
  const auth = useAuth()

  const [sortType, setSortType] = useState<Sort>(Sort.NAME)
  const [sortReversed, setSortReversed] = useState<boolean>(false)

  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      if (!auth) return []
      return sortDevices(await getDevices(), sortType, sortReversed)
    },
  })

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
                Devices
              </Typography>
              <CreateDeviceButton />
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
              <DeviceList
                devices={sortDevices(devices, sortType, sortReversed)}
              />
            ) : null}
          </Box>
        </Box>
      </Box>
    </>
  )
}
