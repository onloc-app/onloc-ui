import MainAppBar from "./components/MainAppBar"
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Dialog,
  Slider,
  useTheme,
} from "@mui/material"
import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import {
  getAvailableDatesByDeviceId,
  getDevices,
  getLocationsByDeviceId,
} from "./api"
import { formatISODate, isAllowedHour, stringToHexColor } from "./helpers/utils"
import {
  exportToGPX,
  getBoundsByLocations,
  getGeolocation,
  listLatestLocations,
} from "./helpers/locations"
import { useLocation } from "react-router-dom"
import DevicesAutocomplete from "./components/DevicesAutocomplete"
import { Device, Location } from "./types/types"
import {
  AccuracyMarker,
  CustomAttribution,
  DirectionLines,
  GeolocationMarker,
  LocationDetails,
  MapControlBar,
  PastLocationMarker,
} from "./components/map"
import dayjs, { Dayjs } from "dayjs"
import { DatePicker } from "@mui/x-date-pickers"
import { Mark } from "@mui/material/Slider/useSlider.types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Icon from "@mdi/react"
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiCrosshairs,
  mdiCrosshairsGps,
  mdiCrosshairsOff,
  mdiExport,
  mdiFitToScreenOutline,
  mdiGlobeModel,
  mdiHistory,
  mdiMinus,
  mdiPageFirst,
  mdiPageLast,
  mdiPlus,
  mdiTune,
} from "@mdi/js"
import MapGL, { MapRef } from "react-map-gl/maplibre"
import { useColorMode } from "./contexts/ThemeContext"
import { useAuth } from "./contexts/AuthProvider"
import { Severity } from "./types/enums"

