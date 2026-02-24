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
      radius="xl"
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
        direction={direction === "left" ? "row" : "row-reverse"}
        align="center"
      >
        {open ? (
          <Flex direction="row" justify="center" gap="xs">
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
        {open ? <Space w={8} /> : null}
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
