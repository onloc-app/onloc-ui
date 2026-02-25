import {
  CurrentLocationButton,
  FitBoundsButton,
  MapControlBar,
  MapProjectionButton,
  ResetHeadingPitchButton,
  ZoomInButton,
  ZoomOutButton,
} from "@/components"
import type { Location } from "@/types/types"
import { Flex } from "@mantine/core"

interface StartActionsProps {
  locations: Location[]
  mapProjection: "globe" | "mercator"
  onMapProjectionClick: (projection: "globe" | "mercator") => void
  isOnCurrentLocation: boolean
  onCurrentLocationClick: (value: boolean) => void
}

export default function StartActions({
  locations,
  mapProjection,
  onMapProjectionClick,
  isOnCurrentLocation,
  onCurrentLocationClick,
}: StartActionsProps) {
  return (
    <Flex direction="column" gap="xs">
      <MapControlBar>
        <MapProjectionButton
          projection={mapProjection}
          onClick={(projection) => onMapProjectionClick(projection)}
        />
      </MapControlBar>
      <MapControlBar>
        <ZoomInButton />
        <ZoomOutButton />
      </MapControlBar>
      <MapControlBar>
        <FitBoundsButton locations={locations} />
      </MapControlBar>
      <MapControlBar>
        <ResetHeadingPitchButton />
      </MapControlBar>
      <MapControlBar>
        <CurrentLocationButton
          selected={isOnCurrentLocation}
          onClick={onCurrentLocationClick}
          tooltipPosition="right"
        />
      </MapControlBar>
    </Flex>
  )
}
