import { getDevices, getSharedDevices } from "@/api"
import { DevicesAutocomplete } from "@/components/devices"
import type { Device, Location } from "@/types/types"
import { Box } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import LocationDetails from "./LocationDetails"
import MapControlBar from "./MapControlBar"

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 1,
        gap: 1,
      }}
    >
      {/* Device selector */}
      <MapControlBar
        sx={{
          width: {
            xs: 1,
            sm: 0.6,
            md: 0.4,
            lg: 0.3,
          },
          padding: 2,
          borderRadius: 4,
        }}
      >
        <DevicesAutocomplete
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
          sx={{
            width: {
              xs: 1,
              sm: 0.6,
              md: 0.4,
              lg: 0.3,
            },
            pointerEvents: "auto",
          }}
        />
      ) : null}
    </Box>
  )
}
