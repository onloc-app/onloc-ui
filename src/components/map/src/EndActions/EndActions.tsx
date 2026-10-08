import type { DateRangeState } from "@/hooks/useDateRange"
import type { Device, Location } from "@/types/types"
import {
  ExportGPXButton,
  MapControlBar,
  ToggleAutoFocusButton,
  ToggleAvatarsButton,
  TuningButton,
} from "@/components"
import classes from "./EndActions.module.css"

interface EndActionsProps {
  selectedDevice: Device | null
  locations: Location[]
  availableDates: string[]
  dateRange: DateRangeState
  autoFocus: boolean
  onAutoFocusToggle: (autoFocus: boolean) => void
  showAvatars: boolean
  onShowAvatarsToggle: (showAvatar: boolean) => void
}

export default function EndActions({
  selectedDevice,
  locations,
  availableDates,
  dateRange,
  autoFocus,
  onAutoFocusToggle,
  showAvatars,
  onShowAvatarsToggle,
}: EndActionsProps) {
  return (
    <div className={classes["container"]}>
      {!selectedDevice && (
        <MapControlBar>
          <ToggleAvatarsButton
            showAvatars={showAvatars}
            onToggle={onShowAvatarsToggle}
          />
        </MapControlBar>
      )}
      {selectedDevice?.latest_location && (
        <>
          <MapControlBar>
            <TuningButton
              selectedDevice={selectedDevice}
              availableDates={availableDates}
              dateRange={dateRange}
            />
          </MapControlBar>
          <MapControlBar>
            <ToggleAutoFocusButton
              autoFocus={autoFocus}
              onToggle={onAutoFocusToggle}
            />
          </MapControlBar>
        </>
      )}
      {selectedDevice && locations.length > 0 && (
        <MapControlBar>
          <ExportGPXButton locations={locations} name={selectedDevice.name} />
        </MapControlBar>
      )}
    </div>
  )
}
