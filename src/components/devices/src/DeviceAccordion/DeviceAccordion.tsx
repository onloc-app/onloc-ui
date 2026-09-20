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
  Skeleton,
  Text,
  Tooltip,
} from "@mantine/core"
import { mdiCompassOutline } from "@mdi/js"
import { Icon } from "@mdi/react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import classes from "./DeviceAccordion.module.css"

interface DeviceAccordionProps {
  device: Device
}

interface LeftActionsProps {
  device: Device
}

interface RightActionsProps {
  user: User | null
  device: Device
}

function LeftActions({ device }: LeftActionsProps) {
  return (
    <div className={classes.panel_leftActions}>
      {device.can_ring && <RingDeviceButton device={device} />}
      {device.can_lock && <LockDeviceButton device={device} />}
      {device.can_flash && <FlashDeviceButton device={device} />}
    </div>
  )
}

function RightActions({ user, device }: RightActionsProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className={classes.panel_rightActions}>
      {device.latest_location && (
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
      )}
      {user?.id === device.user_id && (
        <>
          <EditDeviceButton device={device} />
          <DeleteDeviceButton device={device} />
        </>
      )}
    </div>
  )
}

export default function DeviceAccordion({ device }: DeviceAccordionProps) {
  const auth = useAuth()
  const { user } = auth
  const { t } = useTranslation()

  const { data: sharedUser, isLoading: isSharedUserLoading } = useQuery<User>({
    queryKey: [device.user_id.toString()],
    queryFn: () => getUser(device.user_id),
    enabled: user?.id !== device.user_id,
  })

  return (
    <AccordionItem className={classes.row} value={device.id.toString()}>
      <AccordionControl>
        <div className={classes.control}>
          <div className={classes.control_header}>
            <Symbol
              name={device.icon}
              color={device.color ?? stringToHexColor(device.name)}
              size={1.6}
            />
            <div className={classes.control_header_content}>
              <div className={classes.control_header_title}>
                <Text>{device.name}</Text>
                <div className={classes.control_header_info}>
                  <DeviceInformationBadges device={device} />
                </div>
              </div>
              {device.latest_location?.created_at && (
                <Text className={classes.control_createdAt}>
                  {`${t("components.device_accordion.latest_location")}: ${formatISODate(device.latest_location.created_at)}`}
                </Text>
              )}
            </div>
          </div>
          <div className={classes.control_outsideInfo}>
            <DeviceInformationBadges device={device} />
          </div>
          <div className={classes.control_status}>
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
            {device.is_connected && <ConnectionDot />}
          </div>
        </div>
      </AccordionControl>
      <AccordionPanel>
        <div className={classes.panel}>
          <LeftActions device={device} />
          <Text className={classes.panel_id}>ID: {device.id}</Text>
          <RightActions user={user} device={device} />
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}
