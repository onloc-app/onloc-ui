import type { HTMLAttributes, ReactNode } from "react"
import classes from "./MapCanvas.module.css"
import clsx from "clsx"

interface MapCanvasProps extends HTMLAttributes<HTMLDivElement> {
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
  className,
  ...rest
}: MapCanvasProps) {
  return (
    <div {...rest} className={clsx(classes["container"], className)}>
      <div className={classes["start"]}>{startBox?.()}</div>
      <div className={classes["end"]}>{endBox?.()}</div>
      <div className={classes["top"]}>{topBox?.()}</div>
      <div className={classes["bottom"]}>{bottomBox?.()}</div>
    </div>
  )
}
