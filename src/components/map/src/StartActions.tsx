import { Box } from "@mui/material"
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
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
        />
      </MapControlBar>
    </Box>
  )
}
