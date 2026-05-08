import { numberToBadgeString } from "@/helpers/utils"
import { Box, Typography } from "@mantine/core"
import { memo } from "react"
import { Marker } from "react-map-gl/maplibre"

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
      key={id}
      longitude={longitude}
      latitude={latitude}
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: color,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography fz={20} fw={500} ff="text">
          {numberToBadgeString(count)}
        </Typography>
      </Box>
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
