import { getDevices } from "@/api"
import {
  AccuracyMarker,
  CurrentLocationButton,
  CustomAttribution,
  GeolocationMarker,
  MainAppShell,
  MapControlBar,
  WebGLWarning,
} from "@/components"
import { DeviceList } from "@/components/dashboard"
import { useColorMode } from "@/contexts/ThemeContext"
import { getGeolocation } from "@/helpers/locations"
import { stringToHexColor } from "@/helpers/utils"
import { isWebglSupported } from "@/helpers/webgl"
import { useAuth } from "@/hooks/useAuth"
import { useSettings } from "@/hooks/useSettings"
import { NavOptions } from "@/types/enums"
import type { Device } from "@/types/types"
import {
  Button,
  Flex,
  Paper,
  Skeleton,
  Space,
  Text,
  Typography,
} from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import MapGL, { type MapRef } from "react-map-gl/maplibre"
import { useNavigate } from "react-router-dom"

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
    queryFn: getGeolocation,
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
    <MainAppShell selectedNav={NavOptions.DASHBOARD}>
      <Flex h="100%" gap="sm" direction={{ base: "column", sm: "row" }}>
        <Paper flex={1} p="xs" radius="lg">
          <Flex direction="column" h="100%" mah={{ base: 400, sm: "100%" }}>
            <Typography fz={{ base: 24, md: 32 }} fw={600}>
              {t("pages.dashboard.devices")}
            </Typography>
            <Space h="sm" />
            {devices.length > 0 ? (
              <DeviceList
                selectedDevice={selectedDevice}
                onLocate={(device) => {
                  if (device?.latest_location) {
                    mapRef.current?.flyTo({
                      center: [
                        device.latest_location.longitude,
                        device.latest_location.latitude,
                      ],
                      zoom: 18,
                      bearing: 0,
                      animate: mapAnimations,
                    })
                    setSelectedDevice(device)
                  }
                }}
              />
            ) : (
              <Flex
                h="100%"
                w="100%"
                direction="column"
                align="center"
                justify="center"
                gap="xs"
              >
                <Text>{t("pages.dashboard.no_device_found")}</Text>
                <Button onClick={() => navigate("/devices")}>
                  {t("pages.dashboard.manage_devices")}
                </Button>
              </Flex>
            )}
          </Flex>
        </Paper>

        <Paper flex={2} radius="lg" style={{ overflow: "hidden" }}>
          {isWebglSupported() ? (
            <Skeleton visible={!isMapLoaded && !isDevicesLoading} h="100%">
              <MapGL
                ref={mapRef}
                dragRotate={false}
                maxPitch={0}
                mapStyle={
                  resolvedMode === "dark"
                    ? "/maps/dark.json"
                    : "/maps/light.json"
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
                  open={isAttributionOpened}
                  direction="left"
                  onClick={() => setIsAttributionOpened((prev) => !prev)}
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                  }}
                />
                <MapControlBar sx={{ position: "absolute", top: 8, right: 8 }}>
                  <CurrentLocationButton
                    selected={isOnCurrentLocation}
                    onClick={setIsOnCurrentLocation}
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
                {/* Devices with available locations' markers */}
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
                        mapRef.current?.flyTo({
                          center: [location.longitude, location.latitude],
                          zoom: 18,
                          bearing: 0,
                          animate: mapAnimations,
                        })
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
      </Flex>
    </MainAppShell>
  )
}
