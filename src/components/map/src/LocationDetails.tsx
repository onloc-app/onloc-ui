import { Battery } from "@/components"
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
import { mdiAdjust, mdiClockOutline, mdiMapMarkerOutline } from "@mdi/js"
import Icon from "@mdi/react"
import { useTranslation } from "react-i18next"

interface LocationDetailsProps extends BoxProps {
  selectedDevice: Device
  selectedLocation: Location
}

export default function LocationDetails({
  selectedDevice,
  selectedLocation,
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
              {selectedDevice.latest_location?.id === selectedLocation.id ? (
                <Typography c="dimmed">
                  {t("components.location_details.latest_location")}
                </Typography>
              ) : null}
            </Flex>
          </AccordionControl>
          <AccordionPanel>
            <Flex direction="column" gap={4}>
              {selectedLocation.created_at && (
                <Flex align="center" gap="xs">
                  <Icon path={mdiClockOutline} size={1} />
                  <Typography fz={14}>
                    {formatISODate(selectedLocation.created_at.toString())}
                  </Typography>
                </Flex>
              )}

              <Flex align="center" gap="xs">
                <Icon path={mdiMapMarkerOutline} size={1} />
                <Typography fz={14}>
                  {selectedLocation.latitude}, {selectedLocation.longitude}
                </Typography>
              </Flex>

              {selectedLocation.accuracy && (
                <Flex align="center" gap="xs">
                  <Icon path={mdiAdjust} size={1} />
                  <Typography fz={14}>{selectedLocation.accuracy}</Typography>
                </Flex>
              )}

              {selectedLocation.battery && (
                <Flex align="center" gap="xs">
                  <Battery level={selectedLocation.battery} />
                  <Typography fz={14}>{selectedLocation.battery}%</Typography>
                </Flex>
              )}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
