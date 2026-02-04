import { getDeviceShares } from "@/api"
import {
  ConnectionDot,
  DeleteDeviceButton,
  DeviceInformationChips,
  EditDeviceButton,
  LockDeviceButton,
  RingDeviceButton,
  Symbol,
} from "@/components"
import { formatISODate, stringToHexColor } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { type DeviceShare, type Device } from "@/types/types"
import { mdiChevronDown, mdiCompassOutline } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import type { SyntheticEvent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

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
  const { user } = auth
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data: deviceShares = [] } = useQuery<DeviceShare[]>({
    queryKey: ["device_shares"],
    queryFn: getDeviceShares,
  })

  function DeviceID() {
    return (
      <Box sx={{ display: "flex" }}>
        <Typography color="gray">ID: {device.id}</Typography>
      </Box>
    )
  }

  const deviceShare = deviceShares.find((dc) => dc.device?.id === device.id)

  function LeftActions() {
    const isOwner = user?.id === device.user_id
    const canRing = device.can_ring && (isOwner || deviceShare?.can_ring)
    const canLock = device.can_lock && (isOwner || deviceShare?.can_lock)
    return (
      <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
        {canRing ? <RingDeviceButton device={device} /> : null}
        {canLock ? <LockDeviceButton device={device} /> : null}
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
                    {`${t("components.device_accordion.latest_location")}: ${formatISODate(
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
            <LeftActions />

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
                <Tooltip
                  title={t("components.device_accordion.see_on_map")}
                  enterDelay={500}
                  placement="bottom"
                >
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
              {user?.id === device.user_id ? (
                <>
                  <EditDeviceButton device={device} />
                  <DeleteDeviceButton device={device} />
                </>
              ) : null}
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
