import { Box } from "@mui/material"
import MapControlBar from "./MapControlBar"
import { DevicesAutocomplete } from "@/components/devices"
import type { Device, Location } from "@/types/types"
import LocationDetails from "./LocationDetails"
import { getDevices } from "@/api"
import { useQuery } from "@tanstack/react-query"

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
    queryFn: () => getDevices(),
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
            xs: "100%",
            sm: "60%",
            md: "40%",
            lg: "30%",
          },
          padding: 2,
          borderRadius: 4,
        }}
      >
        <DevicesAutocomplete
          devices={devices}
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
              xs: "100%",
              sm: "60%",
              md: "40%",
              lg: "30%",
            },
            pointerEvents: "auto",
          }}
        />
      ) : null}
    </Box>
  )
}
