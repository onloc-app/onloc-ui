import { Box, Flex } from "@mantine/core"
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
    <Box
      pos="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      p="xs"
      // We have to force the font because MapLibre's CSS is applied
      ff="text"
      sx={{ pointerEvents: "none" }}
    >
      <Flex justify="space-between" h="100%">
        <Flex align="center">{startBox?.()}</Flex>

        <Flex
          flex={1}
          direction="column"
          justify="space-between"
          align="center"
        >
          {topBox?.()}
          {bottomBox?.()}
        </Flex>

        <Flex align="center">{endBox?.()}</Flex>
      </Flex>
    </Box>
  )
}
