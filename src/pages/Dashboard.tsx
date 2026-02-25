import { getDevices } from "@/api"
import {
  AccuracyMarker,
  CurrentLocationButton,
  CustomAttribution,
  GeolocationMarker,
  MainAppShell,
  MapControlBar,
} from "@/components"
import { DeviceList } from "@/components/dashboard"
import { useColorMode } from "@/contexts/ThemeContext"
import { getGeolocation } from "@/helpers/locations"
import { stringToHexColor } from "@/helpers/utils"
import { useAuth } from "@/hooks/useAuth"
import { useSettings } from "@/hooks/useSettings"
import { NavOptions } from "@/types/enums"
import type { Device } from "@/types/types"
import { Flex, Loader, Paper, Space, Typography } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import MapGL, { type MapRef } from "react-map-gl/maplibre"

export default function Dashboard() {
  const auth = useAuth()
  const { resolvedMode } = useColorMode()
  const { mapAnimations } = useSettings()
  const { t } = useTranslation()

  const mapRef = useRef<MapRef>(null)
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

  const { data: devices = [] } = useQuery({
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
          <Flex direction="column" mah={{ base: 400, sm: "100%" }}>
            <Typography fz={{ base: 24, md: 32 }} fw={600}>
              {t("pages.dashboard.devices")}
            </Typography>
            <Space h="sm" />
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
          </Flex>
        </Paper>
        {devices ? (
          <Paper flex={2} radius="lg" style={{ overflow: "hidden" }}>
            <MapGL
              ref={mapRef}
              dragRotate={false}
              maxPitch={0}
              mapStyle={
                resolvedMode === "dark" ? "/maps/dark.json" : "/maps/light.json"
              }
              attributionControl={false}
              onLoad={() => {
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
              {userGeolocation ? (
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
              ) : null}
              {/* Devices with available locations' markers */}
              {devices.map((device: Device) => {
                if (!device.latest_location) return null

                const longitude = device.latest_location.longitude
                const latitude = device.latest_location.latitude
                const accuracy = device.latest_location.accuracy

                return (
                  <AccuracyMarker
                    key={device.latest_location.id}
                    id={device.latest_location.id}
                    longitude={longitude}
                    latitude={latitude}
                    accuracy={accuracy}
                    color={stringToHexColor(device.name)}
                    onClick={() => {
                      mapRef.current?.flyTo({
                        center: [longitude, latitude],
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
          </Paper>
        ) : (
          <Flex flex={2} align="center" justify="center">
            <Loader />
          </Flex>
        )}
      </Flex>
    </MainAppShell>
  )
}
