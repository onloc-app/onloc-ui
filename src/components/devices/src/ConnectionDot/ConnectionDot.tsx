import { rem } from "@mantine/core"
import classes from "./ConnectionDot.module.css"

interface ConnectionDotProps {
  size?: number
}

export default function ConnectionDot({ size = 1 }: ConnectionDotProps) {
  const finalSize = rem(size * 16)

  return (
    <div
      className={classes["container"]}
      style={{ width: finalSize, height: finalSize }}
    >
      <div className={classes["pulse"]} />
      <div className={classes["dot"]} />
    </div>
  )
}
