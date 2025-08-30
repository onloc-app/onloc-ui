import { Layer, Source } from "react-map-gl/maplibre"
import { Location } from "../../../types/types"

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

  const lineGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: locations.map((location) => [
        location.longitude,
        location.latitude,
      ]),
    },
    properties: {},
  }

  return (
    <Source id={sourceId} type="geojson" data={lineGeoJSON}>
      <Layer
        id={pathLayerId}
        type="line"
        paint={{
          "line-color": color,
          "line-width": 3,
          "line-dasharray": [2, 4],
        }}
      />
    </Source>
  )
}
