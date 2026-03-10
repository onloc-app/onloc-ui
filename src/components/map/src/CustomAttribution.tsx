import Icon from "@mdi/react"
import { useColorMode } from "@/contexts/ThemeContext"
import { mdiInformation, mdiInformationOutline } from "@mdi/js"
import { Divider, Flex, Paper, Space, type PaperProps } from "@mantine/core"

interface CustomAttributionProps extends PaperProps {
  open: boolean
  direction: "left" | "right"
  onClick: () => void
}

export default function CustomAttribution({
  open,
  direction,
  onClick,
  sx,
}: CustomAttributionProps) {
  const { resolvedMode } = useColorMode()

  return (
    <Paper
      p="xs"
      radius="lg"
      sx={{
        opacity: open ? 1 : 0.5,
        cursor: "pointer",
        ...(sx as React.CSSProperties),
      }}
      onClick={() => {
        onClick()
      }}
    >
      <Flex
        direction={{
          base: "column",
          xs: direction === "left" ? "row" : "row-reverse",
        }}
        align="center"
        gap="xs"
      >
        {open ? (
          <Flex
            direction={{ base: "column", xs: "row" }}
            justify="center"
            align="center"
            gap="xs"
          >
            <a
              href="https://photon.komoot.io/"
              target="_blank"
              rel="noreferrer"
            >
              Photon
            </a>
            <Divider orientation="vertical" />
            <a href="https://maplibre.org/" target="_blank" rel="noreferrer">
              MapLibre
            </a>
            <Divider orientation="vertical" />
            <a href="https://maps.black/" target="_blank" rel="noreferrer">
              Maps.black
            </a>
            <Divider orientation="vertical" />
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
            >
              © OpenStreetMap
            </a>
          </Flex>
        ) : null}
        <Flex justify="center">
          <Icon
            color={resolvedMode === "dark" ? "white" : "black"}
            path={open ? mdiInformation : mdiInformationOutline}
            size={1}
          />
        </Flex>
      </Flex>
    </Paper>
  )
}
