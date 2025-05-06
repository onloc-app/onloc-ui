import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";
import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, Paper, Typography } from "@mui/material";
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { divIcon } from "leaflet";
import "./leaflet.css";
import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { getDevices, getLocationsByDeviceId } from "./api";
import {
  formatISODate,
  getBoundsByLocations,
  stringToHexColor,
} from "./utils/utils";
import { useLocation } from "react-router-dom";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AdjustOutlinedIcon from "@mui/icons-material/AdjustOutlined";
import DevicesAutocomplete from "./components/DevicesAutocomplete";
import "./Map.css";
import Battery from "./components/Battery";
import { Device, Location } from "./types/types";
import { DateCalendar } from "@mui/x-date-pickers";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface LatestLocationMarkersProps {
  devices: Device[];
  selectedDevice: Device | null;
  setSelectedDevice: Dispatch<SetStateAction<Device | null>>;
}
interface PastLocationMarkersProps {
  selectedDevice: Device;
}

interface MapUpdaterProps {
  device: Device | null;
  setMapMovedByUser: Dispatch<SetStateAction<boolean>>;
}

interface MapEventHandlerProps {
  devices: Device[];
  selectedDevice: Device | null;
  setSelectedDevice: Dispatch<SetStateAction<Device | null>>;
  mapMovedByUser: boolean;
  setMapMovedByUser: Dispatch<SetStateAction<boolean>>;
}

