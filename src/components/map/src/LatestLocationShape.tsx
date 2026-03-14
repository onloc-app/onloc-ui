import { Flex } from "@mantine/core"

interface LatestLocationShapeProps {
  color: string
}

export default function LatestLocationShape({
  color,
}: LatestLocationShapeProps) {
  return (
    <Flex
      align="center"
      justify="center"
      w={24}
      h={24}
      sx={{
        borderRadius: "50%",
        backgroundColor: color,
        border: "2px solid white",
        boxShadow: `0px 0px 10px ${color}`,
      }}
    />
  )
}
