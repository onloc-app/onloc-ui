import { getGeolocation } from "@/helpers/locations"
import type { Device } from "@/types/types"
import { Box } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useState, type SyntheticEvent } from "react"
import DeviceAccordion from "./DeviceAccordion"
import { useLocation } from "react-router-dom"

interface DeviceListProps {
  devices: Device[]
}

export default function DeviceList({ devices }: DeviceListProps) {
  const location = useLocation()
  const { device_id } = location.state || {}

  const { data: userGeolocation = null } = useQuery({
    queryKey: ["geolocation"],
    queryFn: () => getGeolocation(),
  })

  const [expanded, setExpanded] = useState<string | boolean>(
    device_id?.toString() ?? false,
  )
  const handleExpand =
    (panel: string) => (_: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  if (devices) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {devices.map((device) => {
          return (
            <DeviceAccordion
              key={device.id}
              device={device}
              expanded={expanded}
              handleExpand={handleExpand}
              userGeolocation={userGeolocation?.coords ?? null}
            />
          )
        })}
      </Box>
    )
  }
}
