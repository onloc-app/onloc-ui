import { Card, type CardProps } from "@mantine/core"
import type { ReactNode } from "react"
import classes from "./MapControlBar.module.css"
import clsx from "clsx"

interface MapControlBarProps extends CardProps {
  children: ReactNode
  direction?: "vertical" | "horizontal"
}

export default function MapControlBar({
  children,
  direction = "vertical",
  className,
  ...rest
}: MapControlBarProps) {
  return (
    <Card
      className={clsx(
        classes["container"],
        classes[`container--${direction}`],
        className,
      )}
      {...rest}
    >
      {children}
    </Card>
  )
}
