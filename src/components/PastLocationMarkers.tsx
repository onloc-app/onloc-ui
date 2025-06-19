import { Box } from "@mui/material"
import { Circle, Marker, Polyline, useMap } from "react-leaflet"
import { divIcon } from "leaflet"
import "../leaflet.css"
import { useEffect, Dispatch, SetStateAction } from "react"
import { getBoundsByLocations, stringToHexColor } from "../utils/utils"
import "../Map.css"
import { Device, Location } from "../types/types"
import dayjs from "dayjs"

interface PastLocationMarkersProps {
  selectedDevice: Device
  setSelectedLocation: Dispatch<SetStateAction<Location | null>>
  selectedLocation: Location | null
  locations: Location[]
  allowedHours: number[] | null
}

export default function PastLocationMarkers({
  selectedDevice,
  setSelectedLocation,
  selectedLocation,
  locations,
  allowedHours,
}: PastLocationMarkersProps) {
  const map = useMap()

  useEffect(() => {
    if (locations.length > 0) {
      map.fitBounds(getBoundsByLocations(locations), {
        padding: [50, 50],
      })
    }
  }, [map, locations])

  useEffect(() => {
    if (selectedLocation) {
      map.setView(
        [selectedLocation?.latitude, selectedLocation?.longitude],
        map.getZoom()
      )
    }
  }, [map, selectedLocation])

  if (locations.length > 0) {
    const filteredLocations = allowedHours
      ? locations.filter((location) => {
          if (location.created_at) {
            return (
              dayjs(location.created_at).hour() >= allowedHours[0] &&
              dayjs(location.created_at).hour() <= allowedHours[1]
            )
          } else {
            return null
          }
        })
      : locations

    return filteredLocations.map((location, index) => {
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
          {index + 1 < filteredLocations.length ? (
            <Polyline
              pathOptions={{
                color: stringToHexColor(selectedDevice.name),
                weight: 4,
                dashArray: "6, 12",
                className: "moving-dashes",
              }}
              positions={[
                [location.latitude, location.longitude],
                [
                  filteredLocations[index + 1].latitude,
                  filteredLocations[index + 1].longitude,
                ],
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