function Map() {
  const auth = useAuth();
  const location = useLocation();
  const { device_id } = location.state || {};

  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [mapMovedByUser, setMapMovedByUser] = useState<boolean>(false);
  const firstLoad = useRef<boolean>(true);

  useEffect(() => {
    async function fetchDevices() {
      if (!auth) return;

      const data = await getDevices(auth.token);
      if (data && data.length > 0) {
        setDevices(data);
        if (firstLoad.current) {
          setSelectedDevice(
            device_id
              ? data.find((device: Device) => device.id === device_id)
              : null
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
              gap: 2,
              width: "100%",
              padding: 2,
              paddingRight: 4,
            }}
          >
            {/* Device selector */}
            <Paper
              sx={{
                zIndex: 501,
                width: { xs: "100%", sm: "60%", md: "40%", lg: "30%" },
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

            {/*
            <Paper>
              <DateCalendar />
            </Paper> */}

            {selectedDevice && selectedDevice.latest_location ? (
              <Accordion
                sx={{
                  zIndex: 500,
                  width: { xs: "100%", sm: "60%", md: "40%", lg: "30%" },
                  gap: 1,
                }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography variant="subtitle1">Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {selectedDevice.latest_location.created_at ? (
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, marginBottom: 0.5 }}>
                      <AccessTimeOutlinedIcon />
                      <Typography>
                        {formatISODate(
                          selectedDevice.latest_location.created_at.toString()
                        )}
                      </Typography>
                    </Box>
                  ) : (
                    ""
                  )}

                  <Box sx={{ display: "flex", flexDirection: "row", gap: 2, marginBottom: 0.5 }}>
                    <PlaceOutlinedIcon />
                    <Typography>
                      {selectedDevice.latest_location.latitude},{" "}
                      {selectedDevice.latest_location.longitude}
                    </Typography>
                  </Box>

                  {selectedDevice.latest_location.accuracy ? (
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, marginBottom: 0.5 }}>
                      <AdjustOutlinedIcon />
                      <Typography>
                        {selectedDevice.latest_location.accuracy}
                      </Typography>
                    </Box>
                  ) : (
                    ""
                  )}

                  {selectedDevice.latest_location.battery ? (
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, marginBottom: 0.5 }}>
                      <Battery level={selectedDevice.latest_location.battery} />
                      <Typography>
                        {selectedDevice.latest_location.battery}%
                      </Typography>
                    </Box>
                  ) : (
                    ""
                  )}
                </AccordionDetails>
              </Accordion>
              // <Paper
              //   sx={{
              //     zIndex: 500,
              //     width: { xs: "100%", sm: "60%", md: "40%", lg: "30%" },
              //     padding: 2,
              //     display: "flex",
              //     flexDirection: "column",
              //     gap: 1,
              //   }}
              // >
              //   {selectedDevice.latest_location.created_at ? (
              //     <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              //       <AccessTimeOutlinedIcon />
              //       <Typography>
              //         {formatISODate(
              //           selectedDevice.latest_location.created_at.toString()
              //         )}
              //       </Typography>
              //     </Box>
              //   ) : (
              //     ""
              //   )}

              //   <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              //     <PlaceOutlinedIcon />
              //     <Typography>
              //       {selectedDevice.latest_location.latitude},{" "}
              //       {selectedDevice.latest_location.longitude}
              //     </Typography>
              //   </Box>

              //   {selectedDevice.latest_location.accuracy ? (
              //     <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              //       <AdjustOutlinedIcon />
              //       <Typography>
              //         {selectedDevice.latest_location.accuracy}
              //       </Typography>
              //     </Box>
              //   ) : (
              //     ""
              //   )}

              //   {selectedDevice.latest_location.battery ? (
              //     <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              //       <Battery level={selectedDevice.latest_location.battery} />
              //       <Typography>
              //         {selectedDevice.latest_location.battery}%
              //       </Typography>
              //     </Box>
              //   ) : (
              //     ""
              //   )}
              // </Paper>
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
              <LatestLocationMarkers
                devices={devices}
                selectedDevice={selectedDevice}
                setSelectedDevice={setSelectedDevice}
              />
              {selectedDevice ? (
                <PastLocationMarkers selectedDevice={selectedDevice} />
              ) : (
                ""
              )}
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

function LatestLocationMarkers({
  devices,
  selectedDevice,
  setSelectedDevice,
}: LatestLocationMarkersProps) {
  if (devices) {
    return devices.map((device) => {
      if (
        selectedDevice &&
        selectedDevice.latest_location === device.latest_location
      ) {
        return;
      }

      if (device.latest_location) {
        const color = stringToHexColor(device.name);
        const icon = divIcon({
          html: `<div class="map-pin" style="background-color: ${color};"></div>`,
          className: "map-device-div-icon latest-location-icon",
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

function PastLocationMarkers({ selectedDevice }: PastLocationMarkersProps) {
  const auth = useAuth();
  const map = useMap();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    async function fetchLocations() {
      if (!auth || !selectedDevice) return;

      const data = await getLocationsByDeviceId(auth.token, selectedDevice.id);
      if (data) {
        const fetchedLocations = data[0].locations;
        setLocations(fetchedLocations);
        map.fitBounds(getBoundsByLocations(fetchedLocations), {
          padding: [50, 50],
        });
      }
    }
    fetchLocations();
  }, [selectedDevice]);

  if (locations.length > 0) {
    return locations.map((location, index) => {
      const color = stringToHexColor(selectedDevice.name);
      const icon = divIcon({
        html: `<div class="map-pin" style="background-color: ${color};"></div>`,
        className: `map-device-div-icon ${location.id === selectedDevice.latest_location?.id
          ? "latest-location-icon"
          : "past-location-icon"
          }`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      return (
        <Box key={location.id}>
          <Marker
            icon={icon}
            position={[location.latitude, location.longitude]}
            eventHandlers={{
              click: () => {
                map.setView([location.latitude, location.longitude]);
              },
            }}
          />
          {location.id === selectedDevice.latest_location?.id &&
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
          {index + 1 < locations.length ? (
            <Polyline
              pathOptions={{
                color: stringToHexColor(selectedDevice.name),
                weight: 4,
                dashArray: "6, 12",
                className: "moving-dashes",
              }}
              positions={[
                [location.latitude, location.longitude],
                [locations[index + 1].latitude, locations[index + 1].longitude],
              ]}
            />
          ) : (
            ""
          )}
        </Box>
      );
    });
  }
}

function MapUpdater({ device, setMapMovedByUser }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    if (device && device.latest_location) {
      const { latitude, longitude } = device.latest_location;
      map.setView([latitude, longitude], map.getZoom());
      setMapMovedByUser(false);
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
}: MapEventHandlerProps) {
  const map = useMap();
  const [centered, setCentered] = useState(false);

  useEffect(() => {
    map.whenReady(() => {
      if (devices.length === 0 || selectedDevice !== null || centered) return;

      const devicesWithLocation = devices.filter(
        (device) => device.latest_location
      );
      if (devicesWithLocation.length === 0) return;

      const locations: Location[] = devicesWithLocation.map((device) => ({
        id: device.latest_location?.id ?? 0,
        device_id: device.latest_location?.device_id ?? device.id,
        latitude: device.latest_location?.latitude ?? 0,
        longitude: device.latest_location?.longitude ?? 0,
      }));

      if (locations.length === 1 && !mapMovedByUser) {
        setSelectedDevice(devicesWithLocation[0]);
      } else {
        map.fitBounds(getBoundsByLocations(locations), { padding: [50, 50] });
        setCentered(true);
      }
    });
  }, [map, devices]);

  useMapEvents({
    dragend: () => {
      setMapMovedByUser(true);
    },
    zoomend: () => {
      setMapMovedByUser(true);
    },
  });

  return null;
}

export default Map;
