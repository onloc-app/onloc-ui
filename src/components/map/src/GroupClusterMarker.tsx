import { stringToHexColor } from "@/helpers/utils"
import type { Device, User } from "@/types/types"
import { Box, Card, Flex } from "@mantine/core"
import { Marker } from "react-map-gl/maplibre"
import SharedDeviceShape from "./SharedDeviceShape"
import LatestLocationShape from "./LatestLocationShape"

interface GroupClusterMarkerProps {
  id: string | number
  devices: Device[]
  sharedDevices: Device[]
  sharedUsers: (User | undefined)[]
  showAvatars: boolean
  longitude: number
  latitude: number
  onDeviceClick?: (device: Device) => void
  onClick?: () => void
}

export default function GroupClusterMarker({
  id,
  devices,
  sharedDevices,
  sharedUsers,
  showAvatars,
  longitude,
  latitude,
  onDeviceClick,
  onClick,
}: GroupClusterMarkerProps) {
  return (
    <Marker
      key={id}
      longitude={longitude}
      latitude={latitude}
      style={{ cursor: "pointer", zIndex: 5 }}
      onClick={onClick}
    >
      <Card radius="xl" p="xs">
        <Flex align="center" gap="xs">
          {devices.map((device) => {
            const color = device.color ?? stringToHexColor(device.name)
            const isShared = sharedDevices.some((d) => d.id === device.id)
            const user = isShared
              ? sharedUsers.find((u) => u?.id === device.user_id)
              : null

            return (
              <Box
                key={device.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onDeviceClick?.(device)
                }}
              >
                {isShared ? (
                  <SharedDeviceShape
                    avatar={showAvatars ? user?.avatar : null}
                    color={color}
                  />
                ) : (
                  <LatestLocationShape color={color} />
                )}
              </Box>
            )
          })}
        </Flex>
      </Card>
    </Marker>
  )
}
