import { getDevices, getSharedDevices } from "@/api"
import { DevicesSelect } from "@/components"
import type { Device, Location } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import LocationDetails from "./LocationDetails"
import MapControlBar from "./MapControlBar"
import { Flex } from "@mantine/core"

interface TopActionsProps {
  selectedDevice: Device | null
  selectedLocation: Location | null
  callback: (device: Device | null) => void
}

export default function TopActions({
  selectedDevice,
  selectedLocation,
  callback,
}: TopActionsProps) {
  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: getDevices,
  })
  const { data: sharedDevices = [] } = useQuery<Device[]>({
    queryKey: ["shared_devices"],
    queryFn: getSharedDevices,
  })

  return (
    <Flex direction="column" align="center" w="100%" gap="xs">
      {/* Device selector */}
      <MapControlBar
        w={{ base: "100%", sm: "60%", md: "40%", lg: "30%" }}
        p="xs"
        radius="lg"
      >
        <DevicesSelect
          devices={devices}
          sharedDevices={sharedDevices}
          selectedDevice={selectedDevice}
          callback={callback}
        />
      </MapControlBar>

      {/* Location details */}
      {selectedDevice && selectedLocation ? (
        <LocationDetails
          selectedDevice={selectedDevice}
          selectedLocation={selectedLocation}
          w={{ base: "100%", sm: "60%", md: "40%", lg: "30%" }}
          sx={{ pointerEvents: "auto" }}
        />
      ) : null}
    </Flex>
  )
}
