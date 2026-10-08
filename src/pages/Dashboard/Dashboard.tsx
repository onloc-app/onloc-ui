import { getDevices } from "@/api"
import {
  AccuracyMarker,
  CurrentLocationButton,
  CustomAttribution,
  GeolocationMarker,
  MapControlBar,
  WebGLWarning,
} from "@/components"
import { DeviceList } from "@/components/dashboard"
import { useColorMode } from "@/contexts/theme/ThemeContext"
import { stringToHexColor } from "@/helpers/utils"
import { isWebglSupported } from "@/helpers/webgl"
import { useAuth } from "@/hooks/useAuth"
import { useSettings } from "@/hooks/useSettings"
import type { Device } from "@/types/types"
import { Button, Paper, Skeleton, Text, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import MapGL, { type MapRef } from "react-map-gl/maplibre"
import { useNavigate } from "react-router-dom"
import classes from "./Dashboard.module.css"
import { LocationService } from "@/services"

export default function Dashboard() {
  const auth = useAuth()
  const { resolvedMode } = useColorMode()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const mapRef = useRef<MapRef>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [isOnCurrentLocation, setIsOnCurrentLocation] = useState<boolean>(false)
  const [isAttributionOpened, setIsAttributionOpened] = useState<boolean>(false)
  const firstLoad = useRef<boolean>(true)
  const firstLocate = useRef<boolean>(true)

  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: LocationService.getGeolocation,
    retry: false,
  })

  const { data: devices = [], isLoading: isDevicesLoading } = useQuery({
    queryKey: ["devices"],
    queryFn: () => {
      if (!auth) return []
      return getDevices()
    },
  })

  const sortedDevices = useMemo(() => {
    return [...devices].sort((a: Device, b: Device) => {
      const aTime = a.latest_location?.created_at
        ? new Date(a.latest_location.created_at).getTime()
        : 0

      const bTime = b.latest_location?.created_at
        ? new Date(b.latest_location.created_at).getTime()
        : 0

      // Newest first
      return bTime - aTime
    })
  }, [devices])

  const flyTo = (
    longitude: number,
    latitude: number,
    animate: boolean = true,
  ) => {
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: 18,
      bearing: 0,
      animate: animate,
    })
  }

  useEffect(() => {
    if (selectedDevice) {
      for (const device of devices) {
        if (
          device.id === selectedDevice.id &&
          device.latest_location &&
          device.latest_location.id !== selectedDevice.latest_location?.id
        ) {
          flyTo(
            device.latest_location.longitude,
            device.latest_location.latitude,
            mapAnimations,
          )
          setSelectedDevice(device)
        }
      }
    }
    if (!devices || !firstLoad.current) return

    // On first load, select device with the latest location
    if (sortedDevices.length > 0) {
      setSelectedDevice(sortedDevices[0])
      firstLoad.current = false
    }
  }, [devices, selectedDevice, mapAnimations, sortedDevices])

  return (
    <div className={classes["container"]}>
      <Paper className={classes["devices-section"]}>
        <Title>{t("pages.dashboard.devices")}</Title>
        {devices.length > 0 ? (
          <DeviceList
            selectedDevice={selectedDevice}
            onLocate={(device) => {
              if (device?.latest_location) {
                flyTo(
                  device.latest_location.longitude,
                  device.latest_location.latitude,
                  mapAnimations,
                )
                setSelectedDevice(device)
              }
            }}
          />
        ) : isDevicesLoading ? (
          <Skeleton height={64} />
        ) : (
          <div className={classes["devices__no-device-found"]}>
            <Text>{t("pages.dashboard.no_device_found")}</Text>
            <Button onClick={() => navigate("/devices")}>
              {t("pages.dashboard.manage_devices")}
            </Button>
          </div>
        )}
      </Paper>

      <Paper className={classes["map-section"]}>
        {isWebglSupported() ? (
          <Skeleton
            className={classes["map-section__skeleton"]}
            visible={!isMapLoaded && !isDevicesLoading}
          >
            <MapGL
              ref={mapRef}
              dragRotate={false}
              maxPitch={0}
              style={{
                borderRadius: "var(--mantine-radius-md)",
              }}
              mapStyle={
                resolvedMode === "dark" ? "/maps/dark.json" : "/maps/light.json"
              }
              attributionControl={false}
              onLoad={() => {
                setIsMapLoaded(true)
                if (selectedDevice?.latest_location) {
                  flyTo(
                    selectedDevice.latest_location.longitude,
                    selectedDevice.latest_location.latitude,
                    false,
                  )
                  firstLocate.current = false
                }
              }}
              onMoveStart={() => {
                if (!firstLocate.current) {
                  setIsAttributionOpened(false)
                  setSelectedDevice(null)
                  setIsOnCurrentLocation(false)
                }
              }}
            >
              <CustomAttribution
                className={classes["map-section__map__attribution"]}
                open={isAttributionOpened}
                direction="left"
                onClick={() => setIsAttributionOpened((prev) => !prev)}
              />
              <MapControlBar
                className={classes["map-section__map__control-bar"]}
              >
                <CurrentLocationButton
                  selected={isOnCurrentLocation}
                  onClick={() => setIsOnCurrentLocation(true)}
                />
              </MapControlBar>
              {/* User's current location */}
              {userGeolocation && (
                <GeolocationMarker
                  onClick={() => {
                    flyTo(
                      userGeolocation.coords.longitude,
                      userGeolocation.coords.latitude,
                      mapAnimations,
                    )
                    setIsOnCurrentLocation(true)
                  }}
                />
              )}
              {/* Devices with available location markers */}
              {devices.map((device: Device) => {
                const location = device.latest_location
                if (!location) return

                return (
                  <AccuracyMarker
                    key={location.id}
                    id={location.id}
                    location={location}
                    color={device.color ?? stringToHexColor(device.name)}
                    onClick={() => {
                      flyTo(
                        location.longitude,
                        location.latitude,
                        mapAnimations,
                      )
                      setSelectedDevice(device)
                    }}
                  />
                )
              })}
            </MapGL>
          </Skeleton>
        ) : (
          <WebGLWarning />
        )}
      </Paper>
    </div>
  )
}
