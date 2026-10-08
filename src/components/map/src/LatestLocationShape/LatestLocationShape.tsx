import { rem } from "@mantine/core"
import classes from "./LatestLocationShape.module.css"

interface LatestLocationShapeProps {
  color: string
}

export default function LatestLocationShape({
  color,
}: LatestLocationShapeProps) {
  return (
    <div
      className={classes["shape"]}
      style={{
        backgroundColor: color,
        boxShadow: `0 0 ${rem(10)} ${color}`,
      }}
    />
  )
}
