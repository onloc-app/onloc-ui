import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material"
import Battery from "./Battery"
import { Device, Location } from "../types/types"
import { formatISODate } from "../utils/utils"
import Icon from "@mdi/react"
import {
  mdiAdjust,
  mdiChevronDown,
  mdiClockOutline,
  mdiMapMarkerOutline,
} from "@mdi/js"

interface LocationDetailsProps {
  selectedDevice: Device
  selectedLocation: Location
}

export default function LocationDetails({
  selectedDevice,
  selectedLocation,
}: LocationDetailsProps) {
  return (
    <Box
      sx={{
        zIndex: 550,
        width: { xs: "100%", sm: "60%", md: "40%", lg: "30%" },
      }}
    >
      <Accordion disableGutters square sx={{ borderRadius: 4 }}>
        <AccordionSummary expandIcon={<Icon path={mdiChevronDown} size={1} />}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="subtitle1">Details</Typography>
            {selectedDevice.latest_location?.id === selectedLocation.id ? (
              <Typography color="gray">(latest location)</Typography>
            ) : (
              ""
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {selectedLocation.created_at ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                marginBottom: 0.5,
              }}
            >
              <Icon path={mdiClockOutline} size={1} />
              <Typography>
                {formatISODate(selectedLocation.created_at.toString())}
              </Typography>
            </Box>
          ) : (
            ""
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              marginBottom: 0.5,
            }}
          >
            <Icon path={mdiMapMarkerOutline} size={1} />
            <Typography>
              {selectedLocation.latitude}, {selectedLocation.longitude}
            </Typography>
          </Box>

          {selectedLocation.accuracy ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                marginBottom: 0.5,
              }}
            >
              <Icon path={mdiAdjust} size={1} />
              <Typography>{selectedLocation.accuracy}</Typography>
            </Box>
          ) : (
            ""
          )}

          {selectedLocation.battery ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                marginBottom: 0.5,
              }}
            >
              <Battery level={selectedLocation.battery} />
              <Typography>{selectedLocation.battery}%</Typography>
            </Box>
          ) : (
            ""
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
