import { useAuth } from "./contexts/AuthProvider"
import MainAppBar from "./components/MainAppBar"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionActions,
  Box,
  CircularProgress,
  Paper,
  Typography,
  IconButton,
  Dialog,
} from "@mui/material"
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet"
import "./leaflet.css"
import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react"
import { getDevices } from "./api/index"
import { formatISODate, getBoundsByLocations } from "./utils/utils"
import { useLocation } from "react-router-dom"
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined"
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined"
import AdjustOutlinedIcon from "@mui/icons-material/AdjustOutlined"
import DevicesAutocomplete from "./components/DevicesAutocomplete"
import "./Map.css"
import Battery from "./components/Battery"
import { Device, Location } from "./types/types"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined"
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined"
import LastPageIcon from "@mui/icons-material/LastPage"
import FirstPageIcon from "@mui/icons-material/FirstPage"
import PastLocationMarkers from "./components/PastLocationMarkers"
import LatestLocationMarkers from "./components/LatestLocationMarkers"
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined"
import dayjs, { Dayjs } from "dayjs"
import { DatePicker } from "@mui/x-date-pickers"

interface MapUpdaterProps {
  device: Device | null
  setMapMovedByUser: Dispatch<SetStateAction<boolean>>
}

interface MapEventHandlerProps {
  devices: Device[]
  selectedDevice: Device | null
  setSelectedDevice: Dispatch<SetStateAction<Device | null>>
  mapMovedByUser: boolean
  setMapMovedByUser: Dispatch<SetStateAction<boolean>>
}

function Map() {
  const auth = useAuth()
  const location = useLocation()
  const { device_id } = location.state || {}

  const [devices, setDevices] = useState<Device[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )
  const [mapMovedByUser, setMapMovedByUser] = useState<boolean>(false)
  const firstLoad = useRef<boolean>(true)

  // Locations tuning
  const [isTuningDialogOpen, setIsTuningDialogOpen] = useState<boolean>(false)
  const [date, setDate] = useState<Dayjs | null>(null)

  useEffect(() => {
    async function fetchDevices() {
      if (!auth) return

      const data = await getDevices(auth.token)
      if (data && data.length > 0) {
        setDevices(data)
        if (firstLoad.current) {
          setSelectedDevice(
            device_id
              ? data.find((device: Device) => device.id === device_id)
              : null
          )
          firstLoad.current = false
        }
      }
    }
    fetchDevices()

    const updateInterval = setInterval(() => fetchDevices(), 60000)
    return () => clearInterval(updateInterval)
  }, [])

  useEffect(() => {
    if (selectedDevice?.latest_location) {
      setDate(dayjs(selectedDevice.latest_location.created_at))
    }
    setSelectedLocation(null)
  }, [selectedDevice])

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
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              padding: 2,
              paddingRight: 4,
              paddingBottom: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                gap: 1,
              }}
            >
              {/* Device selector */}
              <Paper
                sx={{
                  zIndex: 600,
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

              {/* Location details */}
              {selectedDevice && selectedLocation && locations.length > 0 ? (
                <Accordion
                  sx={{
                    zIndex: 500,
                    width: { xs: "100%", sm: "60%", md: "40%", lg: "30%" },
                    gap: 1,
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography variant="subtitle1">Details</Typography>
                      {selectedDevice.latest_location?.id ===
                      selectedLocation.id ? (
                        <Typography color="gray">(latest location)</Typography>
                      ) : (
                        ""
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {selectedLocation.created_at ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                          marginBottom: 0.5,
                        }}
                      >
                        <AccessTimeOutlinedIcon />
                        <Typography>
                          {formatISODate(
                            selectedLocation.created_at.toString()
                          )}
                        </Typography>
                      </Box>
                    ) : (
                      ""
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        marginBottom: 0.5,
                      }}
                    >
                      <PlaceOutlinedIcon />
                      <Typography>
                        {selectedLocation.latitude},{" "}
                        {selectedLocation.longitude}
                      </Typography>
                    </Box>

                    {selectedLocation.accuracy ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                          marginBottom: 0.5,
                        }}
                      >
                        <AdjustOutlinedIcon />
                        <Typography>{selectedLocation.accuracy}</Typography>
                      </Box>
                    ) : (
                      ""
                    )}

                    {selectedLocation.battery ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                          marginBottom: 0.5,
                        }}
                      >
                        <Battery level={selectedLocation.battery} />
                        <Typography>{selectedLocation.battery}%</Typography>
                      </Box>
                    ) : (
                      ""
                    )}
                  </AccordionDetails>
                  <AccordionActions>
                    <IconButton
                      onClick={() => setSelectedLocation(locations[0])}
                      disabled={selectedLocation.id === locations[0].id}
                    >
                      <FirstPageIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        setSelectedLocation(
                          locations[locations.indexOf(selectedLocation) - 1]
                        )
                      }
                      disabled={selectedLocation.id === locations[0].id}
                    >
                      <NavigateBeforeOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        setSelectedLocation(
                          locations[locations.indexOf(selectedLocation) + 1]
                        )
                      }
                      disabled={
                        selectedLocation.id ===
                        locations[locations.length - 1].id
                      }
                    >
                      <NavigateNextOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        setSelectedLocation(locations[locations.length - 1])
                      }
                      disabled={
                        selectedLocation.id ===
                        locations[locations.length - 1].id
                      }
                    >
                      <LastPageIcon />
                    </IconButton>
                  </AccordionActions>
                </Accordion>
              ) : (
                ""
              )}
            </Box>

            <Box
              sx={{
                zIndex: 500,
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              {selectedDevice?.latest_location ? (
                <Paper
                  sx={{
                    padding: 1,
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                  }}
                >
                  {selectedLocation && locations.length > 0 ? (
                    <>
                      <IconButton
                        onClick={() => setSelectedLocation(locations[0])}
                        disabled={selectedLocation.id === locations[0].id}
                      >
                        <FirstPageIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          setSelectedLocation(
                            locations[locations.indexOf(selectedLocation) - 1]
                          )
                        }
                        disabled={selectedLocation.id === locations[0].id}
                      >
                        <NavigateBeforeOutlinedIcon />
                      </IconButton>
                    </>
                  ) : (
                    ""
                  )}

                  <IconButton onClick={() => setIsTuningDialogOpen(true)}>
                    <TuneOutlinedIcon />
                  </IconButton>

                  {selectedLocation && locations.length > 0 ? (
                    <>
                      <IconButton
                        onClick={() =>
                          setSelectedLocation(
                            locations[locations.indexOf(selectedLocation) + 1]
                          )
                        }
                        disabled={
                          selectedLocation.id ===
                          locations[locations.length - 1].id
                        }
                      >
                        <NavigateNextOutlinedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          setSelectedLocation(locations[locations.length - 1])
                        }
                        disabled={
                          selectedLocation.id ===
                          locations[locations.length - 1].id
                        }
                      >
                        <LastPageIcon />
                      </IconButton>
                    </>
                  ) : (
                    ""
                  )}
                </Paper>
              ) : (
                ""
              )}
            </Box>
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
                <PastLocationMarkers
                  selectedDevice={selectedDevice}
                  setSelectedLocation={setSelectedLocation}
                  selectedLocation={selectedLocation}
                  locations={locations}
                  setLocations={setLocations}
                  date={date}
                />
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
      <Dialog
        open={isTuningDialogOpen}
        onClose={() => setIsTuningDialogOpen(false)}
      >
        <Box sx={{ padding: 8 }}>
          <Box>
            <Typography variant="h5">Date</Typography>
            {selectedDevice?.latest_location?.created_at ? (
              <Typography color="gray" variant="subtitle1">
                Latest location:{" "}
                {formatISODate(selectedDevice.latest_location.created_at)}
              </Typography>
            ) : (
              ""
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <DatePicker
                value={date}
                maxDate={dayjs(selectedDevice?.latest_location?.created_at)}
                onChange={(newDate) => {
                  setDate(newDate)
                }}
              />
              <IconButton
                onClick={() =>
                  setDate(dayjs(selectedDevice?.latest_location?.created_at))
                }
              >
                <RestoreOutlinedIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  )
}

