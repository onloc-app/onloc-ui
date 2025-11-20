import { useAuth } from "@/hooks/useAuth"
import { CurrentLocationButton, MainAppBar } from "@/components"
import {
  Box,
  CircularProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material"
import { useEffect, useState, useRef } from "react"
import { getDevices } from "@/api"
import { stringToHexColor } from "@/helpers/utils"
import type { Device } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { getGeolocation } from "@/helpers/locations"
import MapGL, { type MapRef } from "react-map-gl/maplibre"
import { useColorMode } from "@/contexts/ThemeContext"
import {
  AccuracyMarker,
  CustomAttribution,
  GeolocationMarker,
} from "@/components"
import { DeviceList } from "./components/dashboard"
import { NavOptions } from "./types/enums"
export default function Dashboard() {
  const auth = useAuth()
  const { resolvedMode } = useColorMode()

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
          device.latest_location.id !== selectedDevice.latest_location?.id
        ) {
          flyTo(
            device.latest_location.longitude,
            device.latest_location.latitude,
          )
          setSelectedDevice(device)
        }
      }
    }
    if (!devices || !firstLoad.current) return

    if (devices.length > 0) {
      setSelectedDevice(devices[0])
      firstLoad.current = false
    }
  }, [devices, selectedDevice])

  return (
    <>
      <MainAppBar selectedNav={NavOptions.DASHBOARD} />
      <Box
        sx={{
          padding: 2,
          height: { xs: "auto", md: "calc(100vh - 64px)" },
        }}
      >
        <Box
          sx={{
            width: 1,
            height: 1,
            display: { xs: "block", md: "flex" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Paper
              sx={{
                overflowY: "auto",
                height: 1,
                padding: 2,
                marginBottom: { xs: 2, md: 0 },
                borderRadius: 4,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 24, md: 32 },
                  fontWeight: 600,
                  textAlign: { xs: "left", sm: "center", md: "left" },
                  mb: 2,
                }}
              >
                Devices
              </Typography>
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
                    })
                    setSelectedDevice(device)
                  }
                }}
              />
            </Paper>
          </Box>
          {devices ? (
            <Box sx={{ flex: 2, height: { xs: "60vh", md: "100%" } }}>
              <MapGL
                ref={mapRef}
                style={{ borderRadius: 16 }}
                maxPitch={0}
                mapStyle={
                  resolvedMode === "dark"
                    ? "https://tiles.immich.cloud/v1/style/dark.json"
                    : "https://tiles.immich.cloud/v1/style/light.json"
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
                  onClick={() => setIsAttributionOpened((prev) => !prev)}
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                  }}
                />

                <Paper
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    borderRadius: "50%",
                    padding: 1,
                  }}
                >
                  <Tooltip title="Go to current location" placement="left">
                    <CurrentLocationButton
                      selected={isOnCurrentLocation}
                      onClick={setIsOnCurrentLocation}
                    />
                  </Tooltip>
                </Paper>

                {/* User's current location */}
                {userGeolocation ? (
                  <GeolocationMarker
                    onClick={() => {
                      flyTo(
                        userGeolocation.coords.longitude,
                        userGeolocation.coords.latitude,
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
                        })
                        setSelectedDevice(device)
                      }}
                    />
                  )
                })}
              </MapGL>
            </Box>
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
