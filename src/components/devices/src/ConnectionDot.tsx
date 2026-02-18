import { keyframes } from "@emotion/react"
import { Box, Flex } from "@mantine/core"

interface ConnectionDotProps {
  size?: number
}

export default function ConnectionDot({ size = 1 }: ConnectionDotProps) {
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
    <Flex
      pos="relative"
      w={finalSize}
      h={finalSize}
      align="center"
      justify="center"
    >
      <Box
        pos="absolute"
        inset={0}
        opacity={0}
        bg="success.3"
        sx={{
          borderRadius: "50%",
          animation: `${pulse} 1.5s infinite ease-out`,
        }}
      />

      <Box
        pos="relative"
        w={finalSize / 2}
        h={finalSize / 2}
        bg="success.3"
        sx={{
          borderRadius: "50%",
          zIndex: 1,
        }}
      />
    </Flex>
  )
}
