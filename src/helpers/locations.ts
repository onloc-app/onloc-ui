import { Device, Location } from "../types/types"

export function getBoundsByLocations(
  locations: Location[]
): [[number, number], [number, number]] {
  const longitudes = locations.map((location) => location.longitude)
  const latitudes = locations.map((location) => location.latitude)

  const minLng = Math.min(...longitudes)
  const maxLng = Math.max(...longitudes)
  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)

  const bounds: [[number, number], [number, number]] = [
    [minLng, minLat],
    [maxLng, maxLat],
  ]

  return bounds
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

  const locations: Location[] = devicesWithLocation.map((device) => ({
    id: device.latest_location?.id ?? 0,
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
