import { stringToHexColor } from "@/helpers/utils"
import { BatteryBadge, ConnectionDot, Symbol } from "@/components"
import type { Device } from "@/types/types"
import { useTranslation } from "react-i18next"
import { Group, Select, Typography } from "@mantine/core"
import Icon from "@mdi/react"
import { mdiCheck } from "@mdi/js"

interface DevicesSelectProps {
  devices: Device[]
  selectedDevice: Device | null
  callback: (device: Device | null) => void
  sharedDevices?: Device[] | null
  error?: string
  disableNoLocations?: boolean
}

export default function DevicesSelect({
  devices,
  selectedDevice,
  callback,
  sharedDevices = null,
  error = "",
  disableNoLocations = true,
}: DevicesSelectProps) {
  const { t } = useTranslation()

  const allDevices = [...devices, ...(sharedDevices ?? [])]

  const data = [
    {
      group: t("components.devices_select.categories.personal"),
      items: devices.map((d) => ({
        label: d.name,
        value: d.id.toString(),
        disabled: disableNoLocations && d.latest_location === null,
      })),
    },
    ...(sharedDevices
      ? [
          {
            group: t("components.devices_select.categories.shared"),
            items: sharedDevices.map((d) => ({
              label: d.name,
              value: d.id.toString(),
              disabled: disableNoLocations && d.latest_location === null,
            })),
          },
        ]
      : []),
  ]

  return (
    <Select
      placeholder={t("components.devices_select.devices")}
      data={data}
      value={selectedDevice?.id.toString() ?? null}
      onChange={(value) => {
        const device = allDevices.find((d) => d.id.toString() === value) || null
        callback(device)
      }}
      error={error}
      clearable
      searchable
      checkIconPosition="right"
      renderOption={({ option, checked }) => {
        const device = allDevices.find((d) => d.id.toString() === option.value)

        if (!device) return null

        return (
          <Group justify="space-between" w="100%">
            <Group gap="xs">
              <Symbol
                name={device.icon}
                color={stringToHexColor(device.name)}
              />
              <Typography>{device.name}</Typography>
              {device.latest_location?.battery && (
                <BatteryBadge level={device.latest_location.battery} />
              )}
            </Group>
            <Group gap="xs">
              {device.is_connected && <ConnectionDot />}
              {checked && <Icon path={mdiCheck} size={0.75} />}
            </Group>
          </Group>
        )
      }}
    />
  )
}
