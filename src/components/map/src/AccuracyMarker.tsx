import type { Avatar, Location } from "@/types/types"
import { circle, destination } from "@turf/turf"
import { memo } from "react"
import { Layer, Marker, Source } from "react-map-gl/maplibre"
import LatestLocationShape from "./LatestLocationShape"
import SharedDeviceShape from "./SharedDeviceShape"
import useAnimatedCoordinates from "@/hooks/useAnimatedCoordinates"

interface AccuracyMarkerProps {
  id: bigint
  location: Location
  color: string
  shape?: "circle" | "triangle"
  avatar?: Avatar | null
  showCone?: boolean
  animate?: boolean
  onClick?: () => void
}

function AccuracyMarker({
  id,
  location,
  color,
  shape = "circle",
  avatar = null,
  showCone = false,
  animate = false,
  onClick,
}: AccuracyMarkerProps) {
  const sourceId = `accuracy-circle-${id}`
  const fillLayerId = `accuracy-circle-fill-${id}`
  const outlineLayerId = `accuracy-circle-outline-${id}`

  const coneSourceId = `bearing-cone-${id}`
  const coneLayerId = `bearing-cone-fill-${id}`
  const coneOutlineId = `bearing-cone-outline-${id}`

  const { longitude, latitude, accuracy, bearing, bearing_accuracy_degrees } =
    location

  const animatedPos = useAnimatedCoordinates(longitude, latitude, animate)

  // Cone
  let coneGeoJson = null
  if (
    bearing &&
    bearing_accuracy_degrees &&
    !isNaN(bearing) &&
    !isNaN(bearing_accuracy_degrees)
  ) {
    const coneRadius = 100
    const points = []

    const startAngle = bearing - bearing_accuracy_degrees / 2
    const endAngle = bearing + bearing_accuracy_degrees / 2
    const step = Math.max(bearing_accuracy_degrees / 10, 1)

    points.push([animatedPos.longitude, animatedPos.latitude])

    for (let angle = startAngle; angle <= endAngle; angle += step) {
      const dest = destination(
        [animatedPos.longitude, animatedPos.latitude],
        coneRadius,
        angle,
        {
          units: "meters",
        },
      )
      points.push(dest.geometry.coordinates)
    }

    points.push([animatedPos.longitude, animatedPos.latitude]) // Close polygon

    coneGeoJson = {
      type: "Polygon" as const,
      coordinates: [points],
    }
  }

  return (
    <>
      <Marker
        longitude={animatedPos.longitude}
        latitude={animatedPos.latitude}
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
            data={circle(
              [animatedPos.longitude, animatedPos.latitude],
              accuracy,
              {
                steps: 64,
                units: "meters",
              },
            )}
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

      {coneGeoJson && showCone && (
        <>
          <Source id={coneSourceId} type="geojson" data={coneGeoJson} />
          <Layer
            id={coneLayerId}
            type="fill"
            source={coneSourceId}
            paint={{
              "fill-color": color,
              "fill-opacity": 0.3,
            }}
          />
          <Layer
            id={coneOutlineId}
            type="line"
            source={coneSourceId}
            paint={{
              "line-color": color,
              "line-width": 2.5,
              "line-opacity": 0.4,
            }}
          />
        </>
      )}
    </>
  )
}

export default memo(AccuracyMarker, (prev, next) => {
  return (
    prev.location.id === next.location.id &&
    prev.color === next.color &&
    prev.avatar === next.avatar &&
    prev.showCone === next.showCone
  )
})
