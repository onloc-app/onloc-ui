import {
  ExportGPXButton,
  FirstLocationButton,
  LastLocationButton,
  MapControlBar,
  NextLocationButton,
  PreviousLocationButton,
  TuningButton,
} from "@/components"
import type { DateRangeState } from "@/hooks/useDateRange"
import type { Device, Location } from "@/types/types"
import { Box } from "@mui/material"

interface BottomActionsProps {
  locations: Location[]
  selectedDevice: Device | null
  selectedLocation: Location | null
  onLocationChange: (location: Location) => void
  dateRange: DateRangeState
  availableDates: string[]
}

export default function BottomActions({
  locations,
  selectedDevice,
  selectedLocation,
  onLocationChange,
  dateRange,
  availableDates,
}: BottomActionsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
      }}
    >
      {selectedDevice?.latest_location ? (
        <>
          <MapControlBar sx={{ flexDirection: "row" }}>
            {selectedLocation && locations.length > 0 ? (
              <>
                <FirstLocationButton
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onClick={onLocationChange}
                />
                <PreviousLocationButton
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onClick={onLocationChange}
                />
              </>
            ) : null}

            <TuningButton
              selectedDevice={selectedDevice}
              availableDates={availableDates}
              dateRange={dateRange}
            />

            {selectedLocation && locations.length > 0 ? (
              <>
                <NextLocationButton
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onClick={onLocationChange}
                />
                <LastLocationButton
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onClick={onLocationChange}
                />
              </>
            ) : null}
          </MapControlBar>
          {locations.length > 0 ? (
            <MapControlBar>
              <ExportGPXButton
                locations={locations}
                name={selectedDevice.name}
              />
            </MapControlBar>
          ) : null}
        </>
      ) : null}
    </Box>
  )
}
