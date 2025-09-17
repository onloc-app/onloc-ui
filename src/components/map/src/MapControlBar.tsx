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
        zIndex: 500,
        padding: 1,
        gap: 1,
        borderRadius: 8,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  )
}
