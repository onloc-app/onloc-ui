import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { divIcon } from "leaflet";
import "./leaflet.css";
import { useEffect, useState, useRef } from "react";
import { getDevices } from "./api";
import { formatISODate, stringToHexColor } from "./utils/utils";
import { useLocation } from "react-router-dom";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AdjustOutlinedIcon from "@mui/icons-material/AdjustOutlined";
import DevicesAutocomplete from "./components/DevicesAutocomplete";
import "./Map.css";
import Battery from "./components/Battery";

function Map() {
  const auth = useAuth();
  const location = useLocation();
  const { device_id } = location.state || {};

  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [mapMovedByUser, setMapMovedByUser] = useState(false);
  const firstLoad = useRef(true);

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
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              width: "100%",
              padding: 2,
              paddingRight: 4,
            }}
          >
            <Paper
              sx={{
                zIndex: 501,
                width: { xs: "100%", sm: "60%", md: "30%" },
                padding: 2,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <DevicesAutocomplete
                devices={devices}
                selectedDevice={selectedDevice}
                callback={setSelectedDevice}
              />
            </Paper>
            {selectedDevice && selectedDevice.latest_location ? (
              <Paper
                sx={{
                  zIndex: 500,
                  width: { xs: "100%", sm: "60%", md: "30%" },
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
                  <AccessTimeOutlinedIcon />
                  <Typography>
                    {formatISODate(selectedDevice.latest_location.created_at)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
                  <PlaceOutlinedIcon />
                  <Typography>
                    {selectedDevice.latest_location.latitude},{" "}
                    {selectedDevice.latest_location.longitude}
                  </Typography>
                </Box>

                {selectedDevice.latest_location.accuracy ? (
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
                    <AdjustOutlinedIcon />
                    <Typography>
                      {selectedDevice.latest_location.accuracy}
                    </Typography>
                  </Box>
                ) : (
                  ""
                )}

                {selectedDevice.latest_location.battery ? (
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 1.5 }}>
                    <Battery level={selectedDevice.latest_location.battery} />
                    <Typography>
                      {selectedDevice.latest_location.battery}%
                    </Typography>
                  </Box>
                ) : (
                  ""
                )}
              </Paper>
            ) : (
              ""
            )}
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
  if (devices) {
    return devices.map((device) => {
      if (device.latest_location) {
        const color = stringToHexColor(device.name);
        const icon = new divIcon({
          html: `<div class="map-pin" style="background-color: ${color};"></div>`,
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
          </Box>
        );
      }
      return <></>;
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
      if (devices.length === 0 || selectedDevice !== null || centered) return;
  
      const devicesWithLocation = devices.filter((d) => d.latest_location);
      const locations = devicesWithLocation.map((d) => [
        d.latest_location.latitude,
        d.latest_location.longitude,
      ]);
  
      if (locations.length === 0) return;
  
      if (locations.length === 1) {
        setSelectedDevice(devicesWithLocation[0]);
      } else {
        const avgLatitude =
          locations.reduce((sum, loc) => sum + loc[0], 0) / locations.length;
        const avgLongitude =
          locations.reduce((sum, loc) => sum + loc[1], 0) / locations.length;
  
        const bounds = locations.length > 1 ? locations : [[avgLatitude, avgLongitude]];
        map.fitBounds(bounds, { padding: [50, 50] });
  
        setCentered(true);
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
