import {
  ConnectionDot,
  DeleteDeviceButton,
  DeviceInformationChips,
  Symbol,
} from "@/components"
import { stringToHexColor, formatISODate } from "@/helpers/utils"
import type { Device } from "@/types/types"
import { mdiChevronDown, mdiPhoneRingOutline, mdiCompassOutline } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Box,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material"
import type { SyntheticEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useSocket } from "@/hooks/useSocket"
import { useMutation } from "@tanstack/react-query"
import { ringDevice } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { Severity } from "@/types/enums"

interface DeviceAccordionProps {
  device: Device
  expanded: string | boolean
  handleExpand: (
    panel: string,
  ) => (event: SyntheticEvent, isExpanded: boolean) => void
}

export default function DeviceAccordion({
  device,
  expanded,
  handleExpand,
}: DeviceAccordionProps) {
  const auth = useAuth()
  const navigate = useNavigate()

  const ringDeviceMutation = useMutation({
    mutationFn: () => ringDevice(device.id),
    onSuccess: () => auth.throwMessage("Ring sent", Severity.SUCCESS),
    onError: (error) => auth.throwMessage(error.message, Severity.ERROR),
  })

  function DeviceID() {
    return (
      <Box sx={{ display: "flex" }}>
        <Typography color="gray">ID: {device.id}</Typography>
      </Box>
    )
  }

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
              width: 1,
              paddingRight: 1,
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
                <Box sx={{ display: { xs: "flex", sm: "none" } }}>
                  <DeviceInformationChips device={device} />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography component="span">{device.name}</Typography>
                  <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                    <DeviceInformationChips device={device} />
                  </Box>
                </Box>
                {device.latest_location && device.latest_location.created_at ? (
                  <Typography component="span" sx={{ color: "text.secondary" }}>
                    {`Latest location: ${formatISODate(
                      device.latest_location.created_at.toString(),
                    )}`}
                  </Typography>
                ) : null}
              </Box>
            </Box>
            {device.is_connected ? <ConnectionDot /> : null}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: 1,
            }}
          >
            {/* Left actions */}
            <Box sx={{ flex: 1 }}>
              {device.can_ring ? (
                <Tooltip
                  title={`Ring ${device.name}`}
                  enterDelay={500}
                  placement="bottom"
                >
                  <Button
                    color="contrast"
                    sx={{ paddingInline: 2, borderRadius: 9999 }}
                    endIcon={<Icon path={mdiPhoneRingOutline} size={1} />}
                    onClick={() => {
                      ringDeviceMutation.mutate()
                    }}
                  >
                    Ring
                  </Button>
                </Tooltip>
              ) : null}
            </Box>

            {/* Middle actions */}
            <Box>
              <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                <DeviceID />
              </Box>
            </Box>

            {/* Right actions */}
            <Box
              sx={{ flex: 1, display: "flex", justifyContent: "end", gap: 1.5 }}
            >
              {device.latest_location ? (
                <Tooltip title="See on map" enterDelay={500} placement="bottom">
                  <IconButton
                    onClick={() => {
                      navigate(`/map`, {
                        state: { device_id: device.id },
                      })
                    }}
                  >
                    <Icon path={mdiCompassOutline} size={1} />
                  </IconButton>
                </Tooltip>
              ) : null}

              <DeleteDeviceButton device={device} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ display: { xs: "flex", sm: "none" } }}>
              <DeviceID />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
