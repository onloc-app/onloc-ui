import Symbol from "@/components/src/Symbol"
import { metersPerSecondToKilometersPerHour } from "@/helpers/units"
import { formatISODate, snapAngle, stringToHexColor } from "@/helpers/utils"
import useAnimatedCoordinates from "@/hooks/useAnimatedCoordinates"
import type { Device, Location } from "@/types/types"
import {
  Card,
  Divider,
  Flex,
  Text,
  useComputedColorScheme,
  useMantineTheme,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { mdiSpeedometer } from "@mdi/js"
import Icon from "@mdi/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { throttle } from "lodash"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Marker, useMap } from "react-map-gl/maplibre"

interface InfoMarkerProps {
  devices: Device[]
  location: Location
  animate?: boolean
  onClick?: () => void
}

const ORBIT_DISTANCE = 80

export default function InfoMarker({
  devices,
  location,
  animate = false,
  onClick,
}: InfoMarkerProps) {
  const theme = useMantineTheme()
  const { current: map } = useMap()
  const { i18n } = useTranslation()
  const lang = i18n.language

  const { longitude, latitude, created_at, speed } = location

  const animatedPos = useAnimatedCoordinates(longitude, latitude, animate)

  // Round location to prevent fetching Photon on every change
  const roundedLat = Math.round(latitude * 100) / 100
  const roundedLng = Math.round(longitude * 100) / 100

  const { data: reverseGeocode } = useQuery<string>({
    queryKey: ["reverse_geocode", roundedLat, roundedLng, lang],
    queryFn: async () => {
      const res = await axios.get(
        `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}&lang=${lang}`,
      )
      const { county, state, country } = res.data.features[0].properties
      return [county, state, country].filter(Boolean).join(", ")
    },
    staleTime: 15 * 1000,
  })

  const color =
    devices.length === 1
      ? (devices[0].color ?? stringToHexColor(devices[0].name))
      : "white"
  const colorScheme = useComputedColorScheme("light")
  const cardColor =
    colorScheme === "light" ? theme.colors.gray[1] : theme.colors.dark[6]

  const panelRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 })
  const [lineStart, setLineStart] = useState({ x: 0, y: 0 })
  const [lineEnd, setLineEnd] = useState({ x: 0, y: 0 })

  const [visible, setVisible] = useState(true)
  const isTooSmall = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)

  const updateLine = useCallback(() => {
    const panel = panelRef.current
    const svg = svgRef.current
    if (!map || !panel || !svg) return

    const pos = map.project([animatedPos.longitude, animatedPos.latitude])
    const rect = map.getCanvas().getBoundingClientRect()
    const svgRect = svg.getBoundingClientRect()
    const panelRect = panel.getBoundingClientRect()

    setLineStart({
      x: panelRect.left + panelRect.width / 2 - svgRect.left,
      y: panelRect.bottom - svgRect.top,
    })
    setLineEnd({
      x: pos.x + rect.left - svgRect.left,
      y: pos.y + rect.top - svgRect.top,
    })
  }, [map, animatedPos])

  const updatePanel = useCallback(() => {
    const panel = panelRef.current
    const svg = svgRef.current
    if (!map || !panel || !svg) return

    const pos = map.project([animatedPos.longitude, animatedPos.latitude])
    const rect = map.getCanvas().getBoundingClientRect()

    const screenCenterX = rect.width / 2
    const screenCenterY = rect.height / 2

    const angle = snapAngle(
      Math.atan2(screenCenterY - pos.y, screenCenterX - pos.x),
    )

    setPanelPosition({
      x: Math.cos(angle) * ORBIT_DISTANCE,
      y: Math.sin(angle) * ORBIT_DISTANCE,
    })
  }, [map, animatedPos])

  const updateVisibility = useCallback(() => {
    if (!map) return

    const zoom = map.getZoom()
    const correctZoom = zoom > 5

    const bounds = map.getBounds()
    const inBounds = bounds.contains([longitude, latitude])

    setVisible(correctZoom && inBounds && !isTooSmall)
  }, [map, isTooSmall, longitude, latitude])

  const throttledPanelUpdate = useMemo(
    () => throttle(updatePanel, 50),
    [updatePanel],
  )
  const throttledVisibilityUpdate = useMemo(
    () => throttle(updateVisibility, 50),
    [updateVisibility],
  )

  // Continue running line update for 500ms after trigger
  const runLineUpdateWindow = useCallback(() => {
    const start = performance.now()

    const tick = () => {
      updateLine()

      if (performance.now() - start < 500) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [updateLine])

  useEffect(() => {
    if (!map) return

    const update = () => {
      throttledVisibilityUpdate()
      if (!visible) return
      throttledPanelUpdate()
      runLineUpdateWindow()
    }

    map.on("zoom", update)
    map.on("move", update)
    map.on("projectiontransition", update)
    setTimeout(update, 0)
    return () => {
      map.off("zoom", update)
      map.off("move", update)
      map.off("projectiontransition", update)
      throttledPanelUpdate.cancel()
      throttledVisibilityUpdate.cancel()
    }
  }, [
    map,
    visible,
    throttledPanelUpdate,
    throttledVisibilityUpdate,
    runLineUpdateWindow,
  ])

  return (
    <>
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "visible",
          pointerEvents: "none",
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <line
          x1={lineStart.x}
          y1={lineStart.y}
          x2={lineEnd.x}
          y2={lineEnd.y}
          stroke={color}
          strokeWidth={2}
          strokeOpacity={0.8}
        />
      </svg>
      <Marker
        longitude={animatedPos.longitude}
        latitude={animatedPos.latitude}
        style={{ cursor: "pointer", zIndex: 2, pointerEvents: "none" }}
        onClick={onClick}
      >
        <Card
          left={panelPosition.x}
          top={panelPosition.y}
          ref={panelRef}
          ff="text"
          p="xs"
          sx={{
            backgroundColor: cardColor,
            border: "2px solid white",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            transform: `translate(calc(${panelPosition.x}px), calc(${panelPosition.y}px))`,
          }}
        >
          {devices.map((device, index) => {
            return (
              <Flex key={device.id} direction="column">
                <Flex align="center" gap="xs">
                  <Symbol name={device.icon} />
                  <Text>{device.name}</Text>
                </Flex>
                {created_at && <Text>{formatISODate(created_at)}</Text>}
                <Text>{reverseGeocode}</Text>
                {speed && (
                  <Flex align="center" gap="xs">
                    <Icon path={mdiSpeedometer} size={1} />
                    <Text>
                      {`${metersPerSecondToKilometersPerHour(speed)} km/h`}
                    </Text>
                  </Flex>
                )}
                {index !== devices.length - 1 && <Divider my="xs" size="sm" />}
              </Flex>
            )
          })}
        </Card>
      </Marker>
    </>
  )
}
