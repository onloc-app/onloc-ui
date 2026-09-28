import { ConnectionDot } from "@/components/devices"
import Symbol from "@/components/core/src/Symbol"
import { formatISODate, stringToHexColor } from "@/helpers/utils"
import type { Device } from "@/types/types"
import { ActionIcon, Card, Text, Title, Tooltip } from "@mantine/core"
import { mdiChevronRight, mdiCrosshairs, mdiCrosshairsGps } from "@mdi/js"
import { Icon } from "@mdi/react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import classes from "./DeviceRow.module.css"

interface DeviceRowProps {
  device: Device
  selected: boolean
  onLocate: (device: Device) => void
}

export default function DeviceRow({
  device,
  selected,
  onLocate,
}: DeviceRowProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Card className={classes["card"]} withBorder>
      <div className={classes["header"]}>
        <div className={classes["header__icon-container"]}>
          <Symbol
            name={device.icon}
            color={device.color ?? stringToHexColor(device.name)}
            size={1.6}
          />
        </div>
        <div>
          <Title className={classes["header__name"]}>{device.name}</Title>
          {device.latest_location && (
            <Text className={classes["header__latest-location"]}>
              {device.latest_location.created_at &&
                `${t("components.device_row.latest_location")}: ${formatISODate(device.latest_location.created_at.toString())}`}
            </Text>
          )}
        </div>
      </div>
      <div className={classes["status"]}>
        {device.is_connected && <ConnectionDot size={2} />}
        <div className={classes["status__actions"]}>
          {device.latest_location && (
            <Tooltip
              label={t("components.device_row.locate_device")}
              openDelay={500}
              position="bottom"
            >
              <ActionIcon onClick={() => onLocate(device)}>
                {selected ? (
                  <Icon path={mdiCrosshairsGps} size={1} />
                ) : (
                  <Icon path={mdiCrosshairs} size={1} />
                )}
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip
            label={t("components.device_row.go_to_details")}
            openDelay={500}
            position="bottom"
          >
            <ActionIcon
              onClick={() => {
                navigate(`/devices#${device.id}`, {
                  state: { device_id: device.id },
                })
              }}
            >
              <Icon path={mdiChevronRight} size={1} />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
    </Card>
  )
}
