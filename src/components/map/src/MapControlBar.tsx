import { Card, Flex, type CardProps, type FlexProps } from "@mantine/core"
import type { ReactNode } from "react"

interface MapControlBarProps extends CardProps {
  children: ReactNode
  flexDirection?: FlexProps["direction"]
}

export default function MapControlBar({
  children,
  flexDirection = "column",
  sx,
  ...rest
}: MapControlBarProps) {
  return (
    <Card p="xs" radius="xl" sx={sx} {...rest}>
      <Flex
        h="100%"
        w="100%"
        direction={flexDirection}
        gap="xs"
        sx={{ pointerEvents: "auto" }}
      >
        {children}
      </Flex>
    </Card>
  )
}
