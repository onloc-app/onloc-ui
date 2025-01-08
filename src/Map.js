import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
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
import { formatISODate, sortDevices, stringToHexColor } from "./utils";
import Symbol from "./components/Symbol";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import LocationSearchingOutlinedIcon from "@mui/icons-material/LocationSearchingOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
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

  useEffect(() => {
    async function fetchDevices() {
      const data = await getDevices(auth.token);
      if (data) {
        setDevices(data);
        const sortedDevices = sortDevices(data);
        if (firstLoad.current) {
          setSelectedDevice(
            device_id
              ? data.find((device) => device.id === device_id)
              : sortedDevices[0]
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
              zIndex: 500,
              position: "absolute",
              width: { xs: "calc(100% - 40px)", sm: "40%", md: "30%" },
              height: { xs: 128, sm: "calc(100% - 40px)" },
              left: 20,
              top: 20,
            }}
          >
            <Paper
              sx={{
                overflow: "scroll",
                height: "100%",
                padding: 2,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 24, md: 32 },
                  fontWeight: 500,
                  mb: 2,
                  textAlign: { xs: "left", sm: "center", md: "left" },
                }}
              >
                Devices
              </Typography>
              <DeviceList
                devices={devices}
                selectedDevice={selectedDevice}
                setSelectedDevice={setSelectedDevice}
                navigate={navigate}
              />
            </Paper>
          </Box>
          {devices ? (
            <MapContainer center={[0, 0]} zoom={4} scrollWheelZoom={true}>
              <MapUpdater
                device={selectedDevice}
                setMapMovedByUser={setMapMovedByUser}
              />
              <MapEventHandler
                mapMovedByUser={mapMovedByUser}
                setSelectedDevice={setSelectedDevice}
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

function DeviceList({ devices, selectedDevice, setSelectedDevice, navigate }) {
  const sortedDevices = sortDevices(devices);
  if (devices) {
    return sortedDevices.map((device) => {
      return (
        <DeviceCard
          key={device.id}
          device={device}
          selectedDevice={selectedDevice}
          setSelectedDevice={setSelectedDevice}
          navigate={navigate}
        />
      );
    });
  }
}

function DeviceCard({ device, selectedDevice, setSelectedDevice, navigate }) {
  return (
    <Card elevation={3} sx={{ mb: 2 }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Symbol name={device.icon} color={stringToHexColor(device.name)} />
          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontSize: { xs: 16, md: 24 } }}
            >
              {device.name}
            </Typography>
            {device.latest_location ? (
              <Typography
                sx={{
                  display: { xs: "none", md: "block" },
                  color: "text.secondary",
                }}
              >
                Latest location:{" "}
                {formatISODate(device.latest_location.created_at)}
              </Typography>
            ) : (
              ""
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", sm: "column", xl: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          {device.latest_location ? (
            <IconButton
              title="Locate device"
              onClick={() => {
                setSelectedDevice(device);
              }}
            >
              {selectedDevice && device.id === selectedDevice.id ? (
                <MyLocationOutlinedIcon />
              ) : (
                <LocationSearchingOutlinedIcon />
              )}
            </IconButton>
          ) : (
            ""
          )}
          <IconButton
            title="Go to details"
            onClick={() => {
              navigate(`/devices#${device.id}`, {
                state: { device_id: device.id },
              });
            }}
          >
            <ChevronRightOutlinedIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}

function Markers({ devices, setSelectedDevice }) {
  const map = useMap();

  if (devices) {
    return devices.map((device) => {
      if (device.latest_location) {
        const icon = new divIcon({
          html: `<div class="pin" style="background-color: ${stringToHexColor(
            device.name
          )};"></div><div class="pin-details"><div class="details-name">${
            device.name
          }</div><div class="details-coords">${
            device.latest_location.latitude
          }, ${
            device.latest_location.longitude
          }</div><div class="details-time">${formatISODate(
            device.latest_location.created_at
          )}</div></div>`,
          className: "device-div-icon",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
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
            ></Marker>
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
      map.setView([latitude, longitude], 18);
    }
  }, [device, map]);

  return null;
}

function MapEventHandler({
  setSelectedDevice,
  mapMovedByUser,
  setMapMovedByUser,
}) {
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
