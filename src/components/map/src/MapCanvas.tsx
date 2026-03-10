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
      ff="text"
      sx={{ pointerEvents: "none", zIndex: 100 }}
    >
      <Flex
        pos="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        justify="space-between"
        align="center"
        p="xs"
        sx={{ pointerEvents: "none" }}
      >
        <Box>{startBox?.()}</Box>
        <Box>{endBox?.()}</Box>
      </Flex>

      <Flex
        direction="column"
        justify="space-between"
        align="center"
        h="100%"
        pos="relative"
        sx={{ zIndex: 1 }}
      >
        {topBox?.()}
        {bottomBox?.()}
      </Flex>
    </Box>
  )
}
