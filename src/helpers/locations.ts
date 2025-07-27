import { LatLngTuple } from "leaflet"
import { Device, Location } from "../types/types"

export function getBoundsByLocations(
  locations: Location[]
): [LatLngTuple, LatLngTuple] {
  const latitudes = locations.map((location) => location.latitude)
  const longitudes = locations.map((location) => location.longitude)

  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const minLng = Math.min(...longitudes)
  const maxLng = Math.max(...longitudes)

  const bounds: [LatLngTuple, LatLngTuple] = [
    [minLat, minLng],
    [maxLat, maxLng],
  ]

  return bounds
}

export async function getGeolocation(): Promise<GeolocationPosition | null> {
  if (!navigator.geolocation) {
    return null
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      () => resolve(null)
    )
  })
}

export function getDistance(locationA: Location, locationB: Location) {
  const EARTH_RADIUS = 6371000

  const deltaLatitudes =
    (locationB.latitude - locationA.latitude) * (Math.PI / 180)
  const deltaLongitudes =
    (locationB.longitude - locationA.longitude) * (Math.PI / 180)

  const a =
    Math.sin(deltaLatitudes / 2) ** 2 +
    Math.sin(deltaLongitudes / 2) ** 2 *
      Math.cos(locationA.latitude * (Math.PI / 180)) *
      Math.cos(locationB.latitude * (Math.PI / 180))

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distanceInMeters = EARTH_RADIUS * c

  if (distanceInMeters / 1000 >= 1) {
    return `${(distanceInMeters / 1000).toFixed(2)} km`
  } else {
    return `${distanceInMeters.toFixed(2)} m`
  }
}

export function listLatestLocations(devices: Device[]) {
  const devicesWithLocation = devices.filter((device) => device.latest_location)

  if (devicesWithLocation.length === 0) return null

  const locations: Location[] = devicesWithLocation.map((device) => ({
    id: device.latest_location?.id ?? 0,
    device_id: device.latest_location?.device_id ?? device.id,
    latitude: device.latest_location?.latitude ?? 0,
    longitude: device.latest_location?.longitude ?? 0,
  }))

  return locations
}
