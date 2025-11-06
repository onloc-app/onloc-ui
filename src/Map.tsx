import {
  getAvailableDatesByDeviceId,
  getDevices,
  getLocationsByDeviceId,
} from "@/api"
import {
  AccuracyMarker,
  ClusterMarker,
  CustomAttribution,
  DateRangePicker,
  DevicesAutocomplete,
  DirectionLines,
  GeolocationMarker,
  LocationDetails,
  MainAppBar,
  MapControlBar,
  PastLocationMarker,
} from "@/components"
import { useAuth } from "@/contexts/AuthProvider"
import { useColorMode } from "@/contexts/ThemeContext"
import {
  exportToGPX,
  getBoundsByLocations,
  getGeolocation,
  listLatestLocations,
} from "@/helpers/locations"
import { formatISODate, isAllowedHour, stringToHexColor } from "@/helpers/utils"
import useClusters from "@/hooks/useClusters"
import useDateRange from "@/hooks/useDateRange"
import { Severity } from "@/types/enums"
import { type Device, type Location, type Preference } from "@/types/types"
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiCompassOutline,
  mdiCrosshairs,
  mdiCrosshairsGps,
  mdiCrosshairsOff,
  mdiExport,
  mdiFitToScreenOutline,
  mdiGlobeModel,
  mdiMinus,
  mdiPageFirst,
  mdiPageLast,
  mdiPlus,
  mdiTune,
} from "@mdi/js"
import Icon from "@mdi/react"
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Slider,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material"
import type { Mark } from "@mui/material/Slider/useSlider.types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { throttle } from "lodash"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import MapGL, { type MapRef } from "react-map-gl/maplibre"
import { useLocation } from "react-router-dom"
import { getPreferenceByKey } from "./api/src/preferenceApi"

