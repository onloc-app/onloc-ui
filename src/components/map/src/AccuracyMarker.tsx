import { Box } from "@mui/material"
import { circle } from "@turf/turf"
import { Layer, Marker, Source } from "react-map-gl/maplibre"

interface AccuracyMarkerProps {
  id: number
  longitude: number
  latitude: number
  accuracy?: number | null
  color: string
  onClick?: () => void
}

export default function AccuracyMarker({
  id,
  longitude,
  latitude,
  accuracy,
  color,
  onClick,
}: AccuracyMarkerProps) {
  const sourceId = `accuracy-circle-${color}`
  const fillLayerId = `accuracy-circle-fill-${color}`
  const outlineLayerId = `accuracy-circle-outline-${color}`

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
            width: 24,
            height: 24,
            borderRadius: "50%",
            backgroundColor: color,
            border: "2px solid white",
            boxShadow: `0px 0px 10px ${color}`,
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
