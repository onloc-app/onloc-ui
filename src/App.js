import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Paper,
  Typography,
} from "@mui/material";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "./leaflet.css";
import { useEffect, useState } from "react";
import { getDevices } from "./api";
import { formatISODate, stringToHexColor } from "./utils";
import Symbol from "./components/Symbol";

function App() {
  const auth = useAuth();

  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    async function fetchDevices() {
      const data = await getDevices(auth.token);
      if (data) {
        setDevices(data);
        setMapCenter(
          data[0].latest_location.latitude,
          data[0].latest_location.longitude
        );
      }
    }
    fetchDevices();

    const regularUpdates = setInterval(() => fetchDevices(), 60000);
  }, [auth.token]);

  return (
    <>
      <MainAppBar />
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
              <DeviceList devices={devices} />
            </Paper>
          </Box>
          <MapContainer center={mapCenter} zoom={4} scrollWheelZoom={true}>
            <MapUpdater devices={devices} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Markers devices={devices} />
          </MapContainer>
        </Box>
      </Box>
    </>
  );
}

function DeviceList({ devices }) {
  if (devices) {
    return devices.map((device) => {
      return <DeviceCard key={device.id} device={device} />;
    });
  }
}

function DeviceCard({ device }) {
  return (
    <Card elevation={3} sx={{ mb: 2 }}>
      <CardActionArea>
        <CardContent
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function Markers({ devices }) {
  if (devices) {
    return devices.map((device) => {
      if (device.latest_location) {
        return (
          <Box key={device.latest_location.id}>
            <Marker
              position={[
                device.latest_location.latitude,
                device.latest_location.longitude,
              ]}
            >
              <Popup>{device.name}</Popup>
            </Marker>
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

function MapUpdater({ devices }) {
  const map = useMap();

  useEffect(() => {
    if (devices.length > 0) {
      const { latitude, longitude } = devices[0].latest_location;
      map.setView([latitude, longitude], 20);
    }
  }, [devices, map]);

  return null;
}

export default App;
