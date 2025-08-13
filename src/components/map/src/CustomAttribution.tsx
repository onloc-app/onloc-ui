import Icon from "@mdi/react"
import { Box, Divider, Link, Paper, PaperProps } from "@mui/material"
import { useColorMode } from "../../../contexts/ThemeContext"
import { mdiInformation, mdiInformationOutline } from "@mdi/js"

interface CustomAttributionProps extends PaperProps {
  open: boolean
  onClick: () => void
}

export default function CustomAttribution({
  open,
  onClick,
  sx,
}: CustomAttributionProps) {
  const { resolvedMode } = useColorMode()

  return (
    <Paper
      sx={{
        width: "fit-content",
        padding: 1,
        borderRadius: 8,
        opacity: open ? 1 : 0.5,
        display: "flex",
        flexDirection: "row",
        gap: 1,
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        cursor: "pointer",
        ...sx,
      }}
      onClick={() => {
        onClick()
      }}
    >
      {open ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 1,
            marginX: 1,
          }}
        >
          <Link href="https://maplibre.org/" target="_blank" rel="noreferrer">
            MapLibre
          </Link>
          <Divider orientation="vertical" flexItem />
          <Link href="https://immich.app/" target="_blank" rel="noreferrer">
            Immich
          </Link>
          <Divider orientation="vertical" flexItem />
          <Link
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            © OpenStreetMap
          </Link>
        </Box>
      ) : (
        ""
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Icon
          color={resolvedMode === "dark" ? "white" : "black"}
          path={open ? mdiInformation : mdiInformationOutline}
          size={1}
        />
      </Box>
    </Paper>
  )
}
