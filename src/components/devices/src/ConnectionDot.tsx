import { Box, keyframes, useTheme } from "@mui/material"

interface ConnectionDotProps {
  size?: number
}

export default function ConnectionDot({ size = 1 }: ConnectionDotProps) {
  const theme = useTheme()

  const pulse = keyframes`
    from {
      transform: scale(0.5);
      opacity: 0.7;
    }
    to {
      transform: scale(1.5);
      opacity: 0;
    }
  `

  const finalSize = size * 16

  return (
    <Box
      sx={{
        position: "relative",
        width: finalSize,
        height: finalSize,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backgroundColor: theme.palette.success.main,
          opacity: 0,
          animation: `${pulse} 1.5s infinite ease-out`,
        }}
      />

      <Box
        sx={{
          position: "relative",
          width: finalSize / 2,
          height: finalSize / 2,
          borderRadius: "50%",
          backgroundColor: theme.palette.success.main,
          zIndex: 1,
        }}
      />
    </Box>
  )
}
