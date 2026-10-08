import { numberToBadgeString } from "@/helpers/utils"
import { Text } from "@mantine/core"
import { memo } from "react"
import { Marker } from "react-map-gl/maplibre"
import classes from "./ClusterMarker.module.css"

interface ClusterMarkerProps {
  id: string | number
  longitude: number
  latitude: number
  count: number
  color: string
  onClick?: () => void
}

function ClusterMarker({
  id,
  longitude,
  latitude,
  count,
  color,
  onClick,
}: ClusterMarkerProps) {
  return (
    <Marker
      className={classes["marker"]}
      style={{ backgroundColor: color }}
      key={id}
      longitude={longitude}
      latitude={latitude}
      onClick={onClick}
    >
      <Text className={classes["text"]}>{numberToBadgeString(count)}</Text>
    </Marker>
  )
}

export default memo(ClusterMarker, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.longitude === next.longitude &&
    prev.latitude === next.latitude &&
    prev.count === next.count &&
    prev.color === next.color
  )
})
