import { ConnectionDot } from "@/components/devices"
import Symbol from "@/components/src/Symbol"
import { formatISODate, stringToHexColor } from "@/helpers/utils"
import type { Device } from "@/types/types"
import { mdiChevronRight, mdiCrosshairs, mdiCrosshairsGps } from "@mdi/js"
import Icon from "@mdi/react"
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

interface DeviceRowProps {
  device: Device
  selected: boolean
  onLocate: (device: Device) => void
}

export default function DeviceRow({
  device,
  selected,
  onLocate,
}: DeviceRowProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Card elevation={2} sx={{ mb: 2, borderRadius: 4 }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Symbol
            name={device.icon}
            color={stringToHexColor(device.name)}
            size={1.6}
          />
          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontSize: { xs: 16, md: 24 } }}
            >
              {device.name}
            </Typography>
            {device.latest_location ? (
              <Typography
                sx={{
                  display: { xs: "none", md: "block" },
                  color: "text.secondary",
                }}
              >
                {device.latest_location.created_at
                  ? `${t("components.device_row.latest_location")}: ${formatISODate(device.latest_location.created_at.toString())}`
                  : null}
              </Typography>
            ) : null}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", sm: "column", xl: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          {device.is_connected ? <ConnectionDot size={2} /> : null}
          {device.latest_location ? (
            <Tooltip
              title={t("components.device_row.locate_device")}
              enterDelay={500}
              placement="bottom"
            >
              <IconButton
                onClick={() => {
                  onLocate(device)
                }}
              >
                {selected ? (
                  <Icon path={mdiCrosshairsGps} size={1} />
                ) : (
                  <Icon path={mdiCrosshairs} size={1} />
                )}
              </IconButton>
            </Tooltip>
          ) : null}
          <Tooltip
            title={t("components.device_row.go_to_details")}
            enterDelay={500}
            placement="bottom"
          >
            <IconButton
              onClick={() => {
                navigate(`/devices#${device.id}`, {
                  state: { device_id: device.id },
                })
              }}
            >
              <Icon path={mdiChevronRight} size={1} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}
