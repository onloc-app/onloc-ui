import { ConnectionDot } from "@/components/devices"
import Symbol from "@/components/src/Symbol"
import { formatISODate, stringToHexColor } from "@/helpers/utils"
import type { Device } from "@/types/types"
import { ActionIcon, Box, Card, Flex, Tooltip, Typography } from "@mantine/core"
import { mdiChevronRight, mdiCrosshairs, mdiCrosshairsGps } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

interface DeviceRowProps {
  device: Device
  selected: boolean
  onLocate: (device: Device) => void
}

export default function DeviceRow({
  device,
  selected,
  onLocate,
}: DeviceRowProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Card radius="lg" style={{ flexShrink: 0 }}>
      <Flex align="center" justify="space-between" gap="md">
        <Flex align="center" gap="md">
          <Symbol
            name={device.icon}
            color={stringToHexColor(device.name)}
            size={1.6}
          />
          <Box>
            <Typography fz={{ base: 16, md: 24 }}>{device.name}</Typography>
            {device.latest_location ? (
              <Typography visibleFrom="md">
                {device.latest_location.created_at
                  ? `${t("components.device_row.latest_location")}: ${formatISODate(device.latest_location.created_at.toString())}`
                  : null}
              </Typography>
            ) : null}
          </Box>
        </Flex>
        <Flex align="center" gap="xs">
          {device.is_connected ? <ConnectionDot size={2} /> : null}
          <Flex
            direction={{ base: "row", sm: "column", xl: "row" }}
            align="center"
            gap="xs"
          >
            {device.latest_location ? (
              <Tooltip
                label={t("components.device_row.locate_device")}
                openDelay={500}
                position="bottom"
              >
                <ActionIcon
                  variant="subtle"
                  size="xl"
                  radius="xl"
                  onClick={() => {
                    onLocate(device)
                  }}
                >
                  {selected ? (
                    <Icon path={mdiCrosshairsGps} size={1} />
                  ) : (
                    <Icon path={mdiCrosshairs} size={1} />
                  )}
                </ActionIcon>
              </Tooltip>
            ) : null}
            <Tooltip
              label={t("components.device_row.go_to_details")}
              openDelay={500}
              position="bottom"
            >
              <ActionIcon
                variant="subtle"
                size="xl"
                radius="xl"
                onClick={() => {
                  navigate(`/devices#${device.id}`, {
                    state: { device_id: device.id },
                  })
                }}
              >
                <Icon path={mdiChevronRight} size={1} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}
