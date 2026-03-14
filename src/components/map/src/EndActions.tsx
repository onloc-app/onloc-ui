import type { Device, Location } from "@/types/types"
import MapControlBar from "./MapControlBar"
import { ExportGPXButton, ToggleAvatarsButton, TuningButton } from "./controls"
import type { DateRangeState } from "@/hooks/useDateRange"
import { Flex } from "@mantine/core"

interface EndActionsProps {
  selectedDevice: Device | null
  locations: Location[]
  availableDates: string[]
  dateRange: DateRangeState
  showAvatars: boolean
  onShowAvatarsClick: (showAvatar: boolean) => void
}

export default function EndActions({
  selectedDevice,
  locations,
  availableDates,
  dateRange,
  showAvatars,
  onShowAvatarsClick,
}: EndActionsProps) {
  return (
    <Flex direction="column" gap="xs">
      {!selectedDevice && (
        <MapControlBar>
          <ToggleAvatarsButton
            showAvatars={showAvatars}
            onClick={onShowAvatarsClick}
          />
        </MapControlBar>
      )}
      {selectedDevice?.latest_location && (
        <MapControlBar>
          <TuningButton
            selectedDevice={selectedDevice}
            availableDates={availableDates}
            dateRange={dateRange}
          />
        </MapControlBar>
      )}
      {selectedDevice && locations.length > 0 && (
        <MapControlBar>
          <ExportGPXButton locations={locations} name={selectedDevice.name} />
        </MapControlBar>
      )}
    </Flex>
  )
}
