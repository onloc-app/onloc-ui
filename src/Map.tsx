import { useAuth } from "./contexts/AuthProvider"
import MainAppBar from "./components/MainAppBar"
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  IconButton,
  Dialog,
  Slider,
} from "@mui/material"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import "./leaflet.css"
import { useEffect, useState, useRef, useCallback } from "react"
import {
  getAvailableDatesByDeviceId,
  getDevices,
  getLocationsByDeviceId,
} from "./api/index"
import {
  formatISODate,
  getBoundsByLocations,
  isAllowedDate,
  isAllowedHour,
} from "./utils/utils"
import { useLocation } from "react-router-dom"
import DevicesAutocomplete from "./components/DevicesAutocomplete"
import "./Map.css"
import { Device, Location } from "./types/types"
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
import { Mark } from "@mui/material/Slider/useSlider.types"
import { useQuery } from "@tanstack/react-query"
import LocationDetails from "./components/LocationDetails"

interface MapUpdaterProps {
  device: Device | null
}

interface MapEventHandlerProps {
  devices: Device[]
  selectedDevice: Device | null
}

function Map() {
  const auth = useAuth()
  const location = useLocation()
  const { device_id } = location.state || {}

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )
  const firstLoad = useRef<boolean>(true)

  // Locations tuning
  const [isTuningDialogOpen, setIsTuningDialogOpen] = useState<boolean>(false)
  const [date, setDate] = useState<Dayjs | null>(null)
  const [allowedHours, setAllowedHours] = useState<number[] | null>(null)

  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: () => {
      if (!auth) return
      return getDevices()
    },
  })

  const { data: availableDates = [] } = useQuery<string[]>({
    queryKey: ["available_dates", selectedDevice?.id],
    queryFn: () => {
      if (!auth || !selectedDevice) return []
      return getAvailableDatesByDeviceId(selectedDevice.id)
    },
  })

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["locations", selectedDevice?.id, date],
    queryFn: async () => {
      if (!auth || !selectedDevice || !date || !date.isValid()) return []
      const data = await getLocationsByDeviceId(
        selectedDevice.id,
        date.startOf("day"),
        date.endOf("day")
      )
      return data[0].locations
    },
  })

  const generateFilteredLocations = useCallback(() => {
    return allowedHours
      ? locations.filter((location) => {
          if (location.created_at) {
            return (
              dayjs(location.created_at).hour() >= allowedHours[0] &&
              dayjs(location.created_at).hour() <= allowedHours[1]
            )
          } else {
            return null
          }
        })
      : locations
  }, [allowedHours, locations])

  useEffect(() => {
    if (firstLoad.current && devices.length > 0) {
      setSelectedDevice(
        device_id
          ? devices.find((device: Device) => device.id === device_id)
          : null
      )

      const devicesWithLocation = devices.filter(
        (device: Device) => device.latest_location
      )

      if (devicesWithLocation.length === 1) {
        setSelectedDevice(devicesWithLocation[0])
      }
      firstLoad.current = false
    }
  }, [device_id, devices])

  useEffect(() => {
    if (selectedDevice?.latest_location) {
      setDate(dayjs(selectedDevice.latest_location.created_at))
    }
    setSelectedLocation(null)
  }, [selectedDevice])

  useEffect(() => {
    setSelectedLocation(null)

    if (locations.length === 0) {
      setAllowedHours(null)
      return
    }

    const hours = [
      ...new Set(
        locations.map((location) => dayjs(location.created_at).hour())
      ),
    ].sort((a, b) => a - b)

    setAllowedHours([hours[0], hours[hours.length - 1]])
  }, [locations])

  useEffect(() => {
    if (
      selectedLocation &&
      !generateFilteredLocations().includes(selectedLocation)
    ) {
      setSelectedLocation(null)
    }
  }, [allowedHours, selectedLocation, generateFilteredLocations])

  const generateSliderMarks = useCallback((): Mark[] => {
    if (locations.length === 0) return []

    const uniqueHours = Array.from(
      new Set(locations.map((location) => dayjs(location.created_at).hour()))
    ).sort((a, b) => a - b)

    return uniqueHours.map((hour) => ({
      value: hour,
    }))
  }, [locations])

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
          {/* Center box */}
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
              {selectedDevice && selectedLocation ? (
                <LocationDetails
                  selectedDevice={selectedDevice}
                  selectedLocation={selectedLocation}
                />
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
                  {selectedLocation &&
                  generateFilteredLocations().length > 0 ? (
                    <>
                      <IconButton
                        onClick={() =>
                          setSelectedLocation(generateFilteredLocations()[0])
                        }
                        disabled={
                          selectedLocation.id ===
                          generateFilteredLocations()[0].id
                        }
                      >
                        <FirstPageIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          setSelectedLocation(
                            generateFilteredLocations()[
                              generateFilteredLocations().indexOf(
                                selectedLocation
                              ) - 1
                            ]
                          )
                        }
                        disabled={
                          selectedLocation.id ===
                          generateFilteredLocations()[0].id
                        }
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

                  {selectedLocation &&
                  generateFilteredLocations().length > 0 ? (
                    <>
                      <IconButton
                        onClick={() =>
                          setSelectedLocation(
                            generateFilteredLocations()[
                              generateFilteredLocations().indexOf(
                                selectedLocation
                              ) + 1
                            ]
                          )
                        }
                        disabled={
                          selectedLocation.id ===
                          generateFilteredLocations()[
                            generateFilteredLocations().length - 1
                          ].id
                        }
                      >
                        <NavigateNextOutlinedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          setSelectedLocation(
                            generateFilteredLocations()[
                              generateFilteredLocations().length - 1
                            ]
                          )
                        }
                        disabled={
                          selectedLocation.id ===
                          generateFilteredLocations()[
                            generateFilteredLocations().length - 1
                          ].id
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

          {/* End box */}
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              padding: 2,
              paddingRight: 4,
              paddingBottom: 4,
            }}
          >
            {selectedDevice && allowedHours ? (
              <Paper
                sx={{
                  zIndex: 500,
                  height: { xs: "60%", sm: "80%" },
                  marginTop: { xs: 10, sm: 0 },
                  paddingX: 2,
                  paddingY: 4,
                }}
              >
                <Slider
                  orientation="vertical"
                  min={0}
                  max={23}
                  step={null}
                  marks={generateSliderMarks()}
                  valueLabelDisplay="auto"
                  value={allowedHours}
                  onChange={(_, newValue, activeThumb) => {
                    if (activeThumb === 0) {
                      setAllowedHours((prevValue) => [
                        (newValue as number[])[0],
                        prevValue![1],
                      ])
                    } else {
                      setAllowedHours((prevValue) => [
                        prevValue![0],
                        (newValue as number[])[1],
                      ])
                    }
                  }}
                />
              </Paper>
            ) : (
              ""
            )}
          </Box>

          {devices ? (
            <MapContainer center={[0, 0]} zoom={4} scrollWheelZoom={true}>
              <MapUpdater device={selectedDevice} />
              <MapEventHandler
                devices={devices}
                selectedDevice={selectedDevice}
              />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {(selectedDevice?.latest_location?.created_at &&
                isAllowedHour(
                  selectedDevice.latest_location.created_at,
                  allowedHours
                ) &&
                isAllowedDate(
                  selectedDevice.latest_location.created_at,
                  date
                )) ||
              !selectedDevice ? (
                <LatestLocationMarkers
                  devices={devices}
                  selectedDevice={selectedDevice}
                  setSelectedDevice={setSelectedDevice}
                />
              ) : (
                ""
              )}
              {selectedDevice ? (
                <PastLocationMarkers
                  selectedDevice={selectedDevice}
                  setSelectedLocation={setSelectedLocation}
                  selectedLocation={selectedLocation}
                  locations={locations}
                  allowedHours={allowedHours}
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
        <Box sx={{ padding: { xs: 2, sm: 4 } }}>
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
                shouldDisableDate={(day) => {
                  if (availableDates.length === 0) return true
                  const formatted = day.format("YYYY-MM-DD")
                  return !availableDates.includes(formatted)
                }}
                onChange={(newDate) => setDate(newDate)}
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

function MapUpdater({ device }: MapUpdaterProps) {
  const map = useMap()

  useEffect(() => {
    if (device && device.latest_location) {
      const { latitude, longitude } = device.latest_location
      map.setView([latitude, longitude], map.getZoom())
    }
  }, [device, map])

  return null
}

function MapEventHandler({ devices, selectedDevice }: MapEventHandlerProps) {
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

      map.fitBounds(getBoundsByLocations(locations), { padding: [50, 50] })
      setCentered(true)
    })
  }, [map, devices, centered, selectedDevice])

  return null
}

export default Map
