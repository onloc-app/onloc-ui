import { Paper, type PaperProps } from "@mui/material"
import type { ReactNode } from "react"

interface MapControlBarProps extends PaperProps {
  children: ReactNode
}

export default function MapControlBar({
  children,
  sx,
  ...rest
}: MapControlBarProps) {
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 1,
        gap: 1,
        borderRadius: 8,
        pointerEvents: "auto",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  )
}
