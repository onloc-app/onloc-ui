import type { Location } from "@/types/types"
import { Box } from "@mantine/core"
import { circle } from "@turf/turf"
import React from "react"
import { Layer, Marker, Source } from "react-map-gl/maplibre"

interface PastLocationMarkerProps {
  id: bigint
  location: Location
  showAccuracy?: boolean
  color: string
  onClick?: () => void
}

function PastLocationMarker({
  id,
  location,
  showAccuracy = false,
  color,
  onClick,
}: PastLocationMarkerProps) {
  const sourceId = `accuracy-circle-${id}`
  const fillLayerId = `accuracy-circle-fill-${id}`
  const outlineLayerId = `accuracy-circle-outline-${id}`

  const longitude = location.longitude
  const latitude = location.latitude
  const accuracy = location.accuracy

  return (
    <>
      <Marker
        longitude={longitude}
        latitude={latitude}
        style={{ cursor: "pointer" }}
        onClick={onClick}
      >
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        ></Box>
      </Marker>
      {showAccuracy && accuracy && (
        <>
          <Source
            id={sourceId}
            type="geojson"
            data={circle([longitude, latitude], accuracy, {
              steps: 64,
              units: "meters",
            })}
          />
          <Layer
            id={fillLayerId}
            type="fill"
            source={sourceId}
            paint={{
              "fill-color": color,
              "fill-opacity": 0.2,
            }}
          />
          <Layer
            id={outlineLayerId}
            type="line"
            source={sourceId}
            paint={{
              "line-color": color,
              "line-width": 2,
            }}
          />
        </>
      )}
    </>
  )
}

export default React.memo(PastLocationMarker, (prev, next) => {
  return (
    prev.location.id === next.location.id &&
    prev.showAccuracy === next.showAccuracy &&
    prev.color === next.color
  )
})
