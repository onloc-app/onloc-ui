import { Box } from "@mui/material"
import { Circle, Marker } from "react-leaflet"
import { divIcon } from "leaflet"
import "../leaflet.css"
import { Dispatch, SetStateAction } from "react"
import { stringToHexColor } from "../utils/utils"
import "../Map.css"
import { Device } from "../types/types"

interface LatestLocationMarkersProps {
  devices: Device[]
  selectedDevice: Device | null
  setSelectedDeviceId: Dispatch<SetStateAction<number | null>>
}

export default function LatestLocationMarkers({
  devices,
  selectedDevice,
  setSelectedDeviceId,
}: LatestLocationMarkersProps) {
  if (devices) {
    return devices.map((device) => {
      if (
        selectedDevice &&
        selectedDevice.latest_location === device.latest_location
      ) {
        return null
      }

      if (device.latest_location) {
        const color = stringToHexColor(device.name)
        const icon = divIcon({
          html: `<div class="map-pin" style="background-color: ${color};"></div>`,
          className: "map-device-div-icon latest-location-icon",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })
        return (
          <Box key={device.latest_location.id}>
            <Marker
              icon={icon}
              position={[
                device.latest_location.latitude,
                device.latest_location.longitude,
              ]}
              eventHandlers={{
                click: () => {
                  setSelectedDeviceId(device.id)
                },
              }}
            />
            {device.latest_location.accuracy ? (
              <Circle
                center={[
                  device.latest_location.latitude,
                  device.latest_location.longitude,
                ]}
                pathOptions={{
                  fillColor: stringToHexColor(device.name),
                  color: stringToHexColor(device.name),
                }}
                radius={device.latest_location.accuracy}
              />
            ) : null}
          </Box>
        )
      }
      return <></>
    })
  }
}
