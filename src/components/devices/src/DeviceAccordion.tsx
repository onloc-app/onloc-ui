import { getUser } from "@/api"
import { SERVER_URL } from "@/api/config"
import {
  ConnectionDot,
  DeleteDeviceButton,
  DeviceInformationBadges,
  EditDeviceButton,
  FlashDeviceButton,
  LockDeviceButton,
  RingDeviceButton,
  Symbol,
} from "@/components"
import { formatISODate, stringToHexColor } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { type Device, type User } from "@/types/types"
import {
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  ActionIcon,
  Avatar,
  Box,
  Flex,
  Skeleton,
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

  const { data: sharedUser, isLoading: isSharedUserLoading } = useQuery<User>({
    queryKey: [device.user_id.toString()],
    queryFn: () => getUser(device.user_id),
    enabled: user?.id !== device.user_id,
  })

  function LeftActions() {
    return (
      <Flex flex={1} align="center" justify="start" gap="xs" wrap="wrap">
        {device.can_ring && <RingDeviceButton device={device} />}
        {device.can_lock && <LockDeviceButton device={device} />}
        {device.can_flash && <FlashDeviceButton device={device} />}
      </Flex>
    )
  }

  function RightActions() {
    return (
      <Flex flex={1} align="center" justify="end" gap="xs" wrap="wrap">
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
        {user?.id === device.user_id && (
          <>
            <EditDeviceButton device={device} />
            <DeleteDeviceButton device={device} />
          </>
        )}
      </Flex>
    )
  }

  return (
    <AccordionItem value={device.id.toString()}>
      <AccordionControl>
        <Flex align="center" justify="space-between" pr="sm">
          <Flex direction="column" gap="xs">
            <Flex align="center" gap="md">
              <Symbol
                name={device.icon}
                color={device.color ?? stringToHexColor(device.name)}
                size={1.6}
              />
              <Flex direction="column">
                <Flex direction="row" gap="xs" align="center">
                  <Typography>{device.name}</Typography>
                  <Box visibleFrom="sm">
                    <DeviceInformationBadges device={device} />
                  </Box>
                </Flex>
                {device.latest_location?.created_at && (
                  <Typography c="dimmed">
                    {`${t("components.device_accordion.latest_location")}: ${formatISODate(device.latest_location.created_at)}`}
                  </Typography>
                )}
              </Flex>
            </Flex>
            <Box hiddenFrom="sm">
              <DeviceInformationBadges device={device} />
            </Box>
          </Flex>
          <Flex align="center" gap="xs">
            {user?.id !== device.user_id && (
              <Skeleton visible={isSharedUserLoading} circle>
                {sharedUser && (
                  <Tooltip label={sharedUser.username} position="left">
                    <Avatar
                      src={`${SERVER_URL}/${sharedUser.avatar?.url}`}
                      name={sharedUser?.username}
                    />
                  </Tooltip>
                )}
              </Skeleton>
            )}
            {device.is_connected && (
              <Box>
                <ConnectionDot />
              </Box>
            )}
          </Flex>
        </Flex>
      </AccordionControl>
      <AccordionPanel>
        <Flex direction="column" align="center">
          <Flex align="center" w="100%">
            <LeftActions />
            <Typography c="dimmed">ID: {device.id}</Typography>
            <RightActions />
          </Flex>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  )
}
