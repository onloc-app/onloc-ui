import { Box } from "@mantine/core"
import { circle } from "@turf/turf"
import { Layer, Marker, Source } from "react-map-gl/maplibre"

interface AccuracyMarkerProps {
  id: string | number
  longitude: number
  latitude: number
  accuracy?: number | null
  color: string
  shape?: "circle" | "triangle"
  onClick?: () => void
}

export default function AccuracyMarker({
  id,
  longitude,
  latitude,
  accuracy,
  color,
  shape = "circle",
  onClick,
}: AccuracyMarkerProps) {
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
        {shape === "circle" ? (
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: color,
              border: "2px solid white",
              boxShadow: `0px 0px 10px ${color}`,
            }}
          />
        ) : null}
        {shape === "triangle" ? (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            style={{
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
          >
            <path
              d="M 13 12 A 4 4 0 0 1 19 12 L 24 22 A 4 4 0 0 1 22 26 L 10 26 A 4 4 0 0 1 8 22 L 13 12 Z"
              fill={color}
              stroke="white"
              strokeWidth={2}
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
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
