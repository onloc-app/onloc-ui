import type { Device, Location } from "@/types/types"
import { type MapRef } from "react-map-gl/maplibre"
import { LngLatBounds } from "maplibre-gl"

export function getBoundsByLocations(
  locations: Location[],
): [[number, number], [number, number]] {
  if (locations.length === 0) {
    throw new Error("Cannot get bounds from empty locations")
  }

  const bounds = new LngLatBounds(
    [locations[0].longitude, locations[0].latitude],
    [locations[0].longitude, locations[0].latitude],
  )

  for (const location of locations) {
    bounds.extend([location.longitude, location.latitude])
  }

  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()

  const PADDING_DEGREES = 0.0001

  const minLng = sw.lng
  const maxLng = ne.lng
  const minLat = sw.lat
  const maxLat = ne.lat

  return [
    [minLng - PADDING_DEGREES, minLat - PADDING_DEGREES], // southwest
    [maxLng + PADDING_DEGREES, maxLat + PADDING_DEGREES], // northeast
  ]
}

export async function getGeolocation(): Promise<GeolocationPosition | null> {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported in this browser")
  }

  const status = await navigator.permissions.query({ name: "geolocation" })

  if (status.state === "denied") {
    throw new Error("Location permission was denied")
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      reject(error)
    })
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

  const locations: Location[] = devicesWithLocation.map<Location>((device) => ({
    id: device.latest_location?.id ?? -1n,
    device_id: device.latest_location?.device_id ?? device.id,
    latitude: device.latest_location?.latitude ?? 0,
    longitude: device.latest_location?.longitude ?? 0,
  }))

  return locations
}

export function exportToGPX(locations: Location[], name: string) {
  if (locations.length < 1) return

  let gpx = ""

  const asWaypoint = locations.length === 1

  if (asWaypoint) {
    gpx = `
      <?xml version="1.0" encoding="UTF-8"?>
      <gpx version="1.1" creator="Onloc" xmlns="http://www.topografix.com/GPX/1/1/">
        <wpt lon="${locations[0].longitude}" lat="${locations[0].latitude}">
          <name>${name}</name>
        </wpt>
      </gpx>
    `
  } else {
    gpx = `
      <?xml version="1.0" encoding="UTF-8"?>
      <gpx version="1.1" creator="Onloc" xmlns="http://www.topografix.com/GPX/1/1/">
        <trk>
          <name>${name}</name>
          <trkseg>
            ${locations.map((location) => {
              return `<trkpt lon="${location.longitude}" lat="${location.latitude}"></trkpt>\n`
            })}
          </trkseg>
        </trk>
      </gpx>
    `
  }

  const blob = new Blob([gpx], { type: "application/gpx+xml" })
  const link = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: `Onloc-${name}-${asWaypoint ? "Waypoint" : "Track"}.gpx`,
  })
  link.click()
  URL.revokeObjectURL(link.href)
}

export function fitBounds(
  map: MapRef,
  locations: Location[],
  animate: boolean = true,
) {
  switch (locations.length) {
    case 0:
      break
    case 1:
      map.flyTo({
        center: [locations[0].longitude, locations[0].latitude],
        zoom: 14,
        bearing: 0,
        pitch: 0,
        animate: animate,
      })
      break
    default:
      map.fitBounds(getBoundsByLocations(locations), {
        padding: 150,
        bearing: 0,
        pitch: 0,
        animate: animate,
      })
      break
  }
}

export function isNewerLocation(
  candidate: Location,
  current?: Location | null,
): boolean {
  const candidateTime = candidate.created_at
    ? new Date(candidate.created_at)
    : null
  const currentTime = current?.created_at ? new Date(current.created_at) : null

  if (!candidateTime) return false
  if (!currentTime) return true
  return candidateTime > currentTime
}
