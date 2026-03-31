import Symbol from "@/components/src/Symbol"
import { metersPerSecondToKilometersPerHour } from "@/helpers/units"
import { formatISODate, snapAngle, stringToHexColor } from "@/helpers/utils"
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
  onClick?: () => void
}

const ORBIT_DISTANCE = 80

export default function InfoMarker({
  devices,
  location,
  onClick,
}: InfoMarkerProps) {
  const theme = useMantineTheme()
  const { current: map } = useMap()
  const { i18n } = useTranslation()
  const lang = i18n.language

  const { data: reverseGeocode } = useQuery<string>({
    queryKey: ["reverse_geocode", location.latitude, location.longitude, lang],
    queryFn: async () => {
      const res = await axios.get(
        `https://photon.komoot.io/reverse?lat=${location.latitude}&lon=${location.longitude}&lang=${lang}`,
      )
      const { county, state, country } = res.data.features[0].properties
      return [county, state, country].filter(Boolean).join(", ")
    },
  })

  const color =
    devices.length == 1 ? stringToHexColor(devices[0].name) : "white"
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

    const pos = map.project([location.longitude, location.latitude])
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
  }, [map, location])

  const updatePanel = useCallback(() => {
    const panel = panelRef.current
    const svg = svgRef.current
    if (!map || !panel || !svg) return

    const pos = map.project([location.longitude, location.latitude])
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
  }, [map, location])

  const updateVisibility = useCallback(() => {
    if (!map) return

    const zoom = map.getZoom()
    const correctZoom = zoom > 5

    const bounds = map.getBounds()
    const inBounds = bounds.contains([location.longitude, location.latitude])

    setVisible(correctZoom && inBounds && !isTooSmall)
  }, [map, isTooSmall, location])

  const throttledLineUpdate = useMemo(
    () => throttle(updateLine, 8),
    [updateLine],
  )
  const throttledPanelUpdate = useMemo(
    () => throttle(updatePanel, 50),
    [updatePanel],
  )

  const throttledVisibilityUpdate = useMemo(
    () => throttle(updateVisibility, 50),
    [updateVisibility],
  )

  useEffect(() => {
    if (!map) return

    const update = () => {
      throttledVisibilityUpdate()
      if (!visible) return
      throttledPanelUpdate()
      throttledLineUpdate()
    }

    map.on("zoom", update)
    map.on("move", update)
    map.on("projectiontransition", update)
    setTimeout(update, 0)
    return () => {
      map.off("zoom", update)
      map.off("move", update)
      map.off("projectiontransition", update)
      throttledLineUpdate.cancel()
      throttledPanelUpdate.cancel()
      throttledVisibilityUpdate.cancel()
    }
  }, [
    map,
    visible,
    throttledPanelUpdate,
    throttledLineUpdate,
    throttledVisibilityUpdate,
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
        longitude={location.longitude}
        latitude={location.latitude}
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
                {location.created_at && (
                  <Text>{formatISODate(location.created_at)}</Text>
                )}
                <Text>{reverseGeocode}</Text>
                {location.speed && (
                  <Flex align="center" gap="xs">
                    <Icon path={mdiSpeedometer} size={1} />
                    <Text>
                      {`${metersPerSecondToKilometersPerHour(location.speed)} km/h`}
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
