import { useAuth } from "./contexts/AuthProvider"
import MainAppBar from "./components/MainAppBar"
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material"
import "./leaflet.css"
import { useEffect, useState, useRef } from "react"
import { getDevices } from "./api"
import { formatISODate, sortDevices, stringToHexColor } from "./helpers/utils"
import Symbol from "./components/Symbol"
import { useNavigate, NavigateFunction } from "react-router-dom"
import "./Dashboard.css"
import { Device } from "./types/types"
import { Sort } from "./types/enums"
import { useQuery } from "@tanstack/react-query"
import Icon from "@mdi/react"
import { mdiChevronRight } from "@mdi/js"
import { mdiCrosshairs } from "@mdi/js"
import { mdiCrosshairsGps } from "@mdi/js"
import { getGeolocation } from "./helpers/locations"
import Map, { MapRef } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { useColorMode } from "./contexts/ThemeContext"
import CustomAttribution from "./components/map/src/CustomAttribution"
import AccuracyMarker from "./components/map/src/AccuracyMarker"
import GeolocationMarker2 from "./components/map/src/GeolocationMarker2"

interface DeviceListProps {
  devices: Device[]
  selectedDevice: Device | null
  onLocate: (device: Device) => void
  navigate: NavigateFunction
}

interface DeviceCardProps {
  device: Device
  selectedDevice: Device | null
  onLocate: (device: Device) => void
  navigate: NavigateFunction
}

export default function Dashboard() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { resolvedMode } = useColorMode()
  const theme = useTheme()

  const mapRef = useRef<MapRef>(null)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [isAttributionOpened, setIsAttributionOpened] = useState<boolean>(false)
  const firstLoad = useRef<boolean>(true)
  const firstLocate = useRef<boolean>(true)

  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: async () => getGeolocation(),
  })

  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: () => {
      if (!auth) return []
      return getDevices()
    },
  })

  useEffect(() => {
    if (!devices || !firstLoad.current) return

    const sortedDevices = sortDevices(devices, Sort.LATEST_LOCATION)

    if (devices.length > 0) {
      setSelectedDevice(sortedDevices[0])
      firstLoad.current = false
    }
  }, [devices])

  return (
    <>
      <MainAppBar selectedNav={"dashboard"} />
      <Box
        sx={{
          padding: 2,
          height: "calc(100vh - 64px)",
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
                devices={devices}
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
                navigate={navigate}
              />
            </Paper>
          </Box>
          {devices ? (
            <Box sx={{ flex: 2, height: 1 }}>
              <Map
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
                    mapRef.current?.flyTo({
                      center: [
                        selectedDevice.latest_location.longitude,
                        selectedDevice.latest_location.latitude,
                      ],
                      zoom: 18,
                      bearing: 0,
                      essential: true,
                    })
                    firstLocate.current = false
                  }
                }}
                onMoveStart={() => {
                  if (!firstLocate.current) {
                    setIsAttributionOpened(false)
                    setSelectedDevice(null)
                  }
                }}
              >
                <CustomAttribution
                  open={isAttributionOpened}
                  onClick={() => setIsAttributionOpened((prev) => !prev)}
                  sx={{ position: "absolute", bottom: 8, right: 8 }}
                />

                {/* User's current location */}
                {userGeolocation ? (
                  <GeolocationMarker2
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
              </Map>
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

function DeviceList({
  devices,
  selectedDevice,
  onLocate,
  navigate,
}: DeviceListProps) {
  const sortedDevices = sortDevices(devices, Sort.LATEST_LOCATION)
  if (devices) {
    return sortedDevices.map((device) => {
      return (
        <DeviceCard
          key={device.id}
          device={device}
          selectedDevice={selectedDevice}
          onLocate={onLocate}
          navigate={navigate}
        />
      )
    })
  }
}

function DeviceCard({
  device,
  selectedDevice,
  onLocate,
  navigate,
}: DeviceCardProps) {
  return (
    <Card elevation={2} sx={{ mb: 2, borderRadius: 4 }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Symbol
            name={device.icon}
            color={stringToHexColor(device.name)}
            size={1.6}
          />
          <Box>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontSize: { xs: 16, md: 24 } }}
            >
              {device.name}
            </Typography>
            {device.latest_location ? (
              <Typography
                sx={{
                  display: { xs: "none", md: "block" },
                  color: "text.secondary",
                }}
              >
                Latest location:{" "}
                {device.latest_location.created_at
                  ? formatISODate(device.latest_location.created_at.toString())
                  : ""}
              </Typography>
            ) : (
              ""
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", sm: "column", xl: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          {device.latest_location ? (
            <IconButton
              title="Locate device"
              onClick={() => {
                onLocate(device)
              }}
            >
              {selectedDevice && device.id === selectedDevice.id ? (
                <Icon path={mdiCrosshairsGps} size={1} />
              ) : (
                <Icon path={mdiCrosshairs} size={1} />
              )}
            </IconButton>
          ) : (
            ""
          )}
          <IconButton
            title="Go to details"
            onClick={() => {
              navigate(`/devices#${device.id}`, {
                state: { device_id: device.id },
              })
            }}
          >
            <Icon path={mdiChevronRight} size={1} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}
