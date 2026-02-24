import {
  FirstLocationButton,
  LastLocationButton,
  MapControlBar,
  NextLocationButton,
  PreviousLocationButton,
  TimeRangePicker,
} from "@/components"
import type { Device, Location } from "@/types/types"
import { Flex } from "@mantine/core"

interface BottomActionsProps {
  locations: Location[]
  selectedDevice: Device | null
  selectedLocation: Location | null
  onLocationChange: (location: Location) => void
  allowedHours: [number, number] | null
  onHoursChange: (hours: [number, number]) => void
  isDateRange: boolean
}

export default function BottomActions({
  locations,
  selectedDevice,
  selectedLocation,
  onLocationChange,
  allowedHours,
  onHoursChange,
  isDateRange,
}: BottomActionsProps) {
  return (
    <Flex direction="column" align="center" gap="xs" w="100%">
      {selectedDevice && allowedHours && !isDateRange && (
        <MapControlBar>
          <TimeRangePicker
            allowedHours={allowedHours}
            onChange={onHoursChange}
          />
        </MapControlBar>
      )}
      {selectedLocation && (
        <Flex direction="row" gap="xs">
          <MapControlBar flexDirection="row">
            {selectedLocation && locations.length > 0 && (
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
            )}

            {selectedLocation && locations.length > 0 && (
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
            )}
          </MapControlBar>
        </Flex>
      )}
    </Flex>
  )
}
