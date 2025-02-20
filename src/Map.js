import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";
import { Box, CircularProgress, Paper, TextField } from "@mui/material";
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { divIcon, LatLng } from "leaflet";
import "./leaflet.css";
import { useEffect, useState, useRef } from "react";
import { getDevices } from "./api";
import { formatISODate, stringToHexColor } from "./utils";
import { useNavigate, useLocation } from "react-router-dom";
import "./Map.css";

function Map() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { device_id } = location.state || {};

  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [mapMovedByUser, setMapMovedByUser] = useState(false);
  const firstLoad = useRef(true);

  const [searchDevice, setSearchDevice] = useState(null);

  useEffect(() => {
    async function fetchDevices() {
      const data = await getDevices(auth.token);
      if (data && data.length > 0) {
        setDevices(data);
        if (firstLoad.current) {
          setSelectedDevice(
            device_id ? data.find((device) => device.id === device_id) : null
          );
          firstLoad.current = false;
        }
      }
    }
    fetchDevices();

    const updateInterval = setInterval(() => fetchDevices(), 60000);
    return () => clearInterval(updateInterval);
  }, []);

  function search(name) {
    if (name.trim() === "") return;

    const foundDevices = devices.filter((device) => device.name.includes(name));

    if (foundDevices.length > 0) {
      setSelectedDevice(foundDevices[0]);
    }
  }

  return (
    <>
      <MainAppBar selectedNav={"map"} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 1,
          height: "calc(100vh - 64px)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            padding: 1,
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
              padding: 2,
              paddingRight: 4,
            }}
          >
            <Paper
              sx={{
                zIndex: 500,
                overflow: "scroll",
                width: { xs: "100%", sm: "60%", md: "30%" },
                padding: 2,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <TextField
                variant="standard"
                label="Search devices"
                size="small"
                fullWidth
                onChange={(event) => {
                  search(event.target.value);
                }}
              ></TextField>
            </Paper>
          </Box>
          {devices ? (
            <MapContainer center={[0, 0]} zoom={4} scrollWheelZoom={true}>
              <MapUpdater
                device={selectedDevice}
                setMapMovedByUser={setMapMovedByUser}
              />
              <MapEventHandler
                devices={devices}
                selectedDevice={selectedDevice}
                setSelectedDevice={setSelectedDevice}
                mapMovedByUser={mapMovedByUser}
                setMapMovedByUser={setMapMovedByUser}
              />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Markers
                devices={devices}
                setSelectedDevice={setSelectedDevice}
              />
            </MapContainer>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

function Markers({ devices, setSelectedDevice }) {
  const map = useMap();

  if (devices) {
    return devices.map((device) => {
      function detailsPosition() {
        const middleWidth = window.innerWidth / 2;
        const middleHeight = window.innerHeight / 2;
        const pinDetails = document.getElementById(`map-details-${device.id}`);
        if (!pinDetails) return [false, false];
        var offsets = document
          .getElementById(`map-details-${device.id}`)
          .getBoundingClientRect();
        var top = offsets.top;
        var left = offsets.left;

        return [left > middleWidth, top > middleHeight];
      }

      if (device.latest_location) {
        const color = stringToHexColor(device.name);
        const icon = new divIcon({
          html: `<div class="map-pin" style="background-color: ${color};"></div>
          <div id="map-details-${device.id}" class="map-pin-details" style="
            border-color: ${color};
            left: 50%;
            transform: translateX(${
              detailsPosition()[0] ? "-110%" : "10%"
            }) translateY(${detailsPosition()[1] ? "-110%" : "-10%"});
            white-space: nowrap;
          ">
            <div class="map-details-name">${device.name}</div>
            <div class="map-details-coords">${
              device.latest_location.latitude
            }, ${device.latest_location.longitude}</div>
            <div class="map-details-time">${formatISODate(
              device.latest_location.created_at
            )}</div>
          </div>`,
          className: "map-device-div-icon",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
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
                  setSelectedDevice(device);
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
            <Polyline
              positions={[
                [
                  device.latest_location.latitude,
                  device.latest_location.longitude,
                ],
                [
                  device.latest_location.latitude,
                  // Converts the accuracy into coordinates
                  parseFloat(device.latest_location.longitude) +
                    (device.latest_location.accuracy /
                      (6371000 *
                        Math.cos(
                          (Math.PI * device.latest_location.latitude) / 180
                        ))) *
                      (180 / Math.PI),
                ],
              ]}
              pathOptions={{
                color: color,
              }}
            />
          </Box>
        );
      }
    });
  }
}

function MapUpdater({ device, setMapMovedByUser }) {
  const map = useMap();

  useEffect(() => {
    if (device && device.latest_location) {
      const { latitude, longitude } = device.latest_location;
      setMapMovedByUser(false);
      map.setView([latitude, longitude], 17);
    }
  }, [device, map]);

  return null;
}

function MapEventHandler({
  devices,
  selectedDevice,
  setSelectedDevice,
  mapMovedByUser,
  setMapMovedByUser,
}) {
  const map = useMap();
  const [centered, setCentered] = useState(false);

  useEffect(() => {
    map.whenReady(() => {
      if (devices.length <= 0) return;
      if (selectedDevice !== null) return;
      if (centered) return;

      const locations = devices
        .filter((d) => d.latest_location)
        .map((d) => [d.latest_location.latitude, d.latest_location.longitude]);

      if (locations.length < 2) {
        setSelectedDevice(devices[0]);
      } else {
        if (locations.length > 0) {
          const avgLatitude =
            locations.reduce((sum, loc) => sum + loc[0], 0) / locations.length;
          const avgLongitude =
            locations.reduce((sum, loc) => sum + loc[1], 0) / locations.length;

          const bounds =
            locations.length > 1 ? locations : [[avgLatitude, avgLongitude]];
          map.fitBounds(bounds, { padding: [50, 50] });

          setCentered(true);
        }
      }
    });
  }, [map, devices]);

  useMapEvents({
    dragend: () => {
      setSelectedDevice(null);
      setMapMovedByUser(true);
    },
    zoomend: () => {
      if (mapMovedByUser) {
        setSelectedDevice(null);
      }
      setMapMovedByUser(true);
    },
  });

  return null;
}

export default Map;
