import type { Device } from "@/types/types"
import { useState } from "react"
import DeviceAccordion from "./DeviceAccordion"
import { useLocation } from "react-router-dom"
import { Accordion } from "@mantine/core"

interface DeviceListProps {
  devices: Device[]
}

export default function DeviceAccordionList({ devices }: DeviceListProps) {
  const location = useLocation()
  const { device_id } = location.state || {}

  const [expanded, setExpanded] = useState<string | null>(device_id?.toString())
  const handleExpand = (deviceId: string | null) => {
    setExpanded(deviceId)
  }

  return (
    <Accordion variant="separated" value={expanded} onChange={handleExpand}>
      {devices.map((device) => {
        return <DeviceAccordion key={device.id} device={device} />
      })}
    </Accordion>
  )
}
