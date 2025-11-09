import BatteryChip from "@/components/src/BatteryChip"
import { getDistance, getGeolocation } from "@/helpers/locations"
import type { Device } from "@/types/types"
import { mdiRuler } from "@mdi/js"
import Icon from "@mdi/react"
import { Box, Chip, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"

interface DeviceInformationChipsProps {
  device: Device
}

export default function DeviceInformationChips({
  device,
}: DeviceInformationChipsProps) {
  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: () => getGeolocation(),
  })

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
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
                  latitude: userGeolocation.coords.latitude,
                  longitude: userGeolocation.coords.longitude,
                },
                device.latest_location,
              )}
            </Typography>
          }
          size="small"
        />
      ) : null}
    </Box>
  )
}
