import { deleteDeviceShare, getDeviceShares } from "@/api"
import { SERVER_URL } from "@/api/config"
import {
  AcceptConnectionButton,
  AddSharedDeviceButton,
  RejectConnectionButton,
  Symbol,
} from "@/components"
import { stringToHexColor } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { ConnectionStatus } from "@/types/enums"
import { type Connection, type DeviceShare } from "@/types/types"
import { Avatar, Card, Divider, Pill, Text } from "@mantine/core"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import classes from "./ConnectionCard.module.css"

interface ConnectionCardProps {
  connection: Connection
}

export default function ConnectionCard({ connection }: ConnectionCardProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: deviceShares = [] } = useQuery<DeviceShare[]>({
    queryKey: ["device_shares"],
    queryFn: getDeviceShares,
  })

  const sortedDeviceShares = useMemo(() => {
    return deviceShares.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
      return dateA - dateB
    })
  }, [deviceShares])

  const deleteDeviceShareMutation = useMutation({
    mutationFn: (id: bigint) => deleteDeviceShare(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device_shares"] })
    },
  })

  if (connection.status === ConnectionStatus.REJECTED) return

  const otherUser =
    connection.addressee_id === user?.id
      ? connection.requester
      : connection.addressee

  function DecisionButtons() {
    return (
      <div className={classes["decision-buttons"]}>
        <AcceptConnectionButton connection={connection} />
        <RejectConnectionButton connection={connection} />
      </div>
    )
  }

  function PendingBox() {
    return (
      <div className={classes["pending-box"]}>
        <Text>{t("components.connection_card.status.pending")}&hellip;</Text>
        <RejectConnectionButton connection={connection} mode="cancel" />
      </div>
    )
  }

  return (
    <Card className={classes["card"]} withBorder>
      <div className={classes["header"]}>
        <div className={classes["header__user-info"]}>
          <Avatar
            src={
              otherUser?.avatar?.url &&
              `${SERVER_URL}/${otherUser?.avatar?.url}`
            }
            name={otherUser?.username}
          />
          <Text>{otherUser?.username}</Text>
        </div>
        {connection.status === ConnectionStatus.PENDING &&
          (connection.addressee_id === user!.id ? (
            <DecisionButtons />
          ) : (
            <PendingBox />
          ))}
        {connection.status === ConnectionStatus.ACCEPTED && (
          <RejectConnectionButton connection={connection} mode="remove" />
        )}
      </div>
      {connection.status === ConnectionStatus.ACCEPTED && (
        <>
          <Divider />
          <div className={classes["shared-devices"]}>
            <div className={classes["shared-devices__title"]}>
              <Text>
                {t("components.connection_card.shared_devices.title")}
              </Text>
              <AddSharedDeviceButton connection={connection} />
            </div>
            <div className={classes["shared-devices__list"]}>
              {sortedDeviceShares.map((deviceShare) => {
                const device = deviceShare.device
                if (
                  device &&
                  device.user_id === user?.id &&
                  deviceShare.connection_id === connection.id
                ) {
                  const color = device.color ?? stringToHexColor(device.name)
                  return (
                    <Pill
                      className={classes["device-pill"]}
                      key={device.id}
                      variant="contrast"
                      color={color}
                      size="md"
                      style={{ borderColor: color }}
                      withRemoveButton
                      onRemove={() =>
                        deleteDeviceShareMutation.mutate(deviceShare.id)
                      }
                    >
                      <div className={classes["device-pill__inner"]}>
                        <Symbol name={device.icon} color={color} size={0.75} />
                        <Text>{device.name}</Text>
                      </div>
                    </Pill>
                  )
                }
              })}
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
