import { getDevices } from "@/api"
import { useAuth } from "@/hooks/useAuth"
import { sortDevices } from "@/helpers/utils"
import { Sort } from "@/types/enums"
import type { Device } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { DeviceRow } from "@/components/dashboard"
import { Stack } from "@mantine/core"

interface DeviceListProps {
  selectedDevice: Device | null
  onLocate: (device: Device) => void
}

export default function DeviceList({
  selectedDevice,
  onLocate,
}: DeviceListProps) {
  const auth = useAuth()

  const { data: devices = [] } = useQuery({
    queryKey: ["devices"],
    queryFn: () => {
      if (!auth) return []
      return getDevices()
    },
  })
  const sortedDevices = sortDevices(devices, Sort.LATEST_LOCATION)

  if (devices) {
    return (
      <Stack h="100%" gap="md" p="xs" style={{ overflowY: "auto" }}>
        {sortedDevices.map((device) => (
          <DeviceRow
            key={device.id}
            device={device}
            selected={device.id === selectedDevice?.id}
            onLocate={onLocate}
          />
        ))}
      </Stack>
    )
  }
}
