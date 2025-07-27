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
import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import {
  getAvailableDatesByDeviceId,
  getDevices,
  getLocationsByDeviceId,
} from "./api"
import { formatISODate, isAllowedDate, isAllowedHour } from "./helpers/utils"
import {
  getBoundsByLocations,
  getGeolocation,
  listLatestLocations,
} from "./helpers/locations"
import { useLocation } from "react-router-dom"
import DevicesAutocomplete from "./components/DevicesAutocomplete"
import "./Map.css"
import { Device, Location } from "./types/types"
import {
  PastLocationMarkers,
  LatestLocationMarkers,
  LocationDetails,
  GeolocationMarker,
} from "./components/map"
import dayjs, { Dayjs } from "dayjs"
import { DatePicker } from "@mui/x-date-pickers"
import { Mark } from "@mui/material/Slider/useSlider.types"
import { useQuery } from "@tanstack/react-query"
import Icon from "@mdi/react"
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiCrosshairs,
  mdiCrosshairsGps,
  mdiFitToScreenOutline,
  mdiHistory,
  mdiMinus,
  mdiPageFirst,
  mdiPageLast,
  mdiPlus,
  mdiTune,
} from "@mdi/js"
import MapControlBar from "./components/map/src/MapControlBar"

interface MapUpdaterProps {
  device: Device | null
}

interface MapEventHandlerProps {
  devices: Device[]
  selectedDevice: Device | null
}

function Map() {
  const location = useLocation()
  const { device_id } = location.state || {}
  const mapRef = useRef<L.Map | null>(null)

  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: () => getDevices(),
  })

  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null)
  const selectedDevice = useMemo<Device | null>(
    () => devices.find((device) => device.id === selectedDeviceId) ?? null,
    [devices, selectedDeviceId]
  )
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )
  const firstLoad = useRef<boolean>(true)

  // Locations tuning
  const [isTuningDialogOpen, setIsTuningDialogOpen] = useState<boolean>(false)
  const [date, setDate] = useState<Dayjs | null>(null)
  const [allowedHours, setAllowedHours] = useState<number[] | null>(null)

  const { data: availableDates = [] } = useQuery<string[]>({
    queryKey: ["available_dates", selectedDevice?.id],
    queryFn: () => getAvailableDatesByDeviceId(selectedDevice!.id),
    enabled: !!selectedDevice,
  })

  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: async () => getGeolocation(),
  })

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["locations", "devices", selectedDevice?.id, date],
    queryFn: async () => {
      const data = await getLocationsByDeviceId(
        selectedDevice!.id,
        date!.startOf("day"),
        date!.endOf("day")
      )
      return data[0].locations
    },
    enabled: !!selectedDevice && !!date && date.isValid(),
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

  const generateSliderMarks = useCallback((): Mark[] => {
    if (locations.length === 0) return []

    const uniqueHours = Array.from(
      new Set(locations.map((location) => dayjs(location.created_at).hour()))
    ).sort((a, b) => a - b)

    return uniqueHours.map((hour) => ({
      value: hour,
    }))
  }, [locations])

  useEffect(() => {
    if (firstLoad.current && devices.length > 0) {
      const devicesWithLocation = devices.filter(
        (device) => device.latest_location
      )

      setSelectedDeviceId(
        device_id
          ? devices.find((d) => d.id === device_id)?.id ?? null
          : devicesWithLocation.length === 1
          ? devicesWithLocation[0].id
          : null
      )

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
          {/* Start box */}
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              padding: 2,
              paddingRight: 4,
              paddingBottom: 4,
              gap: 1,
            }}
          >
            <MapControlBar>
              <IconButton
                onClick={() => {
                  mapRef.current?.zoomIn()
                }}
              >
                <Icon path={mdiPlus} size={1} />
              </IconButton>
              <IconButton
                onClick={() => {
                  mapRef.current?.zoomOut()
                }}
              >
                <Icon path={mdiMinus} size={1} />
              </IconButton>
            </MapControlBar>
            <MapControlBar>
              <IconButton
                onClick={() => {
                  if (selectedDevice === null) {
                    const availableLocations = listLatestLocations(devices)

                    if (!availableLocations) return

                    if (userGeolocation?.coords) {
                      availableLocations.push({
                        id: 0,
                        device_id: 0,
                        accuracy: userGeolocation.coords.accuracy,
                        latitude: userGeolocation.coords.latitude,
                        longitude: userGeolocation.coords.longitude,
                      })
                    }

                    mapRef.current?.fitBounds(
                      getBoundsByLocations(availableLocations),
                      {
                        padding: [50, 50],
                      }
                    )
                  } else {
                    mapRef.current?.fitBounds(getBoundsByLocations(locations))
                  }
                }}
              >
                <Icon path={mdiFitToScreenOutline} size={1} />
              </IconButton>
            </MapControlBar>
            <MapControlBar>
              <IconButton
                onClick={() => {
                  if (userGeolocation?.coords) {
                    setSelectedDeviceId(null)
                    mapRef.current?.fitBounds([
                      [
                        userGeolocation.coords.latitude,
                        userGeolocation.coords.longitude,
                      ],
                    ])
                  }
                }}
              >
                <Icon
                  path={userGeolocation ? mdiCrosshairsGps : mdiCrosshairs}
                  size={1}
                />
              </IconButton>
            </MapControlBar>
          </Box>

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
                  borderRadius: 4,
                }}
              >
                <DevicesAutocomplete
                  devices={devices}
                  selectedDevice={selectedDevice}
                  callback={(device) => setSelectedDeviceId(device?.id ?? null)}
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
                <MapControlBar sx={{ flexDirection: "row" }}>
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
                        <Icon path={mdiPageFirst} size={1} />
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
                        <Icon path={mdiChevronLeft} size={1} />
                      </IconButton>
                    </>
                  ) : (
                    ""
                  )}

                  <IconButton onClick={() => setIsTuningDialogOpen(true)}>
                    <Icon path={mdiTune} size={1} />
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
                        <Icon path={mdiChevronRight} size={1} />
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
                        <Icon path={mdiPageLast} size={1} />
                      </IconButton>
                    </>
                  ) : (
                    ""
                  )}
                </MapControlBar>
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
              <MapControlBar
                sx={{ height: { xs: "60%", sm: "80%" }, paddingY: 3 }}
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
              </MapControlBar>
            ) : (
              ""
            )}
          </Box>

          {devices ? (
            <MapContainer
              ref={mapRef}
              center={[0, 0]}
              zoom={4}
              scrollWheelZoom={true}
            >
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
                  setSelectedDeviceId={setSelectedDeviceId}
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
              {userGeolocation?.coords ? (
                <GeolocationMarker
                  geolocation={userGeolocation.coords}
                  onClick={() => {
                    setSelectedDeviceId(null)
                    mapRef.current?.fitBounds([
                      [
                        userGeolocation.coords.latitude,
                        userGeolocation.coords.longitude,
                      ],
                    ])
                  }}
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
                <Icon path={mdiHistory} size={1} />
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

      const availableLocations = listLatestLocations(devices)
      if (!availableLocations) return

      map.fitBounds(getBoundsByLocations(availableLocations), {
        padding: [50, 50],
      })
      setCentered(true)
    })
  }, [map, devices, centered, selectedDevice])

  return null
}

export default Map
