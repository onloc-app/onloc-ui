import { Battery } from "@/components"
import { metersPerSecondToKilometersPerHour } from "@/helpers/units"
import { formatISODate } from "@/helpers/utils"
import type { Device, Location } from "@/types/types"
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Typography,
  type BoxProps,
} from "@mantine/core"
import {
  mdiAdjust,
  mdiAltimeter,
  mdiClockOutline,
  mdiMapMarkerOutline,
  mdiSpeedometer,
} from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"

interface LocationDetailsProps extends BoxProps {
  device: Device
  location: Location
}

export default function LocationDetails({
  device,
  location,
  sx,
  ...rest
}: LocationDetailsProps) {
  const { t } = useTranslation()

  return (
    <Box sx={sx} {...rest}>
      <Accordion variant="separated" radius="lg">
        <AccordionItem value="location_details">
          <AccordionControl>
            <Flex justify="start" align="center" gap="xs">
              <Typography>
                {t("components.location_details.details")}
              </Typography>
              {device.latest_location?.id === location.id ? (
                <Typography c="dimmed">
                  {t("components.location_details.latest_location")}
                </Typography>
              ) : null}
            </Flex>
          </AccordionControl>
          <AccordionPanel>
            <Flex direction="column" gap={4}>
              {location.created_at != null && (
                <Flex align="center" gap="xs">
                  <Icon path={mdiClockOutline} size={1} />
                  <Typography fz={14}>
                    {formatISODate(location.created_at.toString())}
                  </Typography>
                </Flex>
              )}

              <Flex align="center" gap="xs">
                <Icon path={mdiMapMarkerOutline} size={1} />
                <Typography fz={14}>
                  {location.latitude}, {location.longitude}
                </Typography>
              </Flex>

              {location.accuracy != null && (
                <Flex align="center" gap="xs">
                  <Icon path={mdiAdjust} size={1} />
                  <Typography fz={14}>{`${location.accuracy} m`}</Typography>
                </Flex>
              )}

              {location.altitude != null && (
                <Flex align="center" gap="xs">
                  <Icon path={mdiAltimeter} size={1} />
                  <Typography fz={14}>{`${location.altitude} m`}</Typography>
                </Flex>
              )}

              {location.speed != null && (
                <Flex align="center" gap="xs">
                  <Icon path={mdiSpeedometer} size={1} />
                  <Typography fz={14}>
                    {`${metersPerSecondToKilometersPerHour(location.speed)} km/h`}
                  </Typography>
                </Flex>
              )}

              {location.battery != null && (
                <Flex align="center" gap="xs">
                  <Battery level={location.battery} />
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
