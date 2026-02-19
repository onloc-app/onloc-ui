import { getDeviceShares } from "@/api"
import {
  ConnectionDot,
  DeleteDeviceButton,
  DeviceInformationBadges,
  EditDeviceButton,
  LockDeviceButton,
  RingDeviceButton,
  Symbol,
} from "@/components"
import { formatISODate, stringToHexColor } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { type DeviceShare, type Device } from "@/types/types"
import {
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  ActionIcon,
  Box,
  Flex,
  Tooltip,
  Typography,
} from "@mantine/core"
import { mdiCompassOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

interface DeviceAccordionProps {
  device: Device
}

export default function DeviceAccordion({ device }: DeviceAccordionProps) {
  const auth = useAuth()
  const { user } = auth
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data: deviceShares = [] } = useQuery<DeviceShare[]>({
    queryKey: ["device_shares"],
    queryFn: getDeviceShares,
  })

  const deviceShare = deviceShares.find(
    (deviceShare) => deviceShare.device?.id === device.id,
  )

  function LeftActions() {
    const isOwner = user?.id === device.user_id
    const canRing = device.can_ring && (isOwner || deviceShare?.can_ring)
    const canLock = device.can_lock && (isOwner || deviceShare?.can_lock)
    return (
      <Flex align="center" justify="start" gap="xs" wrap="wrap">
        {canRing ? <RingDeviceButton device={device} /> : null}
        {canLock ? <LockDeviceButton device={device} /> : null}
      </Flex>
    )
  }

  function RightActions() {
    return (
      <Flex align="center" justify="end" gap="xs" wrap="wrap">
        {device.latest_location ? (
          <Tooltip
            label={t("components.device_accordion.see_on_map")}
            openDelay={500}
            position="bottom"
          >
            <ActionIcon
              onClick={() => {
                navigate(`/map`, {
                  state: { device_id: device.id },
                })
              }}
            >
              <Icon path={mdiCompassOutline} size={1} />
            </ActionIcon>
          </Tooltip>
        ) : null}
        {user?.id === device.user_id ? (
          <>
            <EditDeviceButton device={device} />
            <DeleteDeviceButton device={device} />
          </>
        ) : null}
      </Flex>
    )
  }

  return (
    <AccordionItem value={device.id}>
      <AccordionControl>
        <Flex align="center" justify="space-between" pr="sm">
          <Flex direction="column" gap="xs">
            <Flex align="center" gap="md">
              <Symbol
                name={device.icon}
                color={stringToHexColor(device.name)}
                size={1.6}
              />
              <Flex direction="column">
                <Flex direction="row" gap="xs" align="center">
                  <Typography>{device.name}</Typography>
                  <Box visibleFrom="sm">
                    <DeviceInformationBadges device={device} />
                  </Box>
                </Flex>
                {device.latest_location?.created_at ? (
                  <Typography c="dimmed">
                    {`${t("components.device_accordion.latest_location")}: ${formatISODate(device.latest_location.created_at)}`}
                  </Typography>
                ) : null}
              </Flex>
            </Flex>
            <Box hiddenFrom="sm">
              <DeviceInformationBadges device={device} />
            </Box>
          </Flex>
          <Box>{device.is_connected ? <ConnectionDot /> : null}</Box>
        </Flex>
      </AccordionControl>
      <AccordionPanel>
        <Flex direction="column" align="center">
          <Flex align="center" justify="space-between" w="100%">
            <LeftActions />
            <Typography visibleFrom="sm" c="dimmed">
              ID: {device.id}
            </Typography>
            <RightActions />
          </Flex>
          <Typography hiddenFrom="sm" c="dimmed">
            ID: {device.id}
          </Typography>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  )
}
