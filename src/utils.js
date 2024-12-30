export function formatISODate(isoDate) {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function stringToHexColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 70 + (Math.abs(hash) % 30);
  const lightness = 50 + (Math.abs(hash) % 30);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function sortDevices(devices) {
  const sortedDevices = devices.sort((a, b) => {
    const aHasLocation = !!a.latest_location;
    const bHasLocation = !!b.latest_location;
  
    if (aHasLocation && bHasLocation) {
      return (
        new Date(b.latest_location.created_at) -
        new Date(a.latest_location.created_at)
      );
    } else if (aHasLocation) {
      return -1;
    } else if (bHasLocation) {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  return sortedDevices
}
