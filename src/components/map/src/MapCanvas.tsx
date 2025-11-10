import { Grid2 } from "@mui/material"
import type { ReactNode } from "react"

interface MapCanvasProps {
  startBox?: () => ReactNode
  endBox?: () => ReactNode
  topBox?: () => ReactNode
  bottomBox?: () => ReactNode
}

export default function MapCanvas({
  startBox,
  endBox,
  topBox,
  bottomBox,
}: MapCanvasProps) {
  return (
    <Grid2
      container
      sx={{
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: 1,
        height: 1,
        padding: 2,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <Grid2
        size={1}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          height: 1,
        }}
      >
        {startBox?.()}
      </Grid2>
      <Grid2
        size="grow"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {topBox?.()}
        {bottomBox?.()}
      </Grid2>
      <Grid2
        size={1}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          height: 1,
        }}
      >
        {endBox?.()}
      </Grid2>
    </Grid2>
  )
}
