import { metersPerSecondToKilometersPerHour } from "@/helpers/units"
import { formatISODate, getBatteryPath } from "@/helpers/utils"
import type { Device, Location } from "@/types/types"
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  ActionIcon,
  Text,
  Tooltip,
} from "@mantine/core"
import {
  mdiAdjust,
  mdiAltimeter,
  mdiClockOutline,
  mdiClose,
  mdiMapMarkerOutline,
  mdiSpeedometer,
} from "@mdi/js"
import { Icon } from "@mdi/react"
import { useTranslation } from "react-i18next"
import classes from "./LocationDetails.module.css"

interface LocationDetailsProps {
  device: Device
  location: Location
  onDismiss: () => void
}

interface FieldProps {
  label: string
  tooltip: string
  icon: string
}

export default function LocationDetails({
  device,
  location,
  onDismiss,
}: LocationDetailsProps) {
  const { t } = useTranslation()

  return (
    <div className={classes["container"]}>
      <Accordion variant="separated" radius="lg">
        <AccordionItem value="location_details">
          <AccordionControl>
            <div className={classes["header"]}>
              <div className={classes["header__text"]}>
                <Text>{t("components.location_details.details")}</Text>
                {device.latest_location?.id === location.id && (
                  <Text c="dimmed">
                    {t("components.location_details.latest_location")}
                  </Text>
                )}
              </div>
              <ActionIcon
                onClick={(e) => {
                  e.stopPropagation()
                  onDismiss()
                }}
                size="md"
              >
                <Icon path={mdiClose} size={0.75} />
              </ActionIcon>
            </div>
          </AccordionControl>
          <AccordionPanel>
            <div className={classes["fields"]}>
              {location.created_at != null && (
                <Field
                  label={formatISODate(location.created_at.toString())}
                  tooltip={t(
                    "components.location_details.tooltip_labels.timestamp",
                  )}
                  icon={mdiClockOutline}
                />
              )}

              <Field
                label={`${location.latitude}, ${location.longitude}`}
                tooltip={t(
                  "components.location_details.tooltip_labels.coordinates",
                )}
                icon={mdiMapMarkerOutline}
              />

              {location.accuracy != null && (
                <Field
                  label={`${location.accuracy} m`}
                  tooltip={t(
                    "components.location_details.tooltip_labels.accuracy",
                  )}
                  icon={mdiAdjust}
                />
              )}

              {location.altitude != null && (
                <Field
                  label={`${location.altitude} m`}
                  tooltip={t(
                    "components.location_details.tooltip_labels.altitude",
                  )}
                  icon={mdiAltimeter}
                />
              )}

              {location.speed != null && (
                <Field
                  label={`${metersPerSecondToKilometersPerHour(location.speed)} km/h`}
                  tooltip={t(
                    "components.location_details.tooltip_labels.speed",
                  )}
                  icon={mdiSpeedometer}
                />
              )}

              {location.battery != null && (
                <Field
                  label={`${location.battery}%`}
                  tooltip={t(
                    "components.location_details.tooltip_labels.battery",
                  )}
                  icon={getBatteryPath(location.battery, location.charging)}
                />
              )}
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

function Field({ label, tooltip, icon }: FieldProps) {
  return (
    <div className={classes["field"]}>
      <Tooltip label={tooltip} position="left">
        <Icon path={icon} size={1} />
      </Tooltip>
      <Text className={classes["field__label"]}>{label}</Text>
    </div>
  )
}
