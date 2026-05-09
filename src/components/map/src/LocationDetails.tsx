import { Battery } from "@/components"
import { metersPerSecondToKilometersPerHour } from "@/helpers/units"
import { formatISODate } from "@/helpers/utils"
import type { Device, Location } from "@/types/types"
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  ActionIcon,
  Box,
  Flex,
  Tooltip,
  Typography,
  type BoxProps,
} from "@mantine/core"
import {
  mdiAdjust,
  mdiAltimeter,
  mdiClockOutline,
  mdiClose,
  mdiMapMarkerOutline,
  mdiSpeedometer,
} from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"

interface LocationDetailsProps extends BoxProps {
  device: Device
  location: Location
  onDismiss: () => void
}

export default function LocationDetails({
  device,
  location,
  onDismiss,
  sx,
  ...rest
}: LocationDetailsProps) {
  const { t } = useTranslation()

  return (
    <Box sx={sx} {...rest}>
      <Accordion variant="separated" radius="lg">
        <AccordionItem value="location_details">
          <AccordionControl>
            <Flex justify="space-between" align="center" gap="xs" mr="xs">
              <Flex justify="start" align="center" gap="xs">
                <Typography>
                  {t("components.location_details.details")}
                </Typography>
                {device.latest_location?.id === location.id && (
                  <Typography c="dimmed">
                    {t("components.location_details.latest_location")}
                  </Typography>
                )}
              </Flex>
              <ActionIcon
                onClick={(e) => {
                  e.stopPropagation()
                  onDismiss()
                }}
                size="md"
              >
                <Icon path={mdiClose} size={0.75} />
              </ActionIcon>
            </Flex>
          </AccordionControl>
          <AccordionPanel>
            <Flex direction="column" gap={4}>
              {location.created_at != null && (
                <Flex align="center" gap="xs">
                  <Tooltip
                    label={t(
                      "components.location_details.tooltip_labels.timestamp",
                    )}
                    position="left"
                  >
                    <Icon path={mdiClockOutline} size={1} />
                  </Tooltip>
                  <Typography fz={14}>
                    {formatISODate(location.created_at.toString())}
                  </Typography>
                </Flex>
              )}

              <Flex align="center" gap="xs">
                <Tooltip
                  label={t(
                    "components.location_details.tooltip_labels.coordinates",
                  )}
                  position="left"
                >
                  <Icon path={mdiMapMarkerOutline} size={1} />
                </Tooltip>
                <Typography fz={14}>
                  {location.latitude}, {location.longitude}
                </Typography>
              </Flex>

              {location.accuracy != null && (
                <Flex align="center" gap="xs">
                  <Tooltip
                    label={t(
                      "components.location_details.tooltip_labels.accuracy",
                    )}
                    position="left"
                  >
                    <Icon path={mdiAdjust} size={1} />
                  </Tooltip>
                  <Typography fz={14}>{`${location.accuracy} m`}</Typography>
                </Flex>
              )}

              {location.altitude != null && (
                <Flex align="center" gap="xs">
                  <Tooltip
                    label={t(
                      "components.location_details.tooltip_labels.altitude",
                    )}
                    position="left"
                  >
                    <Icon path={mdiAltimeter} size={1} />
                  </Tooltip>
                  <Typography fz={14}>{`${location.altitude} m`}</Typography>
                </Flex>
              )}

              {location.speed != null && (
                <Flex align="center" gap="xs">
                  <Tooltip
                    label={t(
                      "components.location_details.tooltip_labels.speed",
                    )}
                    position="left"
                  >
                    <Icon path={mdiSpeedometer} size={1} />
                  </Tooltip>
                  <Typography fz={14}>
                    {`${metersPerSecondToKilometersPerHour(location.speed)} km/h`}
                  </Typography>
                </Flex>
              )}

              {location.battery != null && (
                <Flex align="center" gap="xs">
                  <Tooltip
                    label={t(
                      "components.location_details.tooltip_labels.battery",
                    )}
                    position="left"
                  >
                    <Box>
                      <Battery level={location.battery} />
                    </Box>
                  </Tooltip>
                  <Typography fz={14}>{location.battery}%</Typography>
                </Flex>
              )}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
