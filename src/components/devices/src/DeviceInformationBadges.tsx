import { BatteryBadge } from "@/components"
import { getDistance, getGeolocation } from "@/helpers/locations"
import type { Device } from "@/types/types"
import { Badge, Flex, Typography } from "@mantine/core"
import { mdiRuler } from "@mdi/js"
import Icon from "@mdi/react"
import { useQuery } from "@tanstack/react-query"

interface DeviceInformationBadgesProps {
  device: Device
}

export default function DeviceInformationBadges({
  device,
}: DeviceInformationBadgesProps) {
  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: () => getGeolocation(),
  })

  return (
    <Flex gap={8}>
      {device.latest_location && device.latest_location.battery ? (
        <BatteryBadge level={device.latest_location.battery} />
      ) : null}
      {userGeolocation && device.latest_location ? (
        <Badge
          size="lg"
          variant="light"
          color="dark"
          leftSection={<Icon path={mdiRuler} size={0.8} />}
        >
          <Typography>
            {getDistance(
              {
                id: "-1",
                device_id: "-1",
                latitude: userGeolocation.coords.latitude,
                longitude: userGeolocation.coords.longitude,
              },
              device.latest_location,
            )}
          </Typography>
        </Badge>
      ) : null}
    </Flex>
  )
}
