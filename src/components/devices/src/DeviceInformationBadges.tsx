import { BatteryBadge } from "@/components"
import { getDistance, getGeolocation } from "@/helpers/locations"
import type { Device } from "@/types/types"
import { Badge, Flex, Text, useComputedColorScheme } from "@mantine/core"
import { mdiRuler } from "@mdi/js"
import { Icon } from "@mdi/react"
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

  const colorScheme = useComputedColorScheme("light")

  return (
    <Flex gap={8} wrap="wrap">
      {device.latest_location && device.latest_location.battery && (
        <BatteryBadge
          level={device.latest_location.battery}
          charging={device.latest_location?.charging}
        />
      )}
      {userGeolocation && device.latest_location && (
        <Badge
          size="lg"
          variant="light"
          color={colorScheme === "dark" ? "dark.5" : "gray.3"}
          leftSection={<Icon path={mdiRuler} size={0.8} />}
        >
          <Text fw={500}>
            {getDistance(
              {
                id: -1n,
                device_id: -1n,
                latitude: userGeolocation.coords.latitude,
                longitude: userGeolocation.coords.longitude,
              },
              device.latest_location,
            )}
          </Text>
        </Badge>
      )}
    </Flex>
  )
}
