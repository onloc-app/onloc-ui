import { Icon } from "@mdi/react"
import { mdiInformation, mdiInformationOutline } from "@mdi/js"
import { Divider, Paper, type PaperProps } from "@mantine/core"
import classes from "./CustomAttribution.module.css"
import clsx from "clsx"

interface CustomAttributionProps extends PaperProps {
  open: boolean
  direction: "left" | "right"
  onClick: () => void
}

export default function CustomAttribution({
  open,
  direction,
  onClick,
  className,
  ...rest
}: CustomAttributionProps) {
  return (
    <Paper
      {...rest}
      className={clsx(
        classes["container"],
        direction === "right" && classes["container--reversed"],
        open && classes["container--opened"],
        className,
      )}
      onClick={() => onClick()}
    >
      {open && (
        <div className={classes["content"]}>
          <a href="https://photon.komoot.io/" target="_blank" rel="noreferrer">
            Photon
          </a>
          <Divider orientation="vertical" />
          <a href="https://maplibre.org/" target="_blank" rel="noreferrer">
            MapLibre
          </a>
          <Divider orientation="vertical" />
          <a href="https://protomaps.com/" target="_blank" rel="noreferrer">
            Protomaps
          </a>
          <Divider orientation="vertical" />
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            © OpenStreetMap
          </a>
        </div>
      )}
      <Icon
        className={classes["icon"]}
        path={open ? mdiInformation : mdiInformationOutline}
        size={1}
      />
    </Paper>
  )
}
