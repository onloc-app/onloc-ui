import { Layer, Source } from "react-map-gl/maplibre"
import type { Location } from "@/types/types"
import { useMemo } from "react"

interface DirectionLinesProps {
  id: string | number
  locations: Location[]
  color: string
}

export default function DirectionLines({
  id,
  locations,
  color,
}: DirectionLinesProps) {
  const sourceId = `path-line-${id}`
  const pathLayerId = `path-line-layer-${id}`

  const coordinates = useMemo<[number, number][]>(() => {
    if (locations.length < 2) return []

    const coords: [number, number][] = []
    let prevLongitude: number | null = null

    for (const location of locations) {
      let longitude = location.longitude

      if (prevLongitude !== null) {
        const delta = longitude - prevLongitude
        if (delta > 180) longitude -= 360
        if (delta < -180) longitude += 360
      }

      coords.push([longitude, location.latitude])
      prevLongitude = longitude
    }

    return coords
  }, [locations])

  if (coordinates.length < 2) return null

  const geoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordinates,
    },
    properties: {},
  }

  return (
    <Source id={sourceId} type="geojson" data={geoJSON}>
      <Layer
        id={pathLayerId}
        type="line"
        paint={{
          "line-color": color,
          "line-width": 3,
          "line-dasharray": [2, 4],
          "line-opacity": 0.9,
        }}
      />
    </Source>
  )
}
