import { Box, Typography } from "@mantine/core"
import { Marker } from "react-map-gl/maplibre"

interface ClusterMarkerProps {
  id: string | number
  longitude: number
  latitude: number
  count: number
  color: string
  onClick?: () => void
}

export default function ClusterMarker({
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
          {count > 99 ? "99+" : count}
        </Typography>
      </Box>
    </Marker>
  )
}
