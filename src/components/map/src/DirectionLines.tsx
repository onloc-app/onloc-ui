import { Layer, Source } from "react-map-gl/maplibre"
import { Location } from "../../../types/types"

interface DirectionLinesProps {
  locations: Location[]
  color: string
}

export default function DirectionLines({
  locations,
  color,
}: DirectionLinesProps) {
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
    <Source id="path-line" type="geojson" data={lineGeoJSON}>
      <Layer
        id="path-line-layer"
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
