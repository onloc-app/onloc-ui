import {
  AccuracyMarker,
  BottomActions,
  ClusterMarker,
  CustomAttribution,
  DeviceMarkers,
  DirectionLines,
  EndActions,
  GeolocationMarker,
  LocationHistoryMarkers,
  MainAppShell,
  MapCanvas,
  PastLocationMarker,
  StartActions,
  TopActions,
} from "@/components"
import { useColorMode } from "@/contexts/ThemeContext"
import { fitBounds, listLatestLocations } from "@/helpers/locations"
import { isAllowedHour, stringToHexColor } from "@/helpers/utils"
import useClusters from "@/hooks/useClusters"
import useDateRange from "@/hooks/useDateRange"
import useMapData from "@/hooks/useMapData"
import { useSettings } from "@/hooks/useSettings"
import { MapProjection, NavOptions } from "@/types/enums"
import { type Device, type Location } from "@/types/types"
import { Flex, Skeleton } from "@mantine/core"
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
    if (!isMapLoaded) return
    setMapProjection(defaultProjection)
  }, [defaultProjection, isMapLoaded])

  // Shared devices avatar setting
  const [showAvatars, setShowAvatars] = useState(true)

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
  const [allowedHours, setAllowedHours] = useState<[number, number] | null>(
    null,
  )
  const [restrictedHours, setRestrictedHours] = useState<
    [number, number] | null
  >(null)

  const [selectedDeviceId, setSelectedDeviceId] = useState<bigint | null>(null)

  // Load data
  const {
    devices,
    isDevicesLoading,
    sharedDevices,
    sharedUsers,
    locations,
    availableDates,
    userGeolocation,
  } = useMapData(selectedDeviceId, startDate, endDate, isDateRange)

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

  // Auto-focus
  const [autoFocus, setAutoFocus] = useState(true)
  const handleToggleAutoFocus = (value: boolean) => {
    setAutoFocus(value)
    if (!selectedDevice?.latest_location) return
    if (value) {
      const location = filteredLocations.find(
        (l) => l.id === selectedDevice.latest_location?.id,
      )
      if (location) handleChangeLocation(location)
    }
  }

  /**
   * Filter locations to only show valid ones and include the user's current location.
   * Example: locations that are in the user's selected date and time frame.
   */
  const filteredLocations = useMemo<Location[]>(() => {
    if (selectedDeviceId) {
      if (!locations) return []
      if (!restrictedHours) return []

      let formattedRestrictedHours = restrictedHours

      if (isDateRange) {
        formattedRestrictedHours = [0, 23]
      }

      return locations.filter((location) =>
        location.created_at
          ? isAllowedHour(location.created_at, formattedRestrictedHours)
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
          id: -1n,
          device_id: -1n,
          longitude: userGeolocation.coords.longitude,
          latitude: userGeolocation.coords.latitude,
        })
      }

      return latestLocations
    }
  }, [
    restrictedHours,
    locations,
    devices,
    sharedDevices,
    selectedDeviceId,
    userGeolocation,
    isDateRange,
  ])

  // Cluster hook to pack a bunch of closely located markers together.
  const { clusters: pastLocationClusters, index: pastLocationClustersIndex } =
    useClusters(filteredLocations, viewState.bounds, viewState.zoom)

  // Clusters for the latest locations (no device selected).
  const {
    clusters: latestLocationClusters,
    index: latestLocationClustersIndex,
  } = useClusters(
    [...devices, ...sharedDevices]
      .map((d) => d.latest_location)
      .filter(Boolean) as Location[],
    viewState.bounds,
    viewState.zoom,
    24,
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
  }, [selectedDeviceId, restrictedHours])

  /**
   * Moves the map to fit the bounds when locations change.
   * Handles auto-focus
   */
  useEffect(() => {
    if (!isMapLoaded || !shouldFitBounds) return
    if (!filteredLocations || filteredLocations.length === 0) return
    if (!mapRef.current) return

    if (autoFocus && selectedDevice?.latest_location) {
      const location = filteredLocations.find(
        (l) => l.id === selectedDevice.latest_location?.id,
      )
      if (location) handleChangeLocation(location)
    } else {
      if (!selectedDevice) {
        fitBounds(
          mapRef.current,
          filteredLocations,
          !firstLocate.current && mapAnimations,
        )
      }
    }

    setShouldFitBounds(false)
  }, [
    isMapLoaded,
    filteredLocations,
    shouldFitBounds,
    mapAnimations,
    selectedDevice,
    autoFocus,
    handleChangeLocation,
  ])

  /**
   * Unselects the selected location when selected device changes.
   */
  useEffect(() => {
    setSelectedLocation(null)
  }, [selectedDeviceId])

  /**
   * Sets the date to the device's latest location's timestamp when
   * it's selected.
   */
  useEffect(() => {
    if (selectedDevice?.latest_location) {
      const date = dayjs(selectedDevice.latest_location.created_at)
      setStartDate(date)
      setEndDate(date)
    }
  }, [selectedDevice, setStartDate, setIsDateRange, setEndDate])

  /**
   * Sets the allowed hours and restricted hours to when
   * the selected device has locations available.
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
    setRestrictedHours([hours[0], hours[hours.length - 1]])
  }, [locations])

  /**
   * Unselects the selected location when the date changes
   */
  useEffect(() => {
    if (
      selectedLocation &&
      filteredLocations.length > 0 &&
      !filteredLocations.some(
        (location) => location.id === selectedLocation?.id,
      )
    ) {
      setSelectedLocation(null)
    }
  }, [selectedLocation, filteredLocations])

  return (
    <MainAppShell selectedNav={NavOptions.MAP}>
      <Flex pos="relative" w="100%" h="100%">
        <Skeleton visible={!isMapLoaded && !isDevicesLoading}>
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
              direction="left"
              onClick={() => setIsAttributionOpened((prev) => !prev)}
              sx={{ position: "absolute", bottom: 8, right: 8 }}
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
                    selectedDevice={selectedDevice}
                    locations={filteredLocations}
                    availableDates={availableDates}
                    dateRange={dateRange}
                    autoFocus={autoFocus}
                    onAutoFocusToggle={handleToggleAutoFocus}
                    showAvatars={showAvatars}
                    onShowAvatarsToggle={setShowAvatars}
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
                  allowedHours={allowedHours}
                  onHoursChange={(hours) => {
                    setRestrictedHours(hours)
                  }}
                  isDateRange={isDateRange}
                />
              )}
            />

            {/* User's current location */}
            {userGeolocation && (
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
            )}

            {/* Display markers for every device with a latest location */}
            {!selectedDevice && (
              <DeviceMarkers
                clusters={latestLocationClusters}
                clusterIndex={latestLocationClustersIndex}
                devices={devices}
                sharedDevices={sharedDevices}
                sharedUsers={sharedUsers}
                showAvatars={showAvatars}
                mapRef={mapRef.current}
                mapAnimations={mapAnimations}
                onDeviceSelect={(device) => {
                  setSelectedDeviceId(device.id)
                  firstLocate.current = false
                }}
              />
            )}

            {/* Markers for the selected device's past locations */}
            {selectedDevice && (
              <LocationHistoryMarkers
                clusters={pastLocationClusters}
                clusterIndex={pastLocationClustersIndex}
                selectedDevice={selectedDevice}
                selectedLocation={selectedLocation}
                onLocationSelect={handleChangeLocation}
                locations={locations}
                restrictedHours={restrictedHours}
                mapRef={mapRef.current}
                mapAnimations={mapAnimations}
              />
            )}
          </MapGL>
        </Skeleton>
      </Flex>
    </MainAppShell>
  )
}
