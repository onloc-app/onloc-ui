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
import { Avatar, Card, Divider, Flex, Pill, Typography } from "@mantine/core"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

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

  function DecisionButtons() {
    return (
      <Flex gap="xs">
        <AcceptConnectionButton connection={connection} />
        <RejectConnectionButton connection={connection} />
      </Flex>
    )
  }

  function PendingBox() {
    return (
      <Flex align="center" gap="xs">
        <Typography>
          {t("components.connection_card.status.pending")}&hellip;
        </Typography>
        <RejectConnectionButton connection={connection} mode="cancel" />
      </Flex>
    )
  }

  return (
    <Card radius="lg">
      <Flex direction="column" gap="xs">
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="xs">
            <Avatar
              src={`${SERVER_URL}/${connection?.user?.avatar?.url}`}
              name={connection?.user?.username}
            />
            <Typography>{connection?.user?.username}</Typography>
          </Flex>
          {connection.status === ConnectionStatus.PENDING &&
            (connection.addressee_id === user!.id ? (
              <DecisionButtons />
            ) : (
              <PendingBox />
            ))}
          {connection.status === ConnectionStatus.ACCEPTED && (
            <RejectConnectionButton connection={connection} mode="remove" />
          )}
        </Flex>
        {connection.status === ConnectionStatus.ACCEPTED && (
          <>
            <Divider />
            <Flex direction="column" gap="xs">
              <Flex align="center" gap="xs">
                <Typography>
                  {t("components.connection_card.shared_devices.title")}
                </Typography>
                <AddSharedDeviceButton connection={connection} />
              </Flex>
              <Flex align="center" wrap="wrap" gap="xs">
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
                        key={device.id}
                        variant="contrast"
                        color={color}
                        size="md"
                        sx={{
                          border: `1px solid ${color}`,
                        }}
                        withRemoveButton
                        onRemove={() =>
                          deleteDeviceShareMutation.mutate(deviceShare.id)
                        }
                      >
                        <Flex align="center" gap="xs">
                          <Symbol
                            name={device.icon}
                            color={color}
                            size={0.75}
                          />
                          <Typography>{device.name}</Typography>
                        </Flex>
                      </Pill>
                    )
                  }
                })}
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </Card>
  )
}
