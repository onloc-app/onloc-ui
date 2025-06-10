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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined"
import AdjustOutlinedIcon from "@mui/icons-material/AdjustOutlined"

interface LocationDetailsProps {
  selectedDevice: Device
  selectedLocation: Location
}

export default function LocationDetails({
  selectedDevice,
  selectedLocation,
}: LocationDetailsProps) {
  return (
    <Accordion
      sx={{
        zIndex: 550,
        width: { xs: "100%", sm: "60%", md: "40%", lg: "30%" },
        gap: 1,
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
            <AccessTimeOutlinedIcon />
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
          <PlaceOutlinedIcon />
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
            <AdjustOutlinedIcon />
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
  )
}
