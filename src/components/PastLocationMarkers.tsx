import { useAuth } from "../contexts/AuthProvider"
import { Box } from "@mui/material"
import { Circle, Marker, Polyline, useMap } from "react-leaflet"
import { divIcon } from "leaflet"
import "../leaflet.css"
import { useEffect, Dispatch, SetStateAction } from "react"
import { getLocationsByDeviceId } from "../api"
import { getBoundsByLocations, stringToHexColor } from "../utils/utils"
import "../Map.css"
import { Device, Location } from "../types/types"
import { Dayjs } from "dayjs"

interface PastLocationMarkersProps {
  selectedDevice: Device
  setSelectedLocation: Dispatch<SetStateAction<Location | null>>
  selectedLocation: Location | null
  locations: Location[]
  setLocations: Dispatch<SetStateAction<Location[]>>
  date: Dayjs | null
}

export default function PastLocationMarkers({
  selectedDevice,
  setSelectedLocation,
  selectedLocation,
  locations,
  setLocations,
  date,
}: PastLocationMarkersProps) {
  const auth = useAuth()
  const map = useMap()

  useEffect(() => {
    async function fetchLocations() {
      if (!auth || !selectedDevice || !date) return

      const data = await getLocationsByDeviceId(
        auth.token,
        selectedDevice.id,
        date,
        date
      )
      if (data) {
        let fetchedLocations = []
        if (data[0] && data[0].locations) {
          fetchedLocations = data[0].locations
        }
        setLocations(fetchedLocations)
        if (fetchedLocations.length > 0) {
          map.fitBounds(getBoundsByLocations(fetchedLocations), {
            padding: [50, 50],
          })
        }
      } else {
        setLocations([])
      }
    }
    fetchLocations()
  }, [auth, selectedDevice, date])

  useEffect(() => {
    if (selectedLocation) {
      map.setView(
        [selectedLocation?.latitude, selectedLocation?.longitude],
        map.getZoom()
      )
    }
  }, [selectedLocation])

  if (locations.length > 0) {
    return locations.map((location, index) => {
      const color = stringToHexColor(selectedDevice.name)
      const icon = divIcon({
        html: `<div class="map-pin" style="background-color: ${color};"></div>`,
        className: `map-device-div-icon ${
          location.id === selectedDevice.latest_location?.id
            ? "latest-location-icon"
            : "past-location-icon"
        }`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })
      return (
        <Box key={location.id}>
          <Marker
            icon={icon}
            position={[location.latitude, location.longitude]}
            eventHandlers={{
              click: () => {
                map.setView([location.latitude, location.longitude])
                setSelectedLocation(location)
              },
            }}
          />
          {(location.id === selectedDevice.latest_location?.id ||
            location.id === selectedLocation?.id) &&
          location.accuracy ? (
            <Circle
              center={[location.latitude, location.longitude]}
              pathOptions={{
                fillColor: stringToHexColor(selectedDevice.name),
                color: stringToHexColor(selectedDevice.name),
              }}
              radius={location.accuracy}
            />
          ) : null}
          {index + 1 < locations.length ? (
            <Polyline
              pathOptions={{
                color: stringToHexColor(selectedDevice.name),
                weight: 4,
                dashArray: "6, 12",
                className: "moving-dashes",
              }}
              positions={[
                [location.latitude, location.longitude],
                [locations[index + 1].latitude, locations[index + 1].longitude],
              ]}
            />
          ) : (
            ""
          )}
        </Box>
      )
    })
  }
}
