import type { Avatar, Location } from "@/types/types"
import { Flex } from "@mantine/core"
import { circle } from "@turf/turf"
import { Layer, Marker, Source } from "react-map-gl/maplibre"
import SharedDeviceShape from "./SharedDeviceShape"
import LatestLocationShape from "./LatestLocationShape"

interface AccuracyMarkerProps {
  id: bigint
  location: Location
  color: string
  shape?: "circle" | "triangle"
  avatar?: Avatar | null
  onClick?: () => void
}

export default function AccuracyMarker({
  id,
  location,
  color,
  shape = "circle",
  avatar = null,
  onClick,
}: AccuracyMarkerProps) {
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
        style={{ cursor: "pointer", zIndex: 5 }}
        onClick={onClick}
      >
        {shape === "circle" && <LatestLocationShape color={color} />}
        {shape === "triangle" && (
          <SharedDeviceShape avatar={avatar} color={color} />
        )}
      </Marker>
      {accuracy && (
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
