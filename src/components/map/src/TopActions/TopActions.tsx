import { getDevices, getSharedDevices } from "@/api"
import { DevicesSelect } from "@/components"
import type { Device, Location } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import LocationDetails from "../LocationDetails/LocationDetails"
import MapControlBar from "../MapControlBar"
import classes from "./TopActions.module.css"

interface TopActionsProps {
  selectedDevice: Device | null
  selectedLocation: Location | null
  onDeviceSelected: (device: Device | null) => void
  onLocationUnselected: () => void
}

export default function TopActions({
  selectedDevice,
  selectedLocation,
  onDeviceSelected,
  onLocationUnselected,
}: TopActionsProps) {
  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: getDevices,
  })
  const { data: sharedDevices = [] } = useQuery<Device[]>({
    queryKey: ["shared_devices"],
    queryFn: getSharedDevices,
  })

  return (
    <div className={classes["container"]}>
      <div className={classes["container__inner"]}>
        <MapControlBar className={classes["control-bar"]}>
          <DevicesSelect
            devices={devices}
            sharedDevices={sharedDevices}
            selectedDevice={selectedDevice}
            callback={onDeviceSelected}
          />
        </MapControlBar>
        {selectedDevice && selectedLocation && (
          <LocationDetails
            device={selectedDevice}
            location={selectedLocation}
            onDismiss={onLocationUnselected}
          />
        )}
      </div>
    </div>
  )
}
