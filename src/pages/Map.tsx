import {
  getAvailableDatesByDeviceId,
  getDevices,
  getLocationsByDeviceId,
  getSharedDevices,
} from "@/api"
import {
  AccuracyMarker,
  BottomActions,
  ClusterMarker,
  CustomAttribution,
  DirectionLines,
  EndActions,
  GeolocationMarker,
  MainAppBar,
  MapCanvas,
  PastLocationMarker,
  StartActions,
  TopActions,
} from "@/components"
import { useColorMode } from "@/contexts/ThemeContext"
import {
  fitBounds,
  getGeolocation,
  listLatestLocations,
} from "@/helpers/locations"
import { isAllowedHour, stringToHexColor } from "@/helpers/utils"
import useClusters from "@/hooks/useClusters"
import useDateRange from "@/hooks/useDateRange"
import { useSettings } from "@/hooks/useSettings"
import { MapProjection, NavOptions } from "@/types/enums"
import { type Device, type Location } from "@/types/types"
import { Box, CircularProgress } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { throttle } from "lodash"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import MapGL, { type MapRef } from "react-map-gl/maplibre"
import { useLocation } from "react-router-dom"

export default function Map() {
  const location = useLocation()
  const { device_id } = location.state || {}
  const mapRef = useRef<MapRef>(null)
  const { resolvedMode } = useColorMode()
  const { defaultProjection, mapAnimations } = useSettings()

  const [viewState, setViewState] = useState({
    bounds: [0, 0, 0, 0],
    zoom: 0,
  })
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false)
  const [shouldFitBounds, setShouldFitBounds] = useState<boolean>(false)
  const [isAttributionOpened, setIsAttributionOpened] = useState<boolean>(false)
  const [isOnCurrentLocation, setIsOnCurrentLocation] = useState<boolean>(false)

  // Map projection setting
  const [mapProjection, setMapProjection] =
    useState<MapProjection>(defaultProjection)
  useEffect(() => {
    setMapProjection(defaultProjection)
  }, [defaultProjection])

  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: getDevices,
  })

  const { data: sharedDevices = [] } = useQuery<Device[]>({
    queryKey: ["shared_devices"],
    queryFn: getSharedDevices,
  })

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const selectedDevice = useMemo<Device | null>(() => {
    const device = [...devices, ...sharedDevices].find(
      (device) => device.id === selectedDeviceId,
    )
    return device ?? null
  }, [devices, sharedDevices, selectedDeviceId])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  )

  const firstLoad = useRef<boolean>(true)
  const firstLocate = useRef<boolean>(true)

  // Locations tuning
  const dateRange = useDateRange()
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isDateRange,
    setIsDateRange,
  } = dateRange
  const [allowedHours, setAllowedHours] = useState<number[] | null>(null)

  const { data: availableDates = [] } = useQuery<string[]>({
    queryKey: ["available_dates", selectedDevice?.id],
    queryFn: () => getAvailableDatesByDeviceId(selectedDevice!.id),
    enabled: !!selectedDevice,
  })

  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: getGeolocation,
    retry: false,
  })

  // Fetch locations from the server
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: [
      "locations",
      "devices",
      "shared_devices",
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
      const latestLocations = listLatestLocations([
        ...devices,
        ...sharedDevices,
      ])
      if (!latestLocations) return []

      // Include the user's current position
      if (userGeolocation) {
        latestLocations.push({
          id: "-1",
          device_id: "-1",
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
    sharedDevices,
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

  const handleChangeLocation = useCallback(
    (location: Location) => {
      mapRef.current?.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 18,
        bearing: 0,
        pitch: 0,
        animate: mapAnimations,
      })
      setSelectedLocation(location)
    },
    [mapAnimations],
  )

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

    const devicesWithLocation = [...devices, ...sharedDevices].filter(
      (device) => device.latest_location,
    )

    const deviceId = device_id
      ? (devicesWithLocation.find((device) => device.id === device_id)?.id ??
        null)
      : devicesWithLocation.length === 1
        ? devicesWithLocation[0].id
        : null

    setSelectedDeviceId(deviceId)

    firstLoad.current = false
  }, [device_id, devices, sharedDevices, isMapLoaded, filteredLocations])

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

    if (mapRef.current) {
      fitBounds(
        mapRef.current,
        filteredLocations,
        !firstLocate.current && mapAnimations,
      )
    }

    setShouldFitBounds(false)
  }, [isMapLoaded, filteredLocations, shouldFitBounds, mapAnimations])

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
      <MainAppBar selectedNav={NavOptions.MAP} />
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
            width: 1,
            height: 1,
            padding: 1,
            position: "relative",
          }}
        >
          {devices ? (
            <MapGL
              ref={mapRef}
              style={{ borderRadius: 16 }}
              mapStyle={
                resolvedMode === "dark" ? "/maps/dark.json" : "/maps/light.json"
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

              <MapCanvas
                startBox={() => (
                  <StartActions
                    locations={filteredLocations}
                    mapProjection={mapProjection}
                    onMapProjectionClick={setMapProjection}
                    isOnCurrentLocation={isOnCurrentLocation}
                    onCurrentLocationClick={setIsOnCurrentLocation}
                  />
                )}
                endBox={() => {
                  return (
                    <EndActions
                      locations={locations}
                      allowedHours={allowedHours}
                      onChange={setAllowedHours}
                      selectedDevice={selectedDevice}
                      isDateRange={isDateRange}
                    />
                  )
                }}
                topBox={() => (
                  <TopActions
                    selectedDevice={selectedDevice}
                    selectedLocation={selectedLocation}
                    callback={(device) => {
                      setSelectedDeviceId(device?.id ?? null)
                      firstLocate.current = false
                    }}
                  />
                )}
                bottomBox={() => (
                  <BottomActions
                    locations={filteredLocations}
                    selectedDevice={selectedDevice}
                    selectedLocation={selectedLocation}
                    onLocationChange={handleChangeLocation}
                    dateRange={dateRange}
                    availableDates={availableDates}
                  />
                )}
              />

              {/* User's current location */}
              {userGeolocation ? (
                <GeolocationMarker
                  onClick={() => {
                    mapRef.current?.flyTo({
                      center: [
                        userGeolocation.coords.longitude,
                        userGeolocation.coords.latitude,
                      ],
                      zoom: 18,
                      bearing: 0,
                      pitch: 0,
                      animate: mapAnimations,
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

              {/* Latest locations of shared devices */}
              {!selectedDevice
                ? sharedDevices.map((device) => {
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
                          shape="triangle"
                          onClick={() => {
                            setSelectedDeviceId(device.id)
                            firstLocate.current = false
                          }}
                        />
                      )
                    }
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
                                        animate: mapAnimations,
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
    </>
  )
}
