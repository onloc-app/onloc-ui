import { BatteryBadge, InformationBadge } from "@/components"
import type { Device } from "@/types/types"
import { mdiRuler } from "@mdi/js"
import { useQuery } from "@tanstack/react-query"
import classes from "./DeviceInformationBadges.module.css"
import { LocationService } from "@/services"

interface DeviceInformationBadgesProps {
  device: Device
}

export default function DeviceInformationBadges({
  device,
}: DeviceInformationBadgesProps) {
  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: LocationService.getGeolocation,
  })

  return (
    <div className={classes["badges"]}>
      {device.latest_location && device.latest_location.battery && (
        <BatteryBadge
          level={device.latest_location.battery}
          charging={device.latest_location?.charging}
        />
      )}
      {userGeolocation && device.latest_location && (
        <InformationBadge
          label={LocationService.getDistance(
            {
              id: -1n,
              device_id: -1n,
              latitude: userGeolocation.coords.latitude,
              longitude: userGeolocation.coords.longitude,
            },
            device.latest_location,
          )}
          icon={mdiRuler}
        />
      )}
    </div>
  )
}