function MapUpdater({ device, setMapMovedByUser }: MapUpdaterProps) {
  const map = useMap()

  useEffect(() => {
    if (device && device.latest_location) {
      const { latitude, longitude } = device.latest_location
      map.setView([latitude, longitude], map.getZoom())
      setMapMovedByUser(false)
    }
  }, [device, map])

  return null
}

function MapEventHandler({
  devices,
  selectedDevice,
  setSelectedDevice,
  mapMovedByUser,
  setMapMovedByUser,
}: MapEventHandlerProps) {
  const map = useMap()
  const [centered, setCentered] = useState(false)

  useEffect(() => {
    map.whenReady(() => {
      if (devices.length === 0 || selectedDevice !== null || centered) return

      const devicesWithLocation = devices.filter(
        (device) => device.latest_location
      )
      if (devicesWithLocation.length === 0) return

      const locations: Location[] = devicesWithLocation.map((device) => ({
        id: device.latest_location?.id ?? 0,
        device_id: device.latest_location?.device_id ?? device.id,
        latitude: device.latest_location?.latitude ?? 0,
        longitude: device.latest_location?.longitude ?? 0,
      }))

      if (locations.length === 1 && !mapMovedByUser) {
        setSelectedDevice(devicesWithLocation[0])
      } else {
        map.fitBounds(getBoundsByLocations(locations), { padding: [50, 50] })
        setCentered(true)
      }
    })
  }, [map, devices])

  useMapEvents({
    dragend: () => {
      setMapMovedByUser(true)
    },
    zoomend: () => {
      setMapMovedByUser(true)
    },
  })

  return null
}

export default Map
