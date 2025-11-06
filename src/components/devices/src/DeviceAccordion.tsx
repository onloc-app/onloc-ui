import BatteryChip from "@/components/src/BatteryChip"
import { DeleteDeviceButton, Symbol } from "@/components"
import { useAuth } from "@/contexts/AuthProvider"
import { getDistance } from "@/helpers/locations"
import { stringToHexColor, formatISODate } from "@/helpers/utils"
import type { Device } from "@/types/types"
import {
  mdiChevronDown,
  mdiRuler,
  mdiPhoneRingOutline,
  mdiCompassOutline,
} from "@mdi/js"
import Icon from "@mdi/react"
import {
  Box,
  Accordion,
  AccordionSummary,
  Typography,
  Chip,
  AccordionDetails,
  Button,
  IconButton,
} from "@mui/material"
import type { SyntheticEvent } from "react"
import { useNavigate } from "react-router-dom"

interface DeviceAccordionProps {
  device: Device
  expanded: string | boolean
  handleExpand: (
    panel: string,
  ) => (event: SyntheticEvent, isExpanded: boolean) => void
  userGeolocation: GeolocationCoordinates | null
}

export default function DeviceAccordion({
  device,
  expanded,
  handleExpand,
  userGeolocation,
}: DeviceAccordionProps) {
  const auth = useAuth()
  const navigate = useNavigate()

  return (
    <Box>
      <Accordion
        expanded={expanded === device.id.toString()}
        onChange={handleExpand(device.id.toString())}
        square
        disableGutters
        sx={{ borderRadius: 4 }}
      >
        <AccordionSummary expandIcon={<Icon path={mdiChevronDown} size={1} />}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              <Symbol
                name={device.icon}
                color={stringToHexColor(device.name)}
                size={1.6}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography component="span">{device.name}</Typography>
                  {device.latest_location && device.latest_location.battery ? (
                    <BatteryChip level={device.latest_location.battery} />
                  ) : null}
                  {userGeolocation && device.latest_location ? (
                    <Chip
                      sx={{ paddingLeft: 0.5 }}
                      icon={<Icon path={mdiRuler} size={0.8} />}
                      label={
                        <Typography>
                          {getDistance(
                            {
                              id: 0,
                              device_id: 0,
                              latitude: userGeolocation.latitude,
                              longitude: userGeolocation.longitude,
                            },
                            device.latest_location,
                          )}
                        </Typography>
                      }
                      size="small"
                    />
                  ) : null}
                </Box>
                {device.latest_location && device.latest_location.created_at ? (
                  <Typography component="span" sx={{ color: "text.secondary" }}>
                    Latest location:{" "}
                    {formatISODate(
                      device.latest_location.created_at.toString(),
                    )}
                  </Typography>
                ) : null}
              </Box>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Left actions */}
            <Box>
              <Button
                color="contrast"
                sx={{ paddingInline: 2, borderRadius: 9999 }}
                endIcon={<Icon path={mdiPhoneRingOutline} size={1} />}
                onClick={() => {
                  auth?.socketRef.current?.emit("ring", { deviceId: device.id })
                }}
              >
                Ring
              </Button>
            </Box>

            {/* Right actions */}
            <Box sx={{ display: "flex", gap: 1.5 }}>
              {device.latest_location ? (
                <IconButton
                  onClick={() => {
                    navigate(`/map`, {
                      state: { device_id: device.id },
                    })
                  }}
                  title="See on map"
                >
                  <Icon path={mdiCompassOutline} size={1} />
                </IconButton>
              ) : null}

              <DeleteDeviceButton device={device} />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
