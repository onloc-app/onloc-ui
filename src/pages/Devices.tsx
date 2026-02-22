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
import { Box, Divider, Flex, Space, Typography } from "@mantine/core"
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
      <Flex direction="column" align="center" p="xs">
        <Box w={{ base: "100%", sm: "80%", md: "60%" }} h="100%" p="xs">
          <Flex justify="space-between">
            <Flex align="center" gap="xs">
              <Typography fz={{ base: 24, md: 32 }} fw={500}>
                {t("pages.devices.title")}
              </Typography>
              <AddDeviceButton disabled={maxDevicesReached} />
              {user?.tier && user.tier.max_devices !== null ? (
                <Typography color={maxDevicesBusted ? "error" : undefined}>
                  {devices.length} / {user.tier.max_devices}
                </Typography>
              ) : null}
            </Flex>
            <SortSelect
              defaultType={sortType}
              defaultReversed={sortReversed}
              options={[Sort.NAME, Sort.LATEST_LOCATION]}
              callback={(type: Sort, reversed) => {
                setSortType(type)
                setSortReversed(reversed)
              }}
            />
          </Flex>
          <Space h="sm" />
          <DeviceAccordionList devices={sortedDevices} />
          {sharedDevices && sharedDevices.length > 0 ? (
            <>
              <Divider my="lg" />
              <Flex justify="space-between">
                <Flex align="center" gap="xs">
                  <Typography fz={{ base: 20, md: 24 }} fw={500}>
                    {t("pages.devices.shared")}
                  </Typography>
                </Flex>
              </Flex>
              <Space h="sm" />
              <DeviceAccordionList devices={sortedSharedDevices} />
            </>
          ) : null}
        </Box>
      </Flex>
    </MainAppShell>
  )
}
