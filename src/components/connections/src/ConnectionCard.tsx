import { deleteDeviceConnection, getDeviceConnections } from "@/api"
import {
  AcceptConnectionButton,
  AddSharedDeviceButton,
  RejectConnectionButton,
  Symbol,
} from "@/components"
import { stringToHexColor } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { ConnectionStatus } from "@/types/enums"
import { type Connection, type DeviceConnection } from "@/types/types"
import { mdiAccountCircleOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { Box, Card, Chip, Divider, Typography } from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

interface ConnectionCardProps {
  connection: Connection
}

export default function ConnectionCard({ connection }: ConnectionCardProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { data: deviceConnections } = useQuery<DeviceConnection[]>({
    queryKey: ["device_connections"],
    queryFn: getDeviceConnections,
  })

  const deleteDeviceConnectionMutation = useMutation({
    mutationFn: (id: string) => deleteDeviceConnection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device_connections"] })
    },
  })

  if (connection.status === ConnectionStatus.REJECTED) return

  function DecisionButtons() {
    return (
      <Box sx={{ display: "flex", gap: 1 }}>
        <AcceptConnectionButton connection={connection} />
        <RejectConnectionButton connection={connection} />
      </Box>
    )
  }

  function PendingBox() {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography>
          {t("components.connection_card.status.pending")}&hellip;
        </Typography>
        <RejectConnectionButton connection={connection} mode="cancel" />
      </Box>
    )
  }

  return (
    <Card sx={{ borderRadius: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height: 1,
          padding: 1,
          paddingLeft: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Icon path={mdiAccountCircleOutline} size={1} />
            <Typography>{connection?.username}</Typography>
          </Box>
          {connection.status === ConnectionStatus.PENDING ? (
            connection.addressee_id === user!.id ? (
              <DecisionButtons />
            ) : (
              <PendingBox />
            )
          ) : null}
          {connection.status === ConnectionStatus.ACCEPTED ? (
            <RejectConnectionButton connection={connection} mode="remove" />
          ) : null}
        </Box>
        {connection.status === ConnectionStatus.ACCEPTED &&
        deviceConnections ? (
          <>
            <Divider />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                paddingBottom: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  height: 40,
                }}
              >
                <Typography variant="h6">
                  {t("components.connection_card.shared_devices.title")}
                </Typography>
                <AddSharedDeviceButton connection={connection} />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {deviceConnections.map((deviceConnection) => {
                  const device = deviceConnection.device
                  if (device && device.user_id === user?.id) {
                    return (
                      <Chip
                        key={device.id}
                        variant="outlined"
                        label={
                          <Typography sx={{ ml: -1 }}>{device.name}</Typography>
                        }
                        sx={{
                          paddingLeft: 1,
                          borderWidth: 2,
                          borderColor: stringToHexColor(device.name),
                        }}
                        icon={
                          <Symbol
                            name={device.icon}
                            color={stringToHexColor(device.name)}
                          />
                        }
                        onDelete={() =>
                          deleteDeviceConnectionMutation.mutate(
                            deviceConnection.id,
                          )
                        }
                      />
                    )
                  }
                })}
              </Box>
            </Box>
          </>
        ) : null}
      </Box>
    </Card>
  )
}