function Map() {
  const auth = useAuth()
  const location = useLocation()
  const { device_id } = location.state || {}
  const mapRef = useRef<MapRef>(null)
  const { resolvedMode } = useColorMode()
  const theme = useTheme()
  const queryClient = useQueryClient()

  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false)
  const [shouldFitBounds, setShouldFitBounds] = useState<boolean>(false)
  const [isAttributionOpened, setIsAttributionOpened] = useState<boolean>(false)
  const [isOnCurrentLocation, setIsOnCurrentLocation] = useState<boolean>(false)
  const [mapProjection, setMapProjection] = useState<"globe" | "mercator">(
    "mercator"
  )

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
  const firstLocate = useRef<boolean>(true)

  // Locations tuning
  const [isTuningDialogOpen, setIsTuningDialogOpen] = useState<boolean>(false)
  const [date, setDate] = useState<Dayjs | null>(null)
  const [allowedHours, setAllowedHours] = useState<number[] | null>(null)

  const { data: availableDates = [] } = useQuery<string[]>({
    queryKey: ["available_dates", selectedDevice?.id],
    queryFn: () => getAvailableDatesByDeviceId(selectedDevice!.id),
    enabled: !!selectedDevice,
  })

  const {
    data: userGeolocation = null,
    error: userGeolocationError,
    isError: isUserGeolocationError,
  } = useQuery({
    queryKey: ["geolocation"],
    queryFn: getGeolocation,
    retry: false,
  })

  const { data: locations = [], isFetched: isLocationsFetched } = useQuery<
    Location[]
  >({
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

  const filteredLocations = useMemo<Location[]>(() => {
    if (selectedDeviceId) {
      if (!locations) return []
      if (!allowedHours) return []

      return locations.filter((location) =>
        location.created_at
          ? isAllowedHour(location.created_at, allowedHours)
          : false
      )
    } else {
      const latestLocations = listLatestLocations(devices)
      if (!latestLocations) return []

      // Include the user's current position
      if (userGeolocation) {
        latestLocations.push({
          id: 0,
          device_id: 0,
          longitude: userGeolocation.coords.longitude,
          latitude: userGeolocation.coords.latitude,
        })
      }

      return latestLocations
    }
  }, [allowedHours, locations, devices, selectedDeviceId, userGeolocation])

  const generateSliderMarks = useCallback((): Mark[] => {
    if (locations.length === 0) return []

    const uniqueHours = Array.from(
      new Set(locations.map((location) => dayjs(location.created_at).hour()))
    ).sort((a, b) => a - b)

    return uniqueHours.map((hour) => ({
      value: hour,
    }))
  }, [locations])

  const handleChangeLocation = useCallback((location: Location) => {
    mapRef.current?.flyTo({
      center: [location.longitude, location.latitude],
      zoom: 18,
      bearing: 0,
    })
    setSelectedLocation(location)
  }, [])

  /**
   * Executes only on the first load.
   * Executes only if devices are present.
   * Executes only if the map is loaded.
   *
   * Sets the selected device if an ID for it came with the
   * parameters or sets the only device with a location
   * as the selected one.
   */
  useEffect(() => {
    if (!firstLoad.current) return
    if (!isMapLoaded) return
    if (!devices || devices.length === 0) return

    const devicesWithLocation = devices.filter(
      (device) => device.latest_location
    )

    const deviceId = device_id
      ? devices.find((d) => d.id === device_id)?.id ?? null
      : devicesWithLocation.length === 1
      ? devicesWithLocation[0].id
      : null

    setSelectedDeviceId(deviceId)

    firstLoad.current = false
  }, [device_id, devices, isMapLoaded, filteredLocations])

  /**
   * Whenever filters change, trigger a refit.
   */
  useEffect(() => {
    setShouldFitBounds(true)
  }, [selectedDeviceId, allowedHours, date])

  /**
   * Moves the map to fit the bounds when locations change.
   */
  useEffect(() => {
    if (!isMapLoaded || !shouldFitBounds) return
    if (!filteredLocations || filteredLocations.length === 0) return

    mapRef.current?.fitBounds(getBoundsByLocations(filteredLocations), {
      padding: 150,
      animate: firstLocate.current ? false : true,
    })

    setShouldFitBounds(false)

    // Wait for the data before declaring the first refit as done
    if (isLocationsFetched || !device_id) {
      firstLocate.current = false
    }
  }, [
    firstLocate,
    isMapLoaded,
    selectedDeviceId,
    filteredLocations,
    shouldFitBounds,
    firstLoad,
    isLocationsFetched,
    device_id,
  ])

  /**
   * Sets the date to the device's latest location's timestamp when
   * a it's selected. Also unselects the selected location.
   */
  useEffect(() => {
    if (selectedDevice?.latest_location) {
      setDate(dayjs(selectedDevice.latest_location.created_at))
    }

    setSelectedLocation(null)
  }, [selectedDevice])

  /**
   * Sets the allowed hours to when the selected device has
   * locations available.
   */
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

  /**
   * Unselects the selected location if the allowed hours change
   * and it isn't valid.
   */
  useEffect(() => {
    if (selectedLocation && !filteredLocations.includes(selectedLocation)) {
      setSelectedLocation(null)
    }
  }, [allowedHours, selectedLocation, filteredLocations])

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
              paddingBottom: 4,
              gap: 1,
            }}
          >
            <MapControlBar>
              <IconButton
                onClick={() => {
                  if (mapProjection === "globe") {
                    setMapProjection("mercator")
                  } else {
                    setMapProjection("globe")
                  }
                }}
              >
                <Icon path={mdiGlobeModel} size={1} />
              </IconButton>
            </MapControlBar>
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
                  mapRef.current?.fitBounds(
                    getBoundsByLocations(filteredLocations),
                    {
                      padding: 150,
                    }
                  )
                }}
              >
                <Icon path={mdiFitToScreenOutline} size={1} />
              </IconButton>
            </MapControlBar>
            <MapControlBar>
              <IconButton
                onClick={() => {
                  if (userGeolocation) {
                    mapRef.current?.flyTo({
                      center: [
                        userGeolocation.coords.longitude,
                        userGeolocation.coords.latitude,
                      ],
                      zoom: 18,
                      bearing: 0,
                    })
                    setIsOnCurrentLocation(true)
                  } else {
                    queryClient.invalidateQueries({
                      queryKey: ["geolocation"],
                    })
                    if (isUserGeolocationError) {
                      auth?.throwMessage(
                        userGeolocationError.message,
                        Severity.ERROR
                      )
                    }
                  }
                }}
              >
                <Icon
                  path={
                    userGeolocation
                      ? isOnCurrentLocation
                        ? mdiCrosshairsGps
                        : mdiCrosshairs
                      : mdiCrosshairsOff
                  }
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
              <MapControlBar
                sx={{
                  zIndex: 600,
                  width: { xs: "100%", sm: "60%", md: "40%", lg: "30%" },
                  padding: 2,
                  borderRadius: 4,
                }}
              >
                <DevicesAutocomplete
                  devices={devices}
                  selectedDevice={selectedDevice}
                  callback={(device) => setSelectedDeviceId(device?.id ?? null)}
                />
              </MapControlBar>

              {/* Location details */}
              {selectedDevice && selectedLocation ? (
                <LocationDetails
                  selectedDevice={selectedDevice}
                  selectedLocation={selectedLocation}
                />
              ) : null}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
              }}
            >
              {selectedDevice?.latest_location ? (
                <>
                  <MapControlBar sx={{ flexDirection: "row" }}>
                    {selectedLocation && filteredLocations.length > 0 ? (
                      <>
                        <IconButton
                          onClick={() => {
                            const location = filteredLocations[0]
                            handleChangeLocation(location)
                          }}
                          disabled={
                            selectedLocation.id === filteredLocations[0].id
                          }
                        >
                          <Icon path={mdiPageFirst} size={1} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            const location =
                              filteredLocations[
                                filteredLocations.indexOf(selectedLocation) - 1
                              ]
                            handleChangeLocation(location)
                          }}
                          disabled={
                            selectedLocation.id === filteredLocations[0].id
                          }
                        >
                          <Icon path={mdiChevronLeft} size={1} />
                        </IconButton>
                      </>
                    ) : null}

                    <IconButton onClick={() => setIsTuningDialogOpen(true)}>
                      <Icon path={mdiTune} size={1} />
                    </IconButton>

                    {selectedLocation && filteredLocations.length > 0 ? (
                      <>
                        <IconButton
                          onClick={() => {
                            const location =
                              filteredLocations[
                                filteredLocations.indexOf(selectedLocation) + 1
                              ]
                            handleChangeLocation(location)
                          }}
                          disabled={
                            selectedLocation.id ===
                            filteredLocations[filteredLocations.length - 1].id
                          }
                        >
                          <Icon path={mdiChevronRight} size={1} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            const location =
                              filteredLocations[filteredLocations.length - 1]
                            handleChangeLocation(location)
                          }}
                          disabled={
                            selectedLocation.id ===
                            filteredLocations[filteredLocations.length - 1].id
                          }
                        >
                          <Icon path={mdiPageLast} size={1} />
                        </IconButton>
                      </>
                    ) : null}
                  </MapControlBar>
                  {filteredLocations.length > 0 ? (
                    <MapControlBar>
                      <IconButton
                        onClick={() =>
                          exportToGPX(
                            filteredLocations,
                            `${selectedDevice.name}-${
                              filteredLocations[0].id
                            }-${
                              filteredLocations[filteredLocations.length - 1].id
                            }`
                          )
                        }
                      >
                        <Icon path={mdiExport} size={1} />
                      </IconButton>
                    </MapControlBar>
                  ) : null}
                </>
              ) : null}
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
            ) : null}
          </Box>

          {devices ? (
            <MapGL
              ref={mapRef}
              style={{ borderRadius: 16 }}
              maxPitch={0}
              mapStyle={
                resolvedMode === "dark"
                  ? "https://tiles.immich.cloud/v1/style/dark.json"
                  : "https://tiles.immich.cloud/v1/style/light.json"
              }
              projection={mapProjection}
              attributionControl={false}
              onLoad={() => setIsMapLoaded(true)}
              onMoveStart={() => {
                setIsAttributionOpened(false)
                setIsOnCurrentLocation(false)
              }}
            >
              <CustomAttribution
                open={isAttributionOpened}
                onClick={() => setIsAttributionOpened((prev) => !prev)}
                sx={{ position: "absolute", bottom: 8, right: 8, zIndex: 1000 }}
              />

              {/* User's current location */}
              {userGeolocation ? (
                <GeolocationMarker
                  longitude={userGeolocation.coords.longitude}
                  latitude={userGeolocation.coords.latitude}
                  accuracy={userGeolocation.coords.accuracy}
                  color={theme.palette.primary.main}
                  onClick={() => {
                    mapRef.current?.flyTo({
                      center: [
                        userGeolocation.coords.longitude,
                        userGeolocation.coords.latitude,
                      ],
                      zoom: 18,
                      bearing: 0,
                    })
                    setIsOnCurrentLocation(true)
                  }}
                />
              ) : null}

              {/* Latest locations when no device is selected */}
              {!selectedDevice
                ? devices.map((device) => {
                    if (device.latest_location) {
                      const longitude = device.latest_location.longitude
                      const latitude = device.latest_location.latitude
                      const accuracy = device.latest_location.accuracy

                      return (
                        <AccuracyMarker
                          id={device.latest_location.id}
                          longitude={longitude}
                          latitude={latitude}
                          accuracy={accuracy}
                          color={stringToHexColor(device.name)}
                          onClick={() => setSelectedDeviceId(device.id)}
                        />
                      )
                    }
                    return null
                  })
                : null}

              {/* Locations of the selected device */}
              {selectedDevice
                ? (() => {
                    const deviceLocations = locations
                      .filter(
                        (location) => location.device_id === selectedDevice.id
                      )
                      .filter(
                        (location) =>
                          location.created_at &&
                          isAllowedHour(location.created_at, allowedHours)
                      )

                    return (
                      <>
                        {/* Draw the lines */}
                        {selectedDeviceId ? (
                          <DirectionLines
                            key={selectedDeviceId}
                            id={selectedDeviceId}
                            locations={deviceLocations}
                            color={stringToHexColor(selectedDevice.name)}
                          />
                        ) : null}

                        {/* Draw the markers */}
                        {deviceLocations.map((location) =>
                          selectedDevice.latest_location?.id === location.id ? (
                            <AccuracyMarker
                              key={location.id}
                              id={location.id}
                              longitude={location.longitude}
                              latitude={location.latitude}
                              accuracy={location.accuracy}
                              color={stringToHexColor(selectedDevice.name)}
                              onClick={() => handleChangeLocation(location)}
                            />
                          ) : (
                            <PastLocationMarker
                              key={location.id}
                              id={location.id}
                              longitude={location.longitude}
                              latitude={location.latitude}
                              accuracy={
                                selectedLocation?.id === location.id
                                  ? location.accuracy
                                  : null
                              }
                              color={stringToHexColor(selectedDevice.name)}
                              onClick={() => handleChangeLocation(location)}
                            />
                          )
                        )}
                      </>
                    )
                  })()
                : null}
            </MapGL>
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
            ) : null}
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

export default Map
