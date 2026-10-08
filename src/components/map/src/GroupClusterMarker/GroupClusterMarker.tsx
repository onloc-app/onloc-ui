import { stringToHexColor } from "@/helpers/utils"
import type { Device, User } from "@/types/types"
import { Card } from "@mantine/core"
import { Marker } from "react-map-gl/maplibre"
import { LatestLocationShape, SharedDeviceShape } from "@/components"
import classes from "./GroupClusterMarker.module.css"

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
      className={classes["marker"]}
      key={id}
      longitude={longitude}
      latitude={latitude}
      onClick={onClick}
    >
      <Card className={classes["card"]}>
        {devices.map((device) => {
          const color = device.color ?? stringToHexColor(device.name)
          const isShared = sharedDevices.some((d) => d.id === device.id)
          const user = isShared
            ? sharedUsers.find((u) => u?.id === device.user_id)
            : null

          return (
            <div
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
            </div>
          )
        })}
      </Card>
    </Marker>
  )
}