function Map() {
  const auth = useAuth()
  const location = useLocation()
  const { device_id } = location.state || {}
  const mapRef = useRef<MapRef>(null)
  const { resolvedMode } = useColorMode()
  const theme = useTheme()
  const queryClient = useQueryClient()

  const [viewState, setViewState] = useState({
    bounds: [0, 0, 0, 0],
    zoom: 0,
  })
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false)
  const [shouldFitBounds, setShouldFitBounds] = useState<boolean>(false)
  const [isAttributionOpened, setIsAttributionOpened] = useState<boolean>(false)
  const [isOnCurrentLocation, setIsOnCurrentLocation] = useState<boolean>(false)
  const [mapProjection, setMapProjection] = useState<"globe" | "mercator">(
    "mercator",
  )

  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: () => getDevices(),
  })

  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null)
  const selectedDevice = useMemo<Device | null>(
    () => devices.find((device) => device.id === selectedDeviceId) ?? null,
    [devices, selectedDeviceId],
  )
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  )

  const firstLoad = useRef<boolean>(true)
  const firstLocate = useRef<boolean>(true)

  // Locations tuning
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isDateRange,
    setIsDateRange,
  } = useDateRange()
  const [isTuningDialogOpen, setIsTuningDialogOpen] = useState<boolean>(false)
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

  // Fetch locations from the server
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: [
      "locations",
      "devices",
      selectedDevice?.id,
      startDate,
      endDate,
      isDateRange,
    ],
    queryFn: async () => {
      const data = await getLocationsByDeviceId(
        selectedDevice!.id,
        startDate!.startOf("day"),
        isDateRange && endDate
          ? endDate!.endOf("day")
          : startDate!.endOf("day"),
      )
      return data[0].locations
    },
    enabled: !!selectedDevice && !!startDate && startDate.isValid(),
  })

  // Fetch the map's default projection preference
  const { data: projectionPreference } = useQuery<Preference>({
    queryKey: ["user_preferences"],
    queryFn: () => getPreferenceByKey("defaultProjection"),
  })

  useEffect(() => {
    const projection = projectionPreference?.value

    if (
      projection &&
      isMapLoaded &&
      (projection === "globe" || projection === "mercator")
    ) {
      setMapProjection(projection)
    }
  }, [projectionPreference, isMapLoaded])

  /**
   * Filter locations to only show valid ones and include the user's current location.
   * Example: locations that are in the user's selected date and time frame.
   */
  const filteredLocations = useMemo<Location[]>(() => {
    if (selectedDeviceId) {
      if (!locations) return []
      if (!allowedHours) return []

      let formattedAllowedHours = allowedHours

      if (isDateRange) {
        formattedAllowedHours = [0, 23]
      }

      return locations.filter((location) =>
        location.created_at
          ? isAllowedHour(location.created_at, formattedAllowedHours)
          : false,
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
  }, [
    allowedHours,
    locations,
    devices,
    selectedDeviceId,
    userGeolocation,
    isDateRange,
  ])

  // Cluster hook to pack a bunch of closely located markers together.
  const { clusters, index: clustersIndex } = useClusters(
    filteredLocations,
    viewState.bounds,
    viewState.zoom,
  )

  const generateSliderMarks = useCallback((): Mark[] => {
    if (locations.length === 0) return []

    const uniqueHours = Array.from(
      new Set(locations.map((location) => dayjs(location.created_at).hour())),
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
      pitch: 0,
    })
    setSelectedLocation(location)
  }, [])

  function fitBounds(locations: Location[], animate: boolean = true) {
    switch (locations.length) {
      case 0:
        break
      case 1:
        mapRef.current?.flyTo({
          center: [locations[0].longitude, locations[0].latitude],
          zoom: 14,
          bearing: 0,
          pitch: 0,
          animate: animate,
        })
        break
      default:
        mapRef.current?.fitBounds(getBoundsByLocations(locations), {
          padding: 150,
          bearing: 0,
          pitch: 0,
          animate: animate,
        })
        break
    }
  }

  /**
   * The logic to execute when the map moves.
   */
  const handleMapMove = useMemo(
    () =>
      throttle(() => {
        if (mapRef.current) {
          setViewState({
            bounds: mapRef.current.getBounds().toArray().flat(),
            zoom: mapRef.current.getZoom(),
          })
        }
      }, 200),
    [],
  )

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
      (device) => device.latest_location,
    )

    const deviceId = device_id
      ? (devices.find((device) => device.id === device_id)?.id ?? null)
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
  }, [selectedDeviceId, allowedHours])

  /**
   * Moves the map to fit the bounds when locations change.
   */
  useEffect(() => {
    if (!isMapLoaded || !shouldFitBounds) return
    if (!filteredLocations || filteredLocations.length === 0) return

    fitBounds(filteredLocations, !firstLocate.current)

    setShouldFitBounds(false)
  }, [isMapLoaded, filteredLocations, shouldFitBounds])

  /**
   * Unselects the selected location when selected device changes.
   */
  useEffect(() => {
    setSelectedLocation(null)
  }, [selectedDevice])

  /**
   * Sets the date to the device's latest location's timestamp when
   * a it's selected. Also resets end date.
   */
  useEffect(() => {
    if (selectedDevice?.latest_location) {
      setStartDate(dayjs(selectedDevice.latest_location.created_at))
    } else {
      setIsDateRange(false)
      setEndDate(null)
    }
  }, [selectedDevice, setStartDate, setIsDateRange, setEndDate])

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
        locations.map((location) => dayjs(location.created_at).hour()),
      ),
    ].sort((a, b) => a - b)

    setAllowedHours([hours[0], hours[hours.length - 1]])
  }, [locations])

  /**
   * Unselects the selected location if the allowed hours change
   * and it isn't valid.
   */
  useEffect(() => {
    if (
      selectedLocation &&
      !filteredLocations.some(
        (location) => location.id === selectedLocation?.id,
      )
    ) {
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
              <Tooltip title="Change the map's projection" placement="right">
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
              </Tooltip>
            </MapControlBar>
            <MapControlBar>
              <Tooltip title="Zoom in" placement="right">
                <IconButton
                  onClick={() => {
                    mapRef.current?.zoomIn()
                  }}
                >
                  <Icon path={mdiPlus} size={1} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom out" placement="right">
                <IconButton
                  onClick={() => {
                    mapRef.current?.zoomOut()
                  }}
                >
                  <Icon path={mdiMinus} size={1} />
                </IconButton>
              </Tooltip>
            </MapControlBar>
            <MapControlBar>
              <Tooltip title="Fit bounds" placement="right">
                <IconButton
                  onClick={() => {
                    fitBounds(filteredLocations)
                  }}
                >
                  <Icon path={mdiFitToScreenOutline} size={1} />
                </IconButton>
              </Tooltip>
            </MapControlBar>
            <MapControlBar>
              <Tooltip title="Reset heading and pitch" placement="right">
                <IconButton
                  onClick={() => {
                    mapRef.current?.resetNorthPitch()
                  }}
                >
                  <Icon path={mdiCompassOutline} size={1} />
                </IconButton>
              </Tooltip>
            </MapControlBar>
            <MapControlBar>
              <Tooltip title="Go to current location" placement="right">
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
                        pitch: 0,
                      })
                      setIsOnCurrentLocation(true)
                    } else {
                      queryClient.invalidateQueries({
                        queryKey: ["geolocation"],
                      })
                      if (isUserGeolocationError) {
                        auth?.throwMessage(
                          userGeolocationError.message,
                          Severity.ERROR,
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
              </Tooltip>
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
                  callback={(device) => {
                    setSelectedDeviceId(device?.id ?? null)
                    firstLocate.current = false
                  }}
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
                        <Tooltip title="Go to the first location">
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
                        </Tooltip>

                        <Tooltip title="Go to previous location">
                          <IconButton
                            onClick={() => {
                              const location =
                                filteredLocations[
                                  filteredLocations.indexOf(selectedLocation) -
                                    1
                                ]
                              handleChangeLocation(location)
                            }}
                            disabled={
                              selectedLocation.id === filteredLocations[0].id
                            }
                          >
                            <Icon path={mdiChevronLeft} size={1} />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : null}

                    <Tooltip title="Tune locations settings">
                      <IconButton onClick={() => setIsTuningDialogOpen(true)}>
                        <Icon path={mdiTune} size={1} />
                      </IconButton>
                    </Tooltip>

                    {selectedLocation && filteredLocations.length > 0 ? (
                      <>
                        <Tooltip title="Go to next location">
                          <IconButton
                            onClick={() => {
                              const location =
                                filteredLocations[
                                  filteredLocations.indexOf(selectedLocation) +
                                    1
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
                        </Tooltip>

                        <Tooltip title="Go to the last location">
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
                        </Tooltip>
                      </>
                    ) : null}
                  </MapControlBar>
                  {filteredLocations.length > 0 ? (
                    <MapControlBar>
                      <Tooltip title="Export to gpx">
                        <IconButton
                          onClick={() =>
                            exportToGPX(
                              filteredLocations,
                              `${selectedDevice.name}-${
                                filteredLocations[0].id
                              }-${
                                filteredLocations[filteredLocations.length - 1]
                                  .id
                              }`,
                            )
                          }
                        >
                          <Icon path={mdiExport} size={1} />
                        </IconButton>
                      </Tooltip>
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
            {selectedDevice && allowedHours && !isDateRange ? (
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
              onMove={handleMapMove}
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
                      pitch: 0,
                    })
                    setIsOnCurrentLocation(true)
                    firstLocate.current = false
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
                          key={device.id}
                          id={device.id}
                          longitude={longitude}
                          latitude={latitude}
                          accuracy={accuracy}
                          color={stringToHexColor(device.name)}
                          onClick={() => {
                            setSelectedDeviceId(device.id)
                            firstLocate.current = false
                          }}
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
                        (location) => location.device_id === selectedDevice.id,
                      )
                      .filter(
                        (location) =>
                          location.created_at &&
                          isAllowedHour(location.created_at, allowedHours),
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
                        {clusters.map((cluster) => {
                          const [longitude, latitude] =
                            cluster.geometry.coordinates

                          if (cluster.properties.cluster) {
                            const count = cluster.properties.point_count

                            if (cluster.id) {
                              return (
                                <ClusterMarker
                                  key={cluster.id}
                                  id={cluster.id}
                                  longitude={longitude}
                                  latitude={latitude}
                                  count={count}
                                  color={stringToHexColor(selectedDevice.name)}
                                  onClick={() => {
                                    if (typeof cluster.id === "number") {
                                      const expansionZoom =
                                        clustersIndex.getClusterExpansionZoom(
                                          cluster.id,
                                        )
                                      mapRef.current?.flyTo({
                                        center: [longitude, latitude],
                                        zoom: expansionZoom,
                                        bearing: 0,
                                        pitch: 0,
                                      })
                                    }
                                  }}
                                />
                              )
                            }
                          }

                          const location = cluster.properties as Location

                          return selectedDevice.latest_location?.id ===
                            location.id ? (
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
                        })}
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
            <DateRangePicker
              dateRangeState={{
                startDate,
                setStartDate,
                endDate,
                setEndDate,
                isDateRange,
                setIsDateRange,
              }}
              availableDates={availableDates}
              selectedDevice={selectedDevice}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  )
}

export default Map
