import { Battery } from "@/components"
import { formatISODate } from "@/helpers/utils"
import type { Device, Location } from "@/types/types"
import {
  mdiAdjust,
  mdiChevronDown,
  mdiClockOutline,
  mdiMapMarkerOutline,
} from "@mdi/js"
import Icon from "@mdi/react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  type BoxProps,
} from "@mui/material"
import { useTranslation } from "react-i18next"

interface LocationDetailsProps extends BoxProps {
  selectedDevice: Device
  selectedLocation: Location
}

export default function LocationDetails({
  selectedDevice,
  selectedLocation,
  sx,
}: LocationDetailsProps) {
  const { t } = useTranslation()

  return (
    <Box sx={sx}>
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
            <Typography variant="subtitle1">
              {t("components.location_details.details")}
            </Typography>
            {selectedDevice.latest_location?.id === selectedLocation.id ? (
              <Typography color="gray">
                {t("components.location_details.latest_location")}
              </Typography>
            ) : null}
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
          ) : null}

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
          ) : null}

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
          ) : null}
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
