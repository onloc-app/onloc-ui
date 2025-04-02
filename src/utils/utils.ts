import { LatLngTuple } from "leaflet";
import { Device, Location } from "../types/types";

export function formatISODate(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function stringToHexColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 70 + (Math.abs(hash) % 30);
  const lightness = 50 + (Math.abs(hash) % 30);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// TODO use this function to sort the Devices page
export function sortDevices(devices: Device[]): Device[] {
  const sortedDevices = devices.sort((a, b) => {
    const aHasLocation = !!a.latest_location;
    const bHasLocation = !!b.latest_location;

    if (aHasLocation && bHasLocation) {
      return (
        new Date(b.latest_location?.created_at || 0).getTime() -
        new Date(a.latest_location?.created_at || 0).getTime()
      );
    } else if (aHasLocation) {
      return -1;
    } else if (bHasLocation) {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  return sortedDevices;
}

export function getBoundsByLocations(
  locations: Location[]
): [LatLngTuple, LatLngTuple] {
  const latitudes = locations.map((location) => location.latitude);
  const longitudes = locations.map((location) => location.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const bounds: [LatLngTuple, LatLngTuple] = [
    [minLat, minLng],
    [maxLat, maxLng],
  ];

  return bounds;
}
