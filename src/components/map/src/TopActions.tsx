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
  onDeviceSelected: (device: Device | null) => void
  onLocationUnselected: () => void
}

export default function TopActions({
  selectedDevice,
  selectedLocation,
  onDeviceSelected,
  onLocationUnselected,
}: TopActionsProps) {
  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: getDevices,
  })
  const { data: sharedDevices = [] } = useQuery<Device[]>({
    queryKey: ["shared_devices"],
    queryFn: getSharedDevices,
  })

  const w = { base: "100%", xs: "60%", md: "40%", lg: "30%", xl: "25%" }

  return (
    <Flex direction="column" align="center" w="100%" gap="xs">
      {/* Device selector */}
      <MapControlBar w={w} p="xs" radius="lg">
        <DevicesSelect
          devices={devices}
          sharedDevices={sharedDevices}
          selectedDevice={selectedDevice}
          callback={onDeviceSelected}
        />
      </MapControlBar>

      {/* Location details */}
      {selectedDevice && selectedLocation && (
        <LocationDetails
          device={selectedDevice}
          location={selectedLocation}
          w={w}
          sx={{ pointerEvents: "auto" }}
          onDismiss={onLocationUnselected}
        />
      )}
    </Flex>
  )
}
