import type { Device, Location } from "@/types/types"
import MapControlBar from "./MapControlBar"
import { TimeSlider } from "./controls"

interface EndActionsProps {
  locations: Location[]
  allowedHours: number[] | null
  onChange: (hours: number[]) => void
  selectedDevice: Device | null
  isDateRange: boolean
}

export default function EndActions({
  locations,
  allowedHours,
  onChange,
  selectedDevice,
  isDateRange,
}: EndActionsProps) {
  return (
    <>
      {selectedDevice && allowedHours && !isDateRange ? (
        <MapControlBar
          sx={{
            height: { xs: "60%", sm: "80%" },
            paddingY: 3,
          }}
        >
          <TimeSlider
            locations={locations}
            allowedHours={allowedHours}
            onChange={onChange}
          />
        </MapControlBar>
      ) : null}
    </>
  )
}
