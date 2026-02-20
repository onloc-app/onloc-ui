import { Layer, Source } from "react-map-gl/maplibre"
import type { Location } from "@/types/types"
import { useMemo } from "react"

interface DirectionLinesProps {
  id: bigint
  locations: Location[]
  color: string
}

export default function DirectionLines({
  id,
  locations,
  color,
}: DirectionLinesProps) {
  const { sourceId, segments } = useMemo(() => {
    if (locations.length < 2) return { sourceId: `path-${id}`, segments: [] }

    const segments: [number, number][][] = []
    let current: [number, number][] = [
      [locations[0].longitude, locations[0].latitude],
    ]
    let prevLongitude = locations[0].longitude

    for (let i = 1; i < locations.length; i++) {
      const longitude = locations[i].longitude
      const delta = longitude - prevLongitude

      if (Math.abs(delta) > 180) {
        segments.push(current)
        current = []
      }

      current.push([longitude, locations[i].latitude])
      prevLongitude = longitude
    }
    segments.push(current)

    return { sourceId: `path-${id}`, segments }
  }, [id, locations])

  if (segments.length === 0) return null

  return (
    <>
      {segments.map((segment, index) => (
        <Source
          key={`${sourceId}-${index}`}
          id={`${sourceId}-${index}`}
          type="geojson"
          data={{
            type: "Feature",
            geometry: { type: "LineString", coordinates: segment },
            properties: {},
          }}
        >
          <Layer
            id={`${sourceId}-layer-${index}`}
            type="line"
            paint={{
              "line-color": color,
              "line-width": 3,
              "line-dasharray": [2, 4],
              "line-opacity": 0.9,
            }}
          />
        </Source>
      ))}
    </>
  )
}
