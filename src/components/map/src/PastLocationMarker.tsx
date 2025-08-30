import { Box } from "@mui/material"
import { circle } from "@turf/turf"
import { Layer, Marker, Source } from "react-map-gl/maplibre"

interface PastLocationMarkerProps {
  id: string | number
  longitude: number
  latitude: number
  accuracy?: number | null
  color: string
  onClick?: () => void
}

export default function PastLocationMarker({
  id,
  longitude,
  latitude,
  accuracy,
  color,
  onClick,
}: PastLocationMarkerProps) {
  const sourceId = `accuracy-circle-${id}`
  const fillLayerId = `accuracy-circle-fill-${id}`
  const outlineLayerId = `accuracy-circle-outline-${id}`

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
      {accuracy ? (
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
      ) : null}
    </>
  )
}
